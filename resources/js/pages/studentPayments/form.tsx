import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import Swal from 'sweetalert2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Class {
  cid: string;
  name: string;
  due_amount: number;
}

interface Props {
  student: {
    sid: string;
    sname: string;
  };
  classes: Class[];
  last_payment_date: string | null;
  current_year: number;
  current_month: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Student Payments', href: route('student-payments.index') },
  { title: 'Make Payment', href: '' },
];

export default function PaymentForm({
  student,
  classes,
  last_payment_date,
  current_year,
  current_month,
}: Props) {
  const { data, setData, post, processing } = useForm({
    sid: student.sid,
    sname: student.sname,
    cid: classes.length > 0 ? classes[0].cid : '',
    year: current_year,
    month: current_month,
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('student-payments.store', student.sid), {
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
          className="max-w-full max-h-full mx-auto bg-slate-800 p-10 rounded-xl shadow-xl shadow-slate-700 text-white"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Make Payment for {student.sname}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student ID */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Student ID
              </label>
              <Input
                type="text"
                value={student.sid}
                readOnly
                className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Student Name
              </label>
              <Input
                type="text"
                value={student.sname}
                readOnly
                className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
              />
            </div>

            {/* Enrolled Classes Display */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-white">
                Enrolled Classes
              </label>
              <div className="bg-slate-700 p-4 rounded-md">
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <div key={cls.cid} className="mb-2 flex justify-between">
                      <span>{cls.name}</span>
                    <span>Due: Rs. {Number(cls.due_amount).toFixed(2)}</span>

                    </div>
                  ))
                ) : (
                  <span>No classes enrolled</span>
                )}
              </div>
            </div>

            {/* Last Payment Date */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Last Payment Date
              </label>
              <Input
                type="text"
                value={last_payment_date || 'No payments'}
                readOnly
                className="w-full px-4 py-2 bg-gray-500 cursor-not-allowed text-white rounded-md border border-gray-300"
              />
            </div>

            {/* Class Select */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Class</label>
              <Select
                value={data.cid}
                onValueChange={(value) => setData('cid', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.cid} value={cls.cid}>
    {cls.name} (Due: Rs. {Number(cls.due_amount).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Select */}
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Year</label>
              <Select
                value={data.year.toString()}
                onValueChange={(value) => setData('year', parseInt(value))}
              >
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
              <label className="block mb-2 text-sm font-medium text-white">Month</label>
              <Select
                value={data.month.toString()}
                onValueChange={(value) => setData('month', parseInt(value))}
              >
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
              <label className="block mb-2 text-sm font-medium text-white">
                Payment Amount
              </label>
              <Input
                type="number"
                name="amount"
                placeholder="Enter payment amount"
                required
                min="0"
                step="0.01"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                className="w-full px-4 py-2 text-white bg-slate-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
