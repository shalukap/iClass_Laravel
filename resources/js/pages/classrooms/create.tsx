import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormSpa } from '@/hooks/use-form-spa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, DoorOpen, Save, ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

export default function CreateOrEdit() {
    const { classroomId } = useParams();
    const isEdit = !!classroomId;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(isEdit);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Classrooms', href: '/classrooms' },
        { title: `${isEdit ? 'Edit' : 'Create'} Venue`, href: '' },
    ];

    const { data, setData, post, patch, processing, errors } = useFormSpa({
        classroomId: '',
        name: '',
    });

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/api/classrooms/${classroomId}/edit`);
                    const c = response.data.classroom;
                    setData({
                        classroomId: c.classroomId || '',
                        name: c.name || '',
                    });
                } catch (error) {
                    console.error('Error fetching classroom:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Sync Error',
                        text: 'Failed to retrieve classroom configuration.',
                        background: '#1e293b',
                        color: '#fff'
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isEdit, classroomId]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Venue has been ${isEdit ? 'updated' : 'configured'}`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff'
                });
                navigate('/classrooms');
            },
            onError: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Configuration Failed',
                    text: err.response?.data?.message || 'Please check venue details.',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        };

        if (!isEdit) {
            post('/api/classrooms', options);
        } else {
            patch(`/api/classrooms/${classroomId}`, options);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[50vh] text-white animate-pulse">
                    <DoorOpen className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Mapping institutional spaces...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>{isEdit ? 'Edit Venue' : 'Create Venue'} - iClass</title>
            </Helmet>
            
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/classrooms')} className="text-white hover:bg-white/10">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {isEdit ? 'Update Venue' : 'Configure New Venue'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit ? 'Modify the identifier or label for this classroom.' : 'Establish a new physical or digital learning space.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="h-2 bg-gradient-to-r from-emerald-500 to-indigo-500" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Layout className="h-5 w-5 text-indigo-400" />
                                Classroom Specification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isEdit && (
                                    <div className="space-y-2 opacity-60">
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Venue ID</label>
                                        <div className="relative">
                                            <Input
                                                readOnly
                                                value={data.classroomId}
                                                className="h-12 bg-slate-900 border-white/10 text-white cursor-not-allowed font-mono"
                                            />
                                            <Info className="absolute right-3 top-3.5 h-4 w-4 text-white/20" />
                                        </div>
                                    </div>
                                )}
                                <div className={`space-y-2 ${!isEdit ? 'md:col-span-2' : ''}`}>
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Venue Name / Label</label>
                                    <Input
                                        placeholder="e.g. Hall A, Lab 02, or Online Session"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-12 bg-slate-900 border-white/10 text-white"
                                    />
                                    {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex gap-3">
                                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-white">Resource Allocation</span>
                                    <span className="text-[10px] text-white/40 leading-relaxed">
                                        Once created, this venue can be assigned to multiple class sessions throughout the week.
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => navigate('/classrooms')}
                            className="text-white/40 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all"
                        >
                            {processing ? 'Processing...' : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    {isEdit ? 'Update Details' : 'Configure Venue'}
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
