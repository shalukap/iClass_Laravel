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
import { Textarea } from '../../components/ui/textarea';
import { User, School, Phone, Calendar, MapPin, CheckCircle2, ChevronLeft, Save, Mail, GraduationCap, CreditCard, Car, Info, Briefcase } from 'lucide-react';

interface SchoolData {
    schoolId: string;
    name: string;
}

export default function CreateOrEdit() {
    const { lid } = useParams();
    const isEdit = !!lid;
    const navigate = useNavigate();
    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [loading, setLoading] = useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Lecture', href: '/lectures' },
        { title: `${isEdit ? 'Edit' : 'Add'} Lecturer`, href: '' },
    ];

    const { data, setData, post, patch, processing, errors } = useFormSpa({
        lid: '',
        lec_name: '',
        lec_address: '',
        lec_dob: '',
        qualification: '',
        tp_no: '',
        whatsapp_no: '',
        lec_email: '',
        status: true,
        is_employed: false,
        school_id: '',
        bank_account: '',
        bank_name: '',
        bank_branch: '',
        vehicle_no: '',
        subjects: [] as { grade: string; name: string }[],
    });

    const [subjectInput, setSubjectInput] = useState('');
    const [gradeInput, setGradeInput] = useState('');

    const addSubject = () => {
        if (subjectInput.trim() && gradeInput.trim()) {
            const exists = data.subjects.some(s => s.grade === gradeInput && s.name === subjectInput.trim());
            if (!exists) {
                setData('subjects', [...data.subjects, { grade: gradeInput, name: subjectInput.trim() }]);
                setSubjectInput('');
                // Keep gradeInput for easier multi-subject entry for same grade
            }
        }
    };

    const removeSubject = (grade: string, name: string) => {
        setData('subjects', data.subjects.filter(s => !(s.grade === grade && s.name === name)));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const schoolsRes = await axios.get('/api/schools');
                setSchools(schoolsRes.data.schools || []);

                if (isEdit) {
                    const lectureRes = await axios.get(`/api/lectures/${lid}/edit`);
                    const l = lectureRes.data.lecture;
                    setData({
                        lid: l.lid ?? '',
                        lec_name: l.lec_name ?? '',
                        lec_address: l.lec_address ?? '',
                        lec_dob: l.lec_dob ? l.lec_dob.split('T')[0] : '',
                        qualification: l.qualification ?? '',
                        tp_no: l.tp_no ?? '',
                        whatsapp_no: l.whatsapp_no ?? '',
                        lec_email: l.lec_email ?? '',
                        status: l.status ?? true,
                        is_employed: l.is_employed ?? false,
                        school_id: l.school_id ?? '',
                        bank_account: l.bank_account ?? '',
                        bank_name: l.bank_name ?? '',
                        bank_branch: l.bank_branch ?? '',
                        vehicle_no: l.vehicle_no ?? '',
                        subjects: Array.isArray(l.subjects) ? l.subjects : [],
                    });
                } else {
                    // Generate sequential ID for new lecturer
                    try {
                        const lecturesRes = await axios.get('/api/lectures');
                        const lectures = lecturesRes.data.lectures || [];
                        const nextNumber = (lectures.length + 1).toString().padStart(4, '0');
                        setData('lid', `LEC-${nextNumber}`);
                    } catch (idErr) {
                        // Fallback if list fetch fails
                        setData('lid', 'LEC-0001');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Load Failed',
                    text: 'Failed to retrieve faculty information.',
                    background: '#1e293b',
                    color: '#fff'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEdit, lid]);

    const handlePhoneInput = (field: string, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (field === 'tp_no' || field === 'whatsapp_no') {
            setData(field as any, numericValue.slice(0, 10));
        } else {
            setData(field as any, numericValue);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Lecturer profile ${isEdit ? 'updated' : 'created'} successfully`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/lectures');
            },
            onError: (err: any) => {
                const errorMsg = err.response?.data?.errors 
                    ? Object.values(err.response.data.errors).flat().join(' ')
                    : err.response?.data?.message || 'Please check the form for errors.';
                
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: errorMsg,
                    background: '#1e293b',
                    color: '#fff'
                });
            },
        };

        if (isEdit) {
            patch(`/api/lectures/${lid}`, options);
        } else {
            post('/api/lectures', options);
        }
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                    <User className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Initializing faculty record system...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>{isEdit ? 'Edit Lecturer' : 'Add Lecturer'} - iClass</title>
            </Helmet>
            
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/lectures')} className="text-white hover:bg-white/10">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {isEdit ? 'Edit Lecturer Profile' : 'Add New Lecturer'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Update qualifications and professional details.' : 'Register a new faculty member into the system.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal & Professional */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-indigo-400" />
                                    Professional Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest text-indigo-400">Lecturer ID (LID)</label>
                                    <Input
                                        placeholder="Generating..."
                                        required
                                        readOnly
                                        value={data.lid}
                                        className="h-12 bg-slate-800/50 border-white/5 text-indigo-300 font-mono cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Lecturer Name</label>
                                    <Input
                                        placeholder="e.g. Alexander Smith"
                                        required
                                        value={data.lec_name}
                                        onChange={(e) => setData('lec_name', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Qualifications</label>
                                    <Textarea
                                        placeholder="Enter academic and professional qualifications..."
                                        required
                                        rows={2}
                                        value={data.qualification}
                                        onChange={(e) => setData('qualification', e.target.value)}
                                        className="bg-slate-900 border-white/10 text-white min-h-[80px]"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-4">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Subjects & Grades Taught</label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <Select value={gradeInput} onValueChange={setGradeInput}>
                                                <SelectTrigger className="h-11 bg-slate-900 border-white/10 text-white">
                                                    <SelectValue placeholder="Select Grade" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'A/L Grade 12', 'A/L Grade 13'].map((g) => (
                                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-[2] flex gap-2">
                                            <Input
                                                placeholder="Enter subject (e.g. Mathematics)"
                                                value={subjectInput}
                                                onChange={(e) => setSubjectInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addSubject();
                                                    }
                                                }}
                                                className="h-11 bg-slate-900 border-white/10 text-white"
                                            />
                                            <Button 
                                                type="button" 
                                                onClick={addSubject}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 h-11"
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {data.subjects.map((sub, idx) => (
                                            <div 
                                                key={idx} 
                                                className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-sm font-medium animate-in zoom-in-50 duration-200"
                                            >
                                                <span className="text-white/40 text-[10px] uppercase font-bold mr-1">{sub.grade}</span>
                                                {sub.name}
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeSubject(sub.grade, sub.name)}
                                                    className="ml-1 hover:text-white transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {data.subjects.length === 0 && (
                                            <p className="text-white/20 text-xs italic">No subjects or grades added yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            placeholder="alex@example.com"
                                            required
                                            value={data.lec_email}
                                            onChange={(e) => setData('lec_email', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Date of Birth</label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            required
                                            value={data.lec_dob}
                                            onChange={(e) => setData('lec_dob', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Contact Address</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter residential or office address"
                                            required
                                            value={data.lec_address}
                                            onChange={(e) => setData('lec_address', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial & Logistics */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-indigo-400" />
                                    Financial & Logistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Bank Name</label>
                                    <Input
                                        placeholder="e.g. Bank of Ceylon"
                                        value={data.bank_name}
                                        onChange={(e) => setData('bank_name', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Branch Name</label>
                                    <Input
                                        placeholder="e.g. Colombo Fort"
                                        value={data.bank_branch}
                                        onChange={(e) => setData('bank_branch', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Account Number</label>
                                    <Input
                                        placeholder="Enter account number"
                                        value={data.bank_account}
                                        onChange={(e) => handlePhoneInput('bank_account', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Vehicle Number</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="ABC-1234"
                                            value={data.vehicle_no}
                                            onChange={(e) => setData('vehicle_no', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white"
                                        />
                                        <Car className="absolute left-3 top-3.5 h-4 w-4 text-white/20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Employment & Contact */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Employment & Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">TP Number</label>
                                    <Input
                                        placeholder="07xxxxxxxx"
                                        required
                                        value={data.tp_no}
                                        onChange={(e) => handlePhoneInput('tp_no', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">WhatsApp Number</label>
                                    <Input
                                        placeholder="07xxxxxxxx"
                                        required
                                        value={data.whatsapp_no}
                                        onChange={(e) => handlePhoneInput('whatsapp_no', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    <div 
                                        onClick={() => setData('is_employed', !data.is_employed)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                            data.is_employed ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900 border-white/10 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className={`h-5 w-5 ${data.is_employed ? 'text-indigo-400' : 'text-white/20'}`} />
                                            <span className="font-bold text-white text-sm">Employed</span>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${data.is_employed ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                                            {data.is_employed && <CheckCircle2 className="h-3 w-3 text-white" />}
                                        </div>
                                    </div>

                                    {data.is_employed && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Assign School</label>
                                            <Select value={data.school_id} onValueChange={(v) => setData('school_id', v)}>
                                                <SelectTrigger className="h-12 bg-slate-900 border-white/10 text-white">
                                                    <SelectValue placeholder="Select School" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    {schools.map((school) => (
                                                        <SelectItem key={school.schoolId} value={school.schoolId}>
                                                            {school.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div 
                                        onClick={() => setData('status', !data.status)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                            data.status ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm">Active Status</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-tighter">Availability in system</span>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${data.status ? 'bg-emerald-500 border-emerald-500' : 'bg-rose-500 border-rose-500'}`}>
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all"
                                    >
                                        {processing ? 'Saving...' : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-5 w-5" />
                                                {isEdit ? 'Update Profile' : 'Save Lecturer'}
                                            </div>
                                        )}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        onClick={() => navigate('/lectures')}
                                        className="w-full text-white/40 hover:text-white hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {isEdit && (
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 opacity-60">
                                <Info className="h-5 w-5 text-indigo-400 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-white">LID</span>
                                    <span className="font-mono text-xs text-indigo-300">{lid}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
