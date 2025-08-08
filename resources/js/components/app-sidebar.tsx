import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookA, BookOpen, Folder, LayoutGrid, School, School2, User, User2, User2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { MdPayment } from 'react-icons/md';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/students',
        icon: User,
    },
    {
        title: 'Lectures',
        href: '/lectures',
        icon: BookA,
    },
    {
        title: 'Schools',
        href: '/schools',
        icon: School2,
    },
    {
        title: 'Classes',
        href: '/classes',
        icon: Folder,
    },
    {
        title: 'Student Payments',
        href: '/student-payments',
        icon: Folder,
    },
    {
        title: 'Lecture Payments',
        href: '/lecture-payments',
        icon: Folder,
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: School,
    },
     {
        title: 'Classrooms',
        href: '/classrooms',
        icon: Folder,
    },
    {
        title: 'Enrollments',
        href: '/enrollments',
        icon: User2Icon,
    },
    {
        title: 'Lecture Enrollments',
        href: '/lecture-payments/classes',
        icon: User2Icon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/users',
        icon: User2Icon,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
