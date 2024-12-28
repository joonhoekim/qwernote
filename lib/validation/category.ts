// lib/validations/category.ts
import { z } from "zod";
import { PostSchema } from "@/lib/validation/post";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, "카테고리명은 2자 이상이어야 합니다")
    .max(50, "카테고리명은 50자를 초과할 수 없습니다"),
  slug: z
    .string()
    .min(2, "2자 이상이어야 합니다")
    .max(50, "50자를 초과할 수 없습니다")
    .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 사용 가능합니다"),
});

export const CommonCategorySchema = CategorySchema.partial();
