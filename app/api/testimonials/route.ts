import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { upsertTestimonial } from "@/lib/cms";

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

function slugifyFileName(name: string) {
  const parts = name.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "webp";
  const baseName = parts.join(".") || "avatar";

  return `${baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}.${extension}`;
}

async function uploadAvatar(file: File) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "saabi-media";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Avatar upload is not configured.");
  }

  const objectPath = `testimonials/${slugifyFileName(file.name)}`;
  const uploadUrl = `${supabaseUrl.replace(
    /\/$/,
    "",
  )}/storage/v1/object/${bucket}/${objectPath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!uploadResponse.ok) {
    throw new Error((await uploadResponse.text()) || "Avatar upload failed.");
  }

  return `${supabaseUrl.replace(
    /\/$/,
    "",
  )}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = getText(formData, "name");
  const company = getText(formData, "company");
  const message = getText(formData, "message");
  const role = getText(formData, "role");
  const rating = Number(getText(formData, "rating"));
  const avatar = formData.get("avatar");

  if (
    name.length < 2 ||
    company.length < 2 ||
    message.length < 20 ||
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

    try {
      avatarUrl = await uploadAvatar(avatar);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Avatar upload failed. Please try again.",
        },
        { status: 500 },
      );
    }
  }

  const saved = await upsertTestimonial({
    name,
    role,
    company,
    message,
    avatarUrl,
    rating,
    status: "pending",
  });

  if (!saved) {
    return NextResponse.json(
      { error: "Testimonial save failed. Please try again." },
      { status: 500 },
    );
  }

  revalidatePath("/admin");

  return NextResponse.json({ testimonial: saved[0] });
}
