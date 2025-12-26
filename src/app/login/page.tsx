'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(username, password);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden font-sans">
            {/* Left Side: Immersive Background */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-teal-900">
                <Image
                    src="/images/login-bg.png"
                    alt="Medical Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-transparent to-transparent flex flex-col justify-end p-16">
                    <div className="space-y-4">
                        <div className="w-16 h-1 bg-teal-400 rounded-full"></div>
                        <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Gestión Médica <br /> Profesional
                        </h2>
                        <p className="text-teal-50 text-lg max-w-md opacity-90">
                            Plataforma integral para el cuidado del paciente y gestión clínica eficiente.
                        </p>
                    </div>
                </div>

                <div className="absolute top-12 left-12 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 px-5 rounded-2xl border border-white/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <span className="text-white font-bold tracking-wider text-sm">EMR PORTAL</span>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-[400px]">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="bg-teal-600 p-3 rounded-2xl shadow-lg">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                            Iniciar Sesión
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Ingrese sus datos para acceder al sistema.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/20">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-600 dark:text-slate-400" htmlFor="username">
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="usuario"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-600 dark:text-slate-400" htmlFor="password">
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs font-bold text-teal-600 hover:text-teal-500 uppercase tracking-tighter"
                                >
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Recordarme</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-teal-600 hover:text-teal-500">
                                ¿Olvidó su clave?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'INGRESANDO...' : 'ENTRAR'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
