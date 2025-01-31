"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { slugify } from "@/lib/utils/slugify";

// 트리 데이터를 가져오는 액션
export async function fetchPostTree() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 사용자의 모든 포스트를 가져와서 트리 구조로 변환
  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
    select: {
      id: true,
      parentId: true,
      title: true,
      order: true,
      slug: true
    }
  });

  // 플랫 구조를 트리 구조로 변환하는 함수
  function buildTree(items: any[], parentId: string | null = null): any[] {
    return items
    .filter(item => item.parentId === parentId)
    .sort((a, b) => a.order.localeCompare(b.order))
    .map(item => ({
      ...item,
      children: buildTree(items, item.id)
    }));
  }

  return buildTree(posts);
}

// 새 포스트를 생성하는 액션
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const schema = z.object({
    parentId: z.string().optional(),
    title: z.string().min(1),
    order: z.string()
  });

  const data = schema.parse({
    parentId: formData.get("parentId"),
    title: formData.get("title"),
    order: formData.get("order")
  });

  const post = await prisma.post.create({
    data: {
      ...data,
      userId: session.user.id,
      slug: slugify(data.title),
      content: "", // Lexical 에디터의 초기 상태
      categoryId: "" // 카테고리 ID 설정 필요
    }
  });

  revalidatePath("/posts"); // 경로에 맞게 수정
  return post;
}

// 포스트를 이동하는 액션
export async function movePost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const schema = z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    order: z.string()
  });

  const data = schema.parse({
    id: formData.get("id"),
    parentId: formData.get("parentId"),
    order: formData.get("order")
  });

  // 포스트 소유권 확인
  const post = await prisma.post.findUnique({
    where: { id: data.id },
    select: { userId: true }
  });

  if (post?.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.update({
    where: { id: data.id },
    data: {
      parentId: data.parentId,
      order: data.order
    }
  });

  revalidatePath("/posts");
}

// 포스트를 삭제하는 액션
export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  if (!id) throw new Error("Post ID is required");

  // 포스트 소유권 확인
  const post = await prisma.post.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (post?.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id } });
  revalidatePath("/posts");
}

