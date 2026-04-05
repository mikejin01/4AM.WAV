import { useCallback, useRef, useState } from "react";

type VoiceStatus = "idle" | "connecting" | "recording" | "error";

export function useVoiceInput(opts: {
  onLiveTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
}) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalizedRef = useRef("");

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    recorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    finalizedRef.current = "";

    try {
      // Get temp token from our API
      const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error ?? "Failed to get token");
      const { token } = tokenData;

      // Get mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Deepgram WebSocket
      const params = new URLSearchParams({
        model: "nova-3",
        interim_results: "true",
        punctuate: "true",
        smart_format: "true",
        endpointing: "300",
        utterance_end_ms: "1000",
      });

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen?${params.toString()}`,
        ["token", token]
      );

      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("recording");

        // Start MediaRecorder to stream audio chunks
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "";

        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };

        recorder.start(250); // Send chunks every 250ms
        recorderRef.current = recorder;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        if (data.type !== "Results") return;

        const transcript: string =
          data.channel?.alternatives?.[0]?.transcript ?? "";
        if (!transcript) return;

        if (data.is_final) {
          // Accumulate finalized segments
          finalizedRef.current = finalizedRef.current
            ? finalizedRef.current + " " + transcript
            : transcript;
          opts.onLiveTranscript(finalizedRef.current);
        } else {
          // Show finalized + current interim
          const live = finalizedRef.current
            ? finalizedRef.current + " " + transcript
            : transcript;
          opts.onLiveTranscript(live);
        }
      };

      ws.onerror = () => {
        setError("Connection to transcription service failed");
        cleanup();
        setStatus("idle");
      };

      ws.onclose = () => {
        // Deliver final accumulated transcript
        if (finalizedRef.current.trim()) {
          opts.onFinalTranscript(finalizedRef.current.trim());
        }
        cleanup();
        setStatus("idle");
      };
    } catch (err: unknown) {
      cleanup();
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone access denied");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      setStatus("idle");
    }
  }, [opts, cleanup]);

  const stopRecording = useCallback(() => {
    // Stop MediaRecorder first
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    // Stop mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Tell Deepgram we're done, then close
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "CloseStream" }));
    }
  }, []);

  return { status, error, startRecording, stopRecording };
}
