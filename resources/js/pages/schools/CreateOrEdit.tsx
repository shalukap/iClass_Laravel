// resources/ts/Pages/School/CreateOrEdit.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Props {
  school?: {
    schoolId: string;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Schools', href: route('schools.index') },
];

export default function CreateOrEdit({ school }: Props) {
  const { data, setData, post, put, processing, errors } = useForm({
    schoolId: school?.schoolId ?? '',
    name: school?.name ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    school
      ? put(route('schools.update', school.schoolId))
      : post(route('schools.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={school ? 'Edit School' : 'Add School'} />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-400 text-white"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {school ? 'Update School' : 'Add New School'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {school && (
            <div>
              <label className="block mb-2 text-sm font-medium">School ID</label>
              <input
                type="text"
                name="schoolId"
                value={data.schoolId}
                readOnly
                className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium">School Name</label>
            <input
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
            {school ? 'Update School' : 'Add School'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
