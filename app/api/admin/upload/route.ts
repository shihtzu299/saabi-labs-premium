import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/cms";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function slugifyFileName(name: string) {
  const parts = name.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "webp";
  const baseName = parts.join(".") || "image";

  return `${baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}.${extension}`;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "saabi-media";

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase storage is not configured." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderValue = formData.get("folder");
  const folder = typeof folderValue === "string" ? folderValue : "uploads";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image." }, { status: 400 });
  }

  if (file.size > 1024 * 1024 * 2) {
    return NextResponse.json({ error: "Image must be 2MB or smaller." }, { status: 400 });
  }

  const cleanFolder = folder.replace(/[^a-z0-9-/]/gi, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const objectPath = `${cleanFolder}/${slugifyFileName(file.name)}`;
  const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: Buffer.from(await file.arrayBuffer())
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text();
    return NextResponse.json(
      { error: error || "Supabase image upload failed." },
      { status: uploadResponse.status }
    );
  }

  const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;

  return NextResponse.json({
    path: objectPath,
    publicUrl
  });
}
