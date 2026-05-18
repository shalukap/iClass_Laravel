import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, Layout, DoorOpen, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Classrooms', href: '/classrooms' },
];

interface ClassroomItem {
    id: number;
    classroomId: string;
    name: string;
}

export default function Index() {
    const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
    const [searchClassroom, setSearchClassroom] = useState('');
    const [filteredClassrooms, setFilteredClassrooms] = useState<ClassroomItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchClassrooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/classrooms');
            setClassrooms(response.data.classrooms || []);
            setFilteredClassrooms(response.data.classrooms || []);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        const searchQuery = searchClassroom.toLowerCase();
        const filtered = classrooms.filter((c) =>
            (c.classroomId?.toLowerCase() || '').includes(searchQuery) ||
            (c.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredClassrooms(filtered);
    }, [searchClassroom, classrooms]);

    const handleDelete = (c: ClassroomItem) => {
        Swal.fire({
            title: "Delete Classroom?",
            text: "All associated class schedules will lose their assigned venue.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
            confirmButtonText: "Yes, delete venue",
            background: '#1e293b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/classrooms/${c.classroomId}`);
                    Swal.fire({
                        title: "Deleted!",
                        text: "Classroom has been removed.",
                        icon: "success",
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchClassrooms();
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete classroom.",
                        icon: "error",
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
                <title>Classroom Management - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Classrooms</h1>
                        <p className="text-muted-foreground">Manage physical and virtual learning venues within the institution.</p>
                    </div>
                    <Button onClick={() => navigate('/classrooms/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6 rounded-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Venue
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <Layout className="h-5 w-5 text-indigo-400" />
                                Available Venues
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by venue name or ID..."
                                    value={searchClassroom}
                                    onChange={(e) => setSearchClassroom(e.target.value)}
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
                                <p>Loading venue records...</p>
                            </div>
                        ) : filteredClassrooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredClassrooms.map((c) => (
                                    <div key={c.classroomId} className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/[0.08] transition-all hover:scale-[1.02]">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                                <DoorOpen className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                                                    <Link to={`/classrooms/${c.classroomId}/edit`}>
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button onClick={() => handleDelete(c)} size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">{c.name}</h3>
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase tracking-widest">
                                                <Info className="h-3 w-3" />
                                                ID: {c.classroomId}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 pt-3 border-t border-white/5">
                                            <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9px] font-bold uppercase tracking-tighter">
                                                Active Venue
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <Layout className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No classrooms found</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    Define learning spaces to begin scheduling academic sessions.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
