import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { CgAddR } from "react-icons/cg";
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
}

function handleDelete(c: ClassItem) {
    Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the class.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('classes.destroy', { class: c.cid }), {
                onSuccess: () => {
                    Swal.fire("Deleted!", "Class has been removed.", "success");
                }
            });
        }
    });
}


export default function Index({ classes: originalClasses }: { classes: ClassItem[] }) {
    const [searchClass, setSearchClass] = useState('');
    const [filteredClasses, setFilteredClasses] = useState(originalClasses);

    useEffect(() => {
        const searchQuery = searchClass.toLowerCase();
        const filtered = originalClasses.filter((c) =>
            (c.cid?.toLowerCase() || '').includes(searchQuery) ||
            (c.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredClasses(filtered);
    }, [searchClass, originalClasses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="w-full h-full overflow-x-auto p-4">
                <form className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Class Info</h2>
                    <input
                        type="text"
                        className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by CID or Name"
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                    />
                </form>

                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow mt-4">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">CID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Start Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">End Time</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                        {filteredClasses.map((c) => (
                            <tr key={c.cid}>
                                <td className="px-4 py-2">{c.cid}</td>
                                <td className="px-4 py-2">{c.name}</td>
                                <td className="px-4 py-2">{c.time_start}</td>
                                <td className="px-4 py-2">{c.time_end}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <Link href={route('classes.edit', c.cid)}>
                                        <FaEdit className="hover:text-red-700 text-xl" />
                                    </Link>
                                    <button onClick={() => handleDelete(c)}>
                                        <MdDeleteForever className="hover:text-red-700 text-2xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fixed bottom-4 right-4">
                    <button
                        className="hover:text-red-700 text-5xl bg-blue-900 text-red-500 font-bold"
                        onClick={() => router.visit(route('classes.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
