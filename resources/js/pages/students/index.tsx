import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router,Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { MdDeleteForever } from "react-icons/md"; 
import { log } from 'console';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];
interface Student {
    id: number;
    sid: string;
    sname: string;
    image: string;
    address: string;
    dob: string;
    gender: string;   
    school: string;
    parentName: string;
    tpNo: string;
    watsapp: string;
    isActive: boolean;
}

function handleDelete(id:number) { 
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    router.delete(route('students.destroy',id))
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});
}
/*
function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value;
    router.get(route('students.search'), { search: searchQuery });
  }
*/
 
export default function Index({students:originalStudents}: {students:Student[]}) {
    const[searchStudent, setSearchStudent] = useState('');  
    const [filteredStudents, setFilteredStudents] = useState(originalStudents);

    useEffect(() => {
        const searchQuery = searchStudent.toLowerCase();
          const filtered = originalStudents.filter((student) => 
         
         
            (student.sid?.toLowerCase()||'').includes(searchQuery) ||
            (student.sname?.toLowerCase()||'').includes(searchQuery) ||
            (student.school?.toLowerCase()||'').includes(searchQuery)
          );
        
          setFilteredStudents(filtered);
        }, [searchStudent, originalStudents]);
      

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />
            <div className="w-full h-full overflow-x-auto p-4">
        <form className="max-w-full mx-auto bg-slate-800 p-8 rounded-xl shadow-lg text-white">
  <h2 className="text-2xl font-semibold mb-6 text-center">Student Info</h2>

  
    <div>
      
      <input
        type="text"
        id="sid"        
        className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search SID, Name, School"
        value={searchStudent}
        onChange={(e)=>setSearchStudent(e.target.value)}
      />
    </div>

    
  

  
</form>
  <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
    <thead className="bg-slate-800 text-white border-white">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-semibold">SID</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
        <th className="px-4 py-3 text-left text-sm font-semibold">Age</th>
        
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
    <tr key={s.id}>
      <td className="px-4 py-2">{s.sid}</td>
      <td className="px-4 py-2">{s.sname}</td>
      <td className="px-4 py-2">
        <img
          src={s.image}
          alt={s.sname}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-4 py-2">{s.address}</td>
      
      <td className="px-4 py-2">{new Date(s.dob).toLocaleDateString()}</td>
      <td className="px-4 py-2">{s.school}</td>
      <td className="px-4 py-2">{s.parentName}</td>
      <td className="px-4 py-2">{s.tpNo}</td>
      <td className="px-4 py-2">{s.watsapp}</td>
      <td className="px-4 py-2" >
        <span className={`inline-block px-3 py-1 rounded-full text-white ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
          {s.isActive?'Active':'Inactive'}
        </span>
      </td>
      <td className='px-4 py-2 flex'>
        <td className="px-4 py-2 flex justify-center items-center"><Link as ="button" href={route('students.edit',s.id)}><FaEdit className='hover:text-red-700 text-2xl'/></Link>
        <button onClick={()=>handleDelete(s.id)}><MdDeleteForever className='hover:text-red-700 text-3xl'/></button></td>
      </td>
      
    </tr>
  ))}
</tbody>

  </table>
  <div className="fixed bottom-4 right-4">
    <button className=" hover:text-red-700 text-5xl bg-blue-900 text-red-500 font-bold " onClick={()=>router.visit(route('students.create'))}><CgAddR /></button>
  </div>
</div>
        </AppLayout>
    );
}
