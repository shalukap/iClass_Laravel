import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Rotate3D } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: route('students.create'),
    },
];

export default function Create() {
    const [sid, setSid] = useState('');
    const [sname, setSname] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState(0);
    const [dob, setDob] = useState('');
    const [school, setSchool] = useState('');
    const[parentName, setParentName]= useState('');
    const[tpNo,setTpno]= useState('');
    const[watsappNo,setWatsappNo]= useState('');
    const [isActive, setIsActive] = useState(true);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div>
    <form className="max-w-full max-h-full mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-700 text-white" >
  <h2 className="text-3xl font-bold mb-8 text-center">Add New Student</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
   
    <Input  type="text" name="s_name" placeholder="Enter Student Name"  required={true} onChange={(e)=>{setSname(e.target.value)}}/>
    <div>
    <label className="block mb-2 text-sm font-medium text-white">Gender</label>
    <select
      name="s_gender"
      className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e)=>{setGender(e.target.value)}}
    >
      <option value="">-- Select --</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>   


    </div>
    
    <Input  type="text" name="s_address" placeholder="Enter Student Address" required={true} onChange={(e)=>{setAddress(e.target.value)}}/>
    <Input  type="number" name="s_age" placeholder="00" required={true} onChange={(e)=>{setAge(e.target.value)}}/>
    <Input  type="date" name="s_dob" required={true} onChange={(e)=>{setDob(e.target.value)}}/>
    <div>
  <label className="block mb-2 text-sm font-medium text-white">Present School</label>
  <select
    name="s_school"
    className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e)=>{setSchool(e.target.value)}}
  > 
    <option value="">-- Select --</option>
    {/*}
    {schools.map((school, index) => (
      <option key={index} value={school.name}>
        {school.name}
      </option>
    ))}*/}
  </select>
</div>
    <Input  type="text" name="parent_name" placeholder="Enter Parent Name" required={true} onChange={(e)=>{setParentName(e.target.value)}}/>
    <Input  type="text" name="tp_no" placeholder="0112345678" required={true} onChange={(e)=>{setTpno(e.target.value)}}/>
    <Input type="text" name="watsapp_no" placeholder="Watsapp number" required={true} onChange={(e)=>{setWatsappNo(e.target.value)}}/>
      <div>
      <Input type="checkbox" name="isActive" value={isActive} defaultChecked onChange={(e)=>{setIsActive(e.target.checked)}}/> Active

      </div>
  </div>

  <div className="mt-8 text-center">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
    >
      Submit
    </button>
  </div>
</form>

    </div>
        </AppLayout>
    );
}
