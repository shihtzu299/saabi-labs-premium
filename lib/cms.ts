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
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  try {
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
      let errorCode: string | undefined;
      try {
        const errorBody = (await response.json()) as { code?: unknown };
        if (typeof errorBody.code === "string") {
          errorCode = errorBody.code;
        }
      } catch {
        // Keep the response body out of logs; the status and table identify the failure safely.
      }
      console.error("[Supabase request failed]", {
        table,
        status: response.status,
        code: errorCode,
      });
      return null;
    }

    const prefer = new Headers(init.headers).get("Prefer") || "";
    if (
      response.status === 204 ||
      prefer.split(",").some((value) => value.trim().toLowerCase() === "return=minimal")
    ) {
      return true as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("[Supabase request error]", {
      table,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return null;
  }
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

export async function getProjects(admin = false) {
  const projects = await supabaseRequest<Project[]>("projects", "?select=*&order=created_at.desc", {}, admin);
  return projects?.map(normalizeProject) || fallbackProjects;
}

export async function getProject(slug: string, admin = false) {
  const projects = await supabaseRequest<Project[]>(
    "projects",
    `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {},
    admin
  );
  return projects?.[0] ? normalizeProject(projects[0]) : fallbackProjects.find((project) => project.slug === slug);
}

export async function getPosts(admin = false) {
  const posts = await supabaseRequest<Post[]>("posts", "?select=*&order=date.desc", {}, admin);
  return posts?.map(normalizePost) || fallbackPosts;
}

export async function getTestimonials(status?: "pending" | "approved", admin = false) {
  const query = status
    ? `?select=*&status=eq.${status}&order=created_at.desc`
    : "?select=*&order=created_at.desc";

  const testimonials = await supabaseRequest<Testimonial[]>(
    "testimonials",
    query,
    {},
    admin
  );

  if (testimonials === null) {
    return admin ? [] : fallbackTestimonials;
  }

  if (testimonials.length === 0 && !admin && status === "approved") {
    return fallbackTestimonials
      .filter((testimonial) => testimonial.status === "approved")
      .map(normalizeTestimonial);
  }

  return testimonials.map(normalizeTestimonial);
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

export async function getPost(slug: string, admin = false) {
  const posts = await supabaseRequest<Post[]>(
    "posts",
    `?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {},
    admin
  );
  return posts?.[0] ? normalizePost(posts[0]) : fallbackPosts.find((post) => post.slug === slug);
}

export function isAdminRequest(request: Request) {
  const sessionToken = getCookieValue(request.headers.get("cookie"), adminCookieName);
  return verifyAdminToken(sessionToken);
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
  return supabaseRequest<boolean>(
    "testimonials",
    "",
    {
      method: "POST",
      headers: {
        // The pending row is intentionally hidden by the public SELECT policy.
        Prefer: "return=minimal",
      },
      body: JSON.stringify(testimonial),
    },
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
