import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Helmet } from 'react-helmet-async';
import { type BreadcrumbItem } from '@/types';
import Swal from 'sweetalert2';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormSpa } from '@/hooks/use-form-spa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, User, Calendar, ArrowLeft, CheckCircle2, Coins, Trash2, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface Class {
  cid: string;
  name: string;
  initial_fee: number;
  due_amount: number;
}

interface Receipt {
  pid: string;
  class_name: string;
  amount: number;
  date: string;
  period: string;
}

interface ExistingPayment {
  cid: string;
  year: number;
  month: number;
}

interface OutstandingItem {
  cid: string;
  class_name: string;
  year: number;
  month: number;
  month_name: string;
  due: number;
}

interface PaymentData {
  student: {
    sid: string;
    sname: string;
  };
  classes: Class[];
  existing_payments: ExistingPayment[];
  history: Receipt[];
  outstanding_summary: OutstandingItem[];
  last_payment_date: string | null;
  current_year: number;
  current_month: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Student Payments', href: '/student-payments' },
  { title: 'Payment Dashboard', href: '' },
];

export default function PaymentForm() {
  const [searchParams] = useSearchParams();
  const sid = searchParams.get('sid')?.trim();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const { data, setData, processing } = useFormSpa({
    sid: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    cid: '',
  });

  const groupedOutstanding = useMemo(() => {
    if (!paymentData) return {};
    return paymentData.outstanding_summary.reduce((acc, item) => {
      if (!acc[item.cid]) {
        acc[item.cid] = {
          name: item.class_name,
          items: [],
          total: 0
        };
      }
      acc[item.cid].items.push(item);
      acc[item.cid].total += Number(item.due);
      return acc;
    }, {} as Record<string, {name: string, items: OutstandingItem[], total: number}>);
  }, [paymentData]);

  const currentPeriodHistory = useMemo(() => {
    if (!paymentData) return [];
    const periodStr = `${data.month}/${data.year}`;
    return paymentData.history.filter(r => r.period === periodStr);
  }, [paymentData, data.month, data.year]);

  const totalPaidCurrent = useMemo(() => {
    return currentPeriodHistory.reduce((sum, r) => sum + Number(r.amount), 0);
  }, [currentPeriodHistory]);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkPayments, setBulkPayments] = useState<{cid: string, name: string, amount: number, max: number}[]>([]);

  const fetchData = async () => {
    if (!sid) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/student-payments/create?sid=${sid}&year=${data.year}&month=${data.month}`);
      setPaymentData(response.data);
      if (data.sid !== response.data.student.sid) {
        setData(prev => ({
          ...prev,
          sid: response.data.student.sid,
          year: response.data.current_year,
          month: response.data.current_month
        }));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Failed to load student data.',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sid, data.month, data.year]);

  const openBulkModal = () => {
    const payments = paymentData?.classes
      .filter(c => Number(c.due_amount) > 0)
      .map(c => ({
        cid: c.cid,
        name: c.name,
        amount: Number(c.due_amount),
        max: Number(c.due_amount)
      })) || [];
    setBulkPayments(payments);
    setIsBulkModalOpen(true);
  };

  const handleBulkPaymentChange = (cid: string, val: string) => {
    const amount = parseFloat(val) || 0;
    setBulkPayments(prev => prev.map(p => p.cid === cid ? { ...p, amount } : p));
  };

  const submitBulkPayment = async () => {
    const validPayments = bulkPayments.filter(p => p.amount > 0);
    if (validPayments.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        sid: sid,
        payments: validPayments.map(p => ({
          cid: p.cid,
          year: data.year,
          month: data.month,
          amount: p.amount
        }))
      };

      const res = await axios.post('/api/student-payments/bulk', payload);
      
      Swal.fire({
        icon: 'success',
        title: 'Payments Processed',
        text: res.data.message,
        background: '#1e293b',
        color: '#fff'
      });
      setIsBulkModalOpen(false);
      fetchData(); // Refresh data instead of navigate
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.response?.data?.message || 'Something went wrong',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReceipt = async (pid: string) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: 'Delete Receipt?',
      text: "Please provide a reason for deleting this receipt:",
      input: 'text',
      inputPlaceholder: 'Enter reason here...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#ef4444',
      background: '#1e293b',
      color: '#fff',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a reason!'
        }
      }
    });

    if (isConfirmed && reason) {
      setLoading(true);
      try {
        await axios.delete(`/api/student-payments/${pid}`, {
          data: { reason }
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Receipt has been removed.',
          background: '#1e293b',
          color: '#fff'
        });
        fetchData();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.response?.data?.message || 'Could not delete receipt',
          background: '#1e293b',
          color: '#fff'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || !paymentData) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                <Wallet className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-muted-foreground">Syncing student financial records...</p>
            </div>
        </AppLayout>
    );
  }

  const months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => paymentData.current_year - 5 + i);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Helmet>
        <title>Payment Dashboard - {paymentData.student.sname}</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/student-payments')} className="text-white hover:bg-white/10">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-white">Payment Dashboard</h1>
                    <p className="text-sm text-white/40">Real-time financial overview for {paymentData.student.sname}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Transaction Sidebar (Now contains everything) */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-6">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-400" />
                            Student Transaction Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">Full Name</span>
                                <span className="text-lg font-bold text-white leading-tight">{paymentData.student.sname}</span>
                            </div>
                            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block mb-1">System ID</span>
                                <span className="font-mono text-white/80">{paymentData.student.sid}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Year</span>
                                <Select value={data.year.toString()} onValueChange={(value) => setData('year', parseInt(value))}>
                                    <SelectTrigger className="h-10 bg-black/40 border-white/10 text-white text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {years.map((year) => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Month</span>
                                <Select value={data.month.toString()} onValueChange={(value) => setData('month', parseInt(value))}>
                                    <SelectTrigger className="h-10 bg-black/40 border-white/10 text-white text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {months.map((month) => <SelectItem key={month.value} value={month.value.toString()}>{month.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Arrears by Subject</span>
                                <span className="text-[10px] text-white/20 uppercase font-black">{Object.keys(groupedOutstanding).length} Subjects</span>
                            </div>
                            
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(groupedOutstanding).map(([cid, group]) => (
                                    <div key={cid} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                                        <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-xs font-black text-indigo-300 uppercase tracking-tight">{group.name}</span>
                                            <span className="text-xs font-black text-white/40">Total: Rs. {group.total.toLocaleString()}</span>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            {group.items.map((item, idx) => (
                                                <button 
                                                    key={`${item.cid}-${item.year}-${item.month}-${idx}`}
                                                    type="button"
                                                    onClick={() => {
                                                        setData(prev => ({
                                                            ...prev,
                                                            year: item.year,
                                                            month: item.month,
                                                            cid: item.cid
                                                        }));
                                                    }}
                                                    className={`w-full text-left p-2 rounded-lg transition-all flex justify-between items-center ${
                                                        data.cid === item.cid && data.year === item.year && data.month === item.month
                                                            ? 'bg-indigo-600/40 text-white'
                                                            : 'hover:bg-white/5 text-white/60'
                                                    }`}
                                                >
                                                    <span className="text-[11px] font-medium">{item.month_name} {item.year}</span>
                                                    <span className="text-[11px] font-mono font-bold">Rs. {Number(item.due).toLocaleString()}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                {paymentData.outstanding_summary.length === 0 && (
                                    <div className="py-8 text-center bg-emerald-500/5 rounded-2xl border border-dashed border-emerald-500/20">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500/40 mx-auto mb-2" />
                                        <p className="text-[11px] text-emerald-400/60 font-bold uppercase">No Arrears Found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Total Arrears</span>
                                <span className="text-xl font-black text-white">
                                    Rs. {paymentData.classes.reduce((sum, cls) => sum + Number(cls.due_amount), 0).toLocaleString()}
                                </span>
                            </div>
                            
                            <Button 
                                onClick={openBulkModal}
                                disabled={paymentData.classes.every(c => Number(c.due_amount) === 0)}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all active:scale-95"
                            >
                                <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                Process New Payment
                            </Button>
                        </div>

                        <div className="pt-8 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-white/40" />
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                                        Collection for {months.find(m => m.value === data.month)?.name} {data.year}
                                    </span>
                                </div>
                                <span className="text-[10px] text-white/20 font-black uppercase">{currentPeriodHistory.length} Records</span>
                            </div>
                            
                            <div className="space-y-3">
                                {currentPeriodHistory.map((receipt) => (
                                    <div key={receipt.pid} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-indigo-400 font-mono">{receipt.pid}</span>
                                                    <span className="text-[10px] text-white/20">•</span>
                                                    <span className="text-[10px] text-white/40 font-bold">{receipt.period}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{receipt.class_name}</span>
                                                <span className="text-[10px] text-white/20 font-medium">{new Date(receipt.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-sm font-black text-emerald-400">Rs. {Number(receipt.amount).toLocaleString()}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteReceipt(receipt.pid)}
                                                    className="h-8 w-8 text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors" />
                                    </div>
                                ))}
                                
                                {currentPeriodHistory.length === 0 && (
                                    <div className="py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <History className="h-8 w-8 text-white/10 mx-auto mb-3" />
                                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">No Collection Found for this Period</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Status Overview or Receipt Preview Placeholder */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden rounded-3xl">
                    <CardHeader className="bg-indigo-500/5 p-6 border-b border-white/5">
                        <CardTitle className="text-xs font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-indigo-400" />
                            Financial Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block mb-1">Total Paid</span>
                                <span className="text-lg font-black text-white">Rs. {totalPaidCurrent.toLocaleString()}</span>
                            </div>
                            <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest block mb-1">Total Owed</span>
                                <span className="text-lg font-black text-white">Rs. {paymentData.classes.reduce((sum, cls) => sum + Number(cls.due_amount), 0).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Enrollment Status</span>
                            {paymentData.classes.map(cls => (
                                <div key={cls.cid} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${Number(cls.due_amount) === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                        <span className="text-xs font-bold text-white/80">{cls.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-white/40 uppercase font-black">
                                        {Number(cls.due_amount) === 0 ? 'Up to date' : 'Arrears'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Last Payment Insight */}
                {paymentData.last_payment_date && (
                    <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-3xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col gap-2">
                            <span className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Last Activity Recorded</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-white">{new Date(paymentData.last_payment_date).toLocaleDateString(undefined, { day: 'numeric' })}</span>
                                <div className="flex flex-col mb-1">
                                    <span className="text-xs font-black text-white/80 uppercase">{new Date(paymentData.last_payment_date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                    <span className="text-[10px] text-white/40 font-mono">{new Date(paymentData.last_payment_date).getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                        <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Bulk Payment Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="max-w-2xl bg-[#0f172a] border-white/10 text-white rounded-3xl p-8">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                        <Coins className="h-6 w-6 text-indigo-400" />
                    </div>
                    Process Payment
                </DialogTitle>
                <DialogDescription className="text-white/40 mt-2">
                    Enter payment amounts for <b>{months.find(m => m.value === data.month)?.name} {data.year}</b>.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {bulkPayments.map((p) => (
                    <div key={p.cid} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{p.name}</span>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Max Due: Rs. {p.max.toLocaleString()}</span>
                        </div>
                        <div className="relative w-40">
                            <Input
                                type="number"
                                value={p.amount}
                                onChange={(e) => handleBulkPaymentChange(p.cid, e.target.value)}
                                className="h-12 pl-10 bg-black/40 border-white/10 text-white font-bold rounded-xl text-right pr-4"
                            />
                            <span className="absolute left-3 top-3 text-white/20 font-bold">Rs.</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black text-white">
                        Rs. {bulkPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex flex-col items-end opacity-40">
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Subjects</span>
                    <span className="text-xl font-black text-white">{bulkPayments.filter(p => p.amount > 0).length}</span>
                </div>
            </div>

            <DialogFooter className="gap-3">
                <Button variant="ghost" onClick={() => setIsBulkModalOpen(false)} className="h-12 px-8 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-bold">
                    Cancel
                </Button>
                <Button 
                    onClick={submitBulkPayment}
                    disabled={processing || bulkPayments.reduce((sum, p) => sum + p.amount, 0) <= 0}
                    className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 flex items-center gap-2"
                >
                    {processing ? 'Processing...' : 'Confirm Payment'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
