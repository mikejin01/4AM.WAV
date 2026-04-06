import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "Events", href: "/events" },
    { label: "Platform", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
  ],
  Social: [
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-[#0a0a0a] px-6 py-24 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-20 text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-tight text-white/90">
          See you soon.
        </h1>

        <div className="mb-20 grid grid-cols-2 gap-10 sm:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
                {category}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Image
            src="/assets/posh/svg/logo-white.svg"
            alt="Posh"
            width={80}
            height={28}
          />
          <span className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Posh. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
