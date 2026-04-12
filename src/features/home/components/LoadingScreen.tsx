"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const TOTAL_DURATION_MS = 2400;

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      onCompleteRef.current();
    }, TOTAL_DURATION_MS);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-black">
      {/* Ambient gold pulse behind text */}
      <div className="loading-glow pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[120px]" />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="loading-subtitle">
          <Image
            src="/assets/logos/4am-logo-cropped.png"
            alt="4AM.WAV"
            width={2248}
            height={441}
            priority
            className="h-[clamp(2rem,8vw,4rem)] w-auto"
          />
        </div>

        {/* Waveform visualization */}
        <div className="loading-wave mt-10 flex h-8 items-center gap-[3px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="loading-wave-bar w-[2px] rounded-full bg-gold/60"
              style={{ "--wave-index": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
