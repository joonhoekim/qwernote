// lib/validations/user.ts
import {z} from 'zod';

export const UserSchema = z.object({
    name: z
        .string()
        .min(2, '이름은 2자 이상이어야 합니다')
        .max(100, '이름은 100자를 초과할 수 없습니다'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    handle: z
        .string()
        .min(2, '닉네임은 2자 이상이어야 합니다')
        .max(50, '닉네임은 50자를 초과할 수 없습니다')
        .regex(/^[a-z0-9-]+$/, '영문 소문자, 숫자, 하이픈만 사용 가능합니다'),
    bio: z
        .string()
        .max(500, '자기소개는 500자를 초과할 수 없습니다')
        .optional(),
    image: z.string().url('올바른 URL 형식이 아닙니다').optional(),
});

export const CommonUserSchema = UserSchema.partial();
