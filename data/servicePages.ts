export type ServicePageContent = {
  slug: string;
  title: string;
  metadataTitle: string;
  description: string;
  introduction: string;
  intendedFor: string;
  challenges: string[];
  deliverables: string[];
  approach: string[];
  projects: { title: string; href: string; context: string }[];
  relatedServices: { title: string; href: string }[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "website-development",
    title: "Website Development & E-commerce",
    metadataTitle: "Website Development in Nigeria",
    description:
      "Domani Consult designs and builds responsive business websites, e-commerce stores and landing pages for Nigerian businesses and international clients.",
    introduction:
      "Create a clear, useful online experience for your customers. We plan and build business websites, online stores and campaign landing pages around your content, audience and day-to-day needs.",
    intendedFor:
      "Businesses establishing or improving their online presence, retailers preparing to sell online, and teams that need a focused landing page for a product or campaign.",
    challenges: [
      "Outdated or difficult-to-use websites that do not explain the business clearly.",
      "Product catalogues and enquiry flows that are hard for customers to navigate.",
      "Pages that need to work well across phones, tablets and desktop screens."
    ],
    deliverables: [
      "Responsive business and marketing websites.",
      "E-commerce storefronts, product pages and customer journeys.",
      "Landing pages and content structures for specific offers.",
      "Forms, integrations and content management features suited to the project."
    ],
    approach: [
      "Clarify the audience, goals, content and essential user journeys.",
      "Shape the page structure and visual direction before implementation.",
      "Build, review on common screen sizes, and prepare the agreed handover."
    ],
    projects: [
      {
        title: "PAARD-Co",
        href: "/projects/paard-co",
        context: "A platform experience for agricultural logistics and operations."
      },
      {
        title: "Bozkurt",
        href: "/projects/bozkurt",
        context: "A mobile-focused launch website and community experience."
      }
    ],
    relatedServices: [
      { title: "Full-Stack Applications & SaaS", href: "/services/software-saas" },
      { title: "AI Integration & Automation", href: "/services/ai-automation" }
    ]
  },
  {
    slug: "software-saas",
    title: "Full-Stack Applications & SaaS",
    metadataTitle: "Full-Stack & SaaS Development in Nigeria",
    description:
      "Plan and build custom full-stack applications and SaaS products with Domani Consult, for businesses in Nigeria and internationally.",
    introduction:
      "Turn a business workflow or product idea into working software. We help shape the core experience, then build the application across its interface, server-side logic and data flows.",
    intendedFor:
      "Teams replacing manual processes, founders developing a software product, and businesses that need connected tools designed around their own workflows.",
    challenges: [
      "Repeated work spread across disconnected tools or spreadsheets.",
      "Product ideas that need a clear first release and practical scope.",
      "Existing software that no longer fits the way a team operates."
    ],
    deliverables: [
      "Full-stack web applications and internal business systems.",
      "SaaS product foundations, user flows and account experiences.",
      "Mobile application experiences where they complement the product requirements.",
      "Dashboards, workflow tools and integrations with agreed services.",
      "Application interfaces and supporting server-side functionality."
    ],
    approach: [
      "Map users, workflows, constraints and the first useful release.",
      "Agree on product structure, technical approach and review points.",
      "Build in clear increments and validate the main user journeys."
    ],
    projects: [
      {
        title: "AfriLance",
        href: "/projects/afrilance",
        context: "A web application concept combining marketplace workflows and project tools."
      },
      {
        title: "PAARD-Co",
        href: "/projects/paard-co",
        context: "A digital platform surface for operational modules and information."
      }
    ],
    relatedServices: [
      { title: "Website Development & E-commerce", href: "/services/website-development" },
      { title: "AI Integration & Automation", href: "/services/ai-automation" }
    ]
  },
  {
    slug: "ai-automation",
    title: "AI Integration & Automation",
    metadataTitle: "AI Integration & Business Automation",
    description:
      "Connect AI capabilities and workflow automation to practical business tasks with Domani Consult, serving Nigerian and international teams.",
    introduction:
      "Use AI and automation where they fit the work. We help identify suitable tasks, connect the relevant tools and design clear handoffs so people can review or act on the results.",
    intendedFor:
      "Teams handling repetitive information work, businesses connecting digital tools, and product owners exploring a focused AI feature or Telegram bot.",
    challenges: [
      "Repetitive steps that consume time across common business workflows.",
      "Information that must be moved or summarized between services.",
      "AI ideas that need a defined task, useful inputs and appropriate human review."
    ],
    deliverables: [
      "AI features connected to agreed business applications or data sources.",
      "Workflow automation and service integrations.",
      "Telegram bots for defined information or task flows.",
      "Review steps and fallback behavior appropriate to the workflow."
    ],
    approach: [
      "Choose a specific workflow and understand its inputs and exceptions.",
      "Select an integration approach that fits the task and available systems.",
      "Test expected and edge-case flows, including human review points."
    ],
    projects: [
      {
        title: "AfriLance",
        href: "/projects/afrilance",
        context: "A marketplace concept that includes AI-assisted project matching."
      },
      {
        title: "PAARD-Co",
        href: "/projects/paard-co",
        context: "A platform project whose listed scope includes automation."
      }
    ],
    relatedServices: [
      { title: "Full-Stack Applications & SaaS", href: "/services/software-saas" },
      { title: "Website Development & E-commerce", href: "/services/website-development" }
    ]
  },
  {
    slug: "web3-smart-contracts",
    title: "Web3 Development & Smart Contracts",
    metadataTitle: "Web3 & Smart Contract Development",
    description:
      "Explore Web3 product engineering and smart contract development with Domani Consult for suitable product requirements in Nigeria and internationally.",
    introduction:
      "Build a Web3 experience around a clear product need. We work on the application experience and blockchain components required by the agreed scope, with careful attention to user flows and integration boundaries.",
    intendedFor:
      "Product teams exploring decentralized applications, token-enabled workflows or smart contracts as part of a broader digital product.",
    challenges: [
      "Blockchain features that need to fit into a coherent product experience.",
      "On-chain and off-chain workflows that need clear integration boundaries.",
      "Complex wallet or transaction steps that should be easier to understand."
    ],
    deliverables: [
      "Web3 application interfaces and wallet-connected user flows.",
      "Smart contract development and application integrations.",
      "Product workflows involving on-chain and off-chain components.",
      "Technical planning based on the selected network and project requirements."
    ],
    approach: [
      "Confirm the product requirement and whether blockchain is appropriate.",
      "Define contract responsibilities, application flows and integration scope.",
      "Implement the agreed components and review user and transaction flows."
    ],
    projects: [
      {
        title: "AfriLance",
        href: "/projects/afrilance",
        context: "A marketplace concept with milestone-based smart-contract escrow."
      },
      {
        title: "Bozkurt",
        href: "/projects/bozkurt",
        context: "A Web3 launch experience with community-focused product flows."
      }
    ],
    relatedServices: [
      { title: "Full-Stack Applications & SaaS", href: "/services/software-saas" },
      { title: "AI Integration & Automation", href: "/services/ai-automation" }
    ]
  }
];

export function getServicePage(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}
