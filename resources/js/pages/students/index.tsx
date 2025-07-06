import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];

export default function Index() {
    const [students, setStudents] = useState([]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="w-full h-full overflow-x-auto p-4">
        <form className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
  <h2 className="text-2xl font-semibold mb-6 text-center">Student Info</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label htmlFor="sid" className="block mb-2 text-sm font-medium">Student ID</label>
      <input
        type="text"
        id="sid"
        className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter SID"
      />
    </div>

    <div>
      <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
      <input
        type="text"
        id="name"
        className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Name"
      />
    </div>

    <div>
      <label htmlFor="school" className="block mb-2 text-sm font-medium">School</label>
      <input
        type="text"
        id="school"
        className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter School"
      />
    </div>
  </div>

  <div className="mt-8 text-center">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
    >
      Submit
    </button>
  </div>
</form>
  <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
    <thead className="bg-slate-800 text-white">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold">SID</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Age</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">DOB</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">School</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Parent</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
  {students.map((s) => (
    <tr key={s.sid}>
      <td className="px-4 py-2">{s.sid}</td>
      <td className="px-4 py-2">{s.s_name}</td>
      <td className="px-4 py-2">
        <img
          src={s.s_image}
          alt={s.s_name}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-4 py-2">{s.s_address}</td>
      <td className="px-4 py-2">{s.s_age}</td>
      <td className="px-4 py-2">{new Date(s.s_dob).toLocaleDateString()}</td>
      <td className="px-4 py-2">{s.s_school}</td>
      <td className="px-4 py-2">{s.parent_name}</td>
      <td className="px-4 py-2">{s.tp_no}</td>
      <td className="px-4 py-2">{s.watsapp_no}</td>
      <td className="px-4 py-2" >
        <span className={`inline-block px-3 py-1 rounded-full text-white ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
          {s.isActive?'Active':'Inactive'}
        </span>
      </td>
      <td className='px-4 py-2 flex'>
        <td className="px-4 py-2 flex justify-center items-center"><FaEdit className='hover:text-red-700 text-2xl'/></td>
      </td>
      
    </tr>
  ))}
</tbody>

  </table>
  <div className="fixed bottom-4 right-4">
    <button className=" hover:text-red-700 text-5xl bg-blue-900 text-red-500 font-bold " onClick={()=>navigate("/admin/studentdetails")}><CgAddR /></button>
  </div>
</div>
        </AppLayout>
    );
}
