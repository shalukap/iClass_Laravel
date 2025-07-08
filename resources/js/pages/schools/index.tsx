// resources/ts/Pages/School/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CgAddR } from 'react-icons/cg';
import { MdDelete, MdModeEdit } from 'react-icons/md';

interface School {
    schoolId: string;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Schools', href: '/schools' }];

export default function Index() {
    const [schools, setSchools] = useState<School[]>([]);

    useEffect(() => {
        router.visit(route('schools.index'), {
            only: ['schools'], // optional: if you pass via props from Laravel
            onSuccess: (page) => {
                if (page.props.schools) setSchools(page.props.schools as School[]);
            },
        });
    }, []);

    const handleDelete = async (id: string) => {
        router.delete(route('schools.destroy', id), {
            onSuccess: () => setSchools(schools.filter((s) => s.schoolId !== id)),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="h-full w-full overflow-x-auto p-4">
                <form className="mx-auto max-w-4xl rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-semibold">School Info</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                            <label htmlFor="schoolId" className="mb-2 block text-sm font-medium">
                                School ID
                            </label>
                            <input
                                type="text"
                                id="schoolId"
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter schoolId"
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter Name"
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:bg-blue-700">
                            Submit
                        </button>
                    </div>
                </form>

                <h2 className="my-6 text-center text-2xl font-semibold text-white">Schools</h2>
                <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">School ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {schools.map((school) => (
                            <tr key={school.schoolId}>
                                <td className="px-4 py-2">{school.schoolId}</td>
                                <td className="px-4 py-2">{school.name}</td>
                                <td className="flex space-x-4 px-4 py-2">
                                    <button
                                        onClick={() => router.visit(route('schools.edit', school.schoolId))}
                                        className="text-xl text-blue-600 hover:text-blue-800"
                                    >
                                        <MdModeEdit />
                                    </button>
                                    <button onClick={() => handleDelete(school.schoolId)} className="text-xl text-red-600 hover:text-red-800">
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fixed right-4 bottom-4">
                    <button onClick={() => router.visit(route('schools.create'))} className="text-5xl text-white hover:text-red-700">
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
