import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { CgAddR } from 'react-icons/cg';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';

interface School {
    schoolId: string;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schools',
        href: '/schools',
    },
];

function handleDelete(id: string) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('schools.destroy', id), {
                onSuccess: () => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your school has been deleted.',
                        icon: 'success',
                    });
                },
            });
        }
    });
}

export default function Index({ schools: originalSchools }: { schools: School[] }) {
    const [searchSchool, setSearchSchool] = useState('');
    const [filteredSchools, setFilteredSchools] = useState(originalSchools);

    useEffect(() => {
        const searchQuery = searchSchool.toLowerCase();
        const filtered = originalSchools.filter(
            (school) =>
                (school.schoolId?.toLowerCase() || '').includes(searchQuery) ||
                (school.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredSchools(filtered);
    }, [searchSchool, originalSchools]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="w-full h-full overflow-x-auto p-4">
                <form className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
                    <h2 className="text-2xl font-semibold mb-6 text-center">School Info</h2>
                    <div>
                        <input
                            type="text"
                            id="search"
                            className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search School ID, Name"
                            value={searchSchool}
                            onChange={(e) => setSearchSchool(e.target.value)}
                        />
                    </div>
                </form>

                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                    <thead className="bg-slate-800 text-white border-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">School ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                        {filteredSchools.map((school) => (
                            <tr key={school.schoolId}>
                                <td className="px-4 py-2">{school.schoolId}</td>
                                <td className="px-4 py-2">{school.name}</td>
                                <td className="px-4 py-2 flex">
                                    <Link as="button" href={route('schools.edit', school.schoolId)}>
                                        <FaEdit className="hover:text-red-700 text-2xl" />
                                    </Link>
                                    <button onClick={() => handleDelete(school.schoolId)}>
                                        <MdDeleteForever className="hover:text-red-700 text-3xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fixed bottom-4 right-4">
                    <button
                        className="hover:text-red-700 text-5xl bg-blue-900 text-red-500 font-bold"
                        onClick={() => router.visit(route('schools.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
