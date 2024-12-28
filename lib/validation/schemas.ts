// lib/validations/schemas.ts
import { z } from "zod";

// 1. 공통으로 사용되는 기본 타입들
export const IdSchema = z.string().cuid();
export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, "영문, 숫자, 하이픈만 사용 가능합니다");
export const EmailSchema = z.string().email("올바른 이메일 형식이 아닙니다");

// 2. 공통 응답 형식
export const PaginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
});

// 3. 공통으로 사용되는 에러 메시지
export const errorMessages = {
  required: "필수 입력항목입니다",
  minLength: (n: number) => `최소 ${n}자 이상 입력해주세요`,
  maxLength: (n: number) => `최대 ${n}자까지 입력 가능합니다`,
};

// 4. 여러 도메인에서 공유되는 타입
export const TimestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});
