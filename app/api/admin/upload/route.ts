import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/cms";
import { imageExtension, isValidImage, readBoundedBody } from "@/lib/boundedRequest";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function slugifyFileName(name: string, mimeType: string) {
  const baseName = name.replace(/\.[^.]*$/, "") || "image";
  return `${baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "image"}-${Date.now()}.${imageExtension(mimeType)}`;
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

  const body = await readBoundedBody(request, 2 * 1024 * 1024 + 64 * 1024);
  if (!body) return NextResponse.json({ error: "Upload is too large." }, { status: 413 });
  let formData: FormData;
  try {
    formData = await new Request(request.url, { method: "POST", headers: request.headers, body }).formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload form." }, { status: 400 });
  }
  const file = formData.get("file");
  const folderValue = formData.get("folder");
  const folder = typeof folderValue === "string" ? folderValue : "uploads";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Upload a JPG, PNG, or WebP image." }, { status: 400 });
  }

  if (file.size === 0 || file.size > 1024 * 1024 * 2) {
    return NextResponse.json({ error: "Image must be 2MB or smaller." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isValidImage(bytes, file.type)) {
    return NextResponse.json({ error: "Image content does not match its file type." }, { status: 400 });
  }

  const cleanFolder = folder.split("/").map((part) => part.replace(/[^a-z0-9_-]/gi, "")).filter((part) => part && part !== "." && part !== "..").join("/") || "uploads";
  const objectPath = `${cleanFolder}/${slugifyFileName(file.name, file.type)}`;
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: Buffer.from(bytes)
  });

  if (!uploadResponse.ok) {
    return NextResponse.json(
      { error: "Supabase image upload failed." },
      { status: 502 }
    );
  }

  const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;

  return NextResponse.json({
    path: objectPath,
    publicUrl
  });
}
