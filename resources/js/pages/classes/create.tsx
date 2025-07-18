import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({ classItem, isEdit }: { classItem?: any; isEdit?: boolean }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Add'} Class`,
            href: route('classes.create'),
        },
    ];

    const { data, setData, post, put } = useForm({
        id: classItem?.id || '',
        name: classItem?.name || '',
        time_start: classItem?.time_start || '',
        time_end: classItem?.time_end || '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const routeName = isEdit ? route('classes.update', { class: classItem?.cid }) : route('classes.store');
        const method = isEdit ? put : post;

        method(routeName, {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Class has been ${isEdit ? 'updated' : 'saved'}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Add'} Class`} />
            <div>
                <form onSubmit={handleSubmit} className="mx-auto max-h-full max-w-full rounded-xl bg-slate-800 p-10 text-white shadow-xl">
                    <h2 className="mb-8 text-center text-3xl font-bold">{isEdit ? 'Edit Class' : 'Add New Class'}</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="mb-2 text-sm">
                                Class Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Class Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="time_start" className="mb-2 text-sm">
                                Start Time
                            </label>
                            <Input
                                type="time"
                                name="time_start"
                                id="time_start"
                                required
                                value={data.time_start}
                                onChange={(e) => setData('time_start', e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="time_end" className="mb-2 text-sm">
                                End Time
                            </label>
                            <Input
                                type="time"
                                name="time_end"
                                id="time_end"
                                required
                                value={data.time_end}
                                onChange={(e) => setData('time_end', e.target.value)}
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
