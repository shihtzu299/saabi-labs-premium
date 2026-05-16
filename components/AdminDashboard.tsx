"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  FolderKanban,
  LogOut,
  MessageSquare,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Post } from "@/data/posts";
import type { Project } from "@/data/projects";
import type { Testimonial } from "@/data/testimonials";

type AdminDashboardProps = {
  initialPosts: Post[];
  initialProjects: Project[];
  initialTestimonials: Testimonial[];
};

const emptyProject: Project = {
  slug: "",
  title: "",
  tagline: "",
  summary: "",
  description: "",
  stack: [],
  services: [],
  year: new Date().getFullYear().toString(),
  outcome: "",
  imageUrl: "",
liveUrl: "",
metrics: []
};

const emptyPost: Post = {
  slug: "",
  title: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "3 min read",
  category: "",
  content: []
};

function testimonialAvatar(testimonial: Testimonial) {
  return (
    testimonial.avatarUrl ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      testimonial.name || "Guest",
    )}`
  );
}

function csvToArray(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function linesToArray(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayToCsv(value: string[]) {
  return value.join(", ");
}

export default function AdminDashboard({
  initialPosts,
  initialProjects,
  initialTestimonials,
}: AdminDashboardProps) {
  const router = useRouter();
  const [status, setStatus] = useState("Signed in. Changes will be saved to Supabase.");
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [posts, setPosts] = useState(initialPosts);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [projectForm, setProjectForm] = useState({
    ...emptyProject,
    stack: arrayToCsv(emptyProject.stack),
    services: arrayToCsv(emptyProject.services),
    liveUrl: emptyProject.liveUrl || "",
    metrics: JSON.stringify(emptyProject.metrics, null, 2),
  });
  const [postForm, setPostForm] = useState({
    ...emptyPost,
    content: emptyPost.content.join("\n\n")
  });

  const stats = useMemo(() => [
    { label: "Projects", value: projects.length, icon: FolderKanban },
    { label: "Blog posts", value: posts.length, icon: FileText },
    {
      label: "New testimonials",
      value: testimonials.filter((item) => item.status !== "approved").length,
      icon: MessageSquare,
    },
  ], [posts.length, projects.length, testimonials]);

  const saveProject = async () => {
    let metrics: Project["metrics"] = [];

    try {
      metrics = JSON.parse(projectForm.metrics || "[]");
    } catch {
      setStatus("Project metrics must be valid JSON.");
      return;
    }

    const payload: Project = {
      slug: projectForm.slug.trim(),
      title: projectForm.title.trim(),
      tagline: projectForm.tagline.trim(),
      summary: projectForm.summary.trim(),
      description: projectForm.description.trim(),
      stack: csvToArray(projectForm.stack),
      services: csvToArray(projectForm.services),
      year: projectForm.year.trim(),
      outcome: projectForm.outcome.trim(),
      imageUrl: (projectForm.imageUrl || "").trim(),
      liveUrl: (projectForm.liveUrl || "").trim(),
      metrics,
    };

    const response = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Project save failed.");
      return;
    }

    setProjects((current) => [payload, ...current.filter((project) => project.slug !== payload.slug)]);
    setProjectForm({
      ...emptyProject,
      stack: "",
      services: "",
      liveUrl: "",
      metrics: "[]",
    });
    setStatus(`Saved project: ${payload.title}`);
  };

  const uploadProjectImage = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "projects");

    setUploadingProjectImage(true);
    setStatus("Uploading project image...");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    setUploadingProjectImage(false);

    if (!response.ok) {
      setStatus(data.error || "Image upload failed.");
      return;
    }

    setProjectForm((current) => ({
      ...current,
      imageUrl: data.publicUrl
    }));
    setStatus("Image uploaded. Save the project to keep this image URL.");
  };

  const savePost = async () => {
    const payload: Post = {
      slug: postForm.slug.trim(),
      title: postForm.title.trim(),
      excerpt: postForm.excerpt.trim(),
      date: postForm.date.trim(),
      readTime: postForm.readTime.trim(),
      category: postForm.category.trim(),
      content: linesToArray(postForm.content)
    };

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Post save failed.");
      return;
    }

    setPosts((current) => [payload, ...current.filter((post) => post.slug !== payload.slug)]);
    setPostForm({
      ...emptyPost,
      content: ""
    });
    setStatus(`Saved post: ${payload.title}`);
  };

  const deleteItem = async (kind: "projects" | "posts", slug: string) => {
    const response = await fetch(`/api/admin/${kind}/${slug}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || "Delete failed.");
      return;
    }

    if (kind === "projects") {
      setProjects((current) => current.filter((project) => project.slug !== slug));
    } else {
      setPosts((current) => current.filter((post) => post.slug !== slug));
    }

    setStatus(`Deleted ${slug}.`);
  };

