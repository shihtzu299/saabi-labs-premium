import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { ServicePageContent } from "@/data/servicePages";

export default function ServicePage({ service }: { service: ServicePageContent }) {
  return (
    <main className="min-h-screen px-6 pb-24 pt-32 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/#services"
          className="mb-8 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-blue-300 transition hover:text-blue-200 focus-visible:rounded focus-visible:outline"
        >
          <ArrowUpRight size={16} aria-hidden="true" />
          Explore all services
        </Link>

        <header className="max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300 sm:text-sm">
            Domani Consult Services
          </p>
          <h1 className="text-[var(--text-main)] text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
            {service.introduction}
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 font-semibold text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
          >
            Discuss your project <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <section aria-labelledby="service-fit" className="glass rounded-3xl p-6 sm:p-8">
            <h2 id="service-fit" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Who this is for
            </h2>
            <p className="mt-4 leading-7 text-[var(--text-muted)]">{service.intendedFor}</p>
          </section>
          <section aria-labelledby="service-problems" className="glass rounded-3xl p-6 sm:p-8">
            <h2 id="service-problems" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Problems we can help address
            </h2>
            <ul className="mt-4 space-y-3">
              {service.challenges.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-[var(--text-muted)]">
                  <Check className="mt-1 shrink-0 text-blue-300" size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="service-deliverables" className="glass rounded-3xl p-6 sm:p-8">
            <h2 id="service-deliverables" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Possible deliverables
            </h2>
            <ul className="mt-4 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-[var(--text-muted)]">
                  <Check className="mt-1 shrink-0 text-blue-300" size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="service-approach" className="glass rounded-3xl p-6 sm:p-8">
            <h2 id="service-approach" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              A practical approach
            </h2>
            <ol className="mt-4 space-y-3">
              {service.approach.map((item, index) => (
                <li key={item} className="flex gap-3 leading-7 text-[var(--text-muted)]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-blue-300/30 text-sm font-semibold text-blue-300">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <section aria-labelledby="related-projects">
            <h2 id="related-projects" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Related projects
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {service.projects.map((project) => (
                <Link
                  key={project.href}
                  href={project.href}
                  className="glass group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-blue-300/40 focus-visible:outline"
                >
                  <span className="text-lg font-semibold text-[var(--text-main)]">{project.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">{project.context}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-300">
                    View project <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section aria-labelledby="related-services">
            <h2 id="related-services" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
              Related services
            </h2>
            <ul className="mt-5 space-y-3">
              {service.relatedServices.map((related) => (
                <li key={related.href}>
                  <Link
                    href={related.href}
                    className="inline-flex min-h-11 items-center gap-2 text-[var(--text-muted)] transition hover:text-blue-300 focus-visible:rounded focus-visible:outline"
                  >
                    {related.title} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="service-cta" className="mt-16 rounded-3xl border border-blue-300/20 bg-blue-500/[0.06] p-7 sm:p-10">
          <h2 id="service-cta" className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Let&apos;s talk about what you need to build.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--text-muted)]">
            Share your goals and the challenges you are working through. We can discuss a suitable scope and next steps.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:rounded focus-visible:outline"
          >
            Contact Domani Consult <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
