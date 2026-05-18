import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { MdPayment } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Wallet, ArrowRight, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Lecture {
    lid: string;
    lec_name: string;
    total_earned: number;
    total_paid: number;
    due_amount: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lecture Payments', href: '/lecture-payments' }];

export default function Index() {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [searchLecture, setSearchLecture] = useState('');
    const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await axios.get('/api/lecture-payments');
                setLectures(response.data.lectures || []);
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLectures();
    }, []);

    useEffect(() => {
        const searchQuery = searchLecture.toLowerCase();
        const filtered = lectures.filter(
            (lecture) => (lecture.lid?.toLowerCase() || '').includes(searchQuery) || (lecture.lec_name?.toLowerCase() || '').includes(searchQuery),
        );
        setFilteredLectures(filtered);
    }, [searchLecture, lectures]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Lecture Payments - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Lecturer Settlements</h1>
                    <p className="text-muted-foreground">Monitor and process monthly payments for the teaching staff.</p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <Search className="h-5 w-5 text-indigo-400" />
                                Find Lecturer
                            </CardTitle>
                            <div className="w-full md:w-72">
                                <Input
                                    placeholder="Search by ID or Name..."
                                    value={searchLecture}
                                    onChange={(e) => setSearchLecture(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-white h-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
                                <Wallet className="h-10 w-10 mb-4 opacity-20" />
                                <p>Loading payment records...</p>
                            </div>
                        ) : filteredLectures.length > 0 ? (
                            <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 text-white/60 font-bold uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-6 py-4">LID</th>
                                            <th className="px-6 py-4">Lecturer Name</th>
                                            <th className="px-6 py-4">Total Accrued</th>
                                            <th className="px-6 py-4">Total Paid</th>
                                            <th className="px-6 py-4">Balance Due</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/90">
                                        {filteredLectures.map((lecture) => (
                                            <tr key={lecture.lid} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4 font-mono text-indigo-400">{lecture.lid}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                                            <UserCheck className="h-4 w-4 text-indigo-300" />
                                                        </div>
                                                        <span className="font-semibold">{lecture.lec_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    Rs.{Number(lecture.total_earned ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-emerald-400 font-medium">
                                                    Rs.{Number(lecture.total_paid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${lecture.due_amount > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                                                        Rs.{Number(lecture.due_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button asChild size="sm" variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all">
                                                        <Link to={`/lecture-payments/create?lid=${lecture.lid}`} className="flex items-center gap-2">
                                                            <MdPayment className="h-4 w-4" />
                                                            Process Payment
                                                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
                                <div className="rounded-full bg-white/5 p-6 mb-4">
                                    <Search className="h-10 w-10 opacity-20" />
                                </div>
                                <h3 className="text-white font-medium mb-1">No lecturers found</h3>
                                <p className="text-sm">Try adjusting your search criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
