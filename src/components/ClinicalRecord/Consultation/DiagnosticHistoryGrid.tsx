'use client';

import { useState, useMemo } from 'react';
import { DiagnosticHistoryItem } from '@/services/diagnosticsService';

interface DiagnosticHistoryGridProps {
    history: DiagnosticHistoryItem[];
    onCopyDiagnosis: (item: DiagnosticHistoryItem) => void;
    loading?: boolean;
}

export default function DiagnosticHistoryGrid({ history, onCopyDiagnosis, loading }: DiagnosticHistoryGridProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = searchTerm === '' ||
                item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

            // Simple date filtering (would need proper date parsing in production)
            const matchesDateFrom = dateFrom === '' || item.startDate >= dateFrom;
            const matchesDateTo = dateTo === '' || item.startDate <= dateTo;

            return matchesSearch && matchesDateFrom && matchesDateTo;
        });
    }, [history, searchTerm, dateFrom, dateTo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Buscar diagnóstico/problema
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese término de búsqueda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>

                <div className="w-[180px]">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Fecha desde
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>

                <div className="w-[180px]">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Fecha hasta
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-12"></th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fecha Inicio</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Diagnóstico/Problema</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Profesional</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-sm font-medium">No se encontraron resultados</p>
                                </td>
                            </tr>
                        ) : (
                            filteredHistory.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onCopyDiagnosis(item)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        {item.isProblem && (
                                            <div className="relative group">
                                                <svg
                                                    className={`w-5 h-5 ${item.problemStatus === 'active' ? 'text-red-500' : 'text-slate-400'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                                </svg>
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-32 px-2 py-1 text-xs text-white bg-slate-900 rounded shadow-lg">
                                                    {item.problemStatus === 'active' ? 'Problema activo' : 'Problema resuelto'}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {item.startDate}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                        {item.diagnosis}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                        {item.professional}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
