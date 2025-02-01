// edit layout
// edit 기능을 위한 layout 이다.
// 편집 기능을 위해 필요한 공통 코드들을 작성한다.
// 예를 들면, 사이드바에 관련된 코드들이다.
import {AppSidebar} from '@/components/edit-sidebar/EditSidebar';
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import type {Metadata} from 'next';

export const metadata: Metadata = {
    title: 'qwernote',
    description: 'editor',
};

export default function EditLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex w-dvw">
                <AppSidebar />
                <SidebarTrigger />
                {children}
            </div>
        </SidebarProvider>
    );
}
