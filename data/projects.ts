export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string;
  stack: string[];
  services: string[];
  year: string;
  outcome: string;
  imageUrl?: string;
  liveUrl?: string;
  metrics: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "afrilance",
    title: "AfriLance",
    tagline: "Decentralized freelance escrow for African builders.",
    summary:
      "AI-powered freelance marketplace with smart-contract escrow and stablecoin settlement rails.",
    description:
      "AfriLance combines reputation scoring, milestone-based escrow, dispute workflows, and AI-assisted project matching into a product designed for cross-border freelance work.",
    stack: ["React", "Node.js", "Solidity", "BNB Chain"],
    services: ["Product Strategy", "Smart Contracts", "Web App"],
    year: "2026",
    outcome:
      "A secure marketplace foundation ready for investor demos and protocol integrations.",
    imageUrl: "",
    liveUrl: "",
    metrics: [
      { label: "Escrow flows", value: "4" },
      { label: "Core screens", value: "18+" },
      { label: "Settlement layer", value: "Stablecoin" },
    ],
  },
  {
    slug: "paard-co",
    title: "PAARD-Co",
    tagline: "Agricultural infrastructure platform for scalable operations.",
    summary:
      "A modern platform experience for agricultural logistics, investment storytelling, and field operations.",
    description:
      "PAARD-Co turns a complex operating model into a clear digital presence with investor-ready positioning, operational modules, and a polished growth narrative.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    services: ["Website", "UX Design", "Automation"],
    year: "2026",
    outcome:
      "A premium brand and platform surface built for partnerships and operational expansion.",
    imageUrl: "",
    liveUrl: "",
    metrics: [
      { label: "Regions modeled", value: "6" },
      { label: "Content modules", value: "12" },
      { label: "Launch speed", value: "2 weeks" },
    ],
  },
  {
    slug: "bozkurt",
    title: "Bozkurt",
    tagline: "High-conversion Web3 brand experience.",
    summary:
      "A premium meme coin launch site with community-first interaction design and conversion paths.",
    description:
      "Bozkurt needed to feel fast, loud, and credible. The experience blends token storytelling, launch mechanics, social proof, and mobile-first engagement.",
    stack: ["React", "TypeScript", "Tailwind"],
    services: ["Landing Page", "Motion Design", "Web3 UX"],
    year: "2025",
    outcome:
      "A memorable launch surface built to move visitors from curiosity to community action.",
    imageUrl: "",
    liveUrl: "",
    metrics: [
      { label: "Mobile score", value: "95+" },
      { label: "CTA paths", value: "5" },
      { label: "Community links", value: "3" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
