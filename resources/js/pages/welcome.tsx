import { useAuth } from '@/contexts/auth-context';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Users, ShieldCheck, Zap } from 'lucide-react';

export default function Welcome() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
            <Helmet>
                <title>iClass - Premium Learning Management</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>

            {/* Navigation */}
            <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 lg:px-12 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white/90">iClass</span>
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="group flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20"
                        >
                            Go to Dashboard
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-95"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative flex flex-col items-center justify-center px-6 pt-32 pb-24 lg:px-12 lg:pt-48">
                {/* Background Glows */}
                <div className="absolute top-0 -left-20 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-0 -right-20 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />

                <div className="relative max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        <Zap className="h-3.5 w-3.5" />
                        <span>The future of education is here</span>
                    </div>

                    <h1 className="mb-8 text-5xl font-bold tracking-tight lg:text-7xl">
                        Empower Your Learning <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Without Boundaries
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60 lg:text-xl">
                        Experience the most advanced learning management system designed for modern institutions. 
                        Streamline your workflow, engage students, and achieve excellence.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            to="/register"
                            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 text-lg font-bold text-black transition-all hover:bg-indigo-50 sm:w-auto"
                        >
                            Start for Free
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#features"
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-8 text-lg font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10 sm:w-auto"
                        >
                            See Features
                        </a>
                    </div>
                </div>

                {/* Dashboard Preview Overlay */}
                <div className="relative mt-20 w-full max-w-5xl rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 shadow-2xl shadow-indigo-500/5">
                    <div className="overflow-hidden rounded-2xl bg-[#0a0a0a] relative">
                         <img 
                            src="/images/welcome_hero_bg_1778130074819.png" 
                            alt="iClass Dashboard Preview" 
                            className="w-full object-cover opacity-60 mix-blend-screen"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-t from-[#030303] via-transparent to-transparent">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-auto">
                                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl ring-1 ring-white/10 text-left">
                                    <Users className="h-8 w-8 text-indigo-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2 text-white">Student Centric</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">Personalized learning paths for every student's unique needs.</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl ring-1 ring-white/10 text-left">
                                    <ShieldCheck className="h-8 w-8 text-purple-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2 text-white">Secure & Private</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">Enterprise-grade security to protect your institutional data.</p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-xl ring-1 ring-white/10 text-left">
                                    <BookOpen className="h-8 w-8 text-pink-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2 text-white">Rich Analytics</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">Gain deep insights with our advanced reporting engine.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 lg:px-12 bg-white/[0.02]">
                <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-indigo-500" />
                        <span className="text-lg font-bold tracking-tight">iClass</span>
                    </div>
                    <p className="text-sm text-white/40">© 2024 iClass LMS. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
