'use client';

import {
    createPost,
    deletePost,
    fetchPostTree,
    movePost,
} from '@/actions/post-actions';
import {Button} from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {cn} from '@/lib/utils';
import {File, Folder, Plus} from 'lucide-react';
import {useParams} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';
import {Tree} from 'react-arborist';
import {toast} from 'sonner';

interface TreeData {
    id: string;
    name: string;
    isFolder: boolean;
    path: string;
    level: number;
    children: TreeData[];
}

const Node = ({
    node,
    style,
    dragHandle,
    categoryId,
    onUpdate,
}: {
    node: any;
    style: any;
    dragHandle: any;
    categoryId: string;
    onUpdate: () => Promise<void>;
}) => {
    const indent = node.level * 24;

    const handleCreate = async (
        position: 'before' | 'after' | 'child',
        isFolder: boolean,
    ) => {
        const formData = new FormData();
        const title = isFolder ? 'New Folder' : 'New Post';
        formData.append('title', title);
        formData.append(
            'parentId',
            position === 'child' ? node.id : node.parentId,
        );
        formData.append('isFolder', String(isFolder));
        formData.append('slug', title.toLowerCase().replace(/\s+/g, '-'));
        formData.append(
            'level',
            String(position === 'child' ? node.level + 1 : node.level),
        );
        formData.append(
            'path',
            position === 'child'
                ? `${node.data.path}/${title}`
                : node.data.path,
        );
        formData.append('categoryId', categoryId);

        try {
            await createPost(formData);
            await onUpdate();
            toast.success(
                isFolder
                    ? '폴더가 생성되었습니다.'
                    : '포스트가 생성되었습니다.',
            );
        } catch (error) {
            toast.error('생성에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        try {
            const formData = new FormData();
            formData.append('id', node.id);
            await deletePost(formData);
            await onUpdate();
            toast.success('삭제되었습니다.');
        } catch (error) {
            toast.error('삭제에 실패했습니다.');
        }
    };

    const handleRename = async () => {
        const newName = prompt('새 이름을 입력하세요:', node.data.name);
        if (!newName) return;

        try {
            const formData = new FormData();
            formData.append('id', node.id);
            formData.append('title', newName);
            formData.append('slug', newName.toLowerCase().replace(/\s+/g, '-'));
            await movePost(formData);
            await onUpdate();
            toast.success('이름이 변경되었습니다.');
        } catch (error) {
            toast.error('이름 변경에 실패했습니다.');
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
                node.isSelected && 'bg-accent',
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
                    <ContextMenuItem
                        onSelect={() => handleCreate('before', false)}>
                        위에 포스트 추가
                    </ContextMenuItem>
                    <ContextMenuItem
                        onSelect={() => handleCreate('before', true)}>
                        위에 폴더 추가
                    </ContextMenuItem>
                    <ContextMenuItem
                        onSelect={() => handleCreate('after', false)}>
                        아래에 포스트 추가
                    </ContextMenuItem>
                    <ContextMenuItem
                        onSelect={() => handleCreate('after', true)}>
                        아래에 폴더 추가
                    </ContextMenuItem>
                    {node.data.isFolder && (
                        <>
                            <ContextMenuItem
                                onSelect={() => handleCreate('child', false)}>
                                하위 포스트 추가
                            </ContextMenuItem>
                            <ContextMenuItem
                                onSelect={() => handleCreate('child', true)}>
                                하위 폴더 추가
                            </ContextMenuItem>
                        </>
                    )}
                    <ContextMenuItem onSelect={handleRename}>
                        이름 변경
                    </ContextMenuItem>
                    <ContextMenuItem
                        onSelect={handleDelete}
                        className="text-destructive">
                        삭제
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
};

export const PostTree = ({categoryId}: {categoryId: string}) => {
    const [treeData, setTreeData] = useState<TreeData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const updateTreeData = useCallback(async () => {
        if (!categoryId) return;

        try {
            setIsLoading(true);
            const data = await fetchPostTree(categoryId);
            setTreeData(data);
        } catch (error) {
            toast.error('포스트 목록을 불러오는데 실패했습니다.');
            console.error('Failed to fetch post tree:', error);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        updateTreeData();
    }, [updateTreeData]);

    const handleMove = async ({dragIds, parentId, index}) => {
        if (!categoryId) return;

        const formData = new FormData();
        formData.append('id', dragIds[0]);
        formData.append('parentId', parentId || '');
        formData.append('order', String(index));
        formData.append('level', String(parentId ? 1 : 0));

        try {
            await movePost(formData);
            await updateTreeData();
            toast.success('이동되었습니다.');
        } catch (error) {
            toast.error('이동에 실패했습니다.');
        }
    };

    const handleCreateRoot = async (isFolder: boolean) => {
        if (!categoryId) return;

        const formData = new FormData();
        const title = isFolder ? 'New Folder' : 'New Post';
        formData.append('title', title);
        formData.append('isFolder', String(isFolder));
        formData.append('categoryId', categoryId);
        formData.append('slug', title.toLowerCase().replace(/\s+/g, '-'));
        formData.append('level', '0');
        formData.append('path', `/${title}`);

        try {
            await createPost(formData);
            await updateTreeData();
            toast.success(
                isFolder
                    ? '폴더가 생성되었습니다.'
                    : '포스트가 생성되었습니다.',
            );
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
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted-foreground">
                            로딩 중...
                        </span>
                    </div>
                ) : treeData.length > 0 ? (
                    <Tree
                        data={treeData}
                        indent={24}
                        rowHeight={32}
                        onMove={handleMove}>
                        {(props) => (
                            <Node
                                {...props}
                                categoryId={categoryId}
                                onUpdate={updateTreeData}
                            />
                        )}
                    </Tree>
                ) : (
                    <ContextMenu>
                        <ContextMenuTrigger className="flex h-full w-full items-center justify-center p-4">
                            <span className="text-sm text-muted-foreground">
                                우클릭하여 항목 추가
                            </span>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem
                                onSelect={() => handleCreateRoot(false)}>
                                포스트 추가
                            </ContextMenuItem>
                            <ContextMenuItem
                                onSelect={() => handleCreateRoot(true)}>
                                폴더 추가
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                )}
            </div>
        </div>
    );
};
