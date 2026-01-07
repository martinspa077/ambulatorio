'use client';

import { useState } from 'react';
import ConsultationHistory from './ConsultationHistory';
import ConsultationPrescriptionForm from './ConsultationPrescriptionForm';
import SpecialtySearchModal from './SpecialtySearchModal';
import { Specialty, ConsultationPrescriptionData, DEFAULT_CONSULTATION_DATA } from '@/services/nextConsultationsTypes';

interface NextConsultationsTabProps {
    ordsrvnro: string;
}

export default function NextConsultationsTab({ ordsrvnro }: NextConsultationsTabProps) {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [pendingPrescriptions, setPendingPrescriptions] = useState<ConsultationPrescriptionData[]>([]);

    const handleConfirmSelection = (specialties: Specialty[]) => {
        const newPrescriptions = specialties.map(s => ({
            ...DEFAULT_CONSULTATION_DATA,
            id: Date.now().toString() + Math.random(),
            specialty: s,
            isCollapsed: false,
        }));
        setPendingPrescriptions([...newPrescriptions, ...pendingPrescriptions]); // Add new ones at top
        setShowSearchModal(false);
    };

    const handleUpdatePrescription = (id: string, data: Partial<ConsultationPrescriptionData>) => {
        setPendingPrescriptions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const handleRemovePrescription = (id: string) => {
        setPendingPrescriptions(prev => prev.filter(p => p.id !== id));
    };

    const handleToggleCollapse = (id: string) => {
        setPendingPrescriptions(prev => prev.map(p => p.id === id ? { ...p, isCollapsed: !p.isCollapsed } : p));
    };

    return (
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Side: History */}
            <div className="col-span-12 lg:col-span-6 h-[calc(100vh-340px)] sticky top-6">
                <ConsultationHistory ordsrvnro={ordsrvnro} />
            </div>

            {/* Right Side: Prescription Form */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Agregar Nuevo
                    </button>
                </div>

                <div className="space-y-4 pb-10">
                    {pendingPrescriptions.length === 0 ? (
                        <div className="bg-sky-50/50 dark:bg-slate-800/50 rounded-2xl border border-sky-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center mt-4">
                            <svg className="w-16 h-16 text-teal-500 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                                No hay prescripciones de consulta en curso
                            </p>
                        </div>
                    ) : (
                        pendingPrescriptions.map(p => (
                            <ConsultationPrescriptionForm
                                key={p.id}
                                data={p}
                                onChange={(data) => handleUpdatePrescription(p.id, data)}
                                onRemove={() => handleRemovePrescription(p.id)}
                                onToggleCollapse={() => handleToggleCollapse(p.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {showSearchModal && (
                <SpecialtySearchModal
                    isOpen={showSearchModal}
                    onClose={() => setShowSearchModal(false)}
                    onConfirm={handleConfirmSelection}
                />
            )}
        </div>
    );
}
