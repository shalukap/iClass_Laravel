// resources/ts/Pages/Lecture/CreateOrEdit.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Props {
  lecture?: {
    lid: string;
    lec_name: string;
    lec_address: string;
    lec_dob: string;
    lec_qualification: string;
    tp_no: string;
    whatsapp_no: string;
    lec_email: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lectures', href: route('lectures.index') },
];

export default function CreateOrEdit({ lecture }: Props) {
  const { data, setData, post, put, processing, errors } = useForm({
    lid: lecture?.lid ?? '',
    lec_name: lecture?.lec_name ?? '',
    lec_address: lecture?.lec_address ?? '',
    lec_dob: lecture?.lec_dob ?? '',
    lec_qualification: lecture?.lec_qualification ?? '',
    tp_no: lecture?.tp_no ?? '',
    whatsapp_no: lecture?.whatsapp_no ?? '',
    lec_email: lecture?.lec_email ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lecture
      ? put(route('lectures.update', lecture.lid))
      : post(route('lectures.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={lecture ? 'Edit Lecture' : 'Add Lecture'} />
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-400 text-white"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {lecture ? 'Update Lecture' : 'Add New Lecture'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lecture && (
            <div>
              <label className="block mb-2 text-sm font-medium">Lecture ID</label>
              <input
                type="text"
                name="lid"
                value={data.lid}
                readOnly
                className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border"
              />
            </div>
          )}
          <input type="text" name="lec_name" placeholder="Lecture Name" value={data.lec_name} onChange={(e) => setData('lec_name', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="text" name="lec_address" placeholder="Address" value={data.lec_address} onChange={(e) => setData('lec_address', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="date" name="lec_dob" value={data.lec_dob} onChange={(e) => setData('lec_dob', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="text" name="lec_qualification" placeholder="Qualification" value={data.lec_qualification} onChange={(e) => setData('lec_qualification', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="text" name="tp_no" placeholder="Telephone" value={data.tp_no} onChange={(e) => setData('tp_no', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="text" name="whatsapp_no" placeholder="WhatsApp" value={data.whatsapp_no} onChange={(e) => setData('whatsapp_no', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
          <input type="text" name="lec_email" placeholder="Account/Email" value={data.lec_email} onChange={(e) => setData('lec_email', e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-md border" required />
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
          >
            {lecture ? 'Update Lecture' : 'Add Lecture'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
