'use client';

import { useState, useEffect } from 'react';
import AttentionMode from './Consultation/AttentionMode';
import ConsultationReason from './Consultation/ConsultationReason';
import PhysicalExam from './Consultation/PhysicalExam';
import Evolution from './Consultation/Evolution';
import EVA from './Consultation/EVA';
import Diagnostics from './Consultation/Diagnostics';
import NonPharmacologicalIndications from './Consultation/NonPharmacologicalIndications';

import { AttentionModeType, getAttentionMode } from '@/services/attentionModeService';
import { LastConsultationReason, CurrentConsultationReason, getLastReasons, getCurrentReason } from '@/services/consultationReasonService';
import { PhysicalExamData, getPhysicalExam } from '@/services/physicalExamService';
import { getEvolution } from '@/services/evolutionService';
import { getEVA } from '@/services/evaService';
import { ActiveProblem, DiagnosticHistoryItem, ConsultationDiagnosis, getActiveProblems, getDiagnosticHistory, getConsultationDiagnostics } from '@/services/diagnosticsService';
import { getIndications } from '@/services/nonPharmacologicalService';

// import { ConsultationData } from './ClinicalRecordClient';

export interface ConsultationData {
    attentionMode?: AttentionModeType;
    lastReasons?: LastConsultationReason[];
    currentReasons?: CurrentConsultationReason[];
    physicalExam?: PhysicalExamData;
    evolution?: string;
    eva?: number | null;
    activeProblems: ActiveProblem[];
    diagnosticHistory: DiagnosticHistoryItem[];
    consultationDiagnostics?: ConsultationDiagnosis[];
    indications?: string;
}

interface ConsultationTabProps extends ConsultationData {
    ordsrvnro: string;
}

export default function ConsultationTab({
    ordsrvnro,
    attentionMode: initialMode,
    lastReasons: initialLastReasons,
    currentReasons: initialCurrentReasons,
    physicalExam: initialPhysicalExam,
    evolution: initialEvolution,
    eva: initialEVA,
    activeProblems: initialActiveProblems,
    diagnosticHistory: initialHistory,
    consultationDiagnostics: initialConsultationDiagnostics,
    indications: initialIndications
}: ConsultationTabProps) {
    // Local State for Revalidation
    const [attentionMode, setAttentionMode] = useState<AttentionModeType>(initialMode || 'Presencial');
    const [lastReasons, setLastReasons] = useState<LastConsultationReason[]>(initialLastReasons || []);
    const [currentReasons, setCurrentReasons] = useState<CurrentConsultationReason[]>(initialCurrentReasons || []);
    const [physicalExam, setPhysicalExam] = useState<PhysicalExamData>(initialPhysicalExam || {} as PhysicalExamData);
    const [evolution, setEvolution] = useState<string>(initialEvolution || '');
    const [eva, setEVA] = useState<number | null>(initialEVA || null);
    const [activeProblems, setActiveProblems] = useState<ActiveProblem[]>(initialActiveProblems || []);
    const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticHistoryItem[]>(initialHistory || []);
    const [consultationDiagnostics, setConsultationDiagnostics] = useState<ConsultationDiagnosis[]>(initialConsultationDiagnostics || []);
    const [indications, setIndications] = useState<string>(initialIndications || '');

    const [isRefetching, setIsRefetching] = useState(false);

    // Re-fetch all data on mount
    useEffect(() => {
        let mounted = true;
        setIsRefetching(true);
        console.log("Refetching consultation data for", ordsrvnro);
        const token = localStorage.getItem('gam_access_token') || '';
        Promise.all([
            getAttentionMode(token, ordsrvnro),
            // User requested to move getLastReasons to page.tsx, so we don't fetch it here anymore
            getCurrentReason(token, ordsrvnro),
            getPhysicalExam(token, ordsrvnro),
            getEvolution(token, ordsrvnro),
            getEVA(token, ordsrvnro),
            // getActiveProblems and getDiagnosticHistory are handled by props from page.tsx
            getConsultationDiagnostics(token, ordsrvnro),
            getIndications(token, ordsrvnro)
        ]).then(([
            mode,
            currR,
            phys,
            evol,
            evaVal,
            consultDiags,
            inds
        ]) => {
            if (mounted) {
                setAttentionMode(mode);
                // lastReasons is handled by props from page.tsx
                setCurrentReasons(currR);
                setPhysicalExam(phys || {} as PhysicalExamData);
                setEvolution(evol);
                setEVA(evaVal);
                // activeProblems and diagnosticHistory handled by props
                setConsultationDiagnostics(consultDiags);
                setIndications(inds);
                setIsRefetching(false);
            }
        }).catch(err => {
            console.error("Error refetching consultation data", err);
            if (mounted) setIsRefetching(false);
        });

        return () => { mounted = false; };
    }, [ordsrvnro]);

    return (
        <div className={`flex flex-col gap-8 pb-20 ${isRefetching ? 'opacity-70 pointer-events-none' : ''}`}>
            <section>
                <AttentionMode ordsrvnro={ordsrvnro} initialMode={attentionMode} />
            </section>

            <section>
                <ConsultationReason
                    ordsrvnro={ordsrvnro}
                    initialLastReasons={lastReasons}
                    initialCurrentReasons={currentReasons}
                />
            </section>

            <section>
                <PhysicalExam ordsrvnro={ordsrvnro} initialData={physicalExam} />
            </section>

            <section className="grid grid-cols-2 gap-8">
                <Evolution ordsrvnro={ordsrvnro} initialEvolution={evolution} />
                <EVA ordsrvnro={ordsrvnro} initialValue={eva} />
            </section>

            <section>
                <Diagnostics
                    ordsrvnro={ordsrvnro}
                    initialActiveProblems={activeProblems}
                    initialHistory={diagnosticHistory}
                    initialConsultationDiagnostics={consultationDiagnostics}
                />
            </section>

            <section>
                <NonPharmacologicalIndications ordsrvnro={ordsrvnro} initialText={indications} />
            </section>
        </div>
    );
}
