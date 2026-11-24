import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_MODEL_BYTES = 20 * 1024 * 1024;
const FOLDERS = new Set(["products", "banners", "brand", "company"]);

export class UploadError extends Error {}

export async function saveImage(file: unknown, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!FOLDERS.has(folder)) throw new UploadError("Invalid upload folder.");
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError("Image is larger than 8 MB.");
  }
  if (!IMAGE_TYPES.has(file.type)) {
    throw new UploadError("Use a JPEG, PNG, WebP or AVIF image.");
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer, { failOn: "error" });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) throw new Error("No dimensions");
    if (metadata.width * metadata.height > 40_000_000) {
      throw new UploadError("Image dimensions are too large.");
    }

    const name = `${randomUUID()}.webp`;
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(dir, { recursive: true });
    await image
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 86 })
      .toFile(path.join(dir, name));
    return `/uploads/${folder}/${name}`;
  } catch (error) {
    if (error instanceof UploadError) throw error;
    throw new UploadError("The image could not be processed.");
  }
}

export async function saveModel(file: unknown) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_MODEL_BYTES) {
    throw new UploadError("3D model is larger than 20 MB.");
  }
  const isGlb =
    file.name.toLowerCase().endsWith(".glb") ||
    file.type === "model/gltf-binary";
  if (!isGlb) {
    throw new UploadError("Upload a self-contained .glb model.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 4).toString("utf8") !== "glTF") {
    throw new UploadError("That file is not a valid GLB model.");
  }

  const name = `${randomUUID()}.glb`;
  const dir = path.join(process.cwd(), "public", "uploads", "models");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
  return `/uploads/models/${name}`;
}
