'use client';

import {
    createPost,
    deletePost,
    fetchPostTree,
    movePost,
} from '@/actions/post-actions';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import React from 'react';
import {useOptimistic} from 'react';
import {Tree} from 'react-arborist';
import {useFormStatus} from 'react-dom';

// Fractional indexing을 위한 헬퍼 함수
function generateOrder(prev?: string, next?: string): string {
    // lexorank나 다른 fractional indexing 알고리즘 구현
    // 예시: 'a' < 'b' < 'c' 형태의 문자열 생성
    if (!prev) return 'a';
    if (!next) return prev + 'a';

    const length = Math.max(prev.length, next.length);
    const paddedPrev = prev.padEnd(length, 'a');
    const paddedNext = next.padEnd(length, 'a');

    let result = '';
    for (let i = 0; i < length; i++) {
        const prevChar = paddedPrev.charCodeAt(i);
        const nextChar = paddedNext.charCodeAt(i);
        if (prevChar === nextChar) {
            result += String.fromCharCode(prevChar);
        } else {
            const mid = Math.floor((prevChar + nextChar) / 2);
            return result + String.fromCharCode(mid);
        }
    }
    return result + 'n'; // 중간에 새로운 문자 추가
}

// 트리 노드 컴포넌트
const Node = ({node, dragHandle}) => {
    const {pending} = useFormStatus();
    const {id, data} = node;

    // 새 포스트 생성 폼
    const handleCreate = async () => {
        const formData = new FormData();
        formData.append('parentId', id);
        formData.append('title', 'New Post');
        formData.append('order', generateOrder()); // 순서 생성 함수 필요

        await createPost(formData);
    };

    // 포스트 삭제 폼
    const handleDelete = async () => {
        const formData = new FormData();
        formData.append('id', id);

        await deletePost(formData);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    ref={dragHandle}
                    className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded ${
                        pending ? 'opacity-50' : ''
                    }`}>
                    <span>{data.title}</span>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={handleCreate}>
                    Add Child
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

// 메인 트리 컴포넌트
const PostTree = () => {
    const [optimisticPosts, setOptimisticPosts] = useOptimistic(
        null,
        (state, newPosts) => newPosts,
    );

    // 초기 데이터 로딩
    React.useEffect(() => {
        const loadPosts = async () => {
            const posts = await fetchPostTree();
            setOptimisticPosts(posts);
        };
        loadPosts();
    }, []);

    // 드래그 앤 드롭 핸들러
    const handleMove = async ({node, parentId, index, siblings}) => {
        const formData = new FormData();
        formData.append('id', node.id);
        formData.append('parentId', parentId || '');

        // 새로운 순서 계산
        const prevSibling = siblings[index - 1];
        const nextSibling = siblings[index + 1];
        const newOrder = generateOrder(
            prevSibling?.data.order,
            nextSibling?.data.order,
        );
        formData.append('order', newOrder);

        // 낙관적 업데이트
        const newTree = [...optimisticPosts];
        // 트리에서 노드 위치 업데이트 로직
        setOptimisticPosts(newTree);

        await movePost(formData);
    };

    if (!optimisticPosts) return <div>Loading...</div>;

    return (
        <Tree
            data={optimisticPosts}
            width={400}
            height={600}
            indent={24}
            rowHeight={36}
            onMove={handleMove}>
            {Node}
        </Tree>
    );
};

export default PostTree;
