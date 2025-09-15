// resources/js/pages/lecture-payments/index.tsx
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MdPayment } from 'react-icons/md';

interface Lecture {
    lid: string;
    lec_name: string;
    total_earned: number;
    total_paid: number;
    due_amount: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lecture Payments', href: route('lecture-payments.index') }];

export default function Index({ lectures = [] }: { lectures?: Lecture[] }) {
    const [searchLecture, setSearchLecture] = useState('');
    const [filteredLectures, setFilteredLectures] = useState<Lecture[]>(lectures);

    useEffect(() => {
        const searchQuery = searchLecture.toLowerCase();
        const filtered = (lectures || []).filter(
            (lecture) => (lecture.lid?.toLowerCase() || '').includes(searchQuery) || (lecture.lec_name?.toLowerCase() || '').includes(searchQuery),
        );
        setFilteredLectures(filtered);
    }, [searchLecture, lectures]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lecture Payments" />
            <div className="h-full w-full overflow-x-auto p-4">
                <form className="mx-auto max-w-full rounded-xl bg-slate-800 p-8 text-white shadow-xl shadow-slate-700">
                    <h2 className="mb-6 text-center text-2xl font-semibold">Lecture Payment Info</h2>
                    <div>
                        <Input
                            type="text"
                            id="search"
                            placeholder="Search LID, Name"
                            value={searchLecture}
                            onChange={(e) => setSearchLecture(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </form>
                {filteredLectures.length > 0 ? (
                    <table className="mt-6 min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">LID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Total Earned</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Total Paid</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Due Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
                            {filteredLectures.map((lecture) => (
                                <tr key={lecture.lid}>
                                    <td className="px-4 py-2">{lecture.lid}</td>
                                    <td className="px-4 py-2">{lecture.lec_name}</td>
                                    <td className="px-4 py-2">
  Rs.{Number(lecture.total_earned ?? 0).toFixed(2)}
</td>
<td className="px-4 py-2">
  Rs.{Number(lecture.total_paid ?? 0).toFixed(2)}
</td>
<td className="px-4 py-2">
  Rs.{Number(lecture.due_amount ?? 0).toFixed(2)}
</td>

                                    <td className="px-4 py-2">
                                        <Link
                                            as="button"
                                            href={route('lecture-payments.create') + `?lid=${lecture.lid}`}
                                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                                        >
                                            <MdPayment className="text-lg" />
                                            Pay
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="mt-6 text-center text-gray-500">No lectures found.</div>
                )}
            </div>
        </AppLayout>
    );
}
