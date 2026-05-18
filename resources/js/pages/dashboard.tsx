import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { 
    Users, 
    BookOpen, 
    DollarSign, 
    UserCheck, 
    TrendingUp, 
    Calendar, 
    Clock, 
    ChevronRight,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import WeeklyTimetable from '@/components/weekly-timetable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-8 p-8 overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
                
                {/* Welcome Header Section */}
                <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900/60 p-10 text-white shadow-2xl border border-white/5 backdrop-blur-xl">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/dashboard-header.png" 
                            className="h-full w-full object-cover opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" 
                            alt="Header Background" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-purple-600/30" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-md border border-white/10">
                                <Sparkles className="size-4 text-blue-400" />
                                <span className="text-xs font-bold tracking-widest uppercase text-blue-100/70">System Operational</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter">
                                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>!
                            </h1>
                            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                                You have <span className="font-bold text-white">12 active classes</span> today. Your student attendance is up by <span className="text-green-400 font-bold">8%</span> this week.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => document.getElementById('timetable')?.scrollIntoView({ behavior: 'smooth' })}
                                className="h-14 px-8 rounded-2xl bg-white text-slate-950 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 shadow-blue-500/10"
                            >
                                View Schedule
                            </button>
                            <button className="h-14 px-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold transition-all hover:bg-white/10 active:scale-95">
                                Quick Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Students', value: '1,284', trend: '+12%', icon: Users, color: 'blue' },
                        { label: 'Active Classes', value: '42', trend: '8 today', icon: BookOpen, color: 'indigo' },
                        { label: 'Net Revenue', value: '$12.5k', trend: '+5.4%', icon: DollarSign, color: 'emerald' },
                        { label: 'Top Lecturers', value: '24', trend: 'Stable', icon: UserCheck, color: 'amber' },
                    ].map((stat, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-7 shadow-xl backdrop-blur-sm transition-all hover:shadow-indigo-500/5 hover:-translate-y-2">
                            <div className={`absolute -right-6 -top-6 size-32 rounded-full bg-${stat.color}-500/5 transition-all group-hover:scale-125`} />
                            <div className="relative flex items-center justify-between mb-6">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 shadow-inner border border-white/5`}>
                                    <stat.icon className="size-6" />
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                    <TrendingUp className="size-3 text-green-500" />
                                    <span className="text-xs font-bold text-slate-400">{stat.trend}</span>
                                </div>
                            </div>
                            <div className="relative flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                <span className="text-4xl font-black tracking-tight text-white">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid gap-8 lg:grid-cols-7">
                    
                    {/* Enrollment Trend Chart */}
                    <div className="relative col-span-4 overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-md">
                        <div className="mb-8 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight text-white">Enrollment Growth</h3>
                                <p className="text-sm text-slate-400 font-medium">Monthly performance analysis</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                    <ArrowUpRight className="size-5 text-slate-300" />
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[350px] w-full rounded-3xl bg-black/20 p-8 border border-white/5">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-white/5" />
                            <div className="flex h-full items-end gap-3 overflow-hidden px-2 relative z-10">
                                {[40, 70, 45, 90, 65, 80, 50, 85, 30, 95, 60, 75].map((h, i) => (
                                    <div 
                                        key={i} 
                                        className="w-full rounded-t-2xl bg-gradient-to-t from-blue-600/60 to-indigo-400/20 transition-all hover:from-blue-500 hover:to-indigo-300 group cursor-pointer relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div id="timetable" className="lg:col-span-3 h-full">
                        <WeeklyTimetable />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
