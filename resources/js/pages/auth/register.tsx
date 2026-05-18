import { useFormSpa } from '@/hooks/use-form-spa';
import { LoaderCircle, User, Mail, Lock, UserPlus } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const navigate = useNavigate();
    const { data, setData, post, processing, errors, reset } = useFormSpa<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => navigate('/dashboard'),
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Join us today and start managing your classes efficiently">
            <Helmet>
                <title>Sign Up | iClass</title>
            </Helmet>

            <form className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" onSubmit={submit}>
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-300 font-medium ml-1">Full Name</Label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="John Doe"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="name@company.com"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" discouraged-className="text-slate-300 font-medium ml-1">Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" discouraged-className="text-slate-300 font-medium ml-1">Confirm password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 h-11 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        tabIndex={5} 
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : (
                            <>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Create Account
                            </>
                        )}
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-500 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors" tabIndex={6}>
                        Log in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
