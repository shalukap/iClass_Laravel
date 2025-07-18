import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Props {
  school?: {
    schoolId: string;
    name: string;
  };
  isEdit?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Schools', href: route('schools.index') },
];

export default function CreateOrEdit({ school, isEdit = false }: Props) {
  const { data, setData, post, put, processing, errors } = useForm({
    schoolId: school?.schoolId ?? '',
    name: school?.name ?? '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit) {
      post(route('schools.store'), {
        onSuccess: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'New School has been saved',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    } else {
      put(route('schools.update', school?.schoolId), {
        onSuccess: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'School has been updated',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={[...breadcrumbs, { title: `${isEdit ? 'Edit' : 'Add'} School`, href: route('schools.create') }]}>
      <Head title={isEdit ? 'Edit School' : 'Add School'} />
      <div>
        <form
          onSubmit={handleSubmit}
          className="max-w-full max-h-full mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-700 text-white"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{isEdit ? 'Update School' : 'Add New School'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEdit && (
              <div>
                <label className="block mb-2 text-sm font-medium text-white">School ID</label>
                <Input
                  type="text"
                  name="schoolId"
                  value={data.schoolId}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
                />
              </div>
            )}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">School Name</label>
              <Input
                type="text"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-4 py-2 text-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter School Name"
                required
              />
              {errors.name && <div className="text-red-400 mt-1 text-sm">{errors.name}</div>}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
            >
              {isEdit ? 'Update School' : 'Add School'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
