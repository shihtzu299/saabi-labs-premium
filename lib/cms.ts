import { posts as fallbackPosts, type Post } from "@/data/posts";
import { projects as fallbackProjects, type Project } from "@/data/projects";
import { adminCookieName, getCookieValue, verifyAdminToken } from "@/lib/adminAuth";
import type { Testimonial } from "@/data/testimonials";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";

type TableName = "projects" | "posts" | "testimonials";

function getSupabaseConfig(admin = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = admin
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    key,
    restUrl: `${url.replace(/\/$/, "")}/rest/v1`
  };
}

async function supabaseRequest<T>(
  table: TableName,
  query: string,
  init: RequestInit = {},
  admin = false
) {
  const config = getSupabaseConfig(admin);

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.restUrl}/${table}${query}`, {
    ...init,
    cache: init.method ? undefined : "no-store",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...init.headers
    }
  });

  if (!response.ok) {
    return null;
  }

  if (response.status === 204) {
    return true as T;
  }

  return response.json() as Promise<T>;
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    stack: cleanStringArray(project.stack),
    services: cleanStringArray(project.services),
    imageUrl: typeof project.imageUrl === "string" ? project.imageUrl : "",
    liveUrl: typeof project.liveUrl === "string" ? project.liveUrl : "",
    metrics: Array.isArray(project.metrics) ? project.metrics : [],
  };
}

function normalizePost(post: Post): Post {
  return {
    ...post,
    content: cleanStringArray(post.content)
  };
}

function normalizeTestimonial(testimonial: Testimonial): Testimonial {
  const rating =
    typeof testimonial.rating === "number" && testimonial.rating >= 1
      ? Math.min(5, Math.round(testimonial.rating))
      : 5;

  return {
    ...testimonial,
    avatarUrl:
      typeof testimonial.avatarUrl === "string" &&
      testimonial.avatarUrl.length > 0
        ? testimonial.avatarUrl
        : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
            testimonial.name || "Guest",
          )}`,
    rating,
    status: testimonial.status === "approved" ? "approved" : "pending",
  };
}

export async function getProjects() {
  const projects = await supabaseRequest<Project[]>("projects", "?select=*&order=created_at.desc");
  return projects?.map(normalizeProject) || fallbackProjects;
}

export async function getProject(slug: string) {
  const projects = await supabaseRequest<Project[]>(
    "projects",
    `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  return projects?.[0] ? normalizeProject(projects[0]) : fallbackProjects.find((project) => project.slug === slug);
}

export async function getPosts() {
  const posts = await supabaseRequest<Post[]>("posts", "?select=*&order=date.desc");
  return posts?.map(normalizePost) || fallbackPosts;
}

export async function getTestimonials(status?: "pending" | "approved") {
  const query = status
    ? `?select=*&status=eq.${status}&order=created_at.desc`
    : "?select=*&order=created_at.desc";

  const testimonials = await supabaseRequest<Testimonial[]>(
    "testimonials",
    query,
  );

  return testimonials?.map(normalizeTestimonial) || fallbackTestimonials;
}

export async function updateTestimonial(
  id: string,
  testimonial: Partial<Testimonial>,
) {
  return supabaseRequest<Testimonial[]>(
    "testimonials",
    `?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(testimonial),
    },
    true,
  );
}

export async function deleteTestimonial(id: string) {
  return supabaseRequest<boolean>(
    "testimonials",
    `?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal",
      },
    },
    true,
  );
}

export async function getPost(slug: string) {
  const posts = await supabaseRequest<Post[]>(
    "posts",
    `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  return posts?.[0] ? normalizePost(posts[0]) : fallbackPosts.find((post) => post.slug === slug);
}

export function isAdminRequest(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const suppliedPassword = request.headers.get("x-admin-password");
  const sessionToken = getCookieValue(request.headers.get("cookie"), adminCookieName);
  return verifyAdminToken(sessionToken) || Boolean(password && suppliedPassword && password === suppliedPassword);
}

export async function upsertProject(project: Project) {
  return supabaseRequest<Project[]>(
    "projects",
    "?on_conflict=slug",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(project)
    },
    true
  );
}

export async function deleteProject(slug: string) {
  return supabaseRequest<boolean>(
    "projects",
    `?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal"
      }
    },
    true
  );
}

export async function upsertPost(post: Post) {
  return supabaseRequest<Post[]>(
    "posts",
    "?on_conflict=slug",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(post)
    },
    true
  );
}

export async function upsertTestimonial(testimonial: Testimonial) {
  return supabaseRequest<Testimonial[]>(
    "testimonials",
    "",
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(testimonial),
    },
    true,
  );
}

export async function deletePost(slug: string) {
  return supabaseRequest<boolean>(
    "posts",
    `?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal"
      }
    },
    true
  );
}
