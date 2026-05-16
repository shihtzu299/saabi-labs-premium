import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, isAdminRequest, upsertPost } from "@/lib/cms";
import type { Post } from "@/data/posts";

export async function GET() {
  return NextResponse.json({ posts: await getPosts() });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const post = (await request.json()) as Post;

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
