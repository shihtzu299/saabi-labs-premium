import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, isAdminRequest, upsertPost } from "@/lib/cms";
import type { Post } from "@/data/posts";
import { readBoundedJson } from "@/lib/boundedRequest";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ posts: await getPosts(true) });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = await readBoundedJson(request, 128 * 1024);
  if (parsed.tooLarge) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  if (!parsed.value || typeof parsed.value !== "object") return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const post = parsed.value as Post;

  if (!post.slug || !post.title || !post.excerpt) {
    return NextResponse.json({ error: "Slug, title, and excerpt are required." }, { status: 400 });
  }

  const saved = await upsertPost(post);

  if (!saved) {
    return NextResponse.json({ error: "Supabase post save failed. Check env vars and table setup." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ post: saved[0] });
}
