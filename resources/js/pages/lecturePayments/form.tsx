import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useFormSpa } from '@/hooks/use-form-spa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Banknote, User, Calendar, CheckCircle2, AlertCircle, ChevronRight, GraduationCap } from 'lucide-react';

interface Class {
    cid: string;
    name: string;
    total_earned: number;
    total_paid: number;
    due_amount: number;
    student_count: number;
}

interface PageData {
    lecture: {
        lid: string;
        lec_name: string;
    };
    classes: Class[];
    last_payment_date: string | null;
    current_year: number;
    current_month: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Lecture Payments', href: '/lecture-payments' },
    { title: 'Make Payment', href: '' },
];

export default function PaymentForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const lid = searchParams.get('lid');

    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    const { data, setData, post, processing, errors } = useFormSpa({
        lid: '',
        cids: [] as string[],
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        amount: '',
    });

    useEffect(() => {
        if (!lid) {
            Swal.fire({
                icon: 'error',
                title: 'ID Missing',
                text: 'Lecture ID is required',
                background: '#1e293b',
                color: '#fff'
            });
            navigate('/lecture-payments');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/lecture-payments/create?lid=${lid}`);
                setPageData(response.data);
                setData('lid', response.data.lecture.lid);
                setData('year', response.data.current_year);
                setData('month', response.data.current_month);
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to fetch lecture data',
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/lecture-payments');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [lid]);

    const toggleClassSelection = (cid: string) => {
        if (data.cids.includes(cid)) {
            setData('cids', data.cids.filter((id) => id !== cid));
        } else {
            setData('cids', [...data.cids, cid]);
        }
    };

    const selectAllClasses = () => {
        if (pageData) {
            setData('cids', pageData.classes.map(cls => cls.cid));
        }
    };

    const clearAllClasses = () => {
        setData('cids', []);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.cids.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Selection',
                text: 'Please select at least one class to proceed',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        post('/api/lecture-payments', {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Payment recorded successfully',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/lecture-payments');
            },
            onError: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: err.response?.data?.message || 'Please check the form for errors',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        });
    };

    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
    ];

    if (loading || !pageData) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                    <Banknote className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Loading lecturer payment profile...</p>
                </div>
            </AppLayout>
        );
    }

    const years = Array.from({ length: 10 }, (_, i) => pageData.current_year - 5 + i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Lecturer Payment - {pageData.lecture.lec_name}</title>
            </Helmet>
            
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Process Settlement</h1>
                    <p className="text-muted-foreground">Record monthly earnings and class settlements for teaching staff.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Summary and Settings */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Lecturer Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                                        <GraduationCap className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white text-lg leading-none mb-1">{pageData.lecture.lec_name}</span>
                                        <span className="font-mono text-xs text-white/40 uppercase">{pageData.lecture.lid}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
                                    <span className="text-[10px] text-indigo-400 font-bold uppercase">Last Settlement</span>
                                    <p className="text-sm text-white/60">{pageData.last_payment_date || 'No history recorded'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-white/40">Payment Period</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase px-1">Billing Year</label>
                                    <Select value={data.year.toString()} onValueChange={(value) => setData('year', parseInt(value))}>
                                        <SelectTrigger className="h-11 bg-slate-900 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-white/40 font-bold uppercase px-1">Billing Month</label>
                                    <Select value={data.month.toString()} onValueChange={(value) => setData('month', parseInt(value))}>
                                        <SelectTrigger className="h-11 bg-slate-900 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {months.map((month) => (
                                                <SelectItem key={month.value} value={month.value.toString()}>{month.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 pt-2">
                                    <label className="text-[10px] text-indigo-400 font-bold uppercase px-1">Amount per Class (Rs.)</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="h-12 pl-10 bg-slate-900 border-white/10 text-white font-bold"
                                        />
                                        <span className="absolute left-3 top-3 text-white/20 font-bold">Rs.</span>
                                    </div>
                                    {errors.amount && <p className="text-[10px] text-rose-400 mt-1">{errors.amount}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Class Selection and Submit */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                                    Select Target Classes
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={selectAllClasses} className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">Select All</Button>
                                    <Button size="sm" variant="ghost" onClick={clearAllClasses} className="text-xs text-white/40 hover:text-white hover:bg-white/10">Clear</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-6">
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {pageData.classes.length > 0 ? (
                                        pageData.classes.map((cls) => (
                                            <div 
                                                key={cls.cid} 
                                                onClick={() => toggleClassSelection(cls.cid)}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                                    data.cids.includes(cls.cid) 
                                                    ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/5' 
                                                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-all ${
                                                        data.cids.includes(cls.cid) ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 bg-slate-900'
                                                    }`}>
                                                        {data.cids.includes(cls.cid) && <CheckCircle2 className="h-4 w-4 text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{cls.name}</p>
                                                        <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase font-medium">
                                                            <span>ID: {cls.cid}</span>
                                                            <span className="h-1 w-1 rounded-full bg-white/20" />
                                                            <span>{cls.student_count} Students</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-white/20 font-bold uppercase mb-0.5">Accrued Due</p>
                                                    <p className="font-bold text-indigo-400">Rs.{Number(cls.due_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                                            <AlertCircle className="h-12 w-12 mb-4" />
                                            <p className="font-medium">No class settlements pending for this lecturer.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col gap-1 text-center sm:text-left">
                                        <span className="text-[10px] text-white/40 font-bold uppercase">Total Classes Selected</span>
                                        <span className="text-2xl font-bold text-white">{data.cids.length} <span className="text-sm font-medium text-white/40">of {pageData.classes.length}</span></span>
                                    </div>
                                    <Button 
                                        onClick={(e: any) => handleSubmit(e)}
                                        disabled={processing || data.cids.length === 0 || !data.amount}
                                        className="h-14 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all disabled:opacity-50 min-w-[240px]"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Confirm Settlement
                                                <ChevronRight className="h-5 w-5" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
