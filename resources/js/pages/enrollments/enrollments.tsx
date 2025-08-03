import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Student {
    sid: string;
    sname: string;
    classes: Class[];
}

interface Class {
    cid: string;
    name: string;
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

    const availableClasses = student && Array.isArray(allClasses)
        ? allClasses.filter(cls => !student.classes.some(enrolled => enrolled.cid === cls.cid))
        : [];


    console.log('allClasses:', allClasses);
    console.log('student:', student);
    console.log('availableClasses:', availableClasses);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enroll Student" />
            <div className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
                <h2 className="text-2xl font-semibold mb-6 text-center">Enroll Student to Class</h2>

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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {student && (
                    <div className="mb-8 p-4 bg-slate-700 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Student Information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p><span className="font-semibold">SID:</span> {student.sid}</p>
                                <p><span className="font-semibold">Name:</span> {student.sname}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">Current Enrollments</h3>
                        {student.classes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {student.classes.map(cls => (
                                    <div key={cls.cid} className="bg-slate-600 p-3 rounded-lg">
                                        <p><span className="font-semibold">Class:</span> {cls.name}</p>
                                        <p><span className="font-semibold">ID:</span> {cls.cid}</p>
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
                        <h3 className="text-xl font-semibold mb-4">Enroll to New Class</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block mb-2 text-sm font-medium text-white">
                                    Available Classes
                                </label>
                                <select
                                    name="cid"
                                    className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.cid}
                                    onChange={(e) => setData('cid', e.target.value)}
                                    required
                                >
                                    <option value="">-- Select Class --</option>
                                    {availableClasses.map(cls => (
                                        <option key={cls.cid} value={cls.cid}>
                                            {cls.name} ({cls.cid})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all w-full md:w-auto"
                            >
                                Enroll Student
                            </button>
                        </div>
                    </form>
                )}

                {student && availableClasses.length === 0 && allClasses.length > 0 && (
                    <div className="p-4 bg-slate-700 rounded-lg mt-6">
                        <p className="text-gray-400 italic">This student is already enrolled in all available classes.</p>
                    </div>
                )}

                {student && allClasses.length === 0 && (
                    <div className="p-4 bg-slate-700 rounded-lg mt-6">
                        <p className="text-gray-400 italic">No classes are available in the system.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
