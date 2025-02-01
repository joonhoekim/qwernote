'use client';

import {getCategoriesByHandle} from '@/actions/category-actions';
import {Button} from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {removeAtSymbol} from '@/lib/utils/string-util';
import {Check, ChevronsUpDown} from 'lucide-react';
import {useParams} from 'next/navigation';
import * as React from 'react';
import useSWR from 'swr';

export function CategorySelector() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const params = useParams<{handle: string}>();
    const handle = removeAtSymbol(params.handle);
    // SWR의 key를 상수로 정의하여 재사용
    const cacheKey = `categories-${handle}`;

    // SWR fetcher 함수
    const fetcher = async (handle: string) => {
        const res = getCategoriesByHandle(handle);
        console.log(handle, res);
        return res;
    };

    // SWR을 사용한 데이터 fetching
    const {
        data: categories = [],
        error,
        isLoading,
    } = useSWR(cacheKey, () => fetcher(handle));

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
                          ? categories.find((cat) => cat.name === value)?.name
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
                                <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ''
                                                : currentValue,
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
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
