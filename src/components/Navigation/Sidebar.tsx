'use client';

import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const { user } = useAuth();
    const { sidebarOpen, toggleSidebar } = useLayout();
    const pathname = usePathname();

    const menuItems = [
        { name: 'Agenda del día', path: '/agenda', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-screen flex flex-col items-center bg-[#005F61] text-white z-50 transition-all duration-300 ${sidebarOpen ? 'w-[280px] p-6' : 'w-[80px] py-6 px-2'
                }`}
        >
            {/* Hamburger / Toggle */}
            <button
                onClick={toggleSidebar}
                className="mb-10 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                title="Menú"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <nav className="flex-1 w-full flex flex-col gap-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center ${sidebarOpen ? 'gap-4 px-4' : 'justify-center'} py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 ${pathname === item.path ? "bg-white/20 shadow-md" : "text-slate-300 hover:text-white"
                            }`}
                        title={sidebarOpen ? '' : item.name}
                    >
                        <svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={item.icon} />
                        </svg>
                        {sidebarOpen && (
                            <span className="whitespace-nowrap animate-in fade-in duration-300">{item.name}</span>
                        )}
                    </Link>
                ))}
            </nav>

        </aside>
    );
}
