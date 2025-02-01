// app/components/add-category-button.tsx
'use client';

import {Button} from '@/components/ui/button';
import {removeAtSymbol} from '@/lib/utils/string-util';
import {Loader2} from 'lucide-react';
import {useSession} from 'next-auth/react';
import {useParams} from 'next/navigation';
import {createCategory} from '@/actions/category-actions';
import {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {mutate} from 'swr';

export function AddCategoryButton() {
    const {data: session, status} = useSession();
    const params = useParams<{handle: string}>();
    const handle = removeAtSymbol(params['handle']);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('name: ', name);
        const result = await createCategory(name);
        if (result.success) {
            mutate(`categories-${handle}`);
        }
        setName('');
        setOpen(false);
    }

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <Button disabled>
                <Loader2 className="animate-spin" />
                loading...
            </Button>
        );
    }

    if (status === 'authenticated' && session.user.handle === handle) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Add a category</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                        />
                        <Button type="submit">Create</Button>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    if (status === 'authenticated' && session.user.handle != handle) {
        return <Button>Go to your blog</Button>;
    }
}
