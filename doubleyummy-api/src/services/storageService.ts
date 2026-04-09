import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { MultipartFile } from "@fastify/multipart";
import { config, env } from "../config/index.js";
import { BadRequestError } from "../utils/errors.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const ensureUploadsDir = async () => {
  await mkdir(config.uploadsDir, { recursive: true });
};

export const processAndStoreImage = async (file: MultipartFile) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new BadRequestError("Разрешены только jpeg/png/webp");
  }

  const buffer = await file.toBuffer();

  if (buffer.byteLength > MAX_BYTES) {
    throw new BadRequestError("Файл превышает 10MB");
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const output = await sharp(buffer)
    .rotate()
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  if (env.STORAGE_PROVIDER === "supabase") {
    throw new BadRequestError("Supabase Storage не настроен в dev-шаблоне");
  }

  await ensureUploadsDir();
  await writeFile(path.join(config.uploadsDir, filename), output);

  return `/uploads/${filename}`;
};
