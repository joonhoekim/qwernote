import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

// import EditTree from "@/components/test-components/EditTree";
import { ComboboxDemo } from "@/components/edit-sidebar/EditCombobox";
import { ProfileButton } from "@/components/sidebar-profile/ProfileMenu";
import { PostTree } from "@/components/edit-sidebar/post/PostTree";
import { CategoryTree } from "@/components/edit-sidebar/category/CategoryTree";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <h1>qwernote LOGO</h1>
        <ProfileButton />
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ComboboxDemo />
              {/*<EditTree />*/}
              {/*<CategoryTree />*/}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Posts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <PostTree />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
