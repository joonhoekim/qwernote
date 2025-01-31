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
import Tree from "@/components/tree/Tree";
import { ProfileButton } from "@/components/sidebar-profile/ProfileMenu";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>qwernote</SidebarGroupLabel>
          <ProfileButton />
          <SidebarGroupContent>
            <SidebarMenu>
              <ComboboxDemo />
              {/*<EditTree />*/}
              <Tree />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
