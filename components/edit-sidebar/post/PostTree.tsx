'use client';

import { movePost, createPost, deletePost } from '@/actions/post-actions';
import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { Folder, File, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Tree } from 'react-arborist';
import { useOptimistic } from 'react';
import { toast } from 'sonner';

const Node = ({ node, style, dragHandle }) => {
    const indent = node.level * 24;

    const handleCreate = async (position: 'before' | 'after' | 'child', isFolder: boolean) => {
        const formData = new FormData();
        formData.append('title', isFolder ? 'New Folder' : 'New Post');
        formData.append('parentId', position === 'child' ? node.id : node.parentId);
        formData.append('isFolder', String(isFolder));

        try {
            await createPost(formData);
            toast.success(isFolder ? '폴더가 생성되었습니다.' : '포스트가 생성되었습니다.');
        } catch (error) {
            toast.error('생성에 실패했습니다.');
        }
    };

    return (
        <div
            ref={dragHandle}
            style={{
                ...style,
                paddingLeft: indent,
            }}
            className={cn(
                'flex h-8 cursor-pointer items-center rounded-sm px-2 hover:bg-accent',
                node.isSelected && 'bg-accent'
            )}>
            <ContextMenu>
                <ContextMenuTrigger className="flex-1 truncate">
                    <span className="flex items-center gap-2">
                        {node.data.isFolder ? (
                            <Folder className="h-4 w-4" />
                        ) : (
                            <File className="h-4 w-4" />
                        )}
                        <span className="truncate">{node.data.name}</span>
                    </span>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onSelect={() => handleCreate('before', false)}>
                        위에 포스트 추가
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => handleCreate('before', true)}>
                        위에 폴더 추가
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => handleCreate('after', false)}>
                        아래에 포스트 추가
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => handleCreate('after', true)}>
                        아래에 폴더 추가
                    </ContextMenuItem>
                    {node.data.isFolder && (
                        <>
                            <ContextMenuItem onSelect={() => handleCreate('child', false)}>
                                하위 포스트 추가
                            </ContextMenuItem>
                            <ContextMenuItem onSelect={() => handleCreate('child', true)}>
                                하위 폴더 추가
                            </ContextMenuItem>
                        </>
                    )}
                    <ContextMenuItem>이름 변경</ContextMenuItem>
                    <ContextMenuItem className="text-destructive">
                        삭제
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
};

export const PostTree = ({ categoryId }: { categoryId: string }) => {
    const [optimisticData, setOptimisticData] = useOptimistic(
        null,
        (state, newData) => newData
    );

    const handleMove = async ({ dragIds, parentId, index }) => {
        const formData = new FormData();
        formData.append('id', dragIds[0]);
        formData.append('parentId', parentId || '');

        try {
            await movePost(formData);
            toast.success('이동되었습니다.');
        } catch (error) {
            toast.error('이동에 실패했습니다.');
        }
    };

    const handleCreateRoot = async (isFolder: boolean) => {
        const formData = new FormData();
        formData.append('title', isFolder ? 'New Folder' : 'New Post');
        formData.append('isFolder', String(isFolder));
        formData.append('categoryId', categoryId);

        try {
            await createPost(formData);
            toast.success(isFolder ? '폴더가 생성되었습니다.' : '포스트가 생성되었습니다.');
        } catch (error) {
            toast.error('생성에 실패했습니다.');
        }
    };

    return (
        <div>
            <div className="mb-2 flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateRoot(false)}
                    className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    포스트 추가
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateRoot(true)}
                    className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    폴더 추가
                </Button>
            </div>
            <div className="h-[calc(100vh-200px)] overflow-auto rounded-md border bg-background p-2">
                <Tree
                    data={optimisticData}
                    indent={24}
                    rowHeight={32}
                    onMove={handleMove}
                >
                    {Node}
                </Tree>
                {(!optimisticData || optimisticData.length === 0) && (
                    <ContextMenu>
                        <ContextMenuTrigger className="flex h-full w-full items-center justify-center p-4">
                            <span className="text-sm text-muted-foreground">
                                우클릭하여 항목 추가
                            </span>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onSelect={() => handleCreateRoot(false)}>
                                포스트 추가
                            </ContextMenuItem>
                            <ContextMenuItem onSelect={() => handleCreateRoot(true)}>
                                폴더 추가
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                )}
            </div>
        </div>
    );
};
