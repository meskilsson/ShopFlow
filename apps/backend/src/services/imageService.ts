import { randomUUID } from "crypto";
import path from "path";
import { supabase } from "../config/supabase";
import { AppError } from "../errors/AppError";

const BUCKET = process.env.SUPABASE_BUCKET ?? "product-images";

export async function uploadProductImage(
  file: Express.Multer.File,
): Promise<string> {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const filePath = `products/${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new AppError(`Image upload failed: ${error.message}`, 500);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
