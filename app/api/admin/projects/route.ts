import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjects, isAdminRequest, upsertProject } from "@/lib/cms";
import type { Project } from "@/data/projects";
import { readBoundedJson } from "@/lib/boundedRequest";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ projects: await getProjects(true) });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = await readBoundedJson(request, 128 * 1024);
  if (parsed.tooLarge) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  if (!parsed.value || typeof parsed.value !== "object") return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const project = parsed.value as Project;

  if (!project.slug || !project.title || !project.summary) {
    return NextResponse.json({ error: "Slug, title, and summary are required." }, { status: 400 });
  }

  const saved = await upsertProject(project);

  if (!saved) {
    return NextResponse.json({ error: "Supabase project save failed. Check env vars and table setup." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ project: saved[0] });
}
