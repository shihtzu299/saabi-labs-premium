import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getProject, getProjects } from "@/lib/cms";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 text-sm text-blue-300"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="mb-5 uppercase tracking-[0.3em] text-blue-400">
              {project.year} Project
            </p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-400">
              {project.tagline}
            </p>
          </div>

          <div className="glass rounded-[30px] p-8">
            <h2 className="mb-5 text-2xl font-bold">Scope</h2>
            <div className="flex flex-wrap gap-3">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="my-14 h-[360px] overflow-hidden rounded-[32px]">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`${project.title} project preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="project-orb h-full" />
          )}
        </div>

        <section className="grid gap-8 lg:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="glass rounded-3xl p-8">
              <div className="text-4xl font-black text-blue-300">
                {metric.value}
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.2em] text-gray-400">
                {metric.label}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass rounded-3xl p-8">
            <h2 className="mb-5 text-2xl font-bold">Stack</h2>
            <div className="space-y-3">
              {project.stack.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <CheckCircle2 className="text-blue-300" size={18} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8">
            <h2 className="mb-5 text-2xl font-bold">Outcome</h2>
            <p className="text-lg leading-8 text-gray-400">
              {project.description}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {project.outcome}
            </p>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-blue-400"
              >
                Visit Live Project
                <ArrowUpRight size={18} />
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
