// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

// Configuration for seed data volume
const SEED_COUNT = {
  USERS: 10,
  CATEGORIES_PER_USER: 10,
  POSTS_PER_CATEGORY: 10,
  COMMENTS_PER_POST: 20,
  REPLIES_PER_COMMENT: 4,
  BATCH_SIZE: 50  // Added explicit batch size configuration
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

// Improved batch processor with parallel execution
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void>
): Promise<void> {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    batches.push(processor(batch));
  }
  await Promise.all(batches);
}

// Main seeding logic with improved error handling and resource management
async function seedDatabase(prisma: PrismaClient) {
  console.log("Starting database seeding...");
  const startTime = Date.now();

  // Clean existing data with improved error handling
  try {
    await Promise.all([
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.category.deleteMany(),
      prisma.account.deleteMany(),
      prisma.session.deleteMany(),
      prisma.user.deleteMany()
    ]);
  } catch (error) {
    console.error("Error clearing existing data:", error);
    throw error;
  }

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

  try {
    await processBatch(users, SEED_COUNT.BATCH_SIZE, async (batch) => {
      await prisma.user.createMany({ data: batch });
    });
  } catch (error) {
    console.error("Error creating users:", error);
    throw error;
  }

  const createdUsers = await prisma.user.findMany();

  // Create categories with improved error handling
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

    try {
      await processBatch(categories, SEED_COUNT.BATCH_SIZE, async (batch) => {
        await prisma.category.createMany({ data: batch });
      });
    } catch (error) {
      console.error(`Error creating categories for user ${user.id}:`, error);
      throw error;
    }
  }

  // Create posts with hierarchical structure
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    try {
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

      await prisma.post.createMany({ data: rootPosts });

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
    } catch (error) {
      console.error(`Error creating posts for category ${category.id}:`, error);
      throw error;
    }
  }

  // Create comments with improved error handling
  const posts = await prisma.post.findMany();

  for (const post of posts) {
    try {
      // Create root comments
      const rootComments = Array.from({ length: SEED_COUNT.COMMENTS_PER_POST }, () => ({
        content: faker.lorem.paragraph(),
        userId: faker.helpers.arrayElement(createdUsers).id,
        postId: post.id,
        parentId: null,
        createdAt: randomDate(new Date(post.createdAt), new Date())
      }));

      await prisma.comment.createMany({ data: rootComments });

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
    } catch (error) {
      console.error(`Error creating comments for post ${post.id}:`, error);
      throw error;
    }
  }

  const endTime = Date.now();
  console.log(`Seeding finished in ${(endTime - startTime) / 1000} seconds`);
}

// Main execution function with proper resource management
async function main() {
  let prisma: PrismaClient | undefined;

  try {
    prisma = new PrismaClient();
    await seedDatabase(prisma);
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Process termination handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Cleaning up...');
  try {
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    process.exit(0);
  }
});

// Only run seeding when file is executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error('Failed to run seed:', err);
    process.exit(1);
  });
}