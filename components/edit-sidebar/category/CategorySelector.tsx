'use client';

import {getCategoriesByHandle} from '@/actions/category-actions';
import {deleteCategory, updateCategoryName} from '@/actions/category-actions';
import {Button} from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {removeAtSymbol} from '@/lib/utils/string-util';
import {Category} from '@prisma/client';
import {Check, ChevronsUpDown} from 'lucide-react';
import {useParams} from 'next/navigation';
import * as React from 'react';
import {useState} from 'react';
import {toast} from 'sonner';
import useSWR from 'swr';

interface CategorySelectorProps {
    onCategorySelect: (categoryId: string) => void;
}

export function CategorySelector({onCategorySelect}: CategorySelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const params = useParams<{handle: string}>();
    const handle = removeAtSymbol(params.handle);
    const cacheKey = `categories-${handle}`;

    // SWR fetcher 함수
    const fetcher = async (handle: string) => {
        const res = getCategoriesByHandle(handle);
        console.log(handle, res);
        return res;
    };

    // mutate를 포함하여 SWR 훅 사용
    const {
        data: categories = [],
        error,
        isLoading,
        mutate,
    } = useSWR(cacheKey, () => fetcher(handle));

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [categoryToRename, setCategoryToRename] = useState<Category | null>(
        null,
    );
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleRename = async (category: Category) => {
        setCategoryToRename(category);
        setNewCategoryName(category.name);
        setIsRenameDialogOpen(true);
    };

    const handleRenameSubmit = async () => {
        if (!categoryToRename) return;

        const result = await updateCategoryName(
            categoryToRename.id,
            newCategoryName,
        );
        if (result.success) {
            toast.success('카테고리 이름이 변경되었습니다.');
            setIsRenameDialogOpen(false);
            // 데이터 갱신
            await mutate();
            // 선택된 카테고리가 변경된 카테고리인 경우 value 업데이트
            if (value === categoryToRename.name) {
                setValue(newCategoryName);
            }
        } else {
            toast.error(result.error || '카테고리 이름 변경에 실패했습니다.');
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?')) return;

        const result = await deleteCategory(categoryId);
        if (result.success) {
            toast.success('카테고리가 삭제되었습니다.');
            // 데이터 갱신
            await mutate();
            // 선택된 카테고리가 삭제된 경우 선택 초기화
            const deletedCategory = categories.find(
                (cat) => cat.id === categoryId,
            );
            if (value === deletedCategory?.name) {
                setValue('');
            }
        } else {
            toast.error(result.error || '카테고리 삭제에 실패했습니다.');
        }
    };

    // 로딩 중이 아니고 에러도 아닌데 데이터가 없는 경우
    if (!isLoading && !error && categories.length === 0) {
        return (
            <div className="rounded-md bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    There is no category yet.
                </p>
            </div>
        );
    }

    if (error) return <div>Failed to load categories</div>;

    // 기존 Popover 컴포넌트 렌더링
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                        disabled={isLoading}>
                        {isLoading
                            ? 'Loading...'
                            : value
                              ? categories.find((cat) => cat.name === value)
                                    ?.name
                              : 'Select category...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search category..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                                {categories.map((category) => (
                                    <ContextMenu key={category.id}>
                                        <ContextMenuTrigger>
                                            <CommandItem
                                                value={category.name}
                                                onSelect={(currentValue) => {
                                                    setValue(
                                                        currentValue === value
                                                            ? ''
                                                            : currentValue,
                                                    );
                                                    // 선택된 카테고리의 ID를 상위 컴포넌트로 전달
                                                    const selectedCategory =
                                                        categories.find(
                                                            (cat) =>
                                                                cat.name ===
                                                                currentValue,
                                                        );
                                                    onCategorySelect(
                                                        currentValue === value
                                                            ? ''
                                                            : selectedCategory?.id ||
                                                                  '',
                                                    );
                                                    setOpen(false);
                                                }}>
                                                {category.name}
                                                <Check
                                                    className={cn(
                                                        'ml-auto h-4 w-4',
                                                        value === category.name
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                            </CommandItem>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                onClick={() =>
                                                    handleRename(category)
                                                }>
                                                이름 변경
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                className="text-destructive"
                                                onClick={() =>
                                                    handleDelete(category.id)
                                                }>
                                                삭제
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Dialog
                open={isRenameDialogOpen}
                onOpenChange={setIsRenameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>카테고리 이름 변경</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="새로운 카테고리 이름"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRenameDialogOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={handleRenameSubmit}>변경</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
