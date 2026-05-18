import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useFormSpa } from '@/hooks/use-form-spa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Users, BookOpen, User, GraduationCap, ArrowRight, ShieldCheck, Info, X, CheckCircle2, Languages, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Student {
    sid: string;
    sname: string;
    classes: Class[];
}

interface StudentBasic {
    sid: string;
    sname: string;
}

interface Class {
    cid: string;
    name: string;
    medium: string;
    syllabus: string;
}

export default function Enroll() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Enrollment Hub', href: '/enrollments' },
    ];

    const [student, setStudent] = useState<Student | null>(null);
    const [matchedStudents, setMatchedStudents] = useState<StudentBasic[]>([]);
    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'name'>('id');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, post } = useFormSpa({
        searchTerm: '',
        cid: '',
        sid: '',
    });

    useEffect(() => {
        const fetchInitialClasses = async () => {
            try {
                const response = await axios.get('/api/enrollments');
                setAllClasses(response.data.allClasses || []);
            } catch (error) {
                console.error('Error fetching initial classes:', error);
            }
        };
        fetchInitialClasses();
    }, []);

    // Live Search Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const term = data.searchTerm.trim();
            if (term.length >= 2) {
                setSearching(true);
                try {
                    const response = await axios.get(`/api/enrollments/search?name=${term}`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.data.students) {
                        setMatchedStudents(response.data.students);
                        setShowDropdown(true);
                    }
                } catch (error) {
                    setMatchedStudents([]);
                    setShowDropdown(false);
                } finally {
                    setSearching(false);
                }
            } else {
                setMatchedStudents([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [data.searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMatchedStudents([]);
        setStudent(null);
        setData('sid', '');

        try {
            const term = data.searchTerm.trim();

            if (!term) {
                Swal.fire({
                    icon: 'info',
                    title: 'Search Term Required',
                    text: 'Please enter a student name or ID to begin.',
                    background: '#1e293b',
                    color: '#fff'
                });
                setLoading(false);
                return;
            }

            const params: any = { name: term };
            const response = await axios.get(`/api/enrollments/search`, { 
                params,
                headers: { 'Accept': 'application/json' }
            });

            if (response.data.student) {
                // Direct ID match found
                setStudent(response.data.student);
                setData('sid', response.data.student.sid);
                setData('cid', '');
            } else if (response.data.students && response.data.students.length > 0) {
                const students = response.data.students;
                setMatchedStudents(students);
                setShowDropdown(true);

                if (students.length === 1) {
                    fetchStudentDetails(students[0].sid);
                    setShowDropdown(false);
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Not Found',
                    text: response.data.message || 'No students found.',
                    background: '#1e293b',
                    color: '#fff'
                });
            }

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Search Error',
                text: error.response?.data?.message || 'A network error occurred.',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentDetails = async (sid: string) => {
        if (!sid) return;

        setLoading(true);
        setStudent(null);
        setMatchedStudents([]);
        setData('sid', sid);

        try {
            const response = await axios.get(`/api/enrollments/search?sid=${sid}`);
            if (response.data.student) {
                setStudent(response.data.student);
                setData('cid', '');
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Data Retrieval Failed',
                text: 'Could not fetch detailed student profile.',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.sid || !data.cid) {
            Swal.fire({
                icon: 'warning',
                title: 'Selection Required',
                text: 'Please select a class for enrollment.',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        post('/api/enrollments', {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Student enrolled successfully',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                fetchStudentDetails(data.sid);
                setData('cid', '');
            },
            onError: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Enrollment Error',
                    text: err.response?.data?.message || 'Student is already enrolled or data is invalid.',
                    background: '#1e293b',
                    color: '#fff'
                });
            },
        });
    };

    const availableClasses =
        student && Array.isArray(allClasses) ? allClasses.filter((cls) => !student.classes.some((enrolled) => enrolled.cid === cls.cid)) : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Enrollment Hub - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-8 pb-20 max-w-6xl mx-auto">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <UserPlus className="h-8 w-8 text-indigo-400" />
                        Enrollment Hub
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Register students for new academic sessions. Search by ID or Name to manage enrollments and view current schedules.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Search & Selection */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Student Search</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            placeholder="Search by name or Student ID..."
                                            value={data.searchTerm}
                                            onChange={(e) => setData('searchTerm', e.target.value)}
                                            onFocus={() => matchedStudents.length > 0 && setShowDropdown(true)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white rounded-xl focus:ring-indigo-500"
                                        />
                                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                                        
                                        {searching && (
                                            <div className="absolute right-3 top-3.5">
                                                <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                            </div>
                                        )}

                                        {/* Real-time Dropdown */}
                                        {showDropdown && matchedStudents.length > 0 && (
                                            <div ref={dropdownRef} className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto custom-scrollbar">
                                                {matchedStudents.map((s) => (
                                                    <button
                                                        key={s.sid}
                                                        type="button"
                                                        onClick={() => {
                                                            setData('searchTerm', s.sname);
                                                            setShowDropdown(false);
                                                            fetchStudentDetails(s.sid);
                                                        }}
                                                        className="w-full flex flex-col items-start px-4 py-3 hover:bg-indigo-600/20 border-b border-white/5 last:border-0 transition-colors group"
                                                    >
                                                        <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{s.sname}</span>
                                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{s.sid}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20"
                                    >
                                        {loading ? 'Searching...' : 'Locate Student'}
                                    </Button>
                                </form>

                                {student && (
                                    <div className="pt-6 mt-6 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Registered Name</label>
                                            <div className="h-12 flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold">
                                                <User className="h-4 w-4 mr-3 text-indigo-400" />
                                                {student.sname}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Student ID</label>
                                            <div className="h-12 flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-white/60 font-mono tracking-wider">
                                                <ShieldCheck className="h-4 w-4 mr-3 text-indigo-400" />
                                                {student.sid}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column: Profile & Actions */}
                    <div className="lg:col-span-7 space-y-6">
                        {!student && !loading && (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 relative">
                                    <ShieldCheck className="h-10 w-10 text-white/10" />
                                    <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping opacity-20" />
                                </div>
                                <h3 className="text-white/60 font-bold text-xl mb-2">Registry Access Required</h3>
                                <p className="text-white/20 max-w-sm mx-auto leading-relaxed text-sm">
                                    Search for a student to access their academic profile and manage class enrollments.
                                </p>
                            </div>
                        )}

                        {loading && (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border border-white/10 rounded-3xl bg-white/5 animate-pulse">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                <p className="text-indigo-300 font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
                            </div>
                        )}

                        {student && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Student Profile Summary */}
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                                    <div className="h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                                    </div>
                                    <CardContent className="relative pt-0 pb-6 px-8">
                                        <div className="-mt-12 mb-6 flex items-end gap-6">
                                            <div className="h-24 w-24 rounded-3xl bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl">
                                                <User className="h-12 w-12 text-indigo-400" />
                                            </div>
                                            <div className="pb-2">
                                                <h2 className="text-2xl font-bold text-white">{student.sname}</h2>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 font-mono tracking-widest uppercase text-[10px]">
                                                        {student.sid}
                                                    </Badge>
                                                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                        Active Student
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" /> Current Enrollments
                                            </h3>
                                            {student.classes.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {student.classes.map((cls) => (
                                                        <div key={cls.cid} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{cls.name}</span>
                                                                <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[8px] uppercase tracking-tighter">Enrolled</Badge>
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/5">
                                                                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                                                                    <Languages className="h-3 w-3" />
                                                                    <span>{cls.medium}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                                                                    <FileText className="h-3 w-3" />
                                                                    <span>{cls.syllabus}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-8 flex flex-col items-center justify-center text-center opacity-40">
                                                    <X className="h-8 w-8 mb-2" />
                                                    <p className="text-sm italic">No active enrollments found for this student.</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Enrollment Action */}
                                <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl shadow-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-indigo-400" />
                                            Session Registration
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {availableClasses.length > 0 ? (
                                            <form onSubmit={handleEnroll} className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Select Available Class</label>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <Select value={data.cid} onValueChange={(v) => setData('cid', v)}>
                                                            <SelectTrigger className="h-14 bg-slate-900 border-white/10 text-white rounded-2xl px-6">
                                                                <SelectValue placeholder="Browse Academic Sessions..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                                                                {availableClasses.map((cls) => (
                                                                    <SelectItem key={cls.cid} value={cls.cid} className="py-3">
                                                                        <div className="flex flex-col">
                                                                            <span className="font-bold text-sm">{cls.name}</span>
                                                                            <span className="text-[10px] opacity-40 font-mono tracking-tighter uppercase">
                                                                                {cls.cid} • {cls.medium} Medium • {cls.syllabus}
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                        <Info className="h-5 w-5 text-indigo-300" />
                                                    </div>
                                                    <p className="text-[10px] text-white/40 leading-relaxed">
                                                        By enrolling the student, they will be immediately added to the attendance registry and financial billing for the selected session.
                                                    </p>
                                                </div>

                                                <Button 
                                                    type="submit" 
                                                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-emerald-600/20 transition-all group"
                                                >
                                                    <CheckCircle2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                                    Confirm Enrollment
                                                </Button>
                                            </form>
                                        ) : (
                                            <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl flex gap-4 items-center">
                                                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                                    <Info className="h-6 w-6 text-amber-400" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-white">Full Enrollment</span>
                                                    <p className="text-xs text-white/40 leading-relaxed">
                                                        This student is already registered for all available academic sessions. No further actions required.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
