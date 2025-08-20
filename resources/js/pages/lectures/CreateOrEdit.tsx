import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
        is_employed: boolean;
        bank_account: string;
        bank_name: string;
        bank_branch: string;
        vehicle_no: string;
    };
    isEdit?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lectures', href: route('lectures.index') }];

export default function CreateOrEdit({ lecture, isEdit = false }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        lid: lecture?.lid ?? '',
        lec_name: lecture?.lec_name ?? '',
        lec_address: lecture?.lec_address ?? '',
        lec_dob: lecture?.lec_dob ? formatDateForInput(lecture.lec_dob) : '',

        qualification: lecture?.qualification ?? '',
        tp_no: lecture?.tp_no ?? '',
        whatsapp_no: lecture?.whatsapp_no ?? '',
        lec_email: lecture?.lec_email ?? '',
        status: lecture?.status ?? true,
        is_employed: lecture?.is_employed ?? false,
        bank_account: lecture?.bank_account ?? '',
        bank_name: lecture?.bank_name ?? '',
        bank_branch: lecture?.bank_branch ?? '',
        vehicle_no: lecture?.vehicle_no ?? '',
    });
    function formatDateForInput(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
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
        <AppLayout breadcrumbs={[...breadcrumbs, { title: `${isEdit ? 'Edit' : 'Add'} Lecture`, href: route('lectures.create') }]}>
            <Head title={isEdit ? 'Edit Lecture' : 'Add Lecture'} />
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-h-full max-w-full rounded-xl bg-slate-800 p-10 text-white shadow-xl shadow-slate-700"
                >
                    <h2 className="mb-8 text-center text-3xl font-bold">{isEdit ? 'Update Lecture' : 'Add New Lecture'}</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {isEdit && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Lecture ID</label>
                                <Input
                                    type="text"
                                    name="lid"
                                    value={data.lid}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-500 px-4 py-2 text-white"
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
                        <Input type="date" name="lec_dob" required={true} value={data.lec_dob} onChange={(e) => setData('lec_dob', e.target.value)} />
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
                        <div className="flex items-center gap-2">
                            <Input
                                type="checkbox"
                                name="is_employed"
                                checked={data.is_employed}
                                onChange={(e) => setData('is_employed', e.target.checked)}
                            />
                            <label className="text-sm font-medium text-white">Employed at School</label>
                        </div>

                        <Input
                            type="text"
                            name="bank_account"
                            placeholder="Bank Account Number"
                            value={data.bank_account}
                            onChange={(e) => setData('bank_account', e.target.value)}
                        />

                        <Input
                            type="text"
                            name="bank_name"
                            placeholder="Bank Name"
                            value={data.bank_name}
                            onChange={(e) => setData('bank_name', e.target.value)}
                        />

                        <Input
                            type="text"
                            name="bank_branch"
                            placeholder="Bank Branch"
                            value={data.bank_branch}
                            onChange={(e) => setData('bank_branch', e.target.value)}
                        />

                        <Input
                            type="text"
                            name="vehicle_no"
                            placeholder="Vehicle Number"
                            value={data.vehicle_no}
                            onChange={(e) => setData('vehicle_no', e.target.value)}
                        />
                        <div>
                            <Input type="checkbox" name="status" checked={data.status} onChange={(e) => setData('status', e.target.checked)} /> Active
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                        >
                            {isEdit ? 'Update Lecture' : 'Add Lecture'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
