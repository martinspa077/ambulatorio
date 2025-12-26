'use client';

import PageLayout from '@/components/Navigation/PageLayout';
import ClinicalTabs from '@/components/ClinicalRecord/ClinicalTabs';
import PatientHeader from '@/components/ClinicalRecord/PatientHeader';
import ConsultationTab from '@/components/ClinicalRecord/ConsultationTab';
import SummaryTab from '@/components/ClinicalRecord/SummaryTab';
import SurgicalProceduresTab from '@/components/ClinicalRecord/SurgicalProcedures/SurgicalProceduresTab';
import { useAuth } from '@/context/AuthContext';
import { historiaClinicaService, PatientHeaderInfo } from '@/services/historiaClinicaService';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClinicalRecordPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [patient, setPatient] = useState<PatientHeaderInfo | null>(null);
    const [fetching, setFetching] = useState(true);
    const [activeTab, setActiveTab] = useState('Resumen');

    const ordsrvnro = params.ordsrvnro as string;
    console.log('ClinicalRecordPage mounted, ordsrvnro:', ordsrvnro);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        const loadHeaderData = async () => {
            if (isAuthenticated && ordsrvnro) {
                setFetching(true);
                try {
                    const data = await historiaClinicaService.getInfoHeader('dummy-token', Number(ordsrvnro));
                    setPatient(data);
                } catch (error) {
                    console.error('Error loading patient info:', error);
                } finally {
                    setFetching(false);
                }
            }
        };
        loadHeaderData();
    }, [isAuthenticated, ordsrvnro]);

    if (loading || !isAuthenticated || fetching || !patient) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <PageLayout className="h-screen overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PatientHeader patient={patient} ordsrvnro={Number(ordsrvnro)} />
                <ClinicalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content Body */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none"></div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px]">
                            {activeTab === 'Resumen' && (
                                <SummaryTab ordsrvnro={Number(ordsrvnro)} />
                            )}
                            {activeTab === 'Consulta' && (
                                <ConsultationTab ordsrvnro={Number(ordsrvnro)} />
                            )}
                            {activeTab === 'Procedimientos quirúrgicos' && (
                                <SurgicalProceduresTab ordsrvnro={Number(ordsrvnro)} />
                            )}
                            {activeTab !== 'Resumen' && activeTab !== 'Consulta' && activeTab !== 'Procedimientos quirúrgicos' && (
                                <p className="text-slate-500 dark:text-slate-400 italic">Contenido de la pestaña {activeTab} para Orden de Servicio: {ordsrvnro}</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </PageLayout>
    );
}
