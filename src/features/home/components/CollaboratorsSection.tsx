import Image from "next/image";

type MarqueeItem =
  | { type: "text"; label: string }
  | { type: "logo"; src: string; alt: string; width: number; height: number };

const VENUES: MarqueeItem[] = [
  { type: "logo", src: "/assets/logos/0000.png", alt: "00:00 New York", width: 1658, height: 1005 },
  { type: "text", label: "House of Yes" },
  { type: "text", label: "Elsewhere" },
  { type: "logo", src: "/assets/logos/aura57.png", alt: "Aura 57", width: 200, height: 200 },
  { type: "logo", src: "/assets/logos/terminal-5-logo.png", alt: "Terminal 5", width: 700, height: 205 },
  { type: "text", label: "Avant Gardner" },
  { type: "logo", src: "/assets/logos/s20-logo.avif", alt: "S20", width: 980, height: 1110 },
  { type: "text", label: "Good Room" },
  { type: "logo", src: "/assets/logos/anti-gravity.png", alt: "Anti-Gravity", width: 468, height: 468 },
  { type: "text", label: "Nowadays" },
  { type: "text", label: "Basement" },
  { type: "logo", src: "/assets/logos/pulse.png", alt: "Pulse", width: 486, height: 86 },
  { type: "text", label: "Le Bain" },
  { type: "text", label: "Output" },
];

const LABELS_AND_BRANDS: MarqueeItem[] = [
  { type: "text", label: "Defected Records" },
  { type: "text", label: "Anjunadeep" },
  { type: "text", label: "Cercle" },
  { type: "text", label: "Boiler Room" },
  { type: "text", label: "Red Bull" },
  { type: "text", label: "Resident Advisor" },
  { type: "text", label: "Mixmag" },
  { type: "text", label: "DJ Mag" },
  { type: "text", label: "Pitchfork" },
  { type: "text", label: "KEXP" },
  { type: "text", label: "Absolut" },
  { type: "text", label: "Heineken" },
];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: MarqueeItem[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className={`home-marquee flex items-center gap-10 sm:gap-16 ${
          reverse ? "home-marquee-reverse" : ""
        }`}
      >
        {doubled.map((item, i) =>
          item.type === "logo" ? (
            <Image
              key={`${item.alt}-${i}`}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="h-6 w-auto shrink-0 opacity-20 transition-opacity duration-300 hover:opacity-50 sm:h-8"
            />
          ) : (
            <span
              key={`${item.label}-${i}`}
              className="shrink-0 whitespace-nowrap font-heading text-base font-medium text-white/20 transition-colors duration-300 hover:text-white/50 sm:text-lg"
            >
              {item.label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export default function CollaboratorsSection() {
  return (
    <section className="border-y border-white/[0.06] py-14 sm:py-20">
      <p className="mb-10 text-center text-xs uppercase tracking-[0.4em] text-white sm:mb-12 sm:text-sm sm:tracking-[0.3em]">
        Trusted by venues, labels & brands
      </p>
      <div className="flex flex-col gap-5">
        <MarqueeRow items={VENUES} />
        <MarqueeRow items={LABELS_AND_BRANDS} reverse />
      </div>
    </section>
  );
}
