'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
                {/* Placeholder for Hospital Logo - using text if image not available or Icon */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-700/90 rounded-full grid grid-cols-2 grid-rows-2 p-0.5 gap-0.5 overflow-hidden">
                        <div className="bg-white rounded-tl-full"></div>
                        <div className="bg-white rounded-tr-full"></div>
                        <div className="bg-white rounded-bl-full"></div>
                        <div className="bg-white rounded-br-full"></div>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Hospital</span>
                        <span className="text-xl font-black text-green-700 tracking-tight">BSE</span>
                    </div>
                </div>
            </div>

            {/* Right: User Info & Actions */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-teal-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </button>
                    <button className="text-slate-500 hover:text-teal-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {user?.lastName} {user?.firstName}
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="text-sm font-medium">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
