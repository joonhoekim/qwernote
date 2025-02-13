'use client';

// import EditTree from "@/components/test-components/EditTree";
import {ModeToggle} from '@/components/ModeToggle';
import {ComboboxDemo} from '@/components/edit-sidebar/EditCombobox';
import {CategoryTree} from '@/components/edit-sidebar/category/CategoryTree';
import {PostTree} from '@/components/edit-sidebar/post/PostTree';
import {ProfileButton} from '@/components/sidebar-profile/ProfileMenu';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {useState} from 'react';

export function AppSidebar() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <Sidebar>
            <SidebarContent>
                <h1>qwernote LOGO</h1>
                <ProfileButton />
                <ModeToggle />
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarGroupContent className="rounded-lg border">
                        <SidebarMenu>
                            <ComboboxDemo
                                onCategorySelect={handleCategorySelect}
                            />
                            {/*<EditTree />*/}
                            {/*<CategoryTree />*/}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Posts</SidebarGroupLabel>
                    <SidebarGroupContent className="rounded-lg border">
                        <SidebarMenu>
                            {selectedCategoryId ? (
                                <PostTree categoryId={selectedCategoryId} />
                            ) : (
                                <div className="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
                                    카테고리를 선택해주세요
                                </div>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
