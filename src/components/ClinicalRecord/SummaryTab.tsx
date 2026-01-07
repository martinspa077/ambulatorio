'use client';

import { ActiveProblem } from '@/services/diagnosticsService';
import { Antecedente } from '@/services/headerServices';
import { TemporariaData, ConstanciaData, LastConsultationData } from '@/services/summaryService';
import SummaryCard from './Summary/SummaryCard';
import { useState } from 'react';
import ActiveProblemModal from './Summary/ActiveProblemModal';
import AntecedenteModal from './Summary/AntecedenteModal';

// Icons
const IconProblems = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const IconPersonal = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const IconFamily = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const IconSocio = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const IconTemporaria = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const IconConstancia = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const IconLastConsultation = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        {/* Simplified medical kit icon */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        {/* Using a simpler plus icon for now or standard medical kit if possible */}
        <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="2" />
        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" />
    </svg>
);

interface SummaryTabProps {
    ordsrvnro: string;
    activeProblems: ActiveProblem[];
    antecedentes: Antecedente[];
    temporaria: TemporariaData | null;
    constancia: ConstanciaData | null;
    lastConsultation: LastConsultationData | null;
}

export default function SummaryTab({
    ordsrvnro,
    activeProblems,
    antecedentes,
    temporaria,
    constancia,
    lastConsultation
}: SummaryTabProps) {

    const [selectedProblem, setSelectedProblem] = useState<ActiveProblem | null>(null);
    const [selectedAntecedente, setSelectedAntecedente] = useState<Antecedente | null>(null);

    const personalHistory = antecedentes.filter(a => a.tipo === 'APE');
    const familyHistory = antecedentes.filter(a => a.tipo === 'ANT');
    const socioHistory = antecedentes.filter(a => a.tipo === 'ASE');

    const SearchIcon = ({ onClick }: { onClick?: () => void }) => (
        <button
            onClick={onClick}
            className={`flex-shrink-0 ${onClick ? 'cursor-pointer hover:bg-slate-100 rounded-full p-1 transition-colors' : ''}`}
            disabled={!onClick}
        >
            <svg className="w-5 h-5 text-[#005F61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Row 1 */}
            <SummaryCard title="Problemas activos" icon={<IconProblems />} iconClassName="bg-red-500">
                <div className="space-y-3">
                    {activeProblems.length > 0 ? (
                        activeProblems.map(p => (
                            <div key={p.id} className="flex items-center text-slate-800 font-bold uppercase gap-2">
                                <SearchIcon onClick={() => setSelectedProblem(p)} />
                                <span>{p.diagnosis}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">No hay problemas activos.</p>
                    )}
                </div>
            </SummaryCard>

            <SummaryCard title="Antecedentes personales" icon={<IconPersonal />} iconClassName="bg-amber-500">
                <div className="space-y-3">
                    {personalHistory.length > 0 ? (
                        personalHistory.map(a => (
                            <div key={a.id} className="flex items-center text-slate-800 font-bold uppercase gap-2">
                                <SearchIcon onClick={() => setSelectedAntecedente(a)} />
                                <span>{a.descripcion}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">Sin antecedentes personales.</p>
                    )}
                </div>
            </SummaryCard>

            {/* Row 2 */}
            <SummaryCard title="Antecedentes familiares" icon={<IconFamily />} iconClassName="bg-blue-500">
                <div className="space-y-3">
                    {familyHistory.length > 0 ? (
                        familyHistory.map(a => (
                            <div key={a.id} className="flex items-center text-slate-800 font-bold uppercase gap-2">
                                <SearchIcon onClick={() => setSelectedAntecedente(a)} />
                                <span>{a.descripcion} {a.parentesco ? `(${a.parentesco})` : ''}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">Sin antecedentes familiares.</p>
                    )}
                </div>
            </SummaryCard>

            <SummaryCard title="Antecedentes socioeconómicos" icon={<IconSocio />} iconClassName="bg-emerald-500">
                <div className="space-y-3">
                    {socioHistory.length > 0 ? (
                        socioHistory.map(a => (
                            <div key={a.id} className="flex items-center text-slate-800 font-bold uppercase gap-2">
                                <SearchIcon onClick={() => setSelectedAntecedente(a)} />
                                <span>{a.descripcion}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">Sin antecedentes socioeconómicos.</p>
                    )}
                </div>
            </SummaryCard>

            {/* Row 3 */}
            <SummaryCard title="Temporaria" icon={<IconTemporaria />} iconClassName="bg-pink-500">
                {temporaria ? (
                    <div className="flex justify-between items-center h-full px-4">
                        <div>
                            <p className="text-xs text-slate-600 font-bold mb-1">Días desde el inicio del siniestro</p>
                            <p className="text-2xl font-bold text-slate-900">{temporaria.diasSiniestro} Días</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600 font-bold mb-1">Días desde la última reapertura</p>
                            <p className="text-2xl font-bold text-slate-900">{temporaria.diasReapertura.toString().padStart(2, '0')} Días</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 italic">Sin datos de temporaria.</p>
                )}
            </SummaryCard>

            <SummaryCard title="Constancia de afección no laboral" icon={<IconConstancia />} iconClassName="bg-red-500">
                <p className="text-xs text-slate-800 font-bold mb-2">Motivo</p>
                <div className="space-y-2">
                    {constancia && constancia.motivos.length > 0 ? (
                        constancia.motivos.map((motivo, idx) => (
                            <div key={idx} className="flex items-center text-slate-800 font-bold uppercase">
                                <SearchIcon />
                                {motivo}
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 italic">Sin constancia.</p>
                    )}
                </div>
            </SummaryCard>

            {/* Row 4 - Last Consultation */}
            <div className="md:col-span-2">
                <SummaryCard title="Mi última consulta" icon={<IconLastConsultation />} iconClassName="bg-cyan-400">
                    {lastConsultation ? (
                        <div className="flex gap-8">
                            <div className="flex-shrink-0 w-24">
                                <p className="text-xs text-slate-600 font-bold">Fecha</p>
                                <p className="text-sm font-bold text-slate-800">{lastConsultation.fecha}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{lastConsultation.descripcion}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">No hay consultas previas.</p>
                    )}
                </SummaryCard>
            </div>

            <ActiveProblemModal
                isOpen={!!selectedProblem}
                onClose={() => setSelectedProblem(null)}
                problem={selectedProblem}
            />

            <AntecedenteModal
                isOpen={!!selectedAntecedente}
                onClose={() => setSelectedAntecedente(null)}
                antecedente={selectedAntecedente}
            />
        </div>
    );
}
