import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/data/home";

const trustNotes = ["Websites & applications", "SaaS platforms", "Intelligent automation"];

export default function Hero() {
  return (
    <section className="domani-hero relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-14 pt-10 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:pb-20 xl:px-12">
        <div className="relative z-10 max-w-[600px]">
          <h1 className="max-w-[650px] text-[clamp(2.8rem,5.2vw,5rem)] font-extrabold leading-[0.99] tracking-[-0.045em] text-white">
            Building <span className="gradient-text">modern</span> digital products for businesses.
          </h1>
          <p className="mt-7 max-w-[560px] text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Domani Consult designs and builds websites, full-stack applications, SaaS platforms and intelligent automation to help businesses grow and operate more efficiently.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <a href="https://wa.me/2348140668254" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-500 px-7 text-base font-semibold text-white shadow-[0_10px_40px_rgba(37,99,235,0.24)] transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">
              Start a Project <ArrowRight size={19} aria-hidden="true" />
            </a>
            <a href="#projects" className="glass inline-flex min-h-14 items-center justify-center rounded-full px-7 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">
              View Our Work
            </a>
          </div>
          <ul className="mt-8 flex max-w-[540px] flex-wrap gap-2.5 text-xs text-slate-400 sm:text-sm" aria-label="Domani Consult services">
            {trustNotes.map((note) => (
              <li key={note} className="rounded-full border border-slate-400/20 bg-white/[0.02] px-3.5 py-1.5 leading-5">
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="domani-devices relative mx-auto mt-2 min-h-[260px] w-full max-w-[720px] sm:min-h-[380px] lg:mt-4 lg:min-h-[560px]">
          <div className="domani-device-float relative">
            {homeContent.heroImageUrl ? (
              // Keep the existing CMS supplied hero image behavior available.
              <img src={homeContent.heroImageUrl} alt="Domani Consult digital product showcase" className="domani-device-art" />
            ) : (
              <Image src="/images/domani-consult-hero-devices.webp" alt="Laptop and smartphone displaying Domani Consult analytics dashboards" fill priority sizes="(max-width: 768px) 100vw, 55vw" className="domani-device-art" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
