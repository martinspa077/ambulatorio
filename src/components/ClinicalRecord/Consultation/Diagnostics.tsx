'use client';

import { useState, useEffect, useRef } from 'react';
import { getActiveProblems, getDiagnosticHistory, getConsultationDiagnostics, saveConsultationDiagnostics, ActiveProblem, DiagnosticHistoryItem, ConsultationDiagnosis } from '@/services/diagnosticsService';
import ActiveProblemsGrid from './ActiveProblemsGrid';
import DiagnosticHistoryGrid from './DiagnosticHistoryGrid';
import ConsultationDiagnostics from './ConsultationDiagnostics';

interface DiagnosticsProps {
    ordsrvnro: string;
    initialActiveProblems: ActiveProblem[];
    initialHistory: DiagnosticHistoryItem[];
    initialConsultationDiagnostics: ConsultationDiagnosis[];
}

export default function Diagnostics({
    ordsrvnro,
    initialActiveProblems,
    initialHistory,
    initialConsultationDiagnostics
}: DiagnosticsProps) {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [activeProblems, setActiveProblems] = useState<ActiveProblem[]>(initialActiveProblems);
    const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticHistoryItem[]>(initialHistory);
    const [consultationDiagnostics, setConsultationDiagnostics] = useState<ConsultationDiagnosis[]>(initialConsultationDiagnostics);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [diagnosisToAdd, setDiagnosisToAdd] = useState<string | null>(null);

    // Sync props with state
    useEffect(() => {
        setActiveProblems(initialActiveProblems);
    }, [initialActiveProblems]);

    useEffect(() => {
        setDiagnosticHistory(initialHistory);
    }, [initialHistory]);

    useEffect(() => {
        setConsultationDiagnostics(initialConsultationDiagnostics);
    }, [initialConsultationDiagnostics]);

    // Ref to track current diagnostics for save on unmount
    const consultationDiagnosticsRef = useRef(initialConsultationDiagnostics);

    // Update ref whenever diagnostics change
    useEffect(() => {
        consultationDiagnosticsRef.current = consultationDiagnostics;
    }, [consultationDiagnostics]);

    // Save on unmount
    useEffect(() => {
        return () => {
            const diagnosticsToSave = consultationDiagnosticsRef.current;
            if (diagnosticsToSave.length > 0) {
                const token = localStorage.getItem('gam_access_token') || '';
                saveConsultationDiagnostics(token, ordsrvnro, diagnosticsToSave).catch(err => {
                    console.error('Error saving diagnostics on unmount:', err);
                });
            }
        };
    }, [ordsrvnro]);

    const handleCopyProblem = (problem: ActiveProblem) => {
        setDiagnosisToAdd(problem.diagnosis);
    };

    const handleCopyFromHistory = (item: DiagnosticHistoryItem) => {
        const newDiagnosis: ConsultationDiagnosis = {
            id: Date.now().toString(),
            diagnosis: item.diagnosis,
            certainty: null,
            type: 'primario',
            isProblem: item.isProblem,
            problemStatus: item.problemStatus === 'active' ? 'activo' : item.problemStatus === 'resolved' ? 'resuelto' : undefined,
            isAlert: false,
            startDate: item.startDate,
            mspNotification: false
        };

        setConsultationDiagnostics([...consultationDiagnostics, newDiagnosis]);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Diagnóstico</h2>

            {/* Tabs and Grids Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Tab Headers */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-[#005F61]">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 px-6 py-3 font-bold transition-colors ${activeTab === 'active'
                            ? 'bg-amber-500 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        Problemas Activos
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-6 py-3 font-bold transition-colors ${activeTab === 'history'
                            ? 'bg-amber-500 text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        Histórico
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'active' ? (
                        <ActiveProblemsGrid
                            problems={activeProblems}
                            onCopyProblem={handleCopyProblem}
                            loading={loading}
                        />
                    ) : (
                        <DiagnosticHistoryGrid
                            history={diagnosticHistory}
                            onCopyDiagnosis={handleCopyFromHistory}
                            loading={loading}
                        />
                    )}
                </div>
            </div>

            {/* Consultation Diagnostics Section */}
            {/* Consultation Diagnostics Section */}
            <ConsultationDiagnostics
                diagnostics={consultationDiagnostics}
                onDiagnosticsChange={setConsultationDiagnostics}
                diagnosisToAdd={diagnosisToAdd}
                onDiagnosisProcessed={() => setDiagnosisToAdd(null)}
            />

            {/* Saving Indicator */}
            {saving && (
                <div className="text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-teal-600 rounded-full animate-spin"></div>
                    Guardando...
                </div>
            )}
        </div>
    );
}
