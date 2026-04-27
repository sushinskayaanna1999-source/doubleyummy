import sharp from "sharp";
import type { MultipartFile } from "@fastify/multipart";
import { createClient } from "@supabase/supabase-js";
import { BadRequestError } from "../utils/errors.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export const processAndStoreImage = async (file: MultipartFile) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new BadRequestError("Разрешены только jpeg/png/webp");
  }

  const buffer = await file.toBuffer();

  if (buffer.byteLength > MAX_BYTES) {
    throw new BadRequestError("Файл превышает 10MB");
  }

  const output = await sharp(buffer)
    .rotate()
    .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error } = await supabase.storage
    .from("dishes")
    .upload(filename, output, {
      contentType: "image/webp",
      cacheControl: "31536000"
    });

  if (error) {
    throw new BadRequestError("Ошибка загрузки изображения: " + error.message);
  }

  const { data } = supabase.storage
    .from("dishes")
    .getPublicUrl(filename);

  return data.publicUrl;
};