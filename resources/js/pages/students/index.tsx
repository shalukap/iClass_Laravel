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
        title: 'Students',
        href: '/students',
    },
];
interface School {
    schoolId: string;
    name: string;
}

interface Student {
    sid: string;
    sname: string;
    image: string;
    address: string;
    dob: string;
    gender: string;
    schoolId: string;
    parentName: string;
    tpNo: string;
    watsapp: string;
    isActive: boolean;
    school_details?: School;
}


function handleDelete(sid: string) {
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
            router.delete(route('students.destroy', sid));
            Swal.fire({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
            });
        }
    });
}


export default function Index({ students: originalStudents }: { students: Student[] }) {
    const [searchStudent, setSearchStudent] = useState('');
    const [filteredStudents, setFilteredStudents] = useState(originalStudents);

    useEffect(() => {
        const searchQuery = searchStudent.toLowerCase();
        const filtered = originalStudents.filter(
            (student) =>
                (student.sid?.toLowerCase() || '').includes(searchQuery) ||
                (student.sname?.toLowerCase() || '').includes(searchQuery) ||
                (student.school_details?.name?.toLowerCase() || '').includes(searchQuery)
,
        );

        setFilteredStudents(filtered);
    }, [searchStudent, originalStudents]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="h-full w-full overflow-x-auto p-4">
                <form className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Student Info</h2>

                    <div>
                        <input
                            type="text"
                            id="sid"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Search SID, Name, School"
                            value={searchStudent}
                            onChange={(e) => setSearchStudent(e.target.value)}
                        />
                    </div>
                </form>
                <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <thead className="border-white bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">SID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">DOB</th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">School</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Parent</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                        {filteredStudents.map((s) => (
                            <tr key={s.sid}>
                                <td className="px-4 py-2">{s.sid}</td>
                                <td className="px-4 py-2">{s.sname}</td>
                                <td className="px-4 py-2">
                                    <img src={s.image} alt={s.sname} className="h-10 w-10 rounded-full object-cover" />
                                </td>
                                <td className="px-4 py-2">{s.address}</td>

                                <td className="px-4 py-2">{new Date(s.dob).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{s.school_details?.name || 'N/A'}</td>
                                <td className="px-4 py-2">{s.parentName}</td>
                                <td className="px-4 py-2">{s.tpNo}</td>
                                <td className="px-4 py-2">{s.watsapp}</td>
                                <td className="px-4 py-2">
                                    <span className={`inline-block rounded-full px-3 py-1 text-white ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {s.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="flex px-4 py-2">
                                    <td className="flex items-center justify-center px-4 py-2">
                                        <Link as="button" href={route('students.edit', s.sid)}>
                                            <FaEdit className="text-2xl hover:text-red-700" />
                                        </Link>
                                       <button onClick={() => handleDelete(s.sid)}>
                                            <MdDeleteForever className="text-3xl hover:text-red-700" />
                                        </button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="fixed right-4 bottom-4">
                    <button
                        className="bg-blue-900 text-5xl font-bold text-red-500 hover:text-red-700"
                        onClick={() => router.visit(route('students.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
