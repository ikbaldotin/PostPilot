import { z } from "zod";

const imageFileSchema = z.object({
  mimetype: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "Only JPEG, PNG and WebP images are allowed",
  }),
  size: z.number().max(5 * 1024 * 1024, "Image must be under 5MB"),
});

export default imageFileSchema;
