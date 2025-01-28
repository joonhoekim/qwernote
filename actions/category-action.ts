// add authorization process later...
import "server-only";

import { prisma } from "@/lib/prisma";

// 인가과정 없이, 해당 유저 페이지에서 조회 가능한 카테고리 목록
export async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId: userId,
      published: true
    }
  });

  return categories;
}