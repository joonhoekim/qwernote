'use server';

import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';
import {generateOrder} from '@/lib/utils/fractional-indexing';
import {slugify} from '@/lib/utils/slugify';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';

interface TreeItem {
    id: string;
    title: string;
    parentId: string | null;
    order: string;
    isFolder: boolean;
    path: string;
    level: number;
}

interface TreeNode {
    id: string;
    name: string;
    isFolder: boolean;
    path: string;
    level: number;
    children: TreeNode[];
}

// 트리 데이터를 가져오는 액션
export async function fetchPostTree(categoryId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const posts = await prisma.post.findMany({
        where: {
            userId: session.user.id,
            categoryId,
        },
        orderBy: {order: 'asc'},
        select: {
            id: true,
            title: true,
            parentId: true,
            order: true,
            isFolder: true,
            path: true,
            level: true,
        },
    });

    return buildTree(posts);
}

function buildTree(
    items: TreeItem[],
    parentId: string | null = null,
): TreeNode[] {
    return items
        .filter((item) => item.parentId === parentId)
        .sort((a, b) => a.order.localeCompare(b.order))
        .map((item) => ({
            id: item.id,
            name: item.title,
            isFolder: item.isFolder,
            path: item.path,
            level: item.level,
            children: buildTree(items, item.id),
        }));
}

// 새 포스트를 생성하는 액션
export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const parentId = formData.get('parentId') as string | null;
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const isFolder = formData.get('isFolder') === 'true';

    if (!title || !categoryId) {
        throw new Error('Title and categoryId are required');
    }

    // 같은 카테고리 내에서 중복되지 않는 slug 생성
    const baseSlug = title.toLowerCase().replace(/\s+/g, '-');
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.post.findFirst({
            where: {
                userId: session.user.id,
                categoryId,
                slug,
            },
        });

        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const siblings = await prisma.post.findMany({
        where: {parentId},
        select: {order: true},
        orderBy: {order: 'desc'},
        take: 1,
    });

    const lastOrder = siblings[0]?.order;
    const newOrder = generateOrder(lastOrder);

    // path가 없으면 기본값 설정
    const path = (formData.get('path') as string) || `/${title}`;
    const level = parseInt((formData.get('level') as string) || '0');

    const createData: any = {
        title,
        order: newOrder,
        userId: session.user.id,
        content: '',
        isFolder,
        slug,
        path,
        level,
        category: {
            connect: {
                id: categoryId,
            },
        },
        user: {
            connect: {
                id: session.user.id,
            },
        },
    };

    // parentId가 있으면 parent 관계 설정
    if (parentId) {
        createData.parent = {
            connect: {
                id: parentId,
            },
        };
    }

    const post = await prisma.post.create({
        data: createData,
    });

    revalidatePath('/posts');
    return post;
}

// 포스트를 이동하는 액션
export async function movePost(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const id = formData.get('id') as string;
    const parentId = formData.get('parentId') as string | null;
    const prevId = formData.get('prevId') as string | null;
    const nextId = formData.get('nextId') as string | null;
    const level = parseInt((formData.get('level') as string) || '0');
    const path = formData.get('path') as string;
    const title = formData.get('title') as string;

    const siblings = await prisma.post.findMany({
        where: {parentId},
        select: {id: true, order: true},
        orderBy: {order: 'asc'},
    });

    const prevOrder = prevId
        ? siblings.find((s) => s.id === prevId)?.order
        : null;
    const nextOrder = nextId
        ? siblings.find((s) => s.id === nextId)?.order
        : null;
    const newOrder = generateOrder(prevOrder, nextOrder);

    const updateData: any = {
        order: newOrder,
        level,
    };

    // title이 있으면 업데이트
    if (title) {
        updateData.title = title;
        updateData.slug = title.toLowerCase().replace(/\s+/g, '-');
    }

    // parentId가 있으면 parent 관계 업데이트
    if (parentId) {
        updateData.parent = {
            connect: {
                id: parentId,
            },
        };
    } else {
        updateData.parent = {
            disconnect: true,
        };
    }

    // path가 있으면 업데이트
    if (path) {
        updateData.path = path;
    }

    await prisma.post.update({
        where: {id},
        data: updateData,
    });

    revalidatePath('/posts');
}

// 포스트를 삭제하는 액션
export async function deletePost(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    const id = formData.get('id') as string;
    if (!id) throw new Error('Post ID is required');

    // 포스트 소유권 확인
    const post = await prisma.post.findUnique({
        where: {id},
        select: {userId: true},
    });

    if (post?.userId !== session.user.id) {
        throw new Error('Unauthorized');
    }

    await prisma.post.delete({where: {id}});
    revalidatePath('/posts');
}
