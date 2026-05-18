import { Input } from '@/components/ui/input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, School, Phone, Calendar, MapPin, CheckCircle2, ChevronLeft, Save, UserPlus, Info } from 'lucide-react';

interface SchoolData {
    schoolId: string;
    name: string;
}

export default function Create() {
    const { sid } = useParams();
    const isEdit = !!sid;
    const navigate = useNavigate();
    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [loading, setLoading] = useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Students', href: '/students' },
        { title: `${isEdit ? 'Edit' : 'Register'} Student`, href: '' },
    ];

    const { data, setData, post, patch, processing, errors } = useFormSpa({
        sid: '',
        sname: '',
        gender: '',
        address: '',
        dob: '',
        school: '',
        parentName: '',
        tpNo: '',
        watsapp: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const schoolsRes = await axios.get('/api/schools');
                setSchools(schoolsRes.data.schools || []);

                if (isEdit) {
                    const studentRes = await axios.get(`/api/students/${sid}/edit`);
                    const s = studentRes.data.student;
                    setData({
                        sid: s.sid || '',
                        sname: s.sname || '',
                        gender: s.gender || '',
                        address: s.address || '',
                        dob: s.dob || '',
                        school: s.school || '',
                        parentName: s.parentName || '',
                        tpNo: s.tpNo || '',
                        watsapp: s.watsapp || '',
                        isActive: s.isActive ?? true,
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Failed to retrieve necessary information.',
                    background: '#1e293b',
                    color: '#fff'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEdit, sid]);

    const handlePhoneInput = (field: 'tpNo' | 'watsapp', value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 10);
        setData(field, numericValue);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Student successfully ${isEdit ? 'updated' : 'registered'}`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/students');
            },
            onError: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Error',
                    text: err.response?.data?.message || 'Please check the form for errors.',
                    background: '#1e293b',
                    color: '#fff'
                });
            },
        };

        if (isEdit) {
            patch(`/api/students/${sid}`, options);
        } else {
            post('/api/students', options);
        }
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                    <UserPlus className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Preparing registration environment...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>{isEdit ? 'Edit Student' : 'Student Registration'} - iClass</title>
            </Helmet>
            
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/students')} className="text-white hover:bg-white/10">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {isEdit ? 'Edit Profile' : 'Student Registration'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Update existing student details and academic status.' : 'Register a new student into the management system.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <User className="h-5 w-5 text-indigo-400" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                    <Input
                                        placeholder="e.g. John Doe"
                                        required
                                        value={data.sname}
                                        onChange={(e) => setData('sname', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                    {errors.sname && <p className="text-[10px] text-rose-400">{errors.sname}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Gender</label>
                                    <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Residential Address</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter full residential address"
                                            required
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Date of Birth</label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            required
                                            value={data.dob}
                                            onChange={(e) => setData('dob', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Present School</label>
                                    <Select value={data.school} onValueChange={(v) => setData('school', v)}>
                                        <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                            <SelectValue placeholder="Select School" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="SCH_PRIVATE" className="text-indigo-400 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    Private Student
                                                </div>
                                            </SelectItem>
                                            {schools.filter(s => s.schoolId !== 'SCH_PRIVATE').map((school) => (
                                                <SelectItem key={school.schoolId} value={school.schoolId}>
                                                    {school.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-indigo-400" />
                                    Contact & Emergency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Parent / Guardian Name</label>
                                    <Input
                                        placeholder="Enter primary contact person"
                                        required
                                        value={data.parentName}
                                        onChange={(e) => setData('parentName', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Telephone Number</label>
                                    <Input
                                        placeholder="07xxxxxxxx"
                                        required
                                        value={data.tpNo}
                                        onChange={(e) => handlePhoneInput('tpNo', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">WhatsApp Number</label>
                                    <Input
                                        placeholder="07xxxxxxxx"
                                        required
                                        value={data.watsapp}
                                        onChange={(e) => handlePhoneInput('watsapp', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Actions and Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Status & Save</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div 
                                    onClick={() => setData('isActive', !data.isActive)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                        data.isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-white/10 opacity-60'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white">Active Status</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-tighter">Student can enroll in classes</span>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        data.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                                    }`}>
                                        {data.isActive && <CheckCircle2 className="h-4 w-4 text-white" />}
                                    </div>
                                </div>

                                {isEdit && (
                                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3">
                                        <Info className="h-5 w-5 text-indigo-400 shrink-0" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-white">System ID</span>
                                            <span className="font-mono text-xs text-indigo-300">{sid}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                                Saving...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-5 w-5" />
                                                {isEdit ? 'Update Profile' : 'Complete Registration'}
                                            </div>
                                        )}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => navigate('/students')}
                                        className="w-full text-white/40 hover:text-white hover:bg-white/5"
                                    >
                                        Cancel Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
