'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import PageLayout from '@/components/Navigation/PageLayout';
import ClinicalTabs from '@/components/ClinicalRecord/ClinicalTabs';
import PatientHeader, { HeaderData } from '@/components/ClinicalRecord/PatientHeader';
import ConsultationTab, { ConsultationData } from '@/components/ClinicalRecord/ConsultationTab';
import SummaryTab from '@/components/ClinicalRecord/SummaryTab';
import SurgicalProceduresTab from '@/components/ClinicalRecord/SurgicalProcedures/SurgicalProceduresTab';
import NextConsultationsTab from '@/components/ClinicalRecord/NextConsultations/NextConsultationsTab';

// Services
import { getInfoHeader, getPatientNotes, getPatientAlerts, getAntecedentes } from '@/services/headerServices';
import { getActiveProblems, getDiagnosticHistory } from '@/services/diagnosticsService';
import { getTemporaria, getConstancia, getLastConsultation } from '@/services/summaryService';
import { getHistory } from '@/services/surgicalProceduresService';
import { getLastReasons } from '@/services/consultationReasonService';

interface PageProps {
    params: Promise<{
        ordsrvnro: string;
    }>;
}

export default function ClinicalRecordPage({ params }: PageProps) {
    const [ordsrvnro, setOrdsrvnro] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Resumen');

    const router = useRouter();

    // Unwrap params
    useEffect(() => {
        params.then(p => setOrdsrvnro(p.ordsrvnro));
    }, [params]);

    useEffect(() => {
        if (!ordsrvnro) return;

        const fetchData = async () => {
            const token = localStorage.getItem('gam_access_token');

            if (!token) {
                console.warn("No access token found. Redirecting to login.");
                router.push('/login');
                return;
            }

            try {
                const [
                    patientData,
                    // Summary Data
                    activeProblems,
                    antecedentes,
                    temporaria,
                    constancia,
                    lastConsultation,
                    // Consultation Data
                    lastReasons,
                    diagnosticHistory,
                    // Header Indicators
                    patientNotes,
                    patientAlerts,
                    // Surgical Procedures
                    surgicalHistory
                ] = await Promise.all([
                    getInfoHeader(token, ordsrvnro),
                    // Summary
                    getActiveProblems(token, ordsrvnro),
                    getAntecedentes(token, ordsrvnro),
                    getTemporaria(token, ordsrvnro),
                    getConstancia(token, ordsrvnro),
                    getLastConsultation(token, ordsrvnro),
                    // Consultation
                    getLastReasons(token, ordsrvnro),
                    getDiagnosticHistory(token, ordsrvnro),
                    // Header Indicators
                    getPatientNotes(token, ordsrvnro),
                    getPatientAlerts(token, ordsrvnro),
                    // Surgical Procedures
                    getHistory(ordsrvnro)
                ]);

                setData({
                    patientData,
                    activeProblems,
                    antecedentes,
                    temporaria,
                    constancia,
                    lastConsultation,
                    lastReasons,
                    diagnosticHistory,
                    patientNotes,
                    patientAlerts,
                    surgicalHistory
                });
            } catch (error: any) {
                console.error("Error fetching clinical record data:", error);
                // Check for 401 in error message or object
                if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
                    console.warn("Authentication failed (401). Redirecting to login.");
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ordsrvnro, router]);

    if (loading || !data) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Cargando historia clínica...</p>
                </div>
            </div>
        );
    }

    const headerData: HeaderData = {
        hasNotes: data.patientNotes.length > 0,
        hasBackgrounds: data.antecedentes.length > 0,
        hasAlerts: data.patientAlerts.length > 0
    };

    return (
        <PageLayout className="h-screen overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PatientHeader patient={data.patientData} ordsrvnro={ordsrvnro} headerData={headerData} />
                <ClinicalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none"></div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px]">
                            {activeTab === 'Resumen' && (
                                <SummaryTab
                                    ordsrvnro={ordsrvnro}
                                    activeProblems={data.activeProblems}
                                    antecedentes={data.antecedentes}
                                    temporaria={data.temporaria}
                                    constancia={data.constancia}
                                    lastConsultation={data.lastConsultation}
                                />
                            )}
                            {activeTab === 'Consulta' && (
                                <ConsultationTab
                                    ordsrvnro={ordsrvnro}
                                    activeProblems={data.activeProblems}
                                    diagnosticHistory={data.diagnosticHistory}
                                    lastReasons={data.lastReasons}
                                />
                            )}
                            {activeTab === 'Procedimientos quirúrgicos' && (
                                <SurgicalProceduresTab
                                    ordsrvnro={ordsrvnro}
                                    initialHistory={data.surgicalHistory}
                                />
                            )}
                            {activeTab === 'Próximas Consultas' && (
                                <NextConsultationsTab
                                    ordsrvnro={ordsrvnro}
                                />
                            )}
                            {activeTab !== 'Resumen' && activeTab !== 'Consulta' && activeTab !== 'Procedimientos quirúrgicos' && activeTab !== 'Próximas Consultas' && (
                                <p className="text-slate-500 dark:text-slate-400 italic">Contenido de la pestaña {activeTab} para Orden de Servicio: {ordsrvnro}</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </PageLayout>
    );
}
