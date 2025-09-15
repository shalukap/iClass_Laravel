import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CgAddR } from 'react-icons/cg';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';

interface School {
    schoolId: string;
    name: string;
}

interface Lecture {
    lid: string;
    lec_name: string;
    lec_address: string;
    qualification: string;
    tp_no: string;
    whatsapp_no: string;
    lec_dob: string;
    lec_email: string;
    is_employed: boolean;
    school_id?: string;
    school?: School;
    bank_account: string;
    bank_name: string;
    bank_branch: string;
    vehicle_no: string;
    status: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lectures', href: '/lectures' }];

function handleDelete(lid: string) {
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
            router.delete(route('lectures.destroy', lid), {
                onSuccess: () => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your lecture has been deleted.',
                        icon: 'success',
                    });
                },
            });
        }
    });
}

export default function Index({ lectures: originalLectures }: { lectures: Lecture[] }) {
    const [searchLecture, setSearchLecture] = useState('');
    const [filteredLectures, setFilteredLectures] = useState(originalLectures);

    useEffect(() => {
        const searchQuery = searchLecture.toLowerCase();
        const filtered = originalLectures.filter(
            (lecture) =>
                (lecture.lid?.toLowerCase() || '').includes(searchQuery) ||
                (lecture.lec_name?.toLowerCase() || '').includes(searchQuery) ||
                (lecture.school?.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredLectures(filtered);
    }, [searchLecture, originalLectures]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lectures" />
            <div className="h-full w-full overflow-x-auto p-4">
                <form className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-lg">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Lecture Info</h2>
                    <div>
                        <input
                            type="text"
                            id="search"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Search LID, Name, School"
                            value={searchLecture}
                            onChange={(e) => setSearchLecture(e.target.value)}
                        />
                    </div>
                </form>

                <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
                    <thead className="border-white bg-slate-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">LID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Qualification</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">DOB</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Employed</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">School</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Bank Details</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle No</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                        {filteredLectures.map((lec) => (
                            <tr key={lec.lid}>
                                <td className="px-4 py-2">{lec.lid}</td>
                                <td className="px-4 py-2">{lec.lec_name}</td>
                                <td className="px-4 py-2">{lec.lec_address}</td>
                                <td className="px-4 py-2 whitespace-pre-line">{lec.qualification}</td>
                                <td className="px-4 py-2">{lec.tp_no}</td>
                                <td className="px-4 py-2">{lec.whatsapp_no}</td>
                                <td className="px-4 py-2">{new Date(lec.lec_dob).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{lec.lec_email}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-white ${lec.is_employed ? 'bg-green-500' : 'bg-red-500'}`}
                                    >
                                        {lec.is_employed ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {lec.is_employed ? (lec.school ? lec.school.name : '-') : '-'}
                                </td>
                                <td className="px-4 py-2">
                                    {lec.bank_account ? `${lec.bank_account} - ${lec.bank_name} (${lec.bank_branch})` : '-'}
                                </td>
                                <td className="px-4 py-2">{lec.vehicle_no || '-'}</td>
                                <td className="px-4 py-2">
                                    <span className={`inline-block rounded-full px-3 py-1 text-white ${lec.status ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {lec.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="flex px-4 py-2">
                                    <Link as="button" href={route('lectures.edit', lec.lid)}>
                                        <FaEdit className="text-2xl hover:text-red-700" />
                                    </Link>
                                    <button onClick={() => handleDelete(lec.lid)}>
                                        <MdDeleteForever className="text-3xl hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="fixed right-4 bottom-4">
                    <button
                        className="bg-blue-900 text-5xl font-bold text-red-500 hover:text-red-700"
                        onClick={() => router.visit(route('lectures.create'))}
                    >
                        <CgAddR />
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
