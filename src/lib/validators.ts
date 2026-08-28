import { z } from "zod";

const urlSchema = z
  .string()
  .trim()
  .url({ message: "Enter a valid product URL (including https://)" })
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "URL must start with http:// or https://",
  });

export const submitValidationSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    productUrl: z.string().trim().optional().nullable(),
    productDescription: z.string().trim().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const url = data.productUrl?.trim() || "";
    const description = data.productDescription?.trim() || "";

    if (!url && !description) {
      ctx.addIssue({
        code: "custom",
        message: "Paste a product URL or describe the product",
        path: ["productDescription"],
      });
      return;
    }

    if (url) {
      const parsed = urlSchema.safeParse(url);
      if (!parsed.success) {
        ctx.addIssue({
          code: "custom",
          message: parsed.error.issues[0]?.message ?? "Invalid URL",
          path: ["productUrl"],
        });
      }
    }

    if (!url && description.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Add a bit more detail (at least a short product name)",
        path: ["productDescription"],
      });
    }
  });

export type SubmitValidationInput = z.infer<typeof submitValidationSchema>;

export function isLikelyUnreachableUrlError(message: string): boolean {
  return /unreachable|ENOTFOUND|ECONNREFUSED|timeout|fetch failed/i.test(message);
}
