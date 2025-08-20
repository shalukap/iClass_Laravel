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
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, reset } = useForm({
        sid: '',
        cid: '',
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`/enrollments/search?sid=${data.sid}`);
            console.log('Search response:', response.data);
            if (response.data.student) {
                setStudent(response.data.student);
                setAllClasses(response.data.allClasses || allClasses);
                reset('cid');
            } else {
                Swal.fire('Error', 'Student not found', 'error');
            }
        } catch (error) {
            Swal.fire('Error', (error as any).response?.data?.message || 'Student not found', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('enrollments.store'), {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Student enrolled successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset();
                setStudent(null);
                setData('sid', '');
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Enrollment Failed',
                    text: 'Please try again',
                });
            },
        });
    };

    const availableClasses =
        student && Array.isArray(allClasses) ? allClasses.filter((cls) => !student.classes.some((enrolled) => enrolled.cid === cls.cid)) : [];

    console.log('allClasses:', allClasses);
    console.log('student:', student);
    console.log('availableClasses:', availableClasses);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enroll Student" />
            <div className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-semibold">Enroll Student to Class</h2>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            name="sid"
                            placeholder="Enter Student ID (SID)"
                            required
                            value={data.sid}
                            onChange={(e) => setData('sid', e.target.value)}
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
