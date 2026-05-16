import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  deleteTestimonial,
  isAdminRequest,
  updateTestimonial,
} from "@/lib/cms";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();

  const updated = await updateTestimonial(id, body);

  if (!updated) {
    return NextResponse.json(
      { error: "Failed to update testimonial." },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({
    testimonial: updated[0],
  });
}

export async function DELETE(request: Request, { params }: RouteProps) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const deleted = await deleteTestimonial(id);

  if (!deleted) {
    return NextResponse.json(
      { error: "Failed to delete testimonial." },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
