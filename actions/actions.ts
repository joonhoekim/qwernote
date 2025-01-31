"use server";
// add authorization process later...

import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

// 인가과정 없이, 해당 유저 페이지에서 조회 가능한 카테고리 목록
export async function getCategoriesByHandle(handle: string): Promise<Category[]> {
  // handle로 userId 알아내기
  const user = await prisma.user.findUnique({
    where: {
      handle: handle
    },
    select: {
      id: true
    }
  });

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      published: true
    }
  });

  return categories;
}