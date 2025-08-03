import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MdPayment } from 'react-icons/md';

interface Student {
  sid: string;
  sname: string;
  image: string;
  due_amount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Student Payments', href: route('student-payments.index') },
];

export default function Index({ students = [] }: { students?: Student[] }) {
  const [searchStudent, setSearchStudent] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);

  useEffect(() => {
    const searchQuery = searchStudent.toLowerCase();
    const filtered = (students || []).filter(
      (student) =>
        (student.sid?.toLowerCase() || '').includes(searchQuery) ||
        (student.sname?.toLowerCase() || '').includes(searchQuery)
    );
    setFilteredStudents(filtered);
  }, [searchStudent, students]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Student Payments" />
      <div className="w-full h-full overflow-x-auto p-4">
        <form className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-xl shadow-slate-700 text-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">Student Payment Info</h2>
          <div>
            <Input
              type="text"
              id="search"
              placeholder="Search SID, Name"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
        {filteredStudents.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow mt-6">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">SID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Due Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-slate-800">
              {filteredStudents.map((student) => (
                <tr key={student.sid}>
                  <td className="px-4 py-2">{student.sid}</td>
                  <td className="px-4 py-2">{student.sname}</td>
                  <td className="px-4 py-2">
                    <img
                      src={student.image}
                      alt={student.sname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">${student.due_amount?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-4 py-2">
                    <Link
                      as="button"
                      href={route('student-payments.create') + `?sid=${student.sid}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
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
          <div className="mt-6 text-center text-gray-500">No students found.</div>
        )}
      </div>
    </AppLayout>
  );
}
