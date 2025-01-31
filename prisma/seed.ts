// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

const prisma = new PrismaClient();

// Configuration for seed data volume
const SEED_COUNT = {
  USERS: 100,
  CATEGORIES_PER_USER: 30,
  POSTS_PER_CATEGORY: 50,
  COMMENTS_PER_POST: 30,
  REPLIES_PER_COMMENT: 20
};

// Utility functions
const createSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true
  });
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const createPath = (parentPath: string | null, slug: string): string => {
  return parentPath ? `${parentPath}/${slug}` : slug;
};

// Batch process helper
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
  }
}

// Main seeding function
async function main() {
  console.log("Starting seed...");
  const startTime = Date.now();

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = Array.from({ length: SEED_COUNT.USERS }, () => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    handle: faker.internet.userName(),
    image: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    role: faker.helpers.arrayElement(["user", "admin"]),
    createdAt: randomDate(new Date(2023, 0, 1), new Date())
  }));

  await processBatch(users, 50, async (batch) => {
    await prisma.user.createMany({ data: batch });
  });

  const createdUsers = await prisma.user.findMany();

  // Create categories for each user
  for (const user of createdUsers) {
    const categories = Array.from({ length: SEED_COUNT.CATEGORIES_PER_USER }, () => {
      const name = faker.lorem.words(3);
      return {
        name,
        slug: createSlug(name),
        published: faker.datatype.boolean(),
        userId: user.id,
        createdAt: randomDate(new Date(user.createdAt), new Date())
      };
    });

    await processBatch(categories, 50, async (batch) => {
      await prisma.category.createMany({ data: batch });
    });
  }

  // Create posts with hierarchical structure
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    // Create root level posts
    const rootPosts = Array.from({ length: Math.ceil(SEED_COUNT.POSTS_PER_CATEGORY / 3) }, () => {
      const title = faker.lorem.sentence();
      const slug = createSlug(title);
      return {
        title,
        slug,
        content: faker.lorem.paragraphs(3),
        published: faker.datatype.boolean(),
        userId: category.userId,
        categoryId: category.id,
        parentId: null,
        level: 0,
        path: slug,
        order: faker.number.float({ min: 0, max: 1000000 }).toString(),
        createdAt: randomDate(new Date(category.createdAt), new Date())
      };
    });

    const createdRootPosts = await prisma.post.createMany({ data: rootPosts });

    // Create child posts (level 1)
    const parentPosts = await prisma.post.findMany({
      where: { categoryId: category.id, level: 0 }
    });

    for (const parent of parentPosts) {
      const childPosts = Array.from({ length: 2 }, () => {
        const title = faker.lorem.sentence();
        const slug = createSlug(title);
        return {
          title,
          slug,
          content: faker.lorem.paragraphs(2),
          published: faker.datatype.boolean(),
          userId: category.userId,
          categoryId: category.id,
          parentId: parent.id,
          level: 1,
          path: createPath(parent.path, slug),
          order: faker.number.float({ min: 0, max: 1000000 }).toString(),
          createdAt: randomDate(new Date(parent.createdAt), new Date())
        };
      });

      await prisma.post.createMany({ data: childPosts });
    }
  }

  // Create comments
  const posts = await prisma.post.findMany();

  for (const post of posts) {
    // Create root comments
    const rootComments = Array.from({ length: SEED_COUNT.COMMENTS_PER_POST }, () => ({
      content: faker.lorem.paragraph(),
      userId: faker.helpers.arrayElement(createdUsers).id,
      postId: post.id,
      parentId: null,
      createdAt: randomDate(new Date(post.createdAt), new Date())
    }));

    const createdComments = await prisma.comment.createMany({ data: rootComments });

    // Create reply comments
    const parentComments = await prisma.comment.findMany({
      where: { postId: post.id, parentId: null }
    });

    for (const parent of parentComments) {
      const replies = Array.from({ length: SEED_COUNT.REPLIES_PER_COMMENT }, () => ({
        content: faker.lorem.paragraph(),
        userId: faker.helpers.arrayElement(createdUsers).id,
        postId: post.id,
        parentId: parent.id,
        createdAt: randomDate(new Date(parent.createdAt), new Date())
      }));

      await prisma.comment.createMany({ data: replies });
    }
  }

  const endTime = Date.now();
  console.log(`Seeding finished in ${(endTime - startTime) / 1000} seconds`);
}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});