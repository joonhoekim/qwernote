'use server';

import {auth} from '@/auth';
import {prisma} from '@/lib/prisma';
import {generateOrder} from '@/lib/utils/fractional-indexing';
import {slugify} from '@/lib/utils/slugify';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';

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
        },
    });

    return buildTree(posts);
}

function buildTree(items: any[], parentId: string | null = null): any[] {
    return items
        .filter((item) => item.parentId === parentId)
        .sort((a, b) => a.order.localeCompare(b.order))
        .map((item) => ({
            id: item.id,
            name: item.title,
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

    const siblings = await prisma.post.findMany({
        where: {parentId},
        select: {order: true},
        orderBy: {order: 'desc'},
        take: 1,
    });

    const lastOrder = siblings[0]?.order;
    const newOrder = generateOrder(lastOrder);

    const post = await prisma.post.create({
        data: {
            title,
            parentId,
            categoryId,
            order: newOrder,
            userId: session.user.id,
            content: '',
            isFolder,
            slug: title.toLowerCase().replace(/\s+/g, '-'),
        },
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

    const siblings = await prisma.post.findMany({
        where: {parentId},
        select: {order: true},
        orderBy: {order: 'asc'},
    });

    const prevOrder = prevId
        ? siblings.find((s) => s.id === prevId)?.order
        : null;
    const nextOrder = nextId
        ? siblings.find((s) => s.id === nextId)?.order
        : null;
    const newOrder = generateOrder(prevOrder, nextOrder);

    await prisma.post.update({
        where: {id},
        data: {
            parentId,
            order: newOrder,
        },
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
