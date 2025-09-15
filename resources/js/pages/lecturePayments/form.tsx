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
    const { data, setData, post, processing, errors } = useForm({
        lid: lecture.lid,
        lec_name: lecture.lec_name,
        cids: [] as string[],
        year: current_year,
        month: current_month,
        amount: '',
    });

    // Handle checkbox toggle
    const toggleClassSelection = (cid: string) => {
        if (data.cids.includes(cid)) {
            setData('cids', data.cids.filter((id) => id !== cid));
        } else {
            setData('cids', [...data.cids, cid]);
        }
    };

    // Select all classes
    const selectAllClasses = () => {
        setData('cids', classes.map(cls => cls.cid));
    };

    // Clear all selections
    const clearAllClasses = () => {
        setData('cids', []);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Debug: log what's being sent
        console.log('Submitting data:', data);

        post(route('lecture-payments.store'), {
            data: {
                ...data,
                cids: data.cids, // Ensure array is properly sent
            },
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Payment has been recorded',
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onError: (errors) => {
                console.log('Errors:', errors);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error submitting payment',
                    text: errors.payment || 'Please check your inputs',
                    showConfirmButton: false,
                    timer: 3000,
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

                    {/* Display errors if any */}
                    {errors.payment && (
                        <div className="mb-6 rounded-md bg-red-500 p-4 text-white">
                            {errors.payment}
                        </div>
                    )}

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

                        {/* Class Selection Checkboxes */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-white">Select Classes</label>
                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={selectAllClasses}
                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={clearAllClasses}
                                    className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="rounded-md bg-slate-700 p-4 space-y-2">
                                {classes.length > 0 ? (
                                    classes.map((cls) => (
                                        <div key={cls.cid} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id={`class-${cls.cid}`}
                                                checked={data.cids.includes(cls.cid)}
                                                onChange={() => toggleClassSelection(cls.cid)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                            />
                                            <label htmlFor={`class-${cls.cid}`} className="text-sm">
                                                {cls.name} — Students: {cls.student_count} | Due: Rs.{Number(cls.due_amount).toFixed(2)}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <span>No classes assigned</span>
                                )}
                            </div>
                            {data.cids.length > 0 && (
                                <p className="mt-2 text-sm text-green-400">
                                    Selected {data.cids.length} class(es)
                                </p>
                            )}
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
                            disabled={processing || data.cids.length === 0}
                            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing...' : 'Submit Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
