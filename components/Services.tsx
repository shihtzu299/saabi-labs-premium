import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  FileCode2,
  Globe2,
  Layers3,
  MousePointerClick,
  Smartphone,
  WalletCards
} from "lucide-react";

const services = [
  {
    title: "Website Development & E-commerce",
    href: "/services/website-development",
    description:
      "Responsive business websites, online stores and polished web experiences built around your goals.",
    icon: Globe2
  },
  {
    title: "Custom Software & Full-Stack Applications",
    href: "/services/software-saas",
    description:
      "Purpose-built web applications and digital systems that support the way your business works.",
    icon: Code2
  },
  {
    title: "SaaS Product Development",
    href: "/services/software-saas",
    description:
      "Product design and engineering for subscription software and scalable digital platforms.",
    icon: Layers3
  },
  {
    title: "AI Integration & Automation",
    href: "/services/ai-automation",
    description:
      "Practical AI integrations, intelligent workflows and Telegram bots for business operations.",
    icon: BrainCircuit
  },
  {
    title: "Mobile Applications",
    href: "/services/software-saas",
    description:
      "Mobile experiences designed around your users, product functionality and business needs.",
    icon: Smartphone
  },
  {
    title: "Landing Pages & Conversion Experiences",
    href: "/services/website-development",
    description:
      "Focused landing pages for products, campaigns and business offers.",
    icon: MousePointerClick
  },
  {
    title: "Web3 & Blockchain Development",
    href: "/services/web3-smart-contracts",
    description:
      "Blockchain-based applications and decentralized product engineering.",
    icon: WalletCards
  },
  {
    title: "Smart Contracts",
    href: "/services/web3-smart-contracts",
    description:
      "Smart contract development and integrations shaped to your product requirements.",
    icon: FileCode2
  }
];

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 xl:px-12">
        <div className="mb-10 max-w-3xl sm:mb-14 lg:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300 sm:text-sm">
            What we do
          </p>
          <h2 id="services-heading" className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Digital solutions built for your business.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            From your first website to the software that runs your operations, we design and build useful digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.title}
                href={service.href}
                aria-label={`Learn about ${service.title}`}
                className="glass gsap-reveal flex h-full min-h-[232px] flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-300/30 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:min-h-[248px] sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-[15px]">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h3 className="text-xl font-semibold text-white sm:text-2xl">Have a project in mind?</h3>
            <p className="mt-1 text-sm leading-6 text-gray-300 sm:text-base">
              Tell us what you&apos;re looking to build.
            </p>
          </div>
          <a
            href="https://wa.me/2348140668254"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300 sm:self-auto"
          >
            Start a Project <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
