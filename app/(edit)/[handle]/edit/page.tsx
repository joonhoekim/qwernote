'use client';

import {PostTree} from '@/components/edit-sidebar/post/PostTree';
import {Editor} from '@/editor/Editor';
import {useCallback, useEffect, useState} from 'react';
import {toast} from 'sonner';

interface Post {
    id: string;
    content: string;
    title: string;
    path: string;
    isFolder: boolean;
}

export default function EditPage({params}: {params: {handle: string}}) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [content, setContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const handlePostSelect = useCallback(async (postId: string) => {
        try {
            // TODO: API를 통해 포스트 내용을 가져옴
            const response = await fetch(`/api/posts/${postId}`);
            const post = await response.json();
            setSelectedPost(post);
            setContent(post.content);
        } catch (error) {
            toast.error('포스트를 불러오는데 실패했습니다.');
        }
    }, []);

    const handleContentChange = useCallback(
        async (newContent: string) => {
            if (!selectedPost) return;

            setContent(newContent);
            setIsSaving(true);

            try {
                // TODO: 자동 저장 로직
                await fetch(`/api/posts/${selectedPost.id}`, {
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
        [selectedPost],
    );

    const handleTitleChange = useCallback(
        async (newTitle: string) => {
            if (!selectedPost) return;

            try {
                await fetch(`/api/posts/${selectedPost.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newTitle,
                    }),
                });
                setSelectedPost((prev) =>
                    prev ? {...prev, title: newTitle} : null,
                );
                toast.success('제목이 변경되었습니다.');
            } catch (error) {
                toast.error('제목 변경에 실패했습니다.');
            }
        },
        [selectedPost],
    );

    return (
        <div className="flex h-screen">
            <div className="w-64 border-r">
                <PostTree
                    categoryId={params.handle}
                    onPostSelect={handlePostSelect}
                    selectedPostId={selectedPost?.id}
                    onTitleChange={handleTitleChange}
                />
            </div>
            <div className="flex-1">
                {selectedPost ? (
                    <div className="flex h-full flex-col">
                        <div className="border-b p-2">
                            <div className="text-sm text-muted-foreground">
                                {selectedPost.path}
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
