import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Calendar, FileText, Download, TrendingUp, Receipt, Filter, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Collection {
  pid: string;
  sid: string;
  sname: string;
  student: { sname: string };
  class: { name: string };
  amount: number;
  payment_date: string;
  month: number;
  year: number;
}

interface Summary {
  total_amount: number;
  total_count: number;
  start_date: string;
  end_date: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Reports', href: '#' },
  { title: 'Collection Report', href: '/reports/collection' },
];

export default function CollectionReport() {
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(today);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [deletedCollections, setDeletedCollections] = useState<Collection[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/reports/collection?start_date=${startDate}&end_date=${endDate}`);
      setCollections(response.data.collections);
      setDeletedCollections(response.data.deleted_collections);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownloadPdf = () => {
    window.open(`/api/reports/collection/pdf?start_date=${startDate}&end_date=${endDate}`, '_blank');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Helmet>
        <title>Daily Collection Report - iClass</title>
      </Helmet>
      
      <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                    <FileText className="h-8 w-8 text-indigo-500" />
                    Collection Report
                </h1>
                <p className="text-muted-foreground text-sm font-medium">Analyze and audit student fee collections by date range.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button 
                    onClick={handleDownloadPdf}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 font-bold h-11 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                >
                    <Download className="h-4 w-4" />
                    Export PDF
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => window.print()}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-11 px-6 rounded-xl flex items-center gap-2"
                >
                    <Printer className="h-4 w-4" />
                    Print
                </Button>
            </div>
        </div>

        {/* Filter Section */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] py-4">
                <CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Report Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Start Date</label>
                        <div className="relative">
                            <Input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-black/40 border-white/10 text-white h-12 rounded-xl pl-10 focus:ring-2 focus:ring-indigo-500"
                            />
                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">End Date</label>
                        <div className="relative">
                            <Input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-black/40 border-white/10 text-white h-12 rounded-xl pl-10 focus:ring-2 focus:ring-indigo-500"
                            />
                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                        </div>
                    </div>
                    <Button 
                        onClick={fetchReport}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all"
                    >
                        <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Generate Report
                    </Button>
                </div>
            </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden relative group">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl">
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md">Growth</span>
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-1">Total Collected</span>
                    <h3 className="text-3xl font-black text-white leading-none">
                        Rs. {summary?.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </h3>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all" />
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden relative group">
                <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl">
                            <Receipt className="h-6 w-6 text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400/40 uppercase tracking-widest bg-indigo-500/5 px-2 py-1 rounded-md">Volume</span>
                    </div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block mb-1">Transactions</span>
                    <h3 className="text-3xl font-black text-white leading-none">
                        {summary?.total_count || 0}
                    </h3>
                </CardContent>
                <div className="absolute bottom-0 left-0 h-1 w-full bg-indigo-500/20 group-hover:bg-indigo-500/60 transition-all" />
            </Card>

            <Card className="hidden lg:block border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden relative group border-dashed">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Selected Range</p>
                    <p className="text-sm font-bold text-white/60">
                        {new Date(startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} — {new Date(endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Data Table */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] py-6 px-8">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        Collection Details
                    </CardTitle>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{collections.length} Entries found</span>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/40">
                        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">Aggregating Financial Data...</p>
                    </div>
                ) : collections.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-white/40 font-black uppercase tracking-widest text-[10px] h-14 pl-8">Date</TableHead>
                                    <TableHead className="text-white/40 font-black uppercase tracking-widest text-[10px] h-14">Student</TableHead>
                                    <TableHead className="text-white/40 font-black uppercase tracking-widest text-[10px] h-14">Class</TableHead>
                                    <TableHead className="text-white/40 font-black uppercase tracking-widest text-[10px] h-14">Period</TableHead>
                                    <TableHead className="text-white/40 font-black uppercase tracking-widest text-[10px] h-14 pr-8 text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {collections.map((pay) => (
                                    <TableRow key={pay.pid} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <span className="text-xs font-bold text-white/80">{new Date(pay.payment_date).toLocaleDateString()}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{pay.student?.sname || 'Unknown'}</span>
                                                <span className="text-[10px] font-mono text-white/30 uppercase">{pay.sid}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-medium text-white/60">{pay.class?.name || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-bold text-indigo-400/60 bg-indigo-500/5 px-2 py-1 rounded-md">{pay.month}/{pay.year}</span>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <span className="text-sm font-black text-white">Rs. {Number(pay.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-4">
                            <FileText className="h-10 w-10 text-white/10" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">No data available</h3>
                        <p className="text-white/40 text-xs max-w-xs mx-auto">
                            No collections were recorded between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Deleted Receipts Table */}
        {deletedCollections.length > 0 && (
            <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-red-500/5 bg-red-500/[0.02] py-6 px-8">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-red-400" />
                            Deleted Receipts
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-red-400/40 uppercase tracking-widest">
                                Total Deleted: Rs. {summary?.deleted_amount?.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{deletedCollections.length} Deleted items</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-red-500/5">
                                <TableRow className="border-red-500/10 hover:bg-transparent">
                                    <TableHead className="text-red-400/40 font-black uppercase tracking-widest text-[10px] h-14 pl-8">Date</TableHead>
                                    <TableHead className="text-red-400/40 font-black uppercase tracking-widest text-[10px] h-14">Student</TableHead>
                                    <TableHead className="text-red-400/40 font-black uppercase tracking-widest text-[10px] h-14">Class</TableHead>
                                    <TableHead className="text-red-400/40 font-black uppercase tracking-widest text-[10px] h-14">Reason</TableHead>
                                    <TableHead className="text-red-400/40 font-black uppercase tracking-widest text-[10px] h-14 pr-8 text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deletedCollections.map((pay) => (
                                    <TableRow key={pay.pid} className="border-red-500/5 hover:bg-red-500/[0.03] transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <span className="text-xs font-bold text-red-400/60 line-through">{new Date(pay.payment_date).toLocaleDateString()}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-red-400/80 line-through">{pay.student?.sname || 'Unknown'}</span>
                                                <span className="text-[10px] font-mono text-red-400/30 uppercase">{pay.sid}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-medium text-red-400/40 line-through">{pay.class?.name || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-bold text-red-400/70">{pay.delete_reason || 'No reason provided'}</span>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <span className="text-sm font-black text-red-400/60 line-through">Rs. {Number(pay.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
