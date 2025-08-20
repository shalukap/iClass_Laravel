import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface School {
    schoolId: string;
    name: string;
}

interface Student {
    id?: number;
    sid?: string;
    sname?: string;
    image?: string;
    address?: string;
    dob?: string;
    gender?: string;
    school: string;
    parentName?: string;
    tpNo?: string;
    watsapp?: string;
    isActive?: boolean;
    schoolDetails?: School;
}

interface Props {
    student?: Student;
    schools: School[];
    isEdit: boolean;
}

export default function Create({ student, schools, isEdit }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Edit' : 'Add'} Students`,
            href: route('students.create'),
        },
    ];

    const { data, setData, post, put } = useForm({
        sid: student?.sid || '',
        sname: student?.sname || '',
        gender: student?.gender || '',
        address: student?.address || '',
        dob: student?.dob || '',
        school: student?.school || '',
        parentName: student?.parentName || '',
        tpNo: student?.tpNo || '',
        watsapp: student?.watsapp || '',
        isActive: student?.isActive ?? true,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isEdit) {
            put(route('students.update', student?.sid), {
                onSuccess: () => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Student has been updated',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
            });
        } else {
            post(route('students.store'), {
                onSuccess: () => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'New Student has been saved',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-h-full max-w-full rounded-xl bg-slate-800 p-10 text-white shadow-xl shadow-slate-700"
                >
                    <h2 className="mb-8 text-center text-3xl font-bold">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            type="text"
                            name="sname"
                            placeholder="Enter Student Name"
                            required
                            value={data.sname}
                            onChange={(e) => setData('sname', e.target.value)}
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Gender</label>
                            <select
                                name="gender"
                                className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                required
                            >
                                <option value="">-- Select --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <Input
                            type="text"
                            name="address"
                            placeholder="Enter Student Address"
                            required
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />

                        <Input type="date" name="dob" required value={data.dob} onChange={(e) => setData('dob', e.target.value)} />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Present School</label>
                            <select
                                name="school"
                                className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.school}
                                onChange={(e) => setData('school', e.target.value)}
                                required
                            >
                                <option value="">-- Select School --</option>
                                {schools.map((school) => (
                                    <option key={school.schoolId} value={school.schoolId}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input
                            type="text"
                            name="parentName"
                            placeholder="Enter Parent Name"
                            required
                            value={data.parentName}
                            onChange={(e) => setData('parentName', e.target.value)}
                        />

                        <Input
                            type="text"
                            name="tpNo"
                            placeholder="0112345678"
                            required
                            value={data.tpNo}
                            onChange={(e) => setData('tpNo', e.target.value)}
                        />

                        <Input
                            type="text"
                            name="watsapp"
                            placeholder="Whatsapp number"
                            required
                            value={data.watsapp}
                            onChange={(e) => setData('watsapp', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <Input type="checkbox" name="isActive" checked={data.isActive} onChange={(e) => setData('isActive', e.target.checked)} />
                            <label className="text-sm font-medium text-white">Active</label>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button type="submit" className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700">
                            {isEdit ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
