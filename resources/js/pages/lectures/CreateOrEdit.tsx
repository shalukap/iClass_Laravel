import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface School {
    schoolId: string;
    name: string;
}

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
        school_id?: string;
        bank_account: string;
        bank_name: string;
        bank_branch: string;
        vehicle_no: string;
    };
    isEdit?: boolean;
    schools: School[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lectures', href: route('lectures.index') }];

export default function CreateOrEdit({ lecture, isEdit = false, schools }: Props) {
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
        school_id: lecture?.school_id ?? '',
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


    const validatePhoneNumber = (value: string): boolean => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(value);
    };


    const handlePhoneInput = (field: 'tp_no' | 'whatsapp_no' | 'bank_account', value: string) => {

        const numericValue = value.replace(/\D/g, '');


        let truncatedValue = numericValue;
        if (field !== 'bank_account') {
            truncatedValue = numericValue.slice(0, 10);
        }

        setData(field, truncatedValue);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate phone numbers before submission
        if (!validatePhoneNumber(data.tp_no)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Telephone number must be exactly 10 digits',
            });
            return;
        }

        if (!validatePhoneNumber(data.whatsapp_no)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid WhatsApp Number',
                text: 'WhatsApp number must be exactly 10 digits',
            });
            return;
        }

        if (data.is_employed && !data.school_id) {
            Swal.fire({
                icon: 'error',
                title: 'School Required',
                text: 'Please select a school for employed lectures',
            });
            return;
        }

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
                onError: (errors) => {
                    if (errors.tp_no || errors.whatsapp_no) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Validation Error',
                            text: errors.tp_no || errors.whatsapp_no,
                        });
                    }
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
                onError: (errors) => {
                    if (errors.tp_no || errors.whatsapp_no) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Validation Error',
                            text: errors.tp_no || errors.whatsapp_no,
                        });
                    }
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

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Lecture Name</label>
                            <Input
                                type="text"
                                name="lec_name"
                                placeholder="Enter Lecture Name"
                                required={true}
                                value={data.lec_name}
                                onChange={(e) => setData('lec_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Address</label>
                            <Input
                                type="text"
                                name="lec_address"
                                placeholder="Enter Lecture Address"
                                required={true}
                                value={data.lec_address}
                                onChange={(e) => setData('lec_address', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Date of Birth</label>
                            <Input
                                type="date"
                                name="lec_dob"
                                required={true}
                                value={data.lec_dob}
                                onChange={(e) => setData('lec_dob', e.target.value)}
                            />
                        </div>

                        {/* Qualification Textarea */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-white">Qualification</label>
                            <textarea
                                name="qualification"
                                placeholder="Enter Qualification "
                                required={true}
                                rows={4}
                                value={data.qualification}
                                onChange={(e) => setData('qualification', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Telephone Number</label>
                            <Input
                                type="text"
                                name="tp_no"
                                placeholder="0771234567"
                                required={true}
                                value={data.tp_no}
                                onChange={(e) => handlePhoneInput('tp_no', e.target.value)}
                                pattern="\d{10}"
                                title="Please enter exactly 10 digits"
                            />
                            {data.tp_no && !validatePhoneNumber(data.tp_no) && (
                                <p className="mt-1 text-sm text-red-400">Must be exactly 10 digits</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">WhatsApp Number</label>
                            <Input
                                type="text"
                                name="whatsapp_no"
                                placeholder="0771234567"
                                required={true}
                                value={data.whatsapp_no}
                                onChange={(e) => handlePhoneInput('whatsapp_no', e.target.value)}
                                pattern="\d{10}"
                                title="Please enter exactly 10 digits"
                            />
                            {data.whatsapp_no && !validatePhoneNumber(data.whatsapp_no) && (
                                <p className="mt-1 text-sm text-red-400">Must be exactly 10 digits</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Email Address</label>
                            <Input
                                type="email"
                                name="lec_email"
                                placeholder="Enter Email"
                                required={true}
                                value={data.lec_email}
                                onChange={(e) => setData('lec_email', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <Input
                                type="checkbox"
                                name="is_employed"
                                checked={data.is_employed}
                                onChange={(e) => setData('is_employed', e.target.checked)}
                            />
                            <label className="text-sm font-medium text-white">Employed at School</label>
                        </div>

                        {data.is_employed && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">School</label>
                                <select
                                    name="school_id"
                                    className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={data.school_id}
                                    onChange={(e) => setData('school_id', e.target.value)}
                                    required={data.is_employed}
                                >
                                    <option value="">-- Select School --</option>
                                    {schools.map((school) => (
                                        <option key={school.schoolId} value={school.schoolId}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Bank Account Number</label>
                            <Input
                                type="text"
                                name="bank_account"
                                placeholder="Enter account number"
                                value={data.bank_account}
                                onChange={(e) => handlePhoneInput('bank_account', e.target.value)}
                                pattern="\d+"
                                title="Please enter digits only"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Bank Name</label>
                            <Input
                                type="text"
                                name="bank_name"
                                placeholder="Enter bank name"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Bank Branch</label>
                            <Input
                                type="text"
                                name="bank_branch"
                                placeholder="Enter branch name"
                                value={data.bank_branch}
                                onChange={(e) => setData('bank_branch', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Vehicle Number</label>
                            <Input
                                type="text"
                                name="vehicle_no"
                                placeholder="Enter vehicle number"
                                value={data.vehicle_no}
                                onChange={(e) => setData('vehicle_no', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <Input type="checkbox" name="status" checked={data.status} onChange={(e) => setData('status', e.target.checked)} />
                            <label className="text-sm font-medium text-white">Active Status</label>
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
