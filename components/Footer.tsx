import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" }
];

const services = [
  "Website Development",
  "Web3 Development",
  "Smart Contracts",
  "AI Integrations",
  "SaaS Applications"
];

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M12.04 2C6.58 2 2.14 6.43 2.14 11.88c0 1.74.46 3.43 1.33 4.92L2 22l5.34-1.4a9.87 9.87 0 0 0 4.7 1.2h.01c5.45 0 9.88-4.43 9.88-9.88C21.93 6.46 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.17.83.85-3.08-.2-.32a8.17 8.17 0 0 1-1.25-4.35c0-4.53 3.7-8.21 8.25-8.21 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.23 8.22Zm4.51-6.15c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.07-.25-.13-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M21.7 4.35 18.63 19c-.23 1.04-.84 1.3-1.7.8l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.2L6.72 12.9 2.1 11.45c-1-.31-1.02-1 .21-1.49L20.4 2.98c.84-.31 1.57.2 1.3 1.37Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M18.9 2.5h3.07l-6.7 7.66 7.88 10.42h-6.17l-4.83-6.32-5.53 6.32H3.54l7.17-8.2L3.15 2.5h6.33l4.37 5.78L18.9 2.5Zm-1.08 16.25h1.7L8.55 4.24H6.72l11.1 14.51Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <Link href="/" className="text-2xl font-black">Saabi Labs</Link>
          <p className="mt-5 max-w-sm leading-7 text-gray-400">
            Premium Web3, AI, SaaS and automation engineering for startups and ambitious digital teams.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://wa.me/2348140668254" aria-label="Contact Saabi Labs on WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-blue-300 transition hover:border-blue-300/60">
              <WhatsAppIcon />
            </a>
            <a href="https://t.me/bnbjing" aria-label="Contact Saabi Labs on Telegram" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-blue-300 transition hover:border-blue-300/60">
              <TelegramIcon />
            </a>
            <a href="https://x.com/ares19bc_" aria-label="Visit Saabi Labs on X" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-blue-300 transition hover:border-blue-300/60">
              <XIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Explore</h2>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm text-gray-400 transition hover:text-blue-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Services</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <p key={service} className="text-sm text-gray-400">{service}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Contact</h2>
          <div className="space-y-4 text-sm text-gray-400">
            <p className="flex items-center gap-3">
              <MapPin size={17} className="text-blue-300" />
              Abuja, Nigeria
            </p>
            <a href="mailto:shihtzu299@gmail.com" className="flex items-center gap-3 transition hover:text-blue-300">
              <Mail size={17} className="text-blue-300" />
              shihtzu299@gmail.com
            </a>
            <a href="/#contact" className="inline-flex items-center gap-2 text-blue-300">
              Schedule consultation
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
        <p>Copyright {new Date().getFullYear()} Saabi Labs. All rights reserved.</p>
        <p>Built for premium product launches.</p>
      </div>
    </footer>
  );
}
