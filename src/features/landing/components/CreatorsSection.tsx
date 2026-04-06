import Image from "next/image";

const FEATURES = [
  {
    heading: "Bring your idea to life",
    description:
      "Whether it\u2019s a rooftop soir\u00e9e or a 10-city tour, our tools make it easy to create, customize, and launch your event in minutes.",
    poster: "/assets/posh/creators/creators-1-poster.avif",
    chips: [
      "/assets/posh/creators/creators-chip-1.avif",
      "/assets/posh/creators/creators-1-chip-2b.avif",
    ],
    aspect: "aspect-[2.39/1]",
  },
  {
    heading: "We\u2019ll help you find your crowd",
    description:
      "Reach the right audience with powerful discovery tools, social sharing, and algorithmic recommendations that actually work.",
    poster: "/assets/posh/creators/creators-2-poster.avif",
    chips: [
      "/assets/posh/creators/creators-2-chip-1.avif",
      "/assets/posh/creators/creators-2-chip-2.avif",
    ],
    aspect: "aspect-video",
  },
  {
    heading: "Turn your community into culture",
    description:
      "Build a following, grow your brand, and create a movement \u2014 all from one platform designed for community builders.",
    poster: "/assets/posh/creators/organizers-hero.avif",
    chips: [
      "/assets/posh/creators/creators-3-chip-1.avif",
      "/assets/posh/creators/creators-3-chip-2.avif",
    ],
    aspect: "aspect-[2.39/1]",
  },
];

function FeaturePanel({
  heading,
  description,
  poster,
  aspect,
}: (typeof FEATURES)[number]) {
  return (
    <div className="landing-fade-in mb-24 last:mb-0">
      <div
        className={`fancy-media-wrapper mb-10 overflow-hidden rounded-lg ${aspect}`}
      >
        <div className="relative h-full w-full transition-transform duration-700 hover:scale-105">
          <Image
            src={poster}
            alt={heading}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-16">
        <h2 className="text-3xl font-medium tracking-tight text-[#0a0a0a] sm:text-4xl">
          {heading}
        </h2>
        <p className="text-lg leading-relaxed text-[#0a0a0a]/50">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function CreatorsSection() {
  return (
    <section className="px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24">
          <h2 className="landing-fade-in mb-6 text-4xl font-medium tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-6xl">
            Throw a party.
            <br />
            Build a community.
            <br />
            Find your people.
          </h2>
        </div>

        {FEATURES.map((feature) => (
          <FeaturePanel key={feature.heading} {...feature} />
        ))}

        <div className="landing-fade-in mt-32">
          <div className="mb-8 overflow-hidden rounded-2xl">
            <div className="relative aspect-[2.39/1]">
              <Image
                src="/assets/posh/other/testimonial.avif"
                alt="Creator testimonial"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </div>
          <blockquote className="rounded-2xl bg-[#f5f5f5] p-10 lg:p-16">
            <p className="mb-8 text-2xl font-medium leading-snug tracking-tight text-[#0a0a0a] sm:text-3xl">
              &ldquo;Posh allowed us to scale our events across the country&rdquo;
            </p>
            <footer className="text-sm text-[#0a0a0a]/50">
              <span className="font-medium text-[#0a0a0a]">Event Creator</span>
              {" "}&mdash; National Event Series
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
