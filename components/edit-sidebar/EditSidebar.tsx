// import EditTree from "@/components/test-components/EditTree";
import { ComboboxDemo } from '@/components/edit-sidebar/EditCombobox';
import { CategoryTree } from '@/components/edit-sidebar/category/CategoryTree';
import { PostTree } from '@/components/edit-sidebar/post/PostTree';
import { ProfileButton } from '@/components/sidebar-profile/ProfileMenu';
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
import { ModeToggle } from '../theme/ModeToggle';

export function AppSidebar() {
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
                            <ComboboxDemo />
                            {/*<EditTree />*/}
                            {/*<CategoryTree />*/}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Posts</SidebarGroupLabel>
                    <SidebarGroupContent className="rounded-lg border">
                        <SidebarMenu>
                            <PostTree />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
