// resources/ts/Pages/Lecture/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CgAddR } from 'react-icons/cg';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { type BreadcrumbItem } from '@/types';

interface Lecture {
  lid: string;
  lec_name: string;
  lec_address: string;
  qualification: string;
  tp_no: string;
  whatsapp_no: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lectures', href: '/lectures' },
];

export default function Index() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    router.visit(route('lectures.index'), {
      only: ['lectures'],
      onSuccess: (page) => {
        if (page.props.lectures) {
          setLectures(page.props.lectures as Lecture[]);
        }
      },
    });
  }, []);

  const handleDelete = (id: string) => {
    router.delete(route('lectures.destroy', id), {
      onSuccess: () => setLectures((prev) => prev.filter((l) => l.lid !== id)),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lectures" />
      <div className="w-full h-full overflow-x-auto p-4">
        <form className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">Lecture Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="lid" className="block mb-2 text-sm font-medium">Lecture ID</label>
              <input
                type="text"
                id="lid"
                placeholder="Enter LID"
                className="w-full px-4 py-2 text-white bg-slate-700 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="lec_name" className="block mb-2 text-sm font-medium">Lecture Name</label>
              <input
                type="text"
                id="lec_name"
                placeholder="Enter Name"
                className="w-full px-4 py-2 text-white bg-slate-700 rounded-md border border-gray-300"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Submit
            </button>
          </div>
        </form>

        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow mt-6">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">LID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Lecture Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Qualification</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {lectures.map((lec) => (
              <tr key={lec.lid}>
                <td className="px-4 py-2">{lec.lid}</td>
                <td className="px-4 py-2">{lec.lec_name}</td>
                <td className="px-4 py-2">{lec.lec_address}</td>
                <td className="px-4 py-2">{lec.qualification}</td>
                <td className="px-4 py-2">{lec.tp_no}</td>
                <td className="px-4 py-2">{lec.whatsapp_no}</td>
                <td className="px-4 py-2">
                  <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full">Active</span>
                </td>
                <td className="px-4 py-2 flex space-x-4">
                  <button
                    onClick={() => router.visit(route('lectures.edit', lec.lid))}
                    className="text-blue-600 hover:text-blue-800 text-xl"
                  >
                    <MdModeEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(lec.lid)}
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => router.visit(route('lectures.create'))}
            className="hover:text-red-700 text-5xl text-white"
          >
            <CgAddR />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
