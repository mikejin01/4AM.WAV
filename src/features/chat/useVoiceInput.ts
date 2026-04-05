import { useCallback, useEffect, useRef, useState } from "react";

type VoiceStatus = "idle" | "connecting" | "recording" | "error";

type DeepgramResult = {
  type: string;
  is_final?: boolean;
  channel?: {
    alternatives?: Array<{ transcript?: string }>;
  };
};

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
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    recorderRef.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    finalizedRef.current = "";

    try {
      const [tokenData, stream] = await Promise.all([
        fetch("/api/deepgram-token", { method: "POST" }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Failed to get token");
          return data as { token: string };
        }),
        navigator.mediaDevices.getUserMedia({ audio: true }),
      ]);

      streamRef.current = stream;

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
        ["token", tokenData.token]
      );

      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("recording");

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

        recorder.start(250);
        recorderRef.current = recorder;
      };

      ws.onmessage = (event) => {
        const data: DeepgramResult = JSON.parse(event.data as string);
        if (data.type !== "Results") return;

        const transcript = data.channel?.alternatives?.[0]?.transcript ?? "";
        if (!transcript) return;

        if (data.is_final) {
          finalizedRef.current = finalizedRef.current
            ? finalizedRef.current + " " + transcript
            : transcript;
          optsRef.current.onLiveTranscript(finalizedRef.current);
        } else {
          const live = finalizedRef.current
            ? finalizedRef.current + " " + transcript
            : transcript;
          optsRef.current.onLiveTranscript(live);
        }
      };

      ws.onerror = () => {
        setError("Connection to transcription service failed");
        cleanup();
        setStatus("idle");
      };

      ws.onclose = () => {
        if (finalizedRef.current.trim()) {
          optsRef.current.onFinalTranscript(finalizedRef.current.trim());
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
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    // Signal Deepgram to finalize; ws.onclose handles full cleanup
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "CloseStream" }));
    }
  }, []);

  return { status, error, startRecording, stopRecording };
}
