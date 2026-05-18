import { useFormSpa } from '@/hooks/use-form-spa';
import { LoaderCircle, Mail, Lock, LogIn } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const navigate = useNavigate();
    const { data, setData, post, processing, errors, reset } = useFormSpa<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => navigate('/dashboard'),
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back" description="Please enter your details to sign in to your account">
            <Helmet>
                <title>Sign In | iClass</title>
            </Helmet>

            <form className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@company.com"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" discouraged-className="text-slate-300 font-medium">Password</Label>
                            {canResetPassword && (
                                <Link to="/password/reset" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors" tabIndex={5}>
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="bg-slate-900/50 border-slate-700 pl-10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-11"
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3 ml-1">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            tabIndex={3}
                            className="border-slate-700 data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="remember" className="text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                            Keep me logged in
                        </Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-2 w-full font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 h-11 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : (
                            <>
                                <LogIn className="mr-2 h-5 w-5" />
                                Sign In
                            </>
                        )}
                    </Button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Or continue with</span>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    <Button variant="outline" type="button" className="w-full bg-slate-900/50 border-slate-800 hover:bg-slate-800 transition-colors h-11" onClick={() => {}}>
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors" tabIndex={6}>
                        Sign up for free
                    </Link>
                </div>
            </form>

            {status && (
                <div className="mt-6 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                        {status}
                    </span>
                </div>
            )}
        </AuthLayout>
    );
}
