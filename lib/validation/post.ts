// lib/validations/post.ts
import { z } from "zod";

export const PostSchema = z.object({
  title: z
    .string()
    .min(5, "제목은 5자 이상이어야 합니다")
    .max(200, "제목은 200자를 초과할 수 없습니다"),
  slug: z
    .string()
    .min(5, "5자 이상이어야 합니다")
    .max(200, "200자를 초과할 수 없습니다")
    .regex(/^[a-z0-9-]+$/, "영문 소문자, 숫자, 하이픈만 사용 가능합니다"),
  content: z.string().min(10, "내용은 10자 이상이어야 합니다"),
  categoryId: z.string().min(1, "카테고리를 선택해주세요"),
  published: z.boolean().default(false),
});

export const CommonPostSchema = PostSchema.partial();
