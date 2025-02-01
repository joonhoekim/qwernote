import {ComboboxDemo} from '@/components/edit-sidebar/EditCombobox';
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
import {Calendar, Home, Inbox, Search, Settings} from 'lucide-react';

// Menu items.
const items = [
    {
        title: 'Home',
        url: '#',
        icon: Home,
    },
    {
        title: 'Inbox',
        url: '#',
        icon: Inbox,
    },
    {
        title: 'Calendar',
        url: '#',
        icon: Calendar,
    },
    {
        title: 'Search',
        url: '#',
        icon: Search,
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <h1>qwernote LOGO</h1>
                <ProfileButton />
            </SidebarContent>
        </Sidebar>
    );
}
