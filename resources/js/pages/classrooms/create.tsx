import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ classroomItem, isEdit }: { classroomItem?: any; isEdit?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Add'} Classroom`,
            href: route('classrooms.create'),
        },
    ];

    const { data, setData, post, put } = useForm({
        id: classroomItem?.id || '',
        classroomId: classroomItem?.classroomId || '',
        name: classroomItem?.name || '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const routeName = isEdit ? route('classrooms.update', { classroom: classroomItem?.classroomId }) : route('classrooms.store');
        const method = isEdit ? put : post;

        method(routeName, {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Classroom has been ${isEdit ? 'updated' : 'saved'}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Add'} Classroom`} />
            <div>
                <form onSubmit={handleSubmit} className="mx-auto max-h-full max-w-full rounded-xl bg-slate-800 p-10 text-white shadow-xl">
                    <h2 className="mb-8 text-center text-3xl font-bold">{isEdit ? 'Edit Classroom' : 'Add New Classroom'}</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {isEdit && (
                            <div className="flex flex-col">
                                <label htmlFor="classroomId" className="mb-2 text-sm">
                                    Classroom ID
                                </label>
                                <Input
                                    type="text"
                                    name="classroomId"
                                    id="classroomId"
                                    disabled
                                    value={data.classroomId}
                                />
                            </div>
                        )}

                        <div className="flex flex-col">
                            <label htmlFor="name" className="mb-2 text-sm">
                                Classroom Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Classroom Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button type="submit" className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
