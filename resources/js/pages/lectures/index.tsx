import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { CgAddR } from 'react-icons/cg';
import { MdDeleteForever } from 'react-icons/md';
import Swal from 'sweetalert2';

interface Lecture {
  lid: string;
  lec_name: string;
  lec_address: string;
  qualification: string;
  tp_no: string;
  whatsapp_no: string;
  lec_dob: string;
  lec_email: string;
  status: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lectures', href: '/lectures' },
];

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
        (lecture.lec_name?.toLowerCase() || '').includes(searchQuery)
    );
    setFilteredLectures(filtered);
  }, [searchLecture, originalLectures]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lectures" />
      <div className="w-full h-full overflow-x-auto p-4">
        <form className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">Lecture Info</h2>
          <div>
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search LID, Name"
              value={searchLecture}
              onChange={(e) => setSearchLecture(e.target.value)}
            />
          </div>
        </form>

        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-slate-800 text-white border-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">LID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Qualification</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">DOB</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
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
                <td className="px-4 py-2">{lec.qualification}</td>
                <td className="px-4 py-2">{lec.tp_no}</td>
                <td className="px-4 py-2">{lec.whatsapp_no}</td>
                <td className="px-4 py-2">{new Date(lec.lec_dob).toLocaleDateString()}</td>
                <td className="px-4 py-2">{lec.lec_email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white ${
                      lec.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {lec.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 flex">
                  <Link as="button" href={route('lectures.edit', lec.lid)}>
                    <FaEdit className="hover:text-red-700 text-2xl" />
                  </Link>
                  <button onClick={() => handleDelete(lec.lid)}>
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
            onClick={() => router.visit(route('lectures.create'))}
          >
            <CgAddR />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
