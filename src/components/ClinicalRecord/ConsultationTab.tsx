'use client';

import AttentionMode from './Consultation/AttentionMode';
import ConsultationReason from './Consultation/ConsultationReason';
import PhysicalExam from './Consultation/PhysicalExam';
import Evolution from './Consultation/Evolution';
import EVA from './Consultation/EVA';
import Diagnostics from './Consultation/Diagnostics';
import NonPharmacologicalIndications from './Consultation/NonPharmacologicalIndications';

interface ConsultationTabProps {
    ordsrvnro: number;
}

export default function ConsultationTab({ ordsrvnro }: ConsultationTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Modalidad de atención */}
            <section>
                <AttentionMode ordsrvnro={ordsrvnro} />
            </section>

            {/* 2. Motivo de consulta */}
            <section>
                <ConsultationReason ordsrvnro={ordsrvnro} />
            </section>

            {/* 3. Examen fisico */}
            <section>
                <PhysicalExam ordsrvnro={ordsrvnro} />
            </section>

            {/* 4. Evolución */}
            <section>
                <Evolution ordsrvnro={ordsrvnro} />
            </section>

            {/* 5. EVA */}
            <section>
                <EVA ordsrvnro={ordsrvnro} />
            </section>

            {/* 6. Diagnóstico */}
            <section>
                <Diagnostics ordsrvnro={ordsrvnro} />
            </section>

            {/* 7. Indicaciones no farmacológicas */}
            <section>
                <NonPharmacologicalIndications ordsrvnro={ordsrvnro} />
            </section>
        </div>
    );
}
