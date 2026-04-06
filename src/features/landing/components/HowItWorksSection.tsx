"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PHONE_ASPECT = "393 / 852";
const PHONE_RADIUS = "min(3vw, 64px)";

const STEPS = [
  { text: "Find personalized social experiences in seconds", cols: "col-start-2 col-end-5" },
  { text: "See what the vibe is and who\u2019s going", cols: "col-start-9 col-end-12" },
  { text: "Get off your phone and find your world", cols: "col-start-2 col-end-5" },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const phoneWrapper = section.querySelector<HTMLElement>(".hiw-phone-wrapper");
    const screen1 = section.querySelector<HTMLElement>(".hiw-screen-1");
    const screen2 = section.querySelector<HTMLElement>(".hiw-screen-2");
    const screen3 = section.querySelector<HTMLElement>(".hiw-screen-3");
    const feedImage = section.querySelector<HTMLElement>(".hiw-feed-image");
    const feedHeader = section.querySelector<HTMLElement>(".hiw-feed-header");
    const feedFooter = section.querySelector<HTMLElement>(".hiw-feed-footer");
    const eventImage = section.querySelector<HTMLElement>(".hiw-event-image");
    const completeOverlay = section.querySelector<HTMLElement>(".hiw-complete");
    const ticketBottom = section.querySelector<HTMLElement>(".hiw-ticket-bottom");
    const ticketTop = section.querySelector<HTMLElement>(".hiw-ticket-top");
    const panels = section.querySelectorAll<HTMLElement>(".hiw-text-panel");

    if (!phoneWrapper || !screen1 || !screen2 || !screen3) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        phoneWrapper,
        { scale: 0.7 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "clamp(top bottom)",
            end: "clamp(top 50%)",
            scrub: 0.8,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: 0.5,
        },
      });

      gsap.set(completeOverlay, { opacity: 0 });

      tl.set(panels[0], { opacity: 1, y: 0 });
      tl.to({}, { duration: 0.5 });
      tl.to(feedImage, { y: "-50%", duration: 1, ease: "none" }, 0.5);

      tl.to(panels[0], { opacity: 0, y: "-10vh", duration: 0.5, ease: "none" }, 1);
      tl.fromTo(panels[1], { opacity: 0, y: "10vh" }, { opacity: 1, y: 0, duration: 0.5, ease: "none" }, 1.2);

      tl.to(screen1, { xPercent: -50, duration: 0.8, ease: "none" }, 1.8);
      tl.to(feedHeader, { opacity: 0, duration: 0.3 }, 1.8);
      tl.to(feedFooter, { opacity: 0, duration: 0.3 }, 1.8);
      tl.fromTo(screen2, { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: "none" }, 1.8);
      tl.to(eventImage, { yPercent: -20, duration: 1, ease: "none" }, 2);

      tl.to(panels[1], { opacity: 0, y: "-10vh", duration: 0.5, ease: "none" }, 2.5);
      tl.fromTo(panels[2], { opacity: 0, y: "10vh" }, { opacity: 1, y: 0, duration: 0.5, ease: "none" }, 2.7);

      tl.to(screen2, { scale: 0.9, yPercent: -3, duration: 0.5, ease: "none" }, 3);
      tl.fromTo(screen3, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: "none" }, 3);

      tl.to(completeOverlay, { opacity: 1, duration: 0.3, ease: "none" }, 3.3);

      tl.fromTo(ticketBottom, { yPercent: 200 }, { yPercent: 0, duration: 0.5, ease: "none" }, 3.5);
      tl.fromTo(ticketTop, { yPercent: 200 }, { yPercent: 0, duration: 0.5, ease: "none" }, 3.6);

      tl.to(panels[2], { opacity: 0, y: "-10vh", duration: 0.5, ease: "none" }, 4.5);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="how-it-works-section relative"
      style={{ height: "400svh" }}
    >
      <div className="sticky top-0 overflow-hidden" style={{ minHeight: "100svh" }}>
        <div className="hiw-media absolute inset-0">
          <div
            className="hiw-phone-wrapper absolute"
            style={{
              aspectRatio: PHONE_ASPECT,
              width: "22vw",
              maxWidth: 400,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="hiw-phone relative w-full h-full overflow-hidden bg-black"
              style={{
                aspectRatio: PHONE_ASPECT,
                borderRadius: PHONE_RADIUS,
                boxShadow: "0 2px 64px rgba(0, 0, 0, 0.6)",
                transform: "scale(0.9)",
              }}
            >
              <div
                className="absolute inset-0 overflow-clip"
                style={{
                  aspectRatio: PHONE_ASPECT,
                  borderRadius: PHONE_RADIUS,
                }}
              >
                <div className="hiw-screen-1 absolute inset-0 z-10 overflow-hidden">
                  <div className="hiw-feed-image absolute inset-0" style={{ height: "200%" }}>
                    <Image
                      src="/assets/posh/phone/home-feed.avif"
                      alt="Home Feed"
                      fill
                      className="object-cover object-top"
                      sizes="22vw"
                    />
                  </div>
                  <div className="hiw-feed-header absolute top-0 left-0 right-0 z-10">
                    <Image
                      src="/assets/posh/phone/feed-header.avif"
                      alt=""
                      width={393}
                      height={85}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="hiw-feed-footer absolute bottom-0 left-0 right-0 z-10">
                    <Image
                      src="/assets/posh/phone/feed-footer.avif"
                      alt=""
                      width={393}
                      height={82}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                <div className="hiw-screen-2 absolute inset-0 z-20 overflow-hidden">
                  <div className="hiw-event-image absolute inset-0" style={{ height: "130%" }}>
                    <Image
                      src="/assets/posh/phone/event.avif"
                      alt="Event Page"
                      fill
                      className="object-cover object-top"
                      sizes="22vw"
                    />
                  </div>
                </div>

                <div className="hiw-screen-3 absolute inset-0 z-30 overflow-hidden">
                  <Image
                    src="/assets/posh/phone/checkout.avif"
                    alt="Checkout"
                    fill
                    className="object-cover object-top"
                    sizes="22vw"
                  />
                  <div className="hiw-complete absolute inset-0 z-10">
                    <Image
                      src="/assets/posh/phone/complete.avif"
                      alt="Complete"
                      fill
                      className="object-cover object-top"
                      sizes="22vw"
                    />
                  </div>
                  <div
                    className="hiw-ticket-bottom absolute left-[10%] right-[10%] z-20"
                    style={{ top: "25%" }}
                  >
                    <Image
                      src="/assets/posh/phone/ticket-1.avif"
                      alt="Ticket"
                      width={393}
                      height={160}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                  <div
                    className="hiw-ticket-top absolute left-[10%] right-[10%] z-30"
                    style={{ top: "25%" }}
                  >
                    <Image
                      src="/assets/posh/phone/ticket-2.avif"
                      alt="Ticket"
                      width={393}
                      height={160}
                      className="w-full h-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hiw-content absolute inset-0 z-10">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="hiw-text-panel absolute inset-0 grid grid-cols-12 gap-4 p-12 opacity-0"
              style={{ minHeight: "100svh" }}
            >
              <div className={`${step.cols} self-center`}>
                <p className="text-center text-[2rem] font-normal leading-[2.25rem] text-[#0a0a0a]">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
