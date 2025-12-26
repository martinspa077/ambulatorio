'use client';

import { useState, useEffect, useRef } from 'react';
import { diagnosticsService, ActiveProblem, DiagnosticHistoryItem, ConsultationDiagnosis } from '@/services/diagnosticsService';
import ActiveProblemsGrid from './ActiveProblemsGrid';
import DiagnosticHistoryGrid from './DiagnosticHistoryGrid';
import ConsultationDiagnostics from './ConsultationDiagnostics';

interface DiagnosticsProps {
    ordsrvnro: number;
}

export default function Diagnostics({ ordsrvnro }: DiagnosticsProps) {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [activeProblems, setActiveProblems] = useState<ActiveProblem[]>([]);
    const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticHistoryItem[]>([]);
    const [consultationDiagnostics, setConsultationDiagnostics] = useState<ConsultationDiagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [diagnosisToAdd, setDiagnosisToAdd] = useState<string | null>(null);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [problems, history, consultation] = await Promise.all([
                    diagnosticsService.getActiveProblems(ordsrvnro),
                    diagnosticsService.getDiagnosticHistory(ordsrvnro),
                    diagnosticsService.getConsultationDiagnostics(ordsrvnro)
                ]);

                setActiveProblems(problems);
                setDiagnosticHistory(history);
                setConsultationDiagnostics(consultation);
            } catch (error) {
                console.error('Error loading diagnostics data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [ordsrvnro]);

    // Ref to track current diagnostics for save on unmount
    const consultationDiagnosticsRef = useRef(consultationDiagnostics);

    // Update ref whenever diagnostics change
    useEffect(() => {
        consultationDiagnosticsRef.current = consultationDiagnostics;
    }, [consultationDiagnostics]);

    // Save on unmount
    useEffect(() => {
        return () => {
            const diagnosticsToSave = consultationDiagnosticsRef.current;
            if (diagnosticsToSave.length > 0) {
                // We use the service directly here. 
                // correct logic depends on whether we want to await this or just fire it.
                // Since it's unmount, fire and forget is often safer for sync unmounts,
                // but for critical data, a more robust solution like navigator.sendBeacon might be needed if the fetch cancels.
                // For now, consistent with other parts of the app, we'll just call the async function.
                diagnosticsService.saveConsultationDiagnostics(ordsrvnro, diagnosticsToSave).catch(err => {
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
