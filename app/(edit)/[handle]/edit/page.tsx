'use client';

import {ScrollArea} from '@/components/ui/scroll-area';
import {Editor} from '@/editor/Editor';

export default function Edit() {
    return (
        <div className="min-h-dvh flex-1">
            <ScrollArea className="min-h-screen rounded-lg border">
                <div className="p-4">
                    <Editor />
                </div>
            </ScrollArea>
        </div>
    );
}
