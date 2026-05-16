import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects } from "@/lib/cms";

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-black mb-16">Featured Projects</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.title}
              href={`/projects/${project.slug}`}
              className="glass gsap-reveal group p-8 rounded-[30px] hover:border-blue-500/30 transition"
            >
              <div className="mb-8 h-52 overflow-hidden rounded-2xl">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} project preview`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="project-orb h-full" />
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                <ArrowUpRight className="mt-2 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={22} />
              </div>

              <p className="text-gray-400 leading-7 mb-6">{project.summary}</p>

              <div className="text-sm text-blue-300">{project.stack.join(" / ")}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
