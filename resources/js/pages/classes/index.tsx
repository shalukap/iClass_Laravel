import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CgAddR } from 'react-icons/cg';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Classes',
        href: '/classes',
    },
];

interface ClassItem {
    id: number;
    cid: string;
    name: string;
    time_start: string;
    time_end: string;
    grade: number;
    classroom_id: string;
    lid: string;
    fee: number;
    classroom?: { name: string };
    lecturer?: { lec_name: string };
    medium: string;
    syllabus: string;
}

function handleDelete(c: ClassItem) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the class.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('classes.destroy', { class: c.cid }), {
                onSuccess: () => {
                    Swal.fire('Deleted!', 'Class has been removed.', 'success');
                },
            });
        }
    });
}

function formatTime12Hour(time24: string) {
    if (!time24) return '-';
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // convert 0 to 12
    return `${hour}:${minute} ${ampm}`;
}

export default function Index({ classes: originalClasses }: { classes: ClassItem[] }) {
    const [searchClass, setSearchClass] = useState('');
    const [filteredClasses, setFilteredClasses] = useState(originalClasses);

    useEffect(() => {
        const searchQuery = searchClass.toLowerCase();
        const filtered = originalClasses.filter(
            (c) => (c.cid?.toLowerCase() || '').includes(searchQuery) || (c.name?.toLowerCase() || '').includes(searchQuery),
        );
        setFilteredClasses(filtered);
    }, [searchClass, originalClasses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="h-full w-full p-6">
                <div className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg mb-6">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Class Info</h2>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by CID or Name"
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                    />
                </div>

                <div className="rounded-lg bg-white shadow overflow-hidden">
                    <div className="overflow-x-auto"> {/* Added this container for horizontal scrolling */}
                        <table className="min-w-full">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">CID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Classroom</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Lecturer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">End Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Medium</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Syllabus</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredClasses.map((c) => (
                                    <tr key={c.cid} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{c.cid}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{c.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">Grade {c.grade}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{c.classroom?.name || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{c.lecturer?.lec_name || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{formatTime12Hour(c.time_start)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{formatTime12Hour(c.time_end)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800"> Rs. {c.fee.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 capitalize">{c.medium}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 capitalize">{c.syllabus}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                            <div className="flex items-center gap-4">
                                                <Link href={route('classes.edit', c.cid)} className="text-blue-600 hover:text-blue-800 transition-colors">
                                                    <FaEdit className="text-xl" />
                                                </Link>
                                                <button onClick={() => handleDelete(c)} className="text-red-600 hover:text-red-800 transition-colors">
                                                    <MdDeleteForever className="text-2xl" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="fixed bottom-6 right-6">
                    <button
                        className="bg-blue-900 text-5xl font-bold text-red-500 rounded-full p-2 shadow-lg hover:text-red-700 transition-transform hover:scale-105"
                        onClick={() => router.visit(route('classes.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
