import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Create({
    classItem,
    isEdit,
    classrooms,
    lectures,
}: {
    classItem?: any;
    isEdit?: boolean;
    classrooms?: any[];
    lectures?: any[];
}) {
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
        grade: classItem?.grade || 1,
        classroom_id: classItem?.classroom_id || '',
        lid: classItem?.lid || '',
        fee: classItem?.fee || 2000.0,
        medium: classItem?.medium || 'english',
        syllabus: classItem?.syllabus || 'local',
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
                            <label htmlFor="grade" className="mb-2 text-sm">
                                Grade
                            </label>
                            <Select value={data.grade.toString()} onValueChange={(value) => setData('grade', parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 13 }, (_, i) => i + 1).map((grade) => (
                                        <SelectItem key={grade} value={grade.toString()}>
                                            Grade {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="classroom_id" className="mb-2 text-sm">
                                Classroom
                            </label>
                            <Select value={data.classroom_id} onValueChange={(value) => setData('classroom_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select classroom" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classrooms?.map((classroom) => (
                                        <SelectItem key={classroom.classroomId} value={classroom.classroomId}>
                                            {classroom.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="lid" className="mb-2 text-sm">
                                Lecturer
                            </label>
                            <Select value={data.lid} onValueChange={(value) => setData('lid', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lecturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lectures?.map((lecture) => (
                                        <SelectItem key={lecture.lid} value={lecture.lid}>
                                            {lecture.lec_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                        <div className="flex flex-col">
                            <label htmlFor="fee" className="mb-2 text-sm">
                                Class Fee
                            </label>
                            <Input
                                type="number"
                                name="fee"
                                id="fee"
                                placeholder="Enter class fee"
                                required
                                value={data.fee}
                                onChange={(e) => setData('fee', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="medium" className="mb-2 text-sm">
                                Medium
                            </label>
                            <Select value={data.medium} onValueChange={(value) => setData('medium', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select medium" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="sinhala">Sinhala</SelectItem>
                                    <SelectItem value="tamil">Tamil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="syllabus" className="mb-2 text-sm">
                                Syllabus
                            </label>
                            <Select value={data.syllabus} onValueChange={(value) => setData('syllabus', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select syllabus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">Local Syllabus</SelectItem>
                                    <SelectItem value="london">London Syllabus</SelectItem>
                                </SelectContent>
                            </Select>
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
