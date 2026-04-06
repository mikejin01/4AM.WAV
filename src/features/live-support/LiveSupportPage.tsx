"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TranscriptEntry = {
  id: number;
  speaker: "interviewer";
  text: string;
  timestamp: string;
};

type SessionStatus = "idle" | "requesting" | "active" | "error";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function LiveSupportPage() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalizedRef = useRef("");

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function addTranscriptEntry(text: string) {
    setTranscript((prev) => [
      ...prev,
      {
        id: nextId.current++,
        speaker: "interviewer",
        text,
        timestamp: formatTime(new Date()),
      },
    ]);
  }

  function cleanup() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    recorderRef.current = null;
  }

  const startSession = useCallback(async () => {
    setError(null);
    setStatus("requesting");
    finalizedRef.current = "";

    try {
      // Request screen share with system audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Check if audio track is available
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        stream.getTracks().forEach((t) => t.stop());
        setError(
          "No audio track detected. Make sure to check \"Share tab audio\" or \"Share system audio\" when sharing your screen."
        );
        setStatus("idle");
        return;
      }

      streamRef.current = stream;

      // Listen for user stopping screen share via browser UI
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopSession();
      });

      // Get Deepgram token
      const tokenRes = await fetch("/api/deepgram-token", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error ?? "Failed to get token");

      // Create audio-only stream for Deepgram
      const audioStream = new MediaStream(audioTracks);

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
        setStatus("active");

        // Start timer
        timerRef.current = setInterval(() => {
          setElapsed((prev) => prev + 1);
        }, 1000);

        // Record audio and send to Deepgram
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "";

        const recorder = mimeType
          ? new MediaRecorder(audioStream, { mimeType })
          : new MediaRecorder(audioStream);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(e.data);
          }
        };

        recorder.start(250);
        recorderRef.current = recorder;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        if (data.type !== "Results") return;

        const text = data.channel?.alternatives?.[0]?.transcript ?? "";
        if (!text) return;

        if (data.is_final && text.trim()) {
          finalizedRef.current = finalizedRef.current
            ? finalizedRef.current + " " + text
            : text;
          addTranscriptEntry(text);
        }
      };

      ws.onerror = () => {
        setError("Connection to transcription service failed");
        cleanup();
        setStatus("error");
      };

      ws.onclose = () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } catch (err: unknown) {
      cleanup();
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Screen sharing was cancelled");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setStatus("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopSession() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "CloseStream" }));
    }
    cleanup();
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#060609]">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gold/[0.03] blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/[0.02] blur-[100px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="font-heading text-lg font-bold tracking-wider text-gold"
          >
            4AM.WAV
          </a>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-medium tracking-wide text-white/40">
            LIVE SUPPORT
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Session timer */}
          {status === "active" && (
            <div className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">
              <span className="live-pulse inline-block h-2 w-2 rounded-full bg-red-500" />
              <span className="font-mono text-sm tracking-wider text-white/60">
                {formatElapsed(elapsed)}
              </span>
            </div>
          )}

          {/* Start / Stop button */}
          {status === "idle" || status === "error" ? (
            <button
              onClick={startSession}
              className="group flex items-center gap-2.5 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,168,67,0.3)]"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
                />
              </svg>
              Start Session
            </button>
          ) : status === "requesting" ? (
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-sm text-gold">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Connecting...
            </div>
          ) : (
            <button
              onClick={stopSession}
              className="flex items-center gap-2.5 rounded-full bg-red-500/90 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                />
              </svg>
              End Session
            </button>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left panel — Transcript */}
        <div className="flex flex-1 flex-col border-r border-white/[0.06]">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gold/10">
              <svg
                className="h-3.5 w-3.5 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443h2.887c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <h2 className="text-sm font-medium tracking-wide text-white/50">
              TRANSCRIPT
            </h2>
            {transcript.length > 0 && (
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/30">
                {transcript.length}
              </span>
            )}
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto px-6 py-5">
            {status === "idle" && transcript.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <svg
                    className="h-7 w-7 text-white/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/30">
                    Start a session to begin capturing audio
                  </p>
                  <p className="mt-1 text-xs text-white/15">
                    Share your screen with audio to transcribe in real-time
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {transcript.map((entry) => (
                  <div
                    key={entry.id}
                    className="transcript-entry group rounded-xl border border-white/[0.04] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold/70">
                        Interviewer
                      </span>
                      <span className="text-[10px] text-white/20">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/80">
                      {entry.text}
                    </p>
                  </div>
                ))}

                {status === "active" && (
                  <div className="flex items-center gap-2 py-2 pl-1">
                    <div className="flex gap-1">
                      <span className="listening-dot inline-block h-1.5 w-1.5 rounded-full bg-gold/50" />
                      <span className="listening-dot inline-block h-1.5 w-1.5 rounded-full bg-gold/50 [animation-delay:0.15s]" />
                      <span className="listening-dot inline-block h-1.5 w-1.5 rounded-full bg-gold/50 [animation-delay:0.3s]" />
                    </div>
                    <span className="text-xs text-white/20">Listening...</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Screen / Info */}
        <div className="hidden w-[420px] flex-col lg:flex">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/[0.06]">
              <svg
                className="h-3.5 w-3.5 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </div>
            <h2 className="text-sm font-medium tracking-wide text-white/50">
              SESSION INFO
            </h2>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
            {status === "active" ? (
              <>
                {/* Waveform visualization */}
                <div className="flex h-24 items-end justify-center gap-[3px]">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="session-wave-bar w-[3px] rounded-full bg-gold/40"
                      style={
                        {
                          "--wave-index": i,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="font-mono text-3xl font-light tracking-widest text-white/70">
                    {formatElapsed(elapsed)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-gold/50">
                    Session Active
                  </p>
                </div>

                <div className="mt-4 w-full space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Status</span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400/80">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Connected
                    </span>
                  </div>
                  <div className="h-px bg-white/[0.04]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Segments</span>
                    <span className="font-mono text-xs text-white/50">
                      {transcript.length}
                    </span>
                  </div>
                  <div className="h-px bg-white/[0.04]" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Model</span>
                    <span className="text-xs text-white/50">
                      Deepgram Nova-3
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-white/[0.08]">
                  <svg
                    className="h-8 w-8 text-white/10"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 12V5.25"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/25">No active session</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/15">
                    Click &quot;Start Session&quot; to share your screen and
                    begin real-time transcription
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <svg
              className="h-4 w-4 shrink-0 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm text-red-300/90">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-400/60 transition-colors hover:text-red-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
