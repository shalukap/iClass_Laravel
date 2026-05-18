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
import { School, Building2, Save, ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Schools', href: '/schools' },
];

export default function CreateOrEdit() {
  const { schoolId } = useParams();
  const isEdit = !!schoolId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);

  const { data, setData, post, patch, processing, errors } = useFormSpa({
    schoolId: '',
    name: '',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchSchool = async () => {
        try {
          const response = await axios.get(`/api/schools/${schoolId}/edit`);
          const s = response.data.school;
          setData({
            schoolId: s.schoolId || '',
            name: s.name || '',
          });
        } catch (error) {
          console.error('Error fetching school:', error);
          Swal.fire({
              icon: 'error',
              title: 'Load Failed',
              text: 'Could not retrieve school details.',
              background: '#1e293b',
              color: '#fff'
          });
        } finally {
          setLoading(false);
        }
      };
      fetchSchool();
    }
  }, [isEdit, schoolId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `School has been ${isEdit ? 'updated' : 'registered'}`,
          showConfirmButton: false,
          timer: 2000,
          background: '#1e293b',
          color: '#fff'
        });
        navigate('/schools');
      },
      onError: (err: any) => {
          Swal.fire({
              icon: 'error',
              title: 'Registration Error',
              text: err.response?.data?.message || 'Please check school details.',
              background: '#1e293b',
              color: '#fff'
          });
      }
    };

    if (!isEdit) {
      post('/api/schools', options);
    } else {
      patch(`/api/schools/${schoolId}`, options);
    }
  };

  if (loading) {
      return (
          <AppLayout breadcrumbs={breadcrumbs}>
              <div className="flex flex-col items-center justify-center h-[50vh] text-white animate-pulse">
                  <Building2 className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-muted-foreground">Accessing institutional registry...</p>
              </div>
          </AppLayout>
      );
  }

  return (
    <AppLayout breadcrumbs={[...breadcrumbs, { title: `${isEdit ? 'Edit' : 'Register'} School`, href: '' }]}>
      <Helmet>
        <title>{isEdit ? 'Edit School' : 'Register School'} - iClass</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/schools')} className="text-white hover:bg-white/10">
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {isEdit ? 'Edit Institution' : 'Register New School'}
                </h1>
                <p className="text-muted-foreground">
                    {isEdit ? 'Update the details for this educational partner.' : 'Add a new school to the platform directory.'}
                </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                        <School className="h-5 w-5 text-indigo-400" />
                        School Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEdit && (
                            <div className="space-y-2 opacity-60">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">School ID</label>
                                <div className="relative">
                                    <Input
                                        readOnly
                                        value={data.schoolId}
                                        className="h-12 bg-slate-900 border-white/10 text-white cursor-not-allowed font-mono"
                                    />
                                    <Info className="absolute right-3 top-3.5 h-4 w-4 text-white/20" />
                                </div>
                            </div>
                        )}
                        <div className={`space-y-2 ${!isEdit ? 'md:col-span-2' : ''}`}>
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Institution Name</label>
                            <Input
                                placeholder="e.g. Royal College Colombo"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-12 bg-slate-900 border-white/10 text-white"
                            />
                            {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-white">Active Status</span>
                            <span className="text-[10px] text-white/40 leading-relaxed">
                                Registered schools are immediately available for student and lecturer assignments.
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate('/schools')}
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
                            {isEdit ? 'Update Details' : 'Register Institution'}
                        </div>
                    )}
                </Button>
            </div>
        </form>
      </div>
    </AppLayout>
  );
}
