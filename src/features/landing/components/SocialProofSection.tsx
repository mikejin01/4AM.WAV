const STATS = [
  { value: "10M+", label: "Experiences created" },
  { value: "500K+", label: "Active community members" },
  { value: "50+", label: "Cities worldwide" },
  { value: "4.9", label: "App Store rating" },
];

const BRANDS = [
  "Adidas",
  "Solle P\u00c8RE",
  "Lamborghini",
  "Narc",
  "Electrix Vintage",
  "Rose Gold",
  "Wheels NYC",
  "Palm Tree Crew",
];

const BRANDS_DOUBLED = [...BRANDS, ...BRANDS];

export default function SocialProofSection() {
  return (
    <section className="social-proof-section px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20">
          <h2 className="landing-fade-in mb-4 text-4xl font-medium tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-6xl">
            Driving culture &amp; community
          </h2>
          <p className="landing-fade-in max-w-xl text-lg text-[#0a0a0a]/50">
            From coast to coast, Posh powers the events and experiences that bring people together.
          </p>
        </div>

        <div className="social-proof-stats mb-24 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl bg-[#f5f5f5] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-2 text-4xl font-semibold tracking-tight text-[#0a0a0a] lg:text-5xl">
                {stat.value}
              </div>
              <div className="text-sm text-[#0a0a0a]/50">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden border-t border-b border-[#0a0a0a]/10 py-10">
          <div className="landing-marquee-slow flex items-center gap-16">
            {BRANDS_DOUBLED.map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="flex-shrink-0 text-xl font-semibold tracking-tight text-[#0a0a0a]/20 transition-colors hover:text-[#0a0a0a]/60"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
