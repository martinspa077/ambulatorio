'use client';

import { ActiveProblem } from '@/services/diagnosticsService';

interface ActiveProblemsGridProps {
    problems: ActiveProblem[];
    onCopyProblem: (problem: ActiveProblem) => void;
    loading?: boolean;
}

export default function ActiveProblemsGrid({ problems, onCopyProblem, loading }: ActiveProblemsGridProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (problems.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium">No hay problemas activos registrados</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {problems.map((problem) => (
                <div
                    key={problem.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors group"
                >
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[90px]">
                            {problem.startDate}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            {problem.diagnosis}
                        </span>
                    </div>

                    <button
                        onClick={() => onCopyProblem(problem)}
                        className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all group-hover:scale-110"
                        title="Copiar a diagnósticos de la consulta"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
