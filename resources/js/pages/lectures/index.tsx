import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Edit3, Trash2, GraduationCap, MapPin, Mail, Phone, CheckCircle2, XCircle, Briefcase, CreditCard, Car } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lecture', href: '/lectures' }];

interface School {
    schoolId: string;
    name: string;
}

interface Lecture {
    lid: string;
    lec_name: string;
    lec_address: string;
    qualification: string;
    tp_no: string;
    whatsapp_no: string;
    lec_dob: string;
    lec_email: string;
    is_employed: boolean;
    school_id?: string;
    school?: School;
    bank_account: string;
    bank_name: string;
    bank_branch: string;
    vehicle_no: string;
    status: boolean;
}

export default function Index() {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [searchLecture, setSearchLecture] = useState('');
    const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLectures = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/lectures');
            setLectures(response.data.lectures || []);
            setFilteredLectures(response.data.lectures || []);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    useEffect(() => {
        const searchQuery = searchLecture.toLowerCase();
        const filtered = lectures.filter(
            (lecture) =>
                (lecture.lid?.toLowerCase() || '').includes(searchQuery) ||
                (lecture.lec_name?.toLowerCase() || '').includes(searchQuery) ||
                (lecture.school?.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredLectures(filtered);
    }, [searchLecture, lectures]);

    const handleDelete = (lid: string) => {
        Swal.fire({
            title: 'Delete Lecturer?',
            text: "This action will permanently remove the lecturer profile.",
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
                    await axios.delete(`/api/lectures/${lid}`);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Lecturer profile has been removed.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchLectures();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete record.',
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
                <title>Lecturer Management - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Lecture</h1>
                        <p className="text-muted-foreground">Manage academic faculty, qualifications, and employment status.</p>
                    </div>
                    <Button onClick={() => navigate('/lectures/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add New Lecturer
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <Search className="h-5 w-5 text-indigo-400" />
                                Faculty Directory
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by ID, Name or School..."
                                    value={searchLecture}
                                    onChange={(e) => setSearchLecture(e.target.value)}
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
                                <p>Loading faculty profiles...</p>
                            </div>
                        ) : filteredLectures.length > 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden overflow-x-auto shadow-2xl">
                                <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                                    <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="px-6 py-5">Faculty Member</th>
                                            <th className="px-6 py-5">Employment Info</th>
                                            <th className="px-6 py-5">Contact Details</th>
                                            <th className="px-6 py-5">Financial & Logistics</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/80">
                                        {filteredLectures.map((lec) => (
                                            <tr key={lec.lid} className="hover:bg-white/[0.03] transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 border border-white/10 ring-2 ring-indigo-500/10 shadow-lg group-hover:ring-indigo-500/30 transition-all">
                                                            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 font-bold text-lg">
                                                                {lec.lec_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base">{lec.lec_name}</span>
                                                            <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase tracking-tighter mt-0.5">
                                                                <span className="font-mono text-indigo-400/80 bg-indigo-500/5 px-1 rounded">{lec.lid}</span>
                                                                <span className="mx-1">•</span>
                                                                <span className="truncate max-w-[150px]">{lec.qualification}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        {lec.is_employed ? (
                                                            <div className="flex flex-col gap-1">
                                                                <Badge className="w-fit bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold text-[10px]">
                                                                    <Briefcase className="mr-1 h-3 w-3" />
                                                                    Employed
                                                                </Badge>
                                                                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                                                    <GraduationCap className="h-3 w-3" />
                                                                    <span>{lec.school?.name || 'Assigned School'}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <Badge variant="outline" className="w-fit border-white/10 text-white/40 text-[10px]">
                                                                Independent
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-white/80">
                                                            <Phone className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-xs">{lec.tp_no}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/60">
                                                            <Mail className="h-3 w-3 text-indigo-400" />
                                                            <span className="text-xs truncate max-w-[150px]">{lec.lec_email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-white/60 text-[11px]">
                                                            <CreditCard className="h-3 w-3 text-amber-400" />
                                                            <span>{lec.bank_name || 'No Bank Info'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/40 text-[10px]">
                                                            <Car className="h-3 w-3" />
                                                            <span>{lec.vehicle_no || 'No Vehicle'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {lec.status ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                            <Link to={`/lectures/${lec.lid}/edit`}>
                                                                <Edit3 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button onClick={() => handleDelete(lec.lid)} size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
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
                                    <GraduationCap className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No lecturers found</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    Start by adding your first faculty member to build your academic team.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
