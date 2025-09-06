import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

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

export default function Enroll({ allClasses: initialClasses = [] }: { allClasses?: Class[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Enroll Student',
            href: route('enrollments.create'),
        },
    ];

    const [student, setStudent] = useState<Student | null>(null);
    const [matchedStudents, setMatchedStudents] = useState<StudentBasic[]>([]);
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'name'>('id');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const { data, setData, post, reset } = useForm({
        searchTerm: '',
        cid: '',
        sid: '',
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMatchedStudents([]);
        setStudent(null);
        setSelectedStudentId('');

        try {
            const term = data.searchTerm.trim();

            if (!term) {
                Swal.fire('Info', 'Please enter a search term', 'info');
                setLoading(false);
                return;
            }


            const params: any = {};
            if (searchType === 'id') {
                params.sid = term;
            } else if (searchType === 'name') {
                params.name = term;
            }

            const response = await axios.get(`/enrollments/search`, { params });

            // If searching by ID
            if (searchType === 'id' && response.data.student) {
                setStudent(response.data.student);
                setAllClasses(response.data.allClasses || allClasses);
                setSelectedStudentId(response.data.student.sid);
                setData('sid', response.data.student.sid); // FIX: Set sid in form data
                reset('cid');

            // If searching by Name
            } else if (searchType === 'name' && response.data.students) {
                const students = response.data.students;
                setMatchedStudents(students);

                if (students.length === 1) {

                    fetchStudentDetails(students[0].sid);
                } else if (students.length === 0) {
                    Swal.fire('Info', 'No students found', 'info');
                }
            } else {
                Swal.fire('Info', response.data.message || 'No students found', 'info');
            }

        } catch (error: any) {
            if (error.response?.status === 404) {
                Swal.fire('Info', error.response.data.message || 'Student not found', 'info');
            } else {
                Swal.fire('Error', error.response?.data?.message || 'An error occurred', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentDetails = async (sid: string) => {
        if (!sid) return;

        setLoading(true);
        setStudent(null);
        setMatchedStudents([]);
        setSelectedStudentId(sid);
        setData('sid', sid);

        try {
            const response = await axios.get(`/enrollments/search?sid=${sid}`);

            if (response.data.student) {
                setStudent(response.data.student);
                setAllClasses(response.data.allClasses || allClasses);
                setSelectedStudentId(response.data.student.sid);
                setData('sid', response.data.student.sid);
                reset('cid');
            } else {
                Swal.fire('Info', 'Student details not found', 'info');
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                Swal.fire('Info', error.response.data.message || 'Student not found', 'info');
            } else {
                Swal.fire('Error', error.response?.data?.message || 'Failed to fetch student details', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sid = e.target.value;
        if (sid) {
            fetchStudentDetails(sid);
        }
    };

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedStudentId || !data.cid) {
            Swal.fire('Error', 'Please select both student and class', 'error');
            return;
        }


        post(route('enrollments.store'), {
            data: {
                sid: selectedStudentId,
                cid: data.cid
            },
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Student enrolled successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });

                if (selectedStudentId) {
                    fetchStudentDetails(selectedStudentId);
                }
                reset('cid');
            },
            onError: (errors) => {
                console.log('Enrollment errors:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Enrollment Failed',
                    text: errors.sid || errors.cid || 'Please try again',
                });
            },
        });
    };

    const availableClasses =
        student && Array.isArray(allClasses) ? allClasses.filter((cls) => !student.classes.some((enrolled) => enrolled.cid === cls.cid)) : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enroll Student" />
            <div className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-semibold">Enroll Student to Class</h2>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="mb-4 flex gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Search by:</label>
                            <select
                                value={searchType}
                                onChange={(e) => {
                                    setSearchType(e.target.value as 'id' | 'name');
                                    setMatchedStudents([]);
                                    setStudent(null);
                                    setSelectedStudentId('');
                                    setData('sid', '');
                                    setData('searchTerm', '');
                                }}
                                className="rounded-md border border-gray-300 bg-slate-800 px-3 py-2 text-white"
                            >
                                <option value="id">Student ID</option>
                                <option value="name">Student Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="searchTerm"
                            placeholder={searchType === 'id' ? "Enter Student ID (SID)" : "Enter Student Name"}
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

                {matchedStudents.length > 0 && (
                    <div className="mb-6 rounded-lg bg-slate-700 p-4">
                        <h3 className="mb-3 text-lg font-semibold">Multiple Students Found</h3>
                        <p className="mb-3 text-sm text-gray-300">Please select a student from the list:</p>
                        <select
                            value={selectedStudentId}
                            onChange={handleStudentSelect}
                            className="w-full rounded-md border border-gray-300 bg-slate-800 px-3 py-2 text-white"
                        >
                            <option value="">-- Select Student --</option>
                            {matchedStudents.map((student) => (
                                <option key={student.sid} value={student.sid}>
                                    {student.sname} ({student.sid})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {student && (
                    <div className="mb-8 rounded-lg bg-slate-700 p-4">
                        <h3 className="mb-4 text-xl font-semibold">Student Information</h3>
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <p>
                                    <span className="font-semibold">SID:</span> {student.sid}
                                </p>
                                <p>
                                    <span className="font-semibold">Name:</span> {student.sname}
                                </p>
                            </div>
                        </div>

                        <h3 className="mb-4 text-xl font-semibold">Current Enrollments</h3>
                        {student.classes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {student.classes.map((cls) => (
                                    <div key={cls.cid} className="rounded-lg bg-slate-600 p-3">
                                        <p>
                                            <span className="font-semibold">Class:</span> {cls.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">ID:</span> {cls.cid}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Medium:</span> {cls.medium}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Syllabus:</span> {cls.syllabus}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No current enrollments</p>
                        )}
                    </div>
                )}

                {student && availableClasses.length > 0 && (
                    <form onSubmit={handleEnroll} className="mt-6">
                        <h3 className="mb-4 text-xl font-semibold">Enroll to New Class</h3>
                        <div className="flex flex-col items-end gap-4 md:flex-row">
                            <div className="w-full flex-1">
                                <label className="mb-2 block text-sm font-medium text-white">Available Classes</label>
                                <select
                                    name="cid"
                                    className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={data.cid}
                                    onChange={(e) => setData('cid', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Class --</option>
                                    {availableClasses.map((cls) => (
                                        <option key={cls.cid} value={cls.cid}>
                                            {cls.name} ({cls.cid}) - {cls.medium} - {cls.syllabus}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-all hover:bg-green-700 md:w-auto"
                            >
                                Enroll Student
                            </button>
                        </div>
                    </form>
                )}

                {student && availableClasses.length === 0 && allClasses.length > 0 && (
                    <div className="mt-6 rounded-lg bg-slate-700 p-4">
                        <p className="text-gray-400 italic">This student is already enrolled in all available classes.</p>
                    </div>
                )}

                {student && allClasses.length === 0 && (
                    <div className="mt-6 rounded-lg bg-slate-700 p-4">
                        <p className="text-gray-400 italic">No classes are available in the system.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
