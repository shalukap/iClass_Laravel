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

            <div className="h-full w-full overflow-x-auto p-4">
                <form className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Class Info</h2>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Search by CID or Name"
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                    />
                </form>

                <table className="mt-4 min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">CID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Classroom</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Lecturer</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Start Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">End Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Fee</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Medium</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Syllabus</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                        {filteredClasses.map((c) => (
                            <tr key={c.cid}>
                                <td className="px-4 py-2">{c.cid}</td>
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">Grade {c.grade}</td>
                                <td className="px-4 py-2">{c.classroom?.name || '-'}</td>
                                <td className="px-4 py-2">{c.lecturer?.lec_name || '-'}</td>
                                <td className="px-4 py-2">{c.time_start}</td>
                                <td className="px-4 py-2">{c.time_end}</td>
                                <td className="px-4 py-2">${c.fee.toFixed(2)}</td>
                                <td className="px-4 py-2 capitalize">{c.medium}</td>
                                <td className="px-4 py-2 capitalize">{c.syllabus}</td>
                                <td className="flex gap-2 px-4 py-2">
                                    <Link href={route('classes.edit', c.cid)}>
                                        <FaEdit className="text-xl hover:text-red-700" />
                                    </Link>
                                    <button onClick={() => handleDelete(c)}>
                                        <MdDeleteForever className="text-2xl hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fixed right-4 bottom-4">
                    <button
                        className="bg-blue-900 text-5xl font-bold text-red-500 hover:text-red-700"
                        onClick={() => router.visit(route('classes.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