const approveTestimonial = async (id?: string) => {
  if (!id) return;

  const response = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "approved",
    }),
  });

  if (!response.ok) {
    setStatus("Failed to approve testimonial.");
    return;
  }

  setTestimonials((current) =>
    current.map((item) =>
      item.id === id ? { ...item, status: "approved" } : item,
    ),
  );

  setStatus("Testimonial approved.");
};

const removeTestimonial = async (id?: string) => {
  if (!id) return;

  const response = await fetch(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    setStatus("Failed to delete testimonial.");
    return;
  }

  setTestimonials((current) => current.filter((item) => item.id !== id));

  setStatus("Testimonial deleted.");
};

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-5 uppercase tracking-[0.3em] text-blue-400">
            Admin Dashboard
          </p>
          <h1 className="text-5xl font-black md:text-7xl">
            Content command center.
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass rounded-full px-5 py-3 text-sm text-blue-200">
            Supabase CMS mode
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-blue-300/60"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="glass rounded-3xl p-8">
              <Icon className="mb-6 text-blue-300" />
              <div className="text-4xl font-black">{stat.value}</div>
              <p className="mt-2 text-gray-400">{stat.label}</p>
            </div>
          );
        })}
        <div className="glass rounded-3xl p-8">
          <div className="text-4xl font-black">8h</div>
          <p className="mt-2 text-gray-400">Session length</p>
          <p className="mt-4 text-sm text-gray-400">{status}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Project Editor</h2>
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="slug"
              value={projectForm.slug}
              onChange={(event) =>
                setProjectForm({ ...projectForm, slug: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="title"
              value={projectForm.title}
              onChange={(event) =>
                setProjectForm({ ...projectForm, title: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="tagline"
              value={projectForm.tagline}
              onChange={(event) =>
                setProjectForm({ ...projectForm, tagline: event.target.value })
              }
            />
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="summary"
              value={projectForm.summary}
              onChange={(event) =>
                setProjectForm({ ...projectForm, summary: event.target.value })
              }
            />
            <textarea
              className="min-h-28 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="description"
              value={projectForm.description}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  description: event.target.value,
                })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="stack, comma separated"
              value={projectForm.stack}
              onChange={(event) =>
                setProjectForm({ ...projectForm, stack: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="services, comma separated"
              value={projectForm.services}
              onChange={(event) =>
                setProjectForm({ ...projectForm, services: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="image URL, for example /images/projects/afrilance.webp"
              value={projectForm.imageUrl || ""}
              onChange={(event) =>
                setProjectForm({ ...projectForm, imageUrl: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="live project URL"
              value={projectForm.liveUrl || ""}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  liveUrl: event.target.value,
                })
              }
            />
            <label className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-4 py-4 text-sm text-gray-400">
              <span className="mb-2 block text-blue-300">
                {uploadingProjectImage
                  ? "Uploading..."
                  : "Upload project image"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="block w-full text-sm"
                disabled={uploadingProjectImage}
                onChange={(event) =>
                  uploadProjectImage(event.target.files?.[0])
                }
              />
            </label>
            {projectForm.imageUrl ? (
              <img
                src={projectForm.imageUrl}
                alt="Project preview"
                className="h-36 w-full rounded-2xl object-cover"
              />
            ) : null}
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="year"
              value={projectForm.year}
              onChange={(event) =>
                setProjectForm({ ...projectForm, year: event.target.value })
              }
            />
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="outcome"
              value={projectForm.outcome}
              onChange={(event) =>
                setProjectForm({ ...projectForm, outcome: event.target.value })
              }
            />
            <textarea
              className="min-h-28 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm outline-none"
              placeholder='[{"label":"Metric","value":"Value"}]'
              value={projectForm.metrics}
              onChange={(event) =>
                setProjectForm({ ...projectForm, metrics: event.target.value })
              }
            />
            <button
              onClick={saveProject}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white"
            >
              <Save size={18} />
              Save Project
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Blog Editor</h2>
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="slug"
              value={postForm.slug}
              onChange={(event) =>
                setPostForm({ ...postForm, slug: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="title"
              value={postForm.title}
              onChange={(event) =>
                setPostForm({ ...postForm, title: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="category"
              value={postForm.category}
              onChange={(event) =>
                setPostForm({ ...postForm, category: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="date"
              value={postForm.date}
              onChange={(event) =>
                setPostForm({ ...postForm, date: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="read time"
              value={postForm.readTime}
              onChange={(event) =>
                setPostForm({ ...postForm, readTime: event.target.value })
              }
            />
            <textarea
              className="min-h-24 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="excerpt"
              value={postForm.excerpt}
              onChange={(event) =>
                setPostForm({ ...postForm, excerpt: event.target.value })
              }
            />
            <textarea
              className="min-h-56 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
              placeholder="content, one paragraph per line"
              value={postForm.content}
              onChange={(event) =>
                setPostForm({ ...postForm, content: event.target.value })
              }
            />
            <button
              onClick={savePost}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white"
            >
              <Save size={18} />
              Save Post
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-4"
              >
                <button
                  className="text-left"
                  onClick={() =>
                    setProjectForm({
                      ...project,
                      stack: arrayToCsv(project.stack),
                      services: arrayToCsv(project.services),
                      liveUrl: project.liveUrl || "",
                      metrics: JSON.stringify(project.metrics, null, 2),
                    })
                  }
                >
                  <span className="block font-semibold">{project.title}</span>
                  <span className="text-sm text-gray-400">{project.slug}</span>
                </button>
                <button
                  aria-label={`Delete ${project.title}`}
                  onClick={() => deleteItem("projects", project.slug)}
                  className="text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold">Posts</h2>
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-4"
              >
                <button
                  className="text-left"
                  onClick={() =>
                    setPostForm({
                      ...post,
                      content: post.content.join("\n\n"),
                    })
                  }
                >
                  <span className="block font-semibold">{post.title}</span>
                  <span className="text-sm text-gray-400">{post.slug}</span>
                </button>
                <button
                  aria-label={`Delete ${post.title}`}
                  onClick={() => deleteItem("posts", post.slug)}
                  className="text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="mt-8">
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold">Testimonials</h2>
              <p className="mt-2 text-sm text-gray-400">
                Approve new submissions before they appear on the homepage.
              </p>
            </div>

            <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-blue-200">
              {testimonials.length} total
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex min-h-full flex-col rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={testimonialAvatar(testimonial)}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{testimonial.name}</div>

                        <div className="truncate text-sm text-gray-400">
                          {testimonial.company}
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          testimonial.status === "approved"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {testimonial.status}
                      </span>
                    </div>

                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-6 text-gray-300">
                  {testimonial.message}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {testimonial.status !== "approved" ? (
                    <button
                      onClick={() => approveTestimonial(testimonial.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                  ) : null}

                  <button
                    onClick={() => removeTestimonial(testimonial.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length === 0 ? (
            <p className="rounded-2xl border border-white/10 p-4 text-sm text-gray-400">
              No testimonials have been submitted yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
