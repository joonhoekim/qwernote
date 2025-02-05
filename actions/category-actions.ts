'use server';

// TODO: add auth process
import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';
import {slugify} from '@/lib/utils/slugify';
import {Category} from '@prisma/client';
import {revalidatePath} from 'next/cache';

// 인가과정 없이, 해당 유저 페이지에서 조회 가능한 카테고리 목록(By Id)
export async function getCategoriesByUserId(
    userId: string,
): Promise<Category[]> {
    const categories = await prisma.category.findMany({
        where: {
            userId: userId,
            published: true,
        },
    });

    return categories;
}

// 인가과정 없이, 해당 유저 페이지에서 조회 가능한 카테고리 목록(By Handle)
export async function getCategoriesByHandle(
    handle: string,
): Promise<Category[]> {
    // handle로 userId 알아내기
    const user = await prisma.user.findUnique({
        where: {
            handle: handle,
        },
        select: {
            id: true,
        },
    });

    const categories = await prisma.category.findMany({
        where: {
            userId: user!.id,
            published: true,
        },
    });

    return categories;
}

export async function createCategory(categoryName: string) {
    const session = await auth();

    if (!session?.user) {
        throw new Error('User not found');
    }

    try {
        const category = await prisma.category.create({
            data: {
                // FK 있을 때... connect를 사용해야 한다.
                user: {
                    connect: {id: session.user.id}, // connect를 사용해야 합니다
                },
                name: categoryName,
                slug: slugify(categoryName),
                published: true,
            },
        });
        revalidatePath(`/@${session.user.handle}/*`);
        return {success: true, data: category};
    } catch (error) {
        console.error('Failed to create category', error);

        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return {
                    success: false,
                    error: 'Category with this name already exists',
                };
            }
        }

        return {
            success: false,
            error: error.message,
        };
    } finally {
        console.log('Current session:', session);
    }
}

export async function deleteCategory(categoryId: string) {
    const session = await auth();

    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    try {
        // 카테고리 소유권 확인
        const category = await prisma.category.findUnique({
            where: {id: categoryId},
            select: {userId: true},
        });

        if (category?.userId !== session.user.id) {
            throw new Error('Unauthorized');
        }

        await prisma.category.delete({
            where: {id: categoryId},
        });

        revalidatePath(`/@${session.user.handle}/*`);
        return {success: true};
    } catch (error) {
        console.error('Failed to delete category', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to delete category',
        };
    }
}

export async function updateCategoryName(categoryId: string, newName: string) {
    const session = await auth();

    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    try {
        // 카테고리 소유권 확인
        const category = await prisma.category.findUnique({
            where: {id: categoryId},
            select: {userId: true},
        });

        if (category?.userId !== session.user.id) {
            throw new Error('Unauthorized');
        }

        const updatedCategory = await prisma.category.update({
            where: {id: categoryId},
            data: {
                name: newName,
                slug: slugify(newName),
            },
        });

        revalidatePath(`/@${session.user.handle}/*`);
        return {success: true, data: updatedCategory};
    } catch (error) {
        console.error('Failed to update category', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to update category',
        };
    }
}
