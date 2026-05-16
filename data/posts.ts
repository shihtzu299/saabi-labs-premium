export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "shipping-premium-startup-products",
    title: "Shipping Premium Startup Products Without Slowing Down",
    excerpt: "A practical operating model for pairing fast iteration with a polished product experience.",
    date: "2026-05-13",
    readTime: "4 min read",
    category: "Product Engineering",
    content: [
      "Premium product work is not about adding ceremony. It is about choosing the few systems that keep quality high while the team is moving quickly.",
      "For early teams, the strongest pattern is a compact loop: define the user action, build the smallest complete flow, polish the moment of trust, then measure the next bottleneck.",
      "Saabi Labs uses this approach across AI, Web3, and SaaS builds because it keeps the product useful before it becomes crowded."
    ]
  },
  {
    slug: "web3-products-need-better-ux",
    title: "Web3 Products Need Better UX, Not More Jargon",
    excerpt: "How to make blockchain experiences feel understandable, credible, and conversion-ready.",
    date: "2026-05-10",
    readTime: "3 min read",
    category: "Web3",
    content: [
      "Most users do not want to decode infrastructure. They want to understand what happens next, what risk they are taking, and why the product is worth trusting.",
      "A strong Web3 interface makes wallet states, transaction progress, and ownership outcomes visible without burying the user in protocol language.",
      "The best technical systems still need careful product writing, interface hierarchy, and recovery paths."
    ]
  },
  {
    slug: "ai-automation-that-actually-helps",
    title: "AI Automation That Actually Helps Teams",
    excerpt: "The useful AI layer is usually narrow, workflow-aware, and connected to the right handoff points.",
    date: "2026-05-07",
    readTime: "5 min read",
    category: "AI Systems",
    content: [
      "AI features work best when they remove a repeated decision or prepare a human to make a better one.",
      "Instead of forcing chat into every corner of a product, teams should map the moments where context gathering, summarization, triage, or drafting slows people down.",
      "That keeps the AI experience grounded in business value instead of novelty."
    ]
  }
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
