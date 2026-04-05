import { useCallback, useRef, useState } from "react";

type VoiceStatus = "idle" | "recording" | "transcribing";

export function useVoiceInput(opts: {
  onTranscript: (text: string) => void;
}) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopStream();

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });

        if (blob.size === 0) {
          setStatus("idle");
          return;
        }

        setStatus("transcribing");

        try {
          const formData = new FormData();
          formData.set("audio", blob, "recording");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error ?? "Transcription failed");
          } else if (data.text) {
            opts.onTranscript(data.text);
          }
        } catch {
          setError("Failed to transcribe audio");
        }

        setStatus("idle");
      };

      recorder.start();
      recorderRef.current = recorder;
      setStatus("recording");
    } catch (err) {
      stopStream();
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone access denied");
      } else {
        setError("Could not access microphone");
      }
      setStatus("idle");
    }
  }, [opts, stopStream]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
  }, []);

  return { status, error, startRecording, stopRecording };
}
