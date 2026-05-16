import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePost, isAdminRequest } from "@/lib/cms";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function DELETE(request: Request, { params }: RouteProps) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deletePost(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Supabase post delete failed." }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true });
}
