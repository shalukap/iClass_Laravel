import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

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

export default function LectureClasses({ allClasses: initialClasses = [] }: { allClasses?: Class[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Lecture Classes',
            href: route('lecture-payments.classes'),
        },
    ];

    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [matchedLectures, setMatchedLectures] = useState<LectureBasic[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'name'>('id');
    const [selectedLectureId, setSelectedLectureId] = useState('');

    const { data, setData } = useForm({
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
        // Prepare search parameters only if they have value
        const params: any = {};
        const term = data.searchTerm.trim();

        if (!term) {
            Swal.fire('Info', 'Please enter a search term', 'info');
            setLoading(false);
            return;
        }

        if (searchType === 'id') {
            params.lid = term;
        } else if (searchType === 'name') {
            params.name = term;
        }

        const response = await axios.get(`/lecture-enrollments/search`, { params });

        // If searching by ID
        if (searchType === 'id' && response.data.lecture) {
            setLecture(response.data.lecture);
            setStudents(response.data.students || []);
            setSelectedLectureId(response.data.lecture.lid);

        // If searching by Name
        } else if (searchType === 'name' && response.data.lectures) {
            const lectures = response.data.lectures;
            setMatchedLectures(lectures);

            if (lectures.length === 1) {
                // Auto-select if only one match
                fetchLectureDetails(lectures[0].lid);
            } else if (lectures.length === 0) {
                Swal.fire('Info', 'No lectures found', 'info');
            }
        } else {
            Swal.fire('Info', response.data.message || 'No lectures found', 'info');
        }

    } catch (error: any) {
        if (error.response?.status === 404) {
            Swal.fire('Info', error.response.data.message || 'Lecture not found', 'info');
        } else {
            Swal.fire('Error', error.response?.data?.message || 'An error occurred', 'error');
        }
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
        } else {
            Swal.fire('Info', 'Lecture details not found', 'info');
        }
    } catch (error: any) {
        if (error.response?.status === 404) {
            Swal.fire('Info', error.response.data.message || 'Lecture not found', 'info');
        } else {
            Swal.fire('Error', error.response?.data?.message || 'Failed to fetch lecture details', 'error');
        }
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
            <Head title="Lecture Classes" />
            <div className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-semibold">Lecture Classes and Payments</h2>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="mb-4 flex gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Search by:</label>
                            <select
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value as 'id' | 'name');
                                    setMatchedLectures([]);
                                    setLecture(null);
                                    setStudents([]);
                                }}
                                className="rounded-md border border-gray-300 bg-slate-800 px-3 py-2 text-white"
                            >
                                <option value="id">Lecture ID</option>
                                <option value="name">Lecture Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="searchTerm"
                            placeholder={searchType === 'id' ? "Enter Lecture ID (LID)" : "Enter Lecture Name"}
                            required
                            value={data.searchTerm}
                            onChange={(e) => setData('searchTerm', e.target.value)}
                            className="flex-1"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {matchedLectures.length > 0 && (
                    <div className="mb-6 rounded-lg bg-slate-700 p-4">
                        <h3 className="mb-3 text-lg font-semibold">Multiple Lectures Found</h3>
                        <p className="mb-3 text-sm text-gray-300">Please select a lecture from the list:</p>
                        <select
                            value={selectedLectureId}
                            onChange={handleLectureSelect}
                            className="w-full rounded-md border border-gray-300 bg-slate-800 px-3 py-2 text-white"
                        >
                            <option value="">-- Select Lecture --</option>
                            {matchedLectures.map((lec) => (
                                <option key={lec.lid} value={lec.lid}>
                                    {lec.lec_name} ({lec.lid})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {lecture && (
                    <div className="mb-8 rounded-lg bg-slate-700 p-4">
                        <h3 className="mb-4 text-xl font-semibold">Lecture Information</h3>
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <p>
                                    <span className="font-semibold">LID:</span> {lecture.lid}
                                </p>
                                <p>
                                    <span className="font-semibold">Name:</span> {lecture.lec_name}
                                </p>
                            </div>
                        </div>

                        <h3 className="mb-4 text-xl font-semibold">Classes Teaching</h3>
                        {lecture.classes && lecture.classes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {lecture.classes.map((cls) => (
                                    <div key={cls.cid} className="rounded-lg bg-slate-600 p-4">
                                        <div className="mb-2 flex justify-between">
                                            <span className="font-semibold">Class:</span>
                                            <span>
                                                {cls.name} ({cls.cid})
                                            </span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="font-semibold">Medium/Syllabus:</span>
                                            <span>
                                                {cls.medium} - {cls.syllabus}
                                            </span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
                                            <span className="font-semibold">Students:</span>
                                            <span>{cls.student_count}</span>
                                        </div>
                                        <div className="mb-2 flex justify-between">
    <span className="font-semibold">Total Earned (75%):</span>
    <span>Rs.{Number(cls.total_earned).toFixed(2)}</span>
</div>
<div className="mb-2 flex justify-between">
    <span className="font-semibold">Total Paid:</span>
    <span>Rs.{Number(cls.total_paid).toFixed(2)}</span>
</div>
{cls.due_amount > 0 ? (
    <div className="mb-2 flex justify-between">
        <span className="font-semibold">Due Amount:</span>
        <span className="text-red-400">Rs.{Number(cls.due_amount).toFixed(2)}</span>
    </div>
) : (
    <div className="mb-2 flex justify-between">
        <span className="font-semibold">Status:</span>
        <span className="text-green-400">Paid in Full</span>
    </div>
)}
{cls.overpaid_amount > 0 && (
    <div className="mb-2 flex justify-between">
        <span className="font-semibold">Overpaid:</span>
        <span className="text-yellow-400">Rs.{Number(cls.overpaid_amount).toFixed(2)}</span>
    </div>
)}

                                        <h4 className="mt-4 mb-2 text-lg font-semibold">Students in Class</h4>
                                        <div className="rounded-md bg-slate-700 p-3">
                                            {students.filter((s) => s.cid === cls.cid).length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-600">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2 text-left">SID</th>
                                                            <th className="px-4 py-2 text-left">Name</th>
                                                            <th className="px-4 py-2 text-left">Payment Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {students
                                                            .filter((s) => s.cid === cls.cid)
                                                            .map((student) => (
                                                                <tr key={student.sid}>
                                                                    <td className="px-4 py-2">{student.sid}</td>
                                                                    <td className="px-4 py-2">{student.sname}</td>
                                                                    <td className="px-4 py-2">
                                                                        {student.paid ? (
                                                                            <span className="text-green-400">Paid</span>
                                                                        ) : (
                                                                            <span className="text-red-400">Not Paid</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-gray-400 italic">No students in this class</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No classes assigned to this lecture</p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
