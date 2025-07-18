import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import Swal from 'sweetalert2';

interface Props {
  lecture?: {
    lid: string;
    lec_name: string;
    lec_address: string;
    lec_dob: string;
    qualification: string;
    tp_no: string;
    whatsapp_no: string;
    lec_email: string;
    status: boolean;
  };
  isEdit?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Lectures', href: route('lectures.index') },
];

export default function CreateOrEdit({ lecture, isEdit = false }: Props) {
  const { data, setData, post, put, processing, errors } = useForm({
    lid: lecture?.lid ?? '',
    lec_name: lecture?.lec_name ?? '',
    lec_address: lecture?.lec_address ?? '',
    lec_dob: lecture?.lec_dob ?? '',
    qualification: lecture?.qualification ?? '',
    tp_no: lecture?.tp_no ?? '',
    whatsapp_no: lecture?.whatsapp_no ?? '',
    lec_email: lecture?.lec_email ?? '',
    status: lecture?.status ?? true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit) {
      post(route('lectures.store'), {
        onSuccess: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'New Lecture has been saved',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    } else {
      put(route('lectures.update', lecture?.lid), {
        onSuccess: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Lecture has been updated',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    }
  };

  return (
    <AppLayout
      breadcrumbs={[...breadcrumbs, { title: `${isEdit ? 'Edit' : 'Add'} Lecture`, href: route('lectures.create') }]}
    >
      <Head title={isEdit ? 'Edit Lecture' : 'Add Lecture'} />
      <div>
        <form
          onSubmit={handleSubmit}
          className="max-w-full max-h-full mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-700 text-white"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            {isEdit ? 'Update Lecture' : 'Add New Lecture'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEdit && (
              <div>
                <label className="block mb-2 text-sm font-medium text-white">Lecture ID</label>
                <Input
                  type="text"
                  name="lid"
                  value={data.lid}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
                />
              </div>
            )}
            <Input
              type="text"
              name="lec_name"
              placeholder="Enter Lecture Name"
              required={true}
              value={data.lec_name}
              onChange={(e) => setData('lec_name', e.target.value)}
            />
            <Input
              type="text"
              name="lec_address"
              placeholder="Enter Lecture Address"
              required={true}
              value={data.lec_address}
              onChange={(e) => setData('lec_address', e.target.value)}
            />
            <Input
              type="date"
              name="lec_dob"
              required={true}
              value={data.lec_dob}
              onChange={(e) => setData('lec_dob', e.target.value)}
            />
            <Input
              type="text"
              name="qualification"
              placeholder="Enter Qualification"
              required={true}
              value={data.qualification}
              onChange={(e) => setData('qualification', e.target.value)}
            />
            <Input
              type="text"
              name="tp_no"
              placeholder="Enter Telephone Number"
              required={true}
              value={data.tp_no}
              onChange={(e) => setData('tp_no', e.target.value)}
            />
            <Input
              type="text"
              name="whatsapp_no"
              placeholder="Enter WhatsApp Number"
              required={true}
              value={data.whatsapp_no}
              onChange={(e) => setData('whatsapp_no', e.target.value)}
            />
            <Input
              type="email"
              name="lec_email"
              placeholder="Enter Email"
              required={true}
              value={data.lec_email}
              onChange={(e) => setData('lec_email', e.target.value)}
            />
            <div>
              <Input
                type="checkbox"
                name="status"
                checked={data.status}
                onChange={(e) => setData('status', e.target.checked)}
              />{' '}
              Active
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
            >
              {isEdit ? 'Update Lecture' : 'Add Lecture'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
