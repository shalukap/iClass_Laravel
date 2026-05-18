import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormSpa } from '@/hooks/use-form-spa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Users, Layout, Clock, Banknote, Languages, FileText, Save, ChevronLeft, Info, Calendar } from 'lucide-react';

export default function CreateOrEdit() {
    const { cid } = useParams();
    const isEdit = !!cid;
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [lectures, setLectures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Classes', href: '/classes' },
        { title: `${isEdit ? 'Edit' : 'Create'} Class`, href: '' },
    ];

    const { data, setData, post, patch, processing, errors } = useFormSpa({
        name: '',
        day: 'Monday',
        time_start: '',
        time_end: '',
        grade: 1,
        classroom_id: '',
        lid: '',
        fee: 2000.0,
        recurring_months: 1,
        medium: 'english',
        syllabus: 'local',
        color_code: 'indigo',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [classroomsRes, lecturesRes] = await Promise.all([
                    axios.get('/api/classrooms', { headers: { 'Accept': 'application/json' } }),
                    axios.get('/api/lectures', { headers: { 'Accept': 'application/json' } })
                ]);
                setClassrooms(classroomsRes.data.classrooms || []);
                setLectures(lecturesRes.data.lectures || []);

                if (isEdit) {
                    const classRes = await axios.get(`/api/classes/${cid}/edit`, { headers: { 'Accept': 'application/json' } });
                    const c = classRes.data.classItem;
                    setData({
                        name: c.name || '',
                        day: c.day || 'Monday',
                        time_start: c.time_start || '',
                        time_end: c.time_end || '',
                        grade: c.grade || 1,
                        classroom_id: c.classroom_id || '',
                        lid: c.lid || '',
                        fee: c.fee || 2000.0,
                        recurring_months: c.recurring_months || 1,
                        medium: c.medium || 'english',
                        syllabus: c.syllabus || 'local',
                        color_code: c.color_code || 'indigo',
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Failed to retrieve necessary configuration data.',
                    background: '#1e293b',
                    color: '#fff'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEdit, cid]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Class has been ${isEdit ? 'updated' : 'created'} successfully`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/classes');
            },
            onError: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: err.response?.data?.message || 'Please check the form for errors.',
                    background: '#1e293b',
                    color: '#fff'
                });
            },
        };

        if (!isEdit) {
            post('/api/classes', options);
        } else {
            patch(`/api/classes/${cid}`, options);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                    <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Configuring academic environment...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>{isEdit ? 'Edit Class' : 'Create Class'} - iClass</title>
            </Helmet>
            
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/classes')} className="text-white hover:bg-white/10">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {isEdit ? 'Edit Class Session' : 'Create New Class'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Modify session timings, lecturers, or venue details.' : 'Define a new academic session and its requirements.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Core Details */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-indigo-400" />
                                    General Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-1 space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Class Name</label>
                                    <Input
                                        placeholder="e.g. ICT"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>

                                <div className="sm:col-span-1 space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Day of Week</label>
                                    <Select value={data.day} onValueChange={(v) => setData('day', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                <SelectItem key={day} value={day}>{day}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Academic Grade</label>
                                    <Select value={data.grade.toString()} onValueChange={(v) => setData('grade', parseInt(v))}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {Array.from({ length: 13 }, (_, i) => i + 1).map((grade) => (
                                                <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Assign Lecturer</label>
                                    <Select value={data.lid} onValueChange={(v) => setData('lid', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue placeholder="Select Lecturer" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {lectures.map((l) => (
                                                <SelectItem key={l.lid} value={l.lid}>{l.lec_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <Clock className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    Timing & Logistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 pt-2">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] ml-1">Session Start</label>
                                    <div className="relative group/input">
                                        <Input
                                            type="time"
                                            required
                                            value={data.time_start}
                                            onChange={(e) => setData('time_start', e.target.value)}
                                            className="h-14 bg-slate-950/50 border-white/5 text-white pl-12 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all rounded-xl"
                                        />
                                        <Clock className="absolute left-4 top-4.5 h-5 w-5 text-white/20 group-focus-within/input:text-indigo-400 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-rose-400/60 uppercase tracking-[0.2em] ml-1">Session End</label>
                                    <div className="relative group/input">
                                        <Input
                                            type="time"
                                            required
                                            value={data.time_end}
                                            onChange={(e) => setData('time_end', e.target.value)}
                                            className="h-14 bg-slate-950/50 border-white/5 text-white pl-12 focus:border-rose-500/50 focus:ring-rose-500/20 transition-all rounded-xl"
                                        />
                                        <Clock className="absolute left-4 top-4.5 h-5 w-5 text-white/20 group-focus-within/input:text-rose-400 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.2em] ml-1">Assigned Venue</label>
                                    <Select value={data.classroom_id} onValueChange={(v) => setData('classroom_id', v)}>
                                        <SelectTrigger className="h-14 bg-slate-950/50 border-white/5 text-white pl-4 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all rounded-xl">
                                            <SelectValue placeholder="Choose a classroom" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-white/10 text-white">
                                            {classrooms.map((room) => (
                                                <SelectItem key={room.classroomId} value={room.classroomId} className="focus:bg-indigo-600 focus:text-white">
                                                    {room.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em] ml-1">Standard Fee</label>
                                    <div className="relative group/input">
                                        <Input
                                            type="number"
                                            required
                                            value={data.fee}
                                            onChange={(e) => setData('fee', parseFloat(e.target.value))}
                                            className="h-14 pl-14 bg-slate-950/50 border-white/5 text-white text-lg font-bold focus:border-amber-500/50 focus:ring-amber-500/20 transition-all rounded-xl"
                                        />
                                        <div className="absolute left-4 top-4 text-white/20 font-black text-lg group-focus-within/input:text-amber-400 transition-colors">Rs.</div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] ml-1">Recurring Cycle (Billing)</label>
                                    <div className="relative">
                                        <Select value={data.recurring_months.toString()} onValueChange={(v) => setData('recurring_months', parseInt(v))}>
                                            <SelectTrigger className="h-14 bg-indigo-500/5 border-dashed border-indigo-500/30 text-indigo-300 pl-4 hover:bg-indigo-500/10 transition-all rounded-2xl">
                                                <SelectValue placeholder="Select Frequency" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-950 border-white/10 text-white">
                                                <SelectItem value="1" className="focus:bg-indigo-600">Monthly Cycle</SelectItem>
                                                <SelectItem value="2" className="focus:bg-indigo-600">Bi-Monthly Cycle</SelectItem>
                                                <SelectItem value="3" className="focus:bg-indigo-600">Quarterly Cycle</SelectItem>
                                                <SelectItem value="6" className="focus:bg-indigo-600">Half-Yearly Cycle</SelectItem>
                                                <SelectItem value="12" className="focus:bg-indigo-600">Annual Cycle</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="sm:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400/60 uppercase tracking-[0.2em] ml-1">Timetable Color</label>
                                    <div className="flex flex-wrap gap-3 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                        {['blue', 'indigo', 'purple', 'rose', 'amber', 'emerald', 'cyan'].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setData('color_code', color)}
                                                className={`size-10 rounded-xl transition-all ${data.color_code === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                                style={{ backgroundColor: `var(--${color}-500, ${color})` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Curricullum */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Curriculum Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Languages className="h-3 w-3" /> Medium
                                    </label>
                                    <Select value={data.medium} onValueChange={(v) => setData('medium', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="sinhala">Sinhala</SelectItem>
                                            <SelectItem value="tamil">Tamil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="h-3 w-3" /> Syllabus
                                    </label>
                                    <Select value={data.syllabus} onValueChange={(v) => setData('syllabus', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="local">Local Syllabus</SelectItem>
                                            <SelectItem value="london">London Syllabus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all"
                                    >
                                        {processing ? 'Saving...' : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-5 w-5" />
                                                {isEdit ? 'Update Class' : 'Save Session'}
                                            </div>
                                        )}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => navigate('/classes')}
                                        className="w-full text-white/40 hover:text-white hover:bg-white/5"
                                    >
                                        Discard Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {isEdit && (
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 opacity-60">
                                <Info className="h-5 w-5 text-indigo-400 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-white">CID</span>
                                    <span className="font-mono text-xs text-indigo-300">{cid}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
