const VENUES = [
  "House of Yes",
  "Elsewhere",
  "Avant Gardner",
  "Good Room",
  "Nowadays",
  "Basement",
  "Le Bain",
  "Output",
  "Knockdown Center",
  "Jupiter Disco",
  "Bossa Nova Civic Club",
  "Public Records",
];

const LABELS_AND_BRANDS = [
  "Defected Records",
  "Anjunadeep",
  "Cercle",
  "Boiler Room",
  "Red Bull",
  "Resident Advisor",
  "Mixmag",
  "DJ Mag",
  "Pitchfork",
  "KEXP",
  "Absolut",
  "Heineken",
];

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
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
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 whitespace-nowrap font-heading text-base font-medium text-white/[0.08] transition-colors duration-300 hover:text-white/30 sm:text-lg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CollaboratorsSection() {
  return (
    <section className="border-y border-white/[0.06] py-14 sm:py-20">
      <p className="mb-10 text-center text-[10px] uppercase tracking-[0.4em] text-white/25 sm:mb-12 sm:text-xs sm:tracking-[0.3em]">
        Trusted by venues, labels & brands
      </p>
      <div className="flex flex-col gap-5">
        <MarqueeRow items={VENUES} />
        <MarqueeRow items={LABELS_AND_BRANDS} reverse />
      </div>
    </section>
  );
}
