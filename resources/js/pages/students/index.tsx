import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Edit3, Trash2, GraduationCap, MapPin, Calendar, Phone, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
];

interface School {
    schoolId: string;
    name: string;
}

interface Student {
    sid: string;
    sname: string;
    image: string;
    address: string;
    dob: string;
    gender: string;
    schoolId: string;
    parentName: string;
    tpNo: string;
    watsapp: string;
    isActive: boolean;
    school_details?: School;
}

export default function Index() {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchStudent, setSearchStudent] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/students');
            setStudents(response.data.students || []);
            setFilteredStudents(response.data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const searchQuery = searchStudent.toLowerCase();
        const filtered = students.filter(
            (student) =>
                (student.sid?.toLowerCase() || '').includes(searchQuery) ||
                (student.sname?.toLowerCase() || '').includes(searchQuery) ||
                (student.school_details?.name?.toLowerCase() || '').includes(searchQuery),
        );
        setFilteredStudents(filtered);
    }, [searchStudent, students]);

    const handleDelete = (sid: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This student record will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete record',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/students/${sid}`);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Student record has been purged.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchStudents();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete student.',
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
                <title>Student Management - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Students</h1>
                        <p className="text-muted-foreground">Directory of all registered students and their academic profiles.</p>
                    </div>
                    <Button onClick={() => navigate('/students/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Register New Student
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <Search className="h-5 w-5 text-indigo-400" />
                                Search Directory
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by ID, Name or School..."
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-white h-11 pl-10"
                                />
                                <Search className="absolute left-3 top-3 h-5 w-5 text-white/20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                <p>Accessing student records...</p>
                            </div>
                        ) : filteredStudents.length > 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden overflow-x-auto shadow-2xl">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="px-6 py-5">Profile</th>
                                            <th className="px-6 py-5">ID & School</th>
                                            <th className="px-6 py-5">Contact Details</th>
                                            <th className="px-6 py-5">Address & DOB</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/80">
                                        {filteredStudents.map((s) => (
                                            <tr key={s.sid} className="hover:bg-white/[0.03] transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 border border-white/10 ring-2 ring-indigo-500/10 shadow-lg group-hover:ring-indigo-500/30 transition-all">
                                                            <AvatarImage src={s.image} />
                                                            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 font-bold text-lg">
                                                                {s.sname.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base">{s.sname}</span>
                                                            <span className="text-[10px] text-white/40 uppercase tracking-tighter flex items-center gap-1">
                                                                Parent: {s.parentName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-indigo-400 w-fit">
                                                            {s.sid}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-white/60">
                                                            <GraduationCap className="h-3 w-3" />
                                                            <span className="text-xs truncate max-w-[140px]">{s.school_details?.name || 'Private Student'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-white/80">
                                                            <Phone className="h-3 w-3 text-emerald-400" />
                                                            <span>{s.tpNo}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/40 text-xs">
                                                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">WhatsApp</span>
                                                            <span>{s.watsapp}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                                            <MapPin className="h-3 w-3 shrink-0" />
                                                            <span className="truncate max-w-[150px]">{s.address}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
                                                            <Calendar className="h-2.5 w-2.5" />
                                                            <span>{new Date(s.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {s.isActive ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 transition-all font-bold">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                            <Link to={`/students/${s.sid}/edit`}>
                                                                <Edit3 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button onClick={() => handleDelete(s.sid)} size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
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
                                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                                    <Search className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No students found</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    We couldn't find any student records matching your search criteria. Try using a different name, ID, or school.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
