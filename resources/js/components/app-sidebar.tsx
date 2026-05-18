import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from 'react-router-dom';
import { BookA, BookOpen, Folder, LayoutGrid, School, School2, User, User2, User2Icon } from 'lucide-react';
import AppLogo from './app-logo';
import { MdPayment } from 'react-icons/md';

import { useAuth } from '@/contexts/auth-context';

const navGroups = [
    {
        label: 'Platform',
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Students', href: '/students', icon: User2, privilege: 'students' },
            { title: 'Schools', href: '/schools', icon: School2, privilege: 'schools' },
        ]
    },
    {
        label: 'Academic',
        items: [
            { title: 'Lecture', href: '/lectures', icon: School, privilege: 'lectures' },
            { title: 'Classes', href: '/classes', icon: Folder, privilege: 'classes' },
            { title: 'Classrooms', href: '/classrooms', icon: BookA, privilege: 'classrooms' },
            { title: 'Enrollments', href: '/enrollments', icon: User2Icon, privilege: 'enrollments' },
        ]
    },
    {
        label: 'Financial',
        items: [
            { title: 'Student Payments', href: '/student-payments', icon: MdPayment, privilege: 'student_payments' },
            { title: 'Lecture Payments', href: '/lecture-payments', icon: MdPayment, privilege: 'lecture_payments' },
        ]
    },
    {
        label: 'Reports',
        items: [
            { title: 'Collection Report', href: '/reports/collection', icon: BookOpen, privilege: 'collection_report' },
        ]
    },
    {
        label: 'System',
        items: [
            { title: 'User Management', href: '/users', icon: User2, privilege: 'user_management' },
        ]
    }
];


export function AppSidebar() {
    const { user } = useAuth();
    
    // Filter groups based on user privileges
    const filteredGroups = navGroups.map(group => {
        const filteredItems = group.items.filter((item: any) => {
            // If no privilege is required, show it to all authenticated users
            if (!item.privilege) return true;

            // Root and Admin have all privileges
            if (user?.user_type === 'root' || user?.user_type === 'admin') {
                return true;
            }
            // Check if user has explicit privilege for this item
            return Array.isArray(user?.privileges) && user.privileges.includes(item.privilege);
        });
        
        return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);

    return (
        <Sidebar collapsible="offcanvas" variant="inset" className="border-r border-white/5 bg-[#0a0a0b]">
            <SidebarHeader className="py-6 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link to="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain groups={filteredGroups} />
            </SidebarContent>

            <SidebarFooter className="p-4 bg-black/20 border-t border-white/5">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
