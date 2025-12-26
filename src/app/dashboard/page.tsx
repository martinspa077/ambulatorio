'use client';

import PageLayout from '@/components/Navigation/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="min-screen flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Pacientes Hoy', value: '12', trend: '+2', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { label: 'Citas Pendientes', value: '4', trend: 'Estable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { label: 'Informes Nuevos', value: '7', trend: '+3', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <PageLayout>
            <main className="flex-1 p-8 lg:p-12 animate-in fade-in duration-1000">
                <header className="flex justify-between items-end mb-12">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Buen día, Dr. {user?.lastName}
                        </h1>
                        <p className="text-slate-500 font-medium">Aquí tienes un resumen de tu actividad para hoy.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-semibold text-teal-600 shadow-sm border border-slate-200 dark:border-slate-700">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-6 rounded-2xl glass-effect group hover:translate-y-[-4px] transition-all duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-11 h-11 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d={stat.icon} />
                                    </svg>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-slate-500 bg-slate-50 dark:bg-slate-800'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h2>
                                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-8 rounded-2xl glass-effect">
                        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                            Próximas Citas
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-medium">No hay citas programadas para la próxima hora.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 rounded-2xl glass-effect">
                        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Pacientes Recientes</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { name: 'Juan Pérez', detail: 'Gripe común • Hace 2 horas', initials: 'JP' },
                                { name: 'María García', detail: 'Control post-operatorio • Hace 4 horas', initials: 'MG' }
                            ].map((patient, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400">
                                        {patient.initials}
                                    </div>
                                    <div>
                                        <strong className="block text-sm text-slate-900 dark:text-white leading-none mb-1">{patient.name}</strong>
                                        <span className="text-xs text-slate-500 font-medium">{patient.detail}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}
