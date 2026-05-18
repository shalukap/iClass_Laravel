import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, BookOpen, Clock, Users, GraduationCap, Layout, Banknote, Languages, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Classes', href: '/classes' },
];

interface ClassItem {
    id: number;
    cid: string;
    name: string;
    day: string;
    time_start: string;
    time_end: string;
    grade: number;
    classroom_id: string;
    lid: string;
    fee: number;
    classroom?: { name: string };
    lecturer?: { lec_name: string };
    medium: string;
    syllabus: string;
}

function formatTime12Hour(time24: string) {
    if (!time24) return '-';
    try {
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    } catch (e) {
        return time24;
    }
}

export default function Index() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [searchClass, setSearchClass] = useState('');
    const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/classes');
            setClasses(response.data.classes || []);
            setFilteredClasses(response.data.classes || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        const searchQuery = searchClass.toLowerCase();
        const filtered = classes.filter(
            (c) => (c.cid?.toLowerCase() || '').includes(searchQuery) || (c.name?.toLowerCase() || '').includes(searchQuery),
        );
        setFilteredClasses(filtered);
    }, [searchClass, classes]);

    const handleDelete = (c: ClassItem) => {
        Swal.fire({
            title: 'Delete Class?',
            text: 'This will remove the class and all associated schedules.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete it',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/classes/${c.cid}`);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Class has been removed.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchClasses();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete class.',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Class Management - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Academic Classes</h1>
                        <p className="text-muted-foreground">Schedule and manage academic sessions, lecturers, and classrooms.</p>
                    </div>
                    <Button onClick={() => navigate('/classes/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6 rounded-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Class
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <BookOpen className="h-5 w-5 text-indigo-400" />
                                Class Schedule
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by name or ID..."
                                    value={searchClass}
                                    onChange={(e) => setSearchClass(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-white h-11 pl-10 rounded-xl"
                                />
                                <Search className="absolute left-3 top-3 h-5 w-5 text-white/20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                <p>Synchronizing schedules...</p>
                            </div>
                        ) : filteredClasses.length > 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden overflow-x-auto shadow-2xl">
                                <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                                    <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="px-6 py-5">Class Details</th>
                                            <th className="px-6 py-5">Academic Level</th>
                                            <th className="px-6 py-5">Schedule & Venue</th>
                                            <th className="px-6 py-5">Finance & Medium</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/80">
                                        {filteredClasses.map((c) => (
                                            <tr key={c.cid} className="hover:bg-white/[0.03] transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                                                            <GraduationCap className="h-5 w-5 text-indigo-400" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base">{c.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">CID: {c.cid}</span>
                                                                <Badge variant="outline" className="h-4 border-white/10 text-[9px] px-1 text-white/60 bg-white/5">
                                                                    {c.day || 'Unset'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <Badge variant="outline" className="w-fit border-indigo-500/20 text-indigo-300 bg-indigo-500/5 text-[10px] font-bold">
                                                            Grade {c.grade}
                                                        </Badge>
                                                        <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                                            <Users className="h-3 w-3" />
                                                            <span>{c.lecturer?.lec_name || 'No Lecturer Assigned'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-white/80 text-xs">
                                                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                                            <span>{formatTime12Hour(c.time_start)} - {formatTime12Hour(c.time_end)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/40 text-[10px]">
                                                            <Layout className="h-3 w-3" />
                                                            <span>{c.classroom?.name || 'Unassigned Venue'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-white/80 font-mono text-xs">
                                                            <Banknote className="h-3.5 w-3.5 text-amber-400" />
                                                            <span>Rs. {c.fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-white/40 text-[10px] uppercase">
                                                                <Languages className="h-3 w-3" />
                                                                <span>{c.medium}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-white/40 text-[10px] uppercase">
                                                                <FileText className="h-3 w-3" />
                                                                <span>{c.syllabus}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                            <Link to={`/classes/${c.cid}/edit`}>
                                                                <Edit3 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button onClick={() => handleDelete(c)} size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <BookOpen className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No classes scheduled</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    Define your first academic session to begin managing student enrollments.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
