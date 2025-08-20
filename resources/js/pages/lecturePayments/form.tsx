// resources/js/pages/lecture-payments/form.tsx
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Class {
    cid: string;
    name: string;
    total_earned: number;
    total_paid: number;
    due_amount: number;
    student_count: number;
}

interface Props {
    lecture: {
        lid: string;
        lec_name: string;
    };
    classes: Class[];
    last_payment_date: string | null;
    current_year: number;
    current_month: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Lecture Payments', href: route('lecture-payments.index') },
    { title: 'Make Payment', href: '' },
];

export default function PaymentForm({ lecture, classes, last_payment_date, current_year, current_month }: Props) {
    const { data, setData, post, processing } = useForm({
        lid: lecture.lid,
        lec_name: lecture.lec_name,
        cid: classes.length > 0 ? classes[0].cid : '',
        year: current_year,
        month: current_month,
        amount: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('lecture-payments.store', lecture.lid), {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Payment has been recorded',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    const months = [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
    ];

    const years = Array.from({ length: 10 }, (_, i) => current_year - 5 + i);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Make Payment" />
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-h-full max-w-full rounded-xl bg-slate-800 p-10 text-white shadow-xl shadow-slate-700"
                >
                    <h2 className="mb-8 text-center text-3xl font-bold">Make Payment for {lecture.lec_name}</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Lecture ID */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Lecture ID</label>
                            <Input
                                type="text"
                                value={lecture.lid}
                                readOnly
                                className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-500 px-4 py-2 text-white"
                            />
                        </div>

                        {/* Lecture Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Lecture Name</label>
                            <Input
                                type="text"
                                value={lecture.lec_name}
                                readOnly
                                className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-500 px-4 py-2 text-white"
                            />
                        </div>

                        {/* Classes Taught Display */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-white">Classes Taught</label>
                            <div className="rounded-md bg-slate-700 p-4">
                                {classes.length > 0 ? (
                                    classes.map((cls) => (
                                        <div key={cls.cid} className="mb-2 flex justify-between">
                                            <span>{cls.name}</span>
                                            <span>Students: {cls.student_count}</span>
                                            <span>Earned: Rs.{Number(cls.total_earned).toFixed(2)}</span>
                                            <span>Paid: Rs.{Number(cls.total_paid).toFixed(2)}</span>
                                            <span>Due: Rs.{Number(cls.due_amount).toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span>No classes assigned</span>
                                )}
                            </div>
                        </div>

                        {/* Last Payment Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Last Payment Date</label>
                            <Input
                                type="text"
                                value={last_payment_date || 'No payments'}
                                readOnly
                                className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-500 px-4 py-2 text-white"
                            />
                        </div>

                        {/* Class Select */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Class</label>
                            <Select value={data.cid} onValueChange={(value) => setData('cid', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.cid} value={cls.cid}>
                                            {cls.name} (Due: Rs.{Number(cls.due_amount).toFixed(2)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Year Select */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Year</label>
                            <Select value={data.year.toString()} onValueChange={(value) => setData('year', parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Month Select */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Month</label>
                            <Select value={data.month.toString()} onValueChange={(value) => setData('month', parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                            {month.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Payment Amount</label>
                            <Input
                                type="number"
                                name="amount"
                                placeholder="Enter payment amount"
                                required
                                min="0"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                        >
                            Submit Payment
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
