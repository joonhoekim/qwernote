'use client';

import {PostTree} from '@/components/edit-sidebar/post/PostTree';
import {Editor} from '@/editor/Editor';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import {toast} from 'sonner';

interface Post {
    id: string;
    content: string;
    title: string;
    path: string;
    isFolder: boolean;
}

export default function EditPage({
    params,
}: {
    params: {handle: string; postId?: string[]};
}) {
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const postId = params.postId?.[0];

    // 포스트 데이터 로드
    useEffect(() => {
        if (!postId) {
            setPost(null);
            setContent('');
            return;
        }

        const loadPost = async () => {
            try {
                const response = await fetch(`/api/posts/${postId}`);
                const data = await response.json();
                setPost(data);
                setContent(data.content);
            } catch (error) {
                toast.error('포스트를 불러오는데 실패했습니다.');
            }
        };

        loadPost();
    }, [postId]);

    // 포스트 선택 시 URL 변경
    const handlePostSelect = useCallback(
        (selectedPostId: string) => {
            router.push(`/${params.handle}/edit/${selectedPostId}`);
        },
        [params.handle, router],
    );

    // 내용 변경 시 자동 저장
    const handleContentChange = useCallback(
        async (newContent: string) => {
            if (!post) return;

            setContent(newContent);
            setIsSaving(true);

            try {
                await fetch(`/api/posts/${post.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: newContent,
                    }),
                });
                toast.success('저장되었습니다.');
            } catch (error) {
                toast.error('저장에 실패했습니다.');
            } finally {
                setIsSaving(false);
            }
        },
        [post],
    );

    // 제목 변경 시 URL은 유지하고 데이터만 업데이트
    const handleTitleChange = useCallback(
        async (newTitle: string) => {
            if (!post) return;

            try {
                await fetch(`/api/posts/${post.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newTitle,
                    }),
                });
                setPost((prev) => (prev ? {...prev, title: newTitle} : null));
                toast.success('제목이 변경되었습니다.');
            } catch (error) {
                toast.error('제목 변경에 실패했습니다.');
            }
        },
        [post],
    );

    return (
        <div className="flex h-screen">
            <div className="w-64 border-r">
                <PostTree
                    categoryId={params.handle}
                    onPostSelect={handlePostSelect}
                    selectedPostId={postId}
                    onTitleChange={handleTitleChange}
                />
            </div>
            <div className="flex-1">
                {post ? (
                    <div className="flex h-full flex-col">
                        <div className="border-b p-2">
                            <div className="text-sm text-muted-foreground">
                                {post.path}
                            </div>
                            {isSaving && (
                                <div className="text-xs text-muted-foreground">
                                    저장 중...
                                </div>
                            )}
                        </div>
                        <Editor
                            initialContent={content}
                            onChange={handleContentChange}
                        />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        포스트를 선택해주세요
                    </div>
                )}
            </div>
        </div>
    );
}
