import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    // In a pure SPA, we can manage sidebar state locally or just use the default.
    const isOpen = true;

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
