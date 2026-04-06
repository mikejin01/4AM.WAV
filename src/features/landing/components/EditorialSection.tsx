import Image from "next/image";

const ARTICLES = [
  {
    title: "Interview: 3rd Space",
    category: "Culture",
    image: "/assets/posh/editorial/3rd-space.webp",
  },
  {
    title: "Grown Kid: Building the Future of Events",
    category: "Creators",
    image: "/assets/posh/editorial/grownkid.webp",
  },
  {
    title: "How Geller Became NYC\u2019s Go-To Host",
    category: "Spotlight",
    image: "/assets/posh/editorial/geller.webp",
  },
  {
    title: "Wheels NYC: Rolling Through Culture",
    category: "Community",
    image: "/assets/posh/editorial/wheels.webp",
  },
  {
    title: "Record Club: Where Vinyl Meets Vibe",
    category: "Music",
    image: "/assets/posh/editorial/recordclub.webp",
  },
];

function ArticleCard({
  article,
  aspect,
  sizes,
}: {
  article: (typeof ARTICLES)[number];
  aspect: string;
  sizes: string;
}) {
  return (
    <a href="#" className="landing-fade-in group block">
      <div className="mb-5 overflow-hidden rounded-lg">
        <div className={`relative ${aspect}`}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={sizes}
          />
        </div>
      </div>
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#0a0a0a]/40">
        {article.category}
      </span>
      <h3 className="text-xl font-medium tracking-tight text-[#0a0a0a] transition-colors group-hover:text-[#0a0a0a]/60">
        {article.title}
      </h3>
    </a>
  );
}

export default function EditorialSection() {
  return (
    <section className="px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="landing-fade-in mb-16 text-4xl font-medium tracking-tight text-[#0a0a0a] sm:text-5xl">
          Editorial
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.slice(0, 3).map((article) => (
            <ArticleCard
              key={article.title}
              article={article}
              aspect="aspect-[4/3]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {ARTICLES.slice(3).map((article) => (
            <ArticleCard
              key={article.title}
              article={article}
              aspect="aspect-[16/9]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
