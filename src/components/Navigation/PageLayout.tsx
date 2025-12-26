'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { useLayout } from '@/context/LayoutContext';

export default function PageLayout({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const { sidebarOpen } = useLayout();

    return (
        <div className={`flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500`}>
            <Sidebar />
            <div className={`flex-1 flex flex-col w-full transition-[padding] duration-300 ${sidebarOpen ? 'pl-[280px]' : 'pl-[80px]'} ${className}`}>
                <Header />
                {children}
            </div>
        </div>
    );
}
