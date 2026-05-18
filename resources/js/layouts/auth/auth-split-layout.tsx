import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from 'react-router-dom';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const name = 'iClass';
    const quote = {
        message: 'Empowering the next generation of learners through seamless class management and innovative educational tools.',
        author: 'iClass Education'
    };

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-slate-950">
            <div className="relative hidden h-full flex-col bg-muted p-12 text-white lg:flex dark:border-r overflow-hidden">
                <div className="absolute inset-0 bg-zinc-950">
                    <img
                        src="/images/auth-bg.png"
                        alt="Background"
                        className="h-full w-full object-cover opacity-70 scale-105 animate-pulse-slow brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-purple-600/30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60" />
                </div>
                
                <Link to="/" className="relative z-20 flex items-center gap-3 group transition-all">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 group-hover:scale-110 transition-transform">
                        <AppLogoIcon className="size-8 fill-current text-white drop-shadow-glow" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{name}</span>
                </Link>

                {quote && (
                    <div className="relative z-20 mt-auto">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl">
                            <blockquote className="space-y-6">
                                <p className="text-2xl font-medium leading-snug text-white/95 tracking-tight">
                                    &ldquo;{quote.message}&rdquo;
                                </p>
                                <footer className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">
                                    <span className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-transparent" />
                                    {quote.author}
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative w-full lg:p-8 flex items-center justify-center min-h-screen lg:min-h-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px] p-4">
                    <Link to="/" className="relative z-20 flex items-center justify-center lg:hidden mb-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
                            <AppLogoIcon className="h-10 fill-current text-white" />
                        </div>
                    </Link>

                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-4xl font-black tracking-tight text-white">{title}</h1>
                        <p className="text-lg text-slate-400 max-w-[300px]">{description}</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
