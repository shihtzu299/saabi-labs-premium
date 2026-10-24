import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { upsertTestimonial } from "@/lib/cms";
import {
  imageExtension,
  isValidImage,
  readBoundedBody,
} from "@/lib/boundedRequest";
import { allowRequest, requestClientKey } from "@/lib/rateLimit";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarSize = 1024 * 1024 * 2;

function fallbackAvatar(name: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    name || "Guest",
  )}`;
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugifyFileName(name: string, mimeType: string) {
  const baseName = name.replace(/\.[^.]*$/, "") || "avatar";
  return `${
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "avatar"
  }-${Date.now()}.${imageExtension(mimeType)}`;
}

async function uploadAvatar(file: File, bytes: Uint8Array) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "saabi-media";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Avatar upload is not configured.");
  }

  const objectPath = `testimonials/${slugifyFileName(file.name, file.type)}`;
  const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: Buffer.from(bytes),
  });

  if (!uploadResponse.ok) {
    throw new Error("Avatar upload failed.");
  }

  return `${supabaseUrl.replace(
    /\/$/,
    "",
  )}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function POST(request: Request) {
  if (
    !allowRequest(requestClientKey(request, "testimonial"), 5, 60 * 60 * 1000)
  ) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 },
    );
  }
  const body = await readBoundedBody(request, 2 * 1024 * 1024 + 64 * 1024);
  if (!body)
    return NextResponse.json(
      { error: "Submission is too large." },
      { status: 413 },
    );
  let formData: FormData;
  try {
    formData = await new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body,
    }).formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid submission form." },
      { status: 400 },
    );
  }
  const name = getText(formData, "name");
  const company = getText(formData, "company");
  const message = getText(formData, "message");
  const role = getText(formData, "role");
  const rating = Number(getText(formData, "rating"));
  const avatar = formData.get("avatar");

  if (message.length < 20) {
    return NextResponse.json(
      { error: "Your testimonial must be at least 20 characters long." },
      { status: 400 },
    );
  }

  if (
    name.length < 2 ||
    name.length > 100 ||
    company.length < 2 ||
    company.length > 120 ||
    role.length > 120 ||
    message.length > 3000 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Name, company, rating, and a clear message are required." },
      { status: 400 },
    );
  }

  let avatarUrl = fallbackAvatar(name);

  if (avatar instanceof File && avatar.size > 0) {
    if (!allowedTypes.has(avatar.type)) {
      return NextResponse.json(
        { error: "Upload a JPG, PNG, or WebP avatar." },
        { status: 400 },
      );
    }

    if (avatar.size > maxAvatarSize) {
      return NextResponse.json(
        { error: "Avatar must be 2MB or smaller." },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await avatar.arrayBuffer());
    if (!isValidImage(bytes, avatar.type)) {
      return NextResponse.json(
        { error: "Avatar content does not match its file type." },
        { status: 400 },
      );
    }

    try {
      avatarUrl = await uploadAvatar(avatar, bytes);
    } catch (error) {
      return NextResponse.json(
        {
          error: "Avatar upload failed. Please try again.",
        },
        { status: 500 },
      );
    }
  }

  const testimonial = {
    name,
    role,
    company,
    message,
    avatarUrl,
    rating,
    status: "pending",
    approved: false,
  } as const;
  const saved = await upsertTestimonial(testimonial);

  if (!saved) {
    return NextResponse.json(
      { error: "Testimonial save failed. Please try again." },
      { status: 500 },
    );
  }

  revalidatePath("/admin");

  return NextResponse.json({ testimonial });
}
