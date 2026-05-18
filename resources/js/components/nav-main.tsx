import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, useLocation } from 'react-router-dom';

export function NavMain({ groups = [] }: { groups: { label: string; items: NavItem[] }[] }) {
    const location = useLocation();
    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <SidebarGroup key={group.label} className="px-3 py-0">
                    <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        {group.label}
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {group.items.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={isActive} 
                                        tooltip={{ children: item.title }}
                                        className={`group relative h-10 px-3 rounded-xl transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <Link to={item.href} className="flex items-center gap-3">
                                            {item.icon && (
                                                <item.icon className={`h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 ${
                                                    isActive ? 'text-white' : 'text-indigo-400/60'
                                                }`} />
                                            )}
                                            <span className="text-sm font-semibold tracking-tight">{item.title}</span>
                                            
                                            {isActive && (
                                                <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </div>
    );
}
