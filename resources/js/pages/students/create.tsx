import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2'





export default function Create({...props}) {
    const {student,isEdit}=props;
    const breadcrumbs: BreadcrumbItem[] = [
    {
        title: `${isEdit?'Edit':'Add'} Students`,
        href: route('students.create'),
    },
];
    
    const {data,setData,post,put}=useForm({
        sid:student?.sid||'',
        sname:student?.sname||'',
        gender:student?.gender||'',
        address:student?.address||'',       
        dob:student?.dob||'',
        school:student?.school||'',
        parentName:student?.parentName||'',
        tpNo:student?.tpNo||'',
        watsapp:student?.watsapp||'',
        isActive:student?.isActive||true
    })
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!isEdit){
          post(route('students.store'), {
          onSuccess: () => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "New Student has been saved",
                showConfirmButton: false,
                timer: 1500
              });
          }
        })
        }else{
          put(route('students.update',student?.id), {
          onSuccess: () => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Student has been updated",
                showConfirmButton: false,
                timer: 1500
              });
          }
        })
        }
        

    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div>
    <form onSubmit={handleSubmit} className="max-w-full max-h-full mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-700 text-white" >
  <h2 className="text-3xl font-bold mb-8 text-center">Add New Student</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
   
    <Input  type="text" name="sname" placeholder="Enter Student Name"  required={true} value={data.sname} onChange={(e)=>{setData('sname',e.target.value)}}/>
    <div>
    <label className="block mb-2 text-sm font-medium text-white">Gender</label>
    <select
      name="s_gender"
      className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e)=>{setData('gender',e.target.value)}}
    >
      <option value="">-- Select --</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>   


    </div>
    
    <Input  type="text" name="s_address" placeholder="Enter Student Address" required={true} value={data.address} onChange={(e)=>{setData('address',e.target.value)}}/>
   
    <Input  type="date" name="s_dob" required={true} value={data.dob} onChange={(e)=>{setData('dob',e.target.value)}}/>
    <div>
  <label className="block mb-2 text-sm font-medium text-white">Present School</label>
  <select
    name="s_school"
    className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e)=>{setData('school',e.target.value)}}
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
    <Input  type="text" name="parent_name" placeholder="Enter Parent Name" required={true} value={data.parentName} onChange={(e)=>{setData('parentName',e.target.value)}}/>
    <Input  type="text" name="tp_no" placeholder="0112345678" required={true} value={data.tpNo} onChange={(e)=>{setData('tpNo',e.target.value)}}/>
    <Input type="text" name="watsapp" placeholder="Watsapp number" required={true} value={data.watsapp} onChange={(e)=>{setData('watsapp',e.target.value)}}/>
      <div>
      <Input type="checkbox" name="isActive" checked={data.isActive} onChange={(e)=>{setData('isActive',e.target.checked)}}/> Active

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
