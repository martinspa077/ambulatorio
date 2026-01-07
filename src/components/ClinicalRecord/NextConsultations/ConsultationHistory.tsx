'use client';

import { useState, useEffect } from 'react';
import { getConsultationHistory } from '@/services/nextConsultationsService';
import { ConsultationHistoryItem } from '@/services/nextConsultationsTypes';

interface ConsultationHistoryProps {
    ordsrvnro: string;
}

export default function ConsultationHistory({ ordsrvnro }: ConsultationHistoryProps) {
    const [history, setHistory] = useState<ConsultationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [professionalFilter, setProfessionalFilter] = useState(''); // Assuming professional is part of filtering logic even if not in item yet
    const [timeFilter, setTimeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Pass filters to service in real app
                const data = await getConsultationHistory(ordsrvnro);
                setHistory(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [ordsrvnro]);

    const getStatusBadge = (status: ConsultationHistoryItem['status']) => {
        switch (status) {
            case 'pendiente_coordinar':
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-bold text-xs uppercase tracking-wide">Pendiente de coordinar</span>;
            case 'coordinado':
                return <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full font-bold text-xs uppercase tracking-wide">Coordinado</span>;
            case 'cumplido':
                return <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-bold text-xs uppercase tracking-wide">Cumplido</span>;
            default:
                return null;
        }
    };

    // Filtered History
    const filteredHistory = history.filter(item => {
        // Specialty Filter
        if (specialtyFilter && !item.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())) {
            return false;
        }

        // Status Filter
        if (statusFilter !== 'Todos') {
            const statusMap: Record<string, string> = {
                'Pendiente': 'pendiente_coordinar',
                'Coordinado': 'coordinado',
                'Cumplido': 'cumplido'
            };
            if (item.status !== statusMap[statusFilter]) return false;
        }

        // Time Filter (using requestDate)
        if (timeFilter !== 'Todos' && item.requestDate) {
            const date = new Date(item.requestDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (timeFilter === 'Último mes' && diffDays > 30) return false;
            if (timeFilter === 'Últimos 3 meses' && diffDays > 90) return false;
            if (timeFilter === 'Último año' && diffDays > 365) return false;
        }

        return true;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [specialtyFilter, timeFilter, statusFilter]);

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full shadow-sm">
            <div className="shrink-0 flex flex-col gap-6 mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Histórico de consultas</h2>

                {/* Filters */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Especialidad</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:border-teal-500"
                            value={specialtyFilter}
                            onChange={e => setSpecialtyFilter(e.target.value)}
                        />
                    </div>
                    {/* Professional Filter Removed */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prescripto hace</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:border-teal-500"
                            value={timeFilter}
                            onChange={e => setTimeFilter(e.target.value)}
                        >
                            <option>Todos</option>
                            <option>Último mes</option>
                            <option>Últimos 3 meses</option>
                            <option>Último año</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estado</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white dark:bg-slate-800 focus:outline-none focus:border-teal-500"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option>Todos</option>
                            <option>Pendiente</option>
                            <option>Coordinado</option>
                            <option>Cumplido</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl mb-0 custom-scrollbar">
                <table className="w-full relative text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#005F61] text-white">
                        <tr className="bg-[#005F61] text-white text-left text-sm">
                            <th className="px-6 py-4 font-bold">Especialidad</th>
                            <th className="px-6 py-4 font-bold">Fecha de solicitud</th>
                            <th className="px-6 py-4 font-bold">Fecha coordinada</th>
                            <th className="px-6 py-4 font-bold">Policlínica</th>
                            <th className="px-6 py-4 font-bold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Cargando histórico...
                                </td>
                            </tr>
                        ) : filteredHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">
                                    No se encontraron consultas previas
                                </td>
                            </tr>
                        ) : (
                            paginatedHistory.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                                        {item.specialty}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                        {item.requestDate ? new Date(item.requestDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                        {item.coordinationDate ? new Date(item.coordinationDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                        {item.polyclinic || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(item.status)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Pagination */}
            <div className="flex justify-end items-center text-xs text-slate-500 dark:text-slate-400 mt-4 shrink-0">
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                            Anterior
                        </button>
                        <span className="font-medium">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
