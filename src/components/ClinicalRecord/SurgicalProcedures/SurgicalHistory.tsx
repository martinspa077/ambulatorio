'use client';

import { useState, useEffect } from 'react';
import { getHistory } from '@/services/surgicalProceduresService';
import { SurgicalHistoryItem } from '@/services/surgicalProceduresTypes';

interface SurgicalHistoryProps {
    ordsrvnro: string;
    initialHistory: SurgicalHistoryItem[];
}

export default function SurgicalHistory({ ordsrvnro, initialHistory }: SurgicalHistoryProps) {
    const [history, setHistory] = useState<SurgicalHistoryItem[]>(initialHistory);
    const [loading, setLoading] = useState(false);

    // Filters
    const [procedureFilter, setProcedureFilter] = useState('');
    const [coordinatedFilter, setCoordinatedFilter] = useState('todos');
    const [prescribedFilter, setPrescribedFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');

    // Sync props
    useEffect(() => {
        setHistory(initialHistory);
    }, [initialHistory]);

    // Apply filters (mock logic since API usually handles this)
    // Apply filters (mock logic since API usually handles this)
    const filteredHistory = history.filter(item => {
        const matchesProcedure = item.mainProcedure.toLowerCase().includes(procedureFilter.toLowerCase());
        const matchesStatus = statusFilter === 'todos' ||
            (statusFilter === 'pendiente_autorizacion' && item.status === 'pendiente_autorizacion') ||
            (statusFilter === 'pendiente_coordinar' && item.status === 'pendiente_coordinar') ||
            (statusFilter === 'coordinado' && item.status === 'coordinado') ||
            (statusFilter === 'suspendido' && item.status === 'suspendido') ||
            (statusFilter === 'realizado' && item.status === 'realizado');

        // Date filters
        let matchesPrescribedDate = true;
        if (prescribedFilter !== 'todos') {
            const requestDate = new Date(item.requestDate);
            const cutoffDate = new Date();

            if (prescribedFilter === '1_mes') {
                cutoffDate.setMonth(cutoffDate.getMonth() - 1);
            } else if (prescribedFilter === '6_meses') {
                cutoffDate.setMonth(cutoffDate.getMonth() - 6);
            } else if (prescribedFilter === '1_anio') {
                cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
            }

            // Should be greater or equal to cutoff (i.e., within the last X months)
            // Reset time part to compare dates effectively
            cutoffDate.setHours(0, 0, 0, 0);
            requestDate.setHours(0, 0, 0, 0);

            matchesPrescribedDate = requestDate >= cutoffDate;
        }

        return matchesProcedure && matchesStatus && matchesPrescribedDate;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [procedureFilter, coordinatedFilter, prescribedFilter, statusFilter]);

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pendiente_autorizacion': return 'Pendiente de autorización';
            case 'pendiente_coordinar': return 'Pendiente de coordinar';
            case 'coordinado': return 'Coordinado';
            case 'suspendido': return 'Suspendido';
            case 'realizado': return 'Realizado';
            default: return status;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                Histórico de Procedimientos Quirúrgicos
            </h3>

            {/* Filters */}
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Procedimiento
                    </label>
                    <input
                        type="text"
                        value={procedureFilter}
                        onChange={(e) => setProcedureFilter(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-white"
                    />
                </div>
                <div className="col-span-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Prescripto hace
                    </label>
                    <select
                        value={prescribedFilter}
                        onChange={(e) => setPrescribedFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="todos">Todos</option>
                        <option value="1_mes">Un mes</option>
                        <option value="6_meses">6 meses</option>
                        <option value="1_anio">1 año</option>
                    </select>
                </div>
                <div className="col-span-5">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Estado
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-white"
                    >
                        <option value="todos">Todos</option>
                        <option value="pendiente_autorizacion">Pendiente de autorización</option>
                        <option value="pendiente_coordinar">Pendiente de coordinación</option>
                        <option value="coordinado">Coordinado</option>
                        <option value="suspendido">Suspendido</option>
                        <option value="realizado">Realizado</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#005F61] text-white">
                        <tr>
                            <th className="px-4 py-3 font-bold">Procedimiento</th>
                            <th className="px-4 py-3 font-bold">Fecha de solicitud</th>
                            <th className="px-4 py-3 font-bold">Fecha coordinada</th>
                            <th className="px-4 py-3 font-bold">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Cargando...
                                </td>
                            </tr>
                        ) : filteredHistory.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        ) : (
                            paginatedHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">
                                        {item.mainProcedure}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        {item.requestDate}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                        {item.coordinationDate || '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                                        {getStatusLabel(item.status)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Pagination */}
            <div className="flex justify-end items-center text-xs text-slate-500 dark:text-slate-400">
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
