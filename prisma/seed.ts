// /prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin',
        handle: 'admin',
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        name: 'Normal User',
        role: 'user',
        handle: 'user1',
      },
    }),
  ])

  // 2. Create categories for each user
  const categories = await Promise.all(
    users.map((user) =>
      prisma.category.create({
        data: {
          name: `${user.name}'s Blog`,
          slug: `${user.handle}-blog`,
          userId: user.id,
        },
      })
    )
  )

  // 3. Create sample posts
  const posts = await Promise.all(
    categories.map((category) =>
      prisma.post.create({
        data: {
          title: 'Welcome to my blog',
          slug: 'welcome-post',
          content: 'This is a sample post content.',
          parentId: 'root',
          order: '0',
          published: true,
          userId: category.userId,
          categoryId: category.id,
        },
      })
    )
  )

  // 4. Create sample comments
  await Promise.all(
    posts.map((post) =>
      prisma.comment.create({
        data: {
          content: 'This is a sample comment.',
          userId: post.userId,
          postId: post.id,
        },
      })
    )
  )
}

main()
.catch((e) => {
  console.error(e)
  process.exit(1)
})
.finally(async () => {
  await prisma.$disconnect()
})