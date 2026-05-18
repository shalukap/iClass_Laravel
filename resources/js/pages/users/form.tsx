import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Shield, User2, Mail, Lock, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const AVAILABLE_MENUS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'schools', label: 'Schools' },
    { id: 'lectures', label: 'Lectures' },
    { id: 'classes', label: 'Classes' },
    { id: 'classrooms', label: 'Classrooms' },
    { id: 'enrollments', label: 'Enrollments' },
    { id: 'student_payments', label: 'Student Payments' },
    { id: 'lecture_payments', label: 'Lecture Payments' },
    { id: 'collection_report', label: 'Collection Report' },
    { id: 'user_management', label: 'User Management' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Form', href: '#' },
];

export default function UserForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        user_type: 'receptionist',
        status: 'active',
        privileges: [] as string[]
    });

    const togglePrivilege = (id: string) => {
        setData(prev => {
            const current = [...prev.privileges];
            if (current.includes(id)) {
                return { ...prev, privileges: current.filter(p => p !== id) };
            } else {
                return { ...prev, privileges: [...current, id] };
            }
        });
    };

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (isEdit) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`/api/users/${id}/edit`);
                    const user = response.data.user;
                    setData({
                        name: user.name,
                        email: user.email,
                        password: '',
                        user_type: user.user_type,
                        status: user.status,
                        privileges: user.privileges || []
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to load user data.',
                        background: '#1e293b',
                        color: '#fff'
                    });
                } finally {
                    setFetching(false);
                }
            };
            fetchUser();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (isEdit) {
                await axios.put(`/api/users/${id}`, data);
            } else {
                await axios.post('/api/users', data);
            }

            Swal.fire({
                icon: 'success',
                title: isEdit ? 'User Updated' : 'User Created',
                text: `Successfully ${isEdit ? 'updated' : 'created'} the user account.`,
                background: '#1e293b',
                color: '#fff'
            });
            navigate('/users');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Action Failed',
                    text: 'Something went wrong. Please try again.',
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-white animate-pulse">
                    <User2 className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-muted-foreground">Preparing user account details...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>{isEdit ? 'Edit User' : 'Create User'} - iClass</title>
            </Helmet>
            
            <div className="max-w-4xl mx-auto p-8 space-y-6 pb-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/users')} className="text-white hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit User Profile' : 'Create User Account'}</h1>
                        <p className="text-sm text-white/40">Configure system access and identity.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <User2 className="h-5 w-5 text-indigo-400" />
                                        Identity Information
                                    </CardTitle>
                                    <CardDescription className="text-white/40">Enter the user's personal and login details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">User Name</Label>
                                        <div className="relative">
                                            <Input
                                                value={data.name}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                                className={`bg-black/40 border-white/10 text-white h-12 pl-10 ${errors.name ? 'border-rose-500' : ''}`}
                                                placeholder="e.g. John Doe"
                                            />
                                            <User2 className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                                        </div>
                                        {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.name[0]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Email Address</Label>
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                                className={`bg-black/40 border-white/10 text-white h-12 pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                                                placeholder="e.g. john@example.com"
                                            />
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                                        </div>
                                        {errors.email && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.email[0]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Password {isEdit && '(Leave blank to keep current)'}</Label>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                                className={`bg-black/40 border-white/10 text-white h-12 pl-10 ${errors.password ? 'border-rose-500' : ''}`}
                                                placeholder="••••••••"
                                            />
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/20" />
                                        </div>
                                        {errors.password && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.password[0]}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                                <div className="h-1 bg-indigo-500/30" />
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-indigo-400" />
                                        Access & Permissions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">User Role</Label>
                                            <Select 
                                                value={data.user_type} 
                                                onValueChange={(val: any) => {
                                                    const isSpecial = val === 'root' || val === 'admin';
                                                    setData({ 
                                                        ...data, 
                                                        user_type: val,
                                                        privileges: isSpecial ? AVAILABLE_MENUS.map(m => m.id) : []
                                                    });
                                                }}
                                            >
                                                <SelectTrigger className="bg-black/40 border-white/10 text-white h-12">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="receptionist">Receptionist</SelectItem>
                                                    <SelectItem value="admin">Administrator</SelectItem>
                                                    <SelectItem value="root">Root User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Account Status</Label>
                                            <div className="flex items-center gap-4 h-12 px-4 bg-black/20 rounded-xl border border-white/5">
                                                <Switch 
                                                    checked={data.status === 'active'} 
                                                    onCheckedChange={(checked) => setData({ ...data, status: checked ? 'active' : 'deactive' })}
                                                />
                                                <span className={`text-sm font-bold ${data.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {data.status === 'active' ? 'Account Active' : 'Account Disabled'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Menu Privileges</Label>
                                            {(data.user_type === 'root' || data.user_type === 'admin') && (
                                                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">All Access Granted</Badge>
                                            )}
                                        </div>

                                        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${data.user_type !== 'receptionist' ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {AVAILABLE_MENUS.map((menu) => (
                                                <div 
                                                    key={menu.id} 
                                                    onClick={() => data.user_type === 'receptionist' && togglePrivilege(menu.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                                        data.privileges.includes(menu.id)
                                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                                        : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'
                                                    }`}
                                                >
                                                    <Checkbox 
                                                        checked={data.privileges.includes(menu.id)}
                                                        onCheckedChange={() => {}} // Handled by div click
                                                        className="border-white/20 data-[state=checked]:bg-indigo-600"
                                                    />
                                                    <span className="text-xs font-medium">{menu.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {data.user_type === 'receptionist' && data.privileges.length === 0 && (
                                            <p className="text-[10px] text-amber-400/60 italic flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                User will have no menu access. Please select at least one menu.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                             <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl space-y-4">
                                <h4 className="text-indigo-400 font-black uppercase tracking-tighter text-sm">Summary</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white/40">Role</span>
                                        <span className="text-white font-bold capitalize">{data.user_type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white/40">Status</span>
                                        <span className={`font-bold ${data.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {data.status === 'active' ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl shadow-xl shadow-indigo-600/20"
                                >
                                    {loading ? 'Saving...' : (isEdit ? 'Update Account' : 'Create Account')}
                                    {!loading && <Save className="ml-2 h-4 w-4" />}
                                </Button>
                             </div>

                             <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardHeader>
                                    <CardTitle className="text-xs font-black text-white/40 uppercase tracking-widest">Help</CardTitle>
                                </CardHeader>
                                <CardContent className="text-[10px] text-white/30 space-y-2 leading-relaxed">
                                    <p>• <b>Receptionist</b>: Limited access to student and payment records.</p>
                                    <p>• <b>Admin</b>: Full access to students, payments, and reports.</p>
                                    <p>• <b>Root</b>: Complete system control including user management.</p>
                                </CardContent>
                             </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
