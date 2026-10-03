import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { slugify } from "@/utils/slugify";

function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length > 1) {
    return `.${parts.pop()?.toLowerCase()}`;
  }
  return ".png";
}

function getBaseNameWithoutExtension(filename: string): string {
  const ext = getFileExtension(filename);
  return filename.slice(0, filename.length - ext.length);
}

function generateCleanFileName(originalName: string): string {
  const ext = getFileExtension(originalName);
  const base = getBaseNameWithoutExtension(originalName);
  const cleanBase = slugify(base);
  const timestamp = Date.now().toString().slice(-4);
  return `${cleanBase}-${timestamp}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const cleanFilename = generateCleanFileName(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Option A: Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${cleanFilename}`, buffer, {
        access: "public",
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: cleanFilename,
        provider: "vercel_blob",
      });
    }

    // Option B: Local filesystem storage in public/images/products/
    const targetDir = path.join(process.cwd(), "public", "images", "products");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, cleanFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/products/${cleanFilename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: cleanFilename,
      provider: "local",
    });
  } catch (error) {
    console.error("Error in POST /api/admin/upload:", error);
    return NextResponse.json({ success: false, error: "Error al subir la imagen" }, { status: 500 });
  }
}
