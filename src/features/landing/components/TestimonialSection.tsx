import Image from "next/image";

export default function TestimonialSection() {
  return (
    <section className="landing-fade-in px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <blockquote className="mb-16">
          <p className="text-2xl font-medium leading-snug tracking-tight text-[#0a0a0a] sm:text-3xl lg:text-4xl">
            &ldquo;Literally anytime I want to find something to do, I just open the app, find
            something interesting and go. It&apos;s become part of my routine.&rdquo;
          </p>
        </blockquote>

        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-[#0a0a0a]">4.9</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src="/assets/posh/svg/star.svg"
                  alt="Star"
                  width={20}
                  height={20}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <a href="#" className="transition-opacity hover:opacity-80">
              <Image
                src="/assets/posh/svg/app-store-badge.svg"
                alt="Download on the App Store"
                width={140}
                height={42}
              />
            </a>
            <a href="#" className="transition-opacity hover:opacity-80">
              <Image
                src="/assets/posh/svg/play-store-badge.svg"
                alt="Get it on Google Play"
                width={140}
                height={42}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
