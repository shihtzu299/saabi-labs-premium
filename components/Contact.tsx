import { Building2, Mail } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 fill-current">
      <path d="M12.04 2C6.58 2 2.14 6.43 2.14 11.88c0 1.74.46 3.43 1.33 4.92L2 22l5.34-1.4a9.87 9.87 0 0 0 4.7 1.2h.01c5.45 0 9.88-4.43 9.88-9.88C21.93 6.46 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.17.83.85-3.08-.2-.32a8.17 8.17 0 0 1-1.25-4.35c0-4.53 3.7-8.21 8.25-8.21 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.23 8.22Zm4.51-6.15c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.07-.25-.13-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 fill-current">
      <path d="M21.7 4.35 18.63 19c-.23 1.04-.84 1.3-1.7.8l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.34-4.78 8.7-7.86c.38-.34-.08-.53-.59-.2L6.72 12.9 2.1 11.45c-1-.31-1.02-1 .21-1.49L20.4 2.98c.84-.31 1.57.2 1.3 1.37Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9 fill-current">
      <path d="M18.9 2.5h3.07l-6.7 7.66 7.88 10.42h-6.17l-4.83-6.32-5.53 6.32H3.54l7.17-8.2L3.15 2.5h6.33l4.37 5.78L18.9 2.5Zm-1.08 16.25h1.7L8.55 4.24H6.72l11.1 14.51Z" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass rounded-[32px] p-12">
          <h2 className="text-5xl font-black mb-10">Let&apos;s build something exceptional.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://wa.me/2348140668254"
              aria-label="Contact Saabi Labs on WhatsApp"
              className="glass flex items-center justify-between gap-6 p-8 rounded-3xl transition hover:border-blue-400/40"
            >
              <h3 className="text-2xl font-bold">WhatsApp</h3>
              <span className="text-blue-300">
                <WhatsAppIcon />
              </span>
            </a>

            <a
              href="https://t.me/bnbjing"
              aria-label="Contact Saabi Labs on Telegram"
              className="glass flex items-center justify-between gap-6 p-8 rounded-3xl transition hover:border-blue-400/40"
            >
              <h3 className="text-2xl font-bold">Telegram</h3>
              <span className="text-blue-300">
                <TelegramIcon />
              </span>
            </a>

            <a
              href="https://x.com/ares19bc_"
              aria-label="Visit Saabi Labs on X"
              className="glass flex items-center justify-between gap-6 p-8 rounded-3xl transition hover:border-blue-400/40"
            >
              <h3 className="text-2xl font-bold">X</h3>
              <span className="text-blue-300">
                <XIcon />
              </span>
            </a>

            <div className="glass p-8 rounded-3xl">
              <div className="mb-4 flex items-center justify-between gap-6">
                <h3 className="text-2xl font-bold">Location</h3>
                <Building2 className="text-blue-300" size={34} />
              </div>
              <p className="text-gray-400">Abuja FCT, Nigeria.</p>
              <div className="mt-2 flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>shihtzu299@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
