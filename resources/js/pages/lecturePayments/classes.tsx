import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useFormSpa } from '@/hooks/use-form-spa';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Search, GraduationCap, Users, Banknote, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Lecture {
    lid: string;
    lec_name: string;
    classes: Class[];
}

interface LectureBasic {
    lid: string;
    lec_name: string;
}

interface Class {
    cid: string;
    name: string;
    medium: string;
    syllabus: string;
    student_count: number;
    total_earned: number;
    total_paid: number;
    due_amount: number;
    overpaid_amount: number;
}

interface Student {
    sid: string;
    sname: string;
    paid: boolean;
    cid: string;
}

export default function LectureClasses() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Lecture Classes',
            href: '/lecture-payments/classes',
        },
    ];

    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [matchedLectures, setMatchedLectures] = useState<LectureBasic[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'name'>('id');
    const [selectedLectureId, setSelectedLectureId] = useState('');

    const { data, setData } = useFormSpa({
        searchTerm: '',
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMatchedLectures([]);
        setLecture(null);
        setStudents([]);
        setSelectedLectureId('');

        try {
            const params: any = {};
            const term = data.searchTerm.trim();

            if (!term) {
                Swal.fire({
                    icon: 'info',
                    title: 'Empty Search',
                    text: 'Please enter a search term',
                    background: '#1e293b',
                    color: '#fff',
                    confirmButtonColor: '#3b82f6'
                });
                setLoading(false);
                return;
            }

            if (searchType === 'id') {
                params.lid = term;
            } else if (searchType === 'name') {
                params.name = term;
            }

            const response = await axios.get(`/lecture-enrollments/search`, { params });

            if (searchType === 'id' && response.data.lecture) {
                setLecture(response.data.lecture);
                setStudents(response.data.students || []);
                setSelectedLectureId(response.data.lecture.lid);
            } else if (searchType === 'name' && response.data.lectures) {
                const lectures = response.data.lectures;
                setMatchedLectures(lectures);

                if (lectures.length === 1) {
                    fetchLectureDetails(lectures[0].lid);
                } else if (lectures.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Not Found',
                        text: 'No lectures found with that name',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Not Found',
                    text: response.data.message || 'No lectures found',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'An error occurred during search',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchLectureDetails = async (lid: string) => {
        if (!lid) return;

        setLoading(true);
        setLecture(null);
        setStudents([]);
        setMatchedLectures([]);
        setSelectedLectureId(lid);

        try {
            const response = await axios.get(`/lecture-payments/${lid}`);

            if (response.data.lecture) {
                setLecture(response.data.lecture);
                setStudents(response.data.students || []);
                setSelectedLectureId(response.data.lecture.lid);
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch lecture details',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLectureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lid = e.target.value;
        if (lid) {
            fetchLectureDetails(lid);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Lecture Classes & Payments</title>
            </Helmet>

            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Lecture Payments</h1>
                    <p className="text-muted-foreground">Manage and track lecture earnings and class settlements.</p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Search className="h-5 w-5 text-indigo-400" />
                            Search Lectures
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-48">
                                <select
                                    value={searchType}
                                    onChange={(e) => {
                                        setSearchType(e.target.value as 'id' | 'name');
                                        setMatchedLectures([]);
                                        setLecture(null);
                                        setStudents([]);
                                    }}
                                    className="w-full h-10 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="id">Lecture ID</option>
                                    <option value="name">Lecture Name</option>
                                </select>
                            </div>

                            <div className="flex-1 flex gap-2">
                                <Input
                                    type="text"
                                    placeholder={searchType === 'id' ? "Enter LID (e.g. L001)" : "Enter lecturer name..."}
                                    value={data.searchTerm}
                                    onChange={(e) => setData('searchTerm', e.target.value)}
                                    className="bg-slate-900 border-white/10"
                                />
                                <Button 
                                    type="submit" 
                                    className="bg-indigo-600 hover:bg-indigo-700 transition-all px-8"
                                    disabled={loading}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {matchedLectures.length > 0 && (
                    <Card className="border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl">
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <AlertCircle className="h-5 w-5" />
                                    <p className="text-sm font-medium">Multiple matches found. Please select from the list below:</p>
                                </div>
                                <select
                                    value={selectedLectureId}
                                    onChange={handleLectureSelect}
                                    className="w-full h-11 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-white"
                                >
                                    <option value="">-- Select Lecturer --</option>
                                    {matchedLectures.map((lec) => (
                                        <option key={lec.lid} value={lec.lid}>
                                            {lec.lec_name} ({lec.lid})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {lecture && (
                    <div className="grid gap-6 animate-in fade-in duration-500">
                        {/* Lecture Info Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-xl bg-indigo-500/10 p-3">
                                        <GraduationCap className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lecturer Name</p>
                                        <p className="text-xl font-bold text-white">{lecture.lec_name}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-xl bg-purple-500/10 p-3">
                                        <AlertCircle className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lecturer ID</p>
                                        <p className="text-xl font-bold text-white">{lecture.lid}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="rounded-xl bg-pink-500/10 p-3">
                                        <Users className="h-6 w-6 text-pink-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Classes Teaching</p>
                                        <p className="text-xl font-bold text-white">{lecture.classes?.length || 0}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Classes Table/List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2 px-1">
                                <Banknote className="h-5 w-5 text-emerald-400" />
                                Class Settlements
                            </h2>

                            {lecture.classes && lecture.classes.length > 0 ? (
                                <div className="grid gap-4">
                                    {lecture.classes.map((cls) => (
                                        <Card key={cls.cid} className="border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all">
                                            <div className="p-6">
                                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                    {/* Left: Class Info */}
                                                    <div className="space-y-4 flex-1">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-lg font-bold text-white">{cls.name}</h3>
                                                                <span className="text-xs font-mono bg-white/10 text-white/50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                                    {cls.cid}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {cls.medium} Medium • {cls.syllabus} Syllabus
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5">
                                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Total Earned (75%)</p>
                                                                <p className="text-lg font-bold text-indigo-400">Rs.{Number(cls.total_earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5">
                                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Total Paid</p>
                                                                <p className="text-lg font-bold text-emerald-400">Rs.{Number(cls.total_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Balance Due</p>
                                                                <p className={`text-lg font-bold ${cls.due_amount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                                    {cls.due_amount > 0 ? `Rs.${Number(cls.due_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Settled'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right: Student Breakdown */}
                                                    <div className="w-full lg:w-[400px] bg-black/20 rounded-xl border border-white/5 p-4 self-start">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center justify-between">
                                                            <span>Students ({students.filter((s) => s.cid === cls.cid).length})</span>
                                                            {cls.student_count > 0 && <span className="text-[10px] lowercase text-white/20">Scroll to see all</span>}
                                                        </h4>
                                                        
                                                        <div className="max-h-[180px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
                                                            {students.filter((s) => s.cid === cls.cid).length > 0 ? (
                                                                students.filter((s) => s.cid === cls.cid).map((student) => (
                                                                    <div key={student.sid} className="flex items-center justify-between p-2 rounded-md bg-white/[0.02] border border-white/[0.02] text-xs">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="font-mono text-white/30">{student.sid}</span>
                                                                            <span className="font-medium text-white/80">{student.sname}</span>
                                                                        </div>
                                                                        {student.paid ? (
                                                                            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                                                                <CheckCircle2 className="h-3 w-3" />
                                                                                <span className="font-bold">Paid</span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                                                                <AlertCircle className="h-3 w-3" />
                                                                                <span className="font-bold">Pending</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-center py-6 text-white/20 italic text-xs">No student data available</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-white/10 bg-white/5 border-dashed">
                                    <CardContent className="p-12 flex flex-col items-center justify-center text-center opacity-40">
                                        <Banknote className="h-12 w-12 mb-4" />
                                        <p>No classes or payments assigned to this lecturer.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
