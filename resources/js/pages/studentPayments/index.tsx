import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { MdPayment } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Student {
  sid: string;
  sname: string;
  image: string;
  due_amount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Student Payments', href: '/student-payments' },
];

export default function Index() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/student-payments');
        setStudents(response.data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const searchQuery = searchStudent.toLowerCase();
    const filtered = students.filter(
      (student) =>
        (student.sid?.toLowerCase() || '').includes(searchQuery) ||
        (student.sname?.toLowerCase() || '').includes(searchQuery)
    );
    setFilteredStudents(filtered);
  }, [searchStudent, students]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Helmet>
        <title>Student Fees Management - iClass</title>
      </Helmet>
      
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Student Payments</h1>
            <p className="text-muted-foreground">Manage student enrollments, fees, and collection history.</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                        <Search className="h-5 w-5 text-indigo-400" />
                        Quick Search
                    </CardTitle>
                    <div className="w-full md:w-80 relative">
                        <Input
                            placeholder="Enter Student ID or Full Name..."
                            value={searchStudent}
                            onChange={(e) => setSearchStudent(e.target.value)}
                            className="bg-slate-900 border-white/10 text-white h-11 pl-10 focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-3 h-5 w-5 text-white/20" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                        <p>Accessing student records...</p>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden overflow-x-auto shadow-2xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-5">Student Details</th>
                                    <th className="px-6 py-5">Student ID</th>
                                    <th className="px-6 py-5">Fee Balance</th>
                                    <th className="px-6 py-5 text-right">Collection</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white/80">
                                {filteredStudents.map((student) => (
                                    <tr key={student.sid} className="hover:bg-white/[0.03] transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-indigo-500/10">
                                                    <AvatarImage src={student.image} />
                                                    <AvatarFallback className="bg-indigo-500/20 text-indigo-300 font-bold">
                                                        {student.sname.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">{student.sname}</span>
                                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter flex items-center gap-1">
                                                        <GraduationCap className="h-2.5 w-2.5" />
                                                        Registered Student
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-indigo-400">
                                                {student.sid}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-base font-bold ${student.due_amount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                    Rs.{student.due_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '0.00'}
                                                </span>
                                                {student.due_amount > 0 && (
                                                    <span className="text-[10px] text-rose-400/60 font-medium flex items-center gap-1">
                                                        <AlertCircle className="h-2.5 w-2.5" />
                                                        Outstanding Balance
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 group/btn h-9 px-5">
                                                <Link to={`/student-payments/create?sid=${student.sid}`} className="flex items-center gap-2">
                                                    <MdPayment className="h-4 w-4" />
                                                    <span className="font-bold">Pay Now</span>
                                                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                            <User className="h-8 w-8 text-white/20" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">No results found</h3>
                        <p className="text-white/40 max-w-xs mx-auto">
                            We couldn't find any students matching "{searchStudent}". Try searching with a valid ID or name.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
