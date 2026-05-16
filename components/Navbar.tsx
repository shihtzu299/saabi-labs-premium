"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ExperienceLayer";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/#services", label: "Services" },
    { href: "/#projects", label: "Projects" },
    { href: "/#about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contact" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
  href="/"
  className="flex items-center gap-3"
>
  <Image
    src="/logo.png"
    alt="Saabi Labs logo"
    width={44}
    height={44}
    className="object-contain"
    priority
  />

  <div className="flex flex-col leading-none">
    <span className="text-lg font-black">
      Saabi Labs
    </span>

    <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-blue-300">
      Premium Engineering
    </span>
  </div>
</Link>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-panel mx-4 mb-4 rounded-3xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-gray-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
