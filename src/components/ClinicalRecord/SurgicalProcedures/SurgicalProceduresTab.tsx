'use client';

import { useState, useRef, useEffect } from 'react';
import SurgicalHistory from './SurgicalHistory';
import SurgicalSearchModal from './SurgicalSearchModal';
import SurgicalPrescriptionForm from './SurgicalPrescriptionForm';
import { SurgicalProcedure, surgicalProceduresService, DEFAULT_PRESCRIPTION_DATA } from '@/services/surgicalProceduresService';

interface SurgicalProceduresTabProps {
    ordsrvnro: number;
}

export default function SurgicalProceduresTab({ ordsrvnro }: SurgicalProceduresTabProps) {
    const [showSearchModal, setShowSearchModal] = useState(false);
    // Track multiple pending forms. Using simpler IDs for local state.
    const [pendingForms, setPendingForms] = useState<{ id: string, procedures: SurgicalProcedure[], data?: any, isCollapsed: boolean }[]>([]);

    // Ref to keep track of latest state for unmount effect
    const formsRef = useRef(pendingForms);

    useEffect(() => {
        formsRef.current = pendingForms;
    }, [pendingForms]);

    // Save on unmount
    useEffect(() => {
        return () => {
            const forms = formsRef.current;
            if (forms.length > 0) {
                forms.forEach(form => {
                    if (form.data) { // Only save if there is data
                        surgicalProceduresService.savePrescription(ordsrvnro, {
                            ...form.data,
                            procedures: form.procedures
                        }).catch(err => console.error("Error saving prescription on exit", err));
                    }
                });
            }
        };
    }, [ordsrvnro]);

    const handleFormChange = (formId: string, data: any) => {
        setPendingForms(prev => prev.map(f => f.id === formId ? { ...f, data } : f));
    };

    const handleConfirmSelection = (procedures: SurgicalProcedure[], sameInstance: boolean) => {
        if (sameInstance) {
            // Group all into one form
            const newFormId = Date.now().toString();
            setPendingForms(prev => [
                { id: newFormId, procedures, isCollapsed: false, data: { ...DEFAULT_PRESCRIPTION_DATA } },
                ...prev
            ]);
        } else {
            // Split into separate forms
            // We reverse to keep order when unshifting (or just ...prev at end)
            // If we unshift [A, B], we want [A, B, ...prev] or [B, A, ...prev]?
            // Ideally order in array = order in UI. List is top-down? UI is `map`.
            // User adds A then B. Array [B, A] -> map renders B then A.
            // If "same instance" selected [A, B, C] -> one form.
            // If "different" -> [A], [B], [C].
            // To appear "added recently at top", we probably want them stacked.
            // Let's map and add them all.
            const newForms = procedures.map((p, index) => ({
                id: (Date.now() + index).toString(),
                procedures: [p],
                isCollapsed: false,
                data: { ...DEFAULT_PRESCRIPTION_DATA }
            }));

            setPendingForms(prev => [...newForms, ...prev]);
        }
        setShowSearchModal(false);
    };

    const handleSavePrescription = async (formId: string, data: any) => {
        // Here we might just update the local state to "saved" or "collapsed"
        // But the prompt says "Confirmar solo colapsa". It implies the user might review later or it auto-saves?
        // Let's assume we save to backend AND collapse.
        await surgicalProceduresService.savePrescription(ordsrvnro, {
            ...data,
            procedures: pendingForms.find(f => f.id === formId)?.procedures || []
        });

        // Update local state to collapse
        setPendingForms(prev => prev.map(f => f.id === formId ? { ...f, isCollapsed: true, data } : f));
    };

    const handleToggleCollapse = (formId: string) => {
        setPendingForms(prev => prev.map(f => f.id === formId ? { ...f, isCollapsed: !f.isCollapsed } : f));
    };

    const handleRemoveForm = (formId: string) => {
        setPendingForms(prev => prev.filter(f => f.id !== formId));
    };

    return (
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Side: History */}
            <div className="col-span-5 h-[calc(100vh-340px)] sticky top-6">
                <SurgicalHistory ordsrvnro={ordsrvnro} />
            </div>

            {/* Right Side: Prescription */}
            <div className="col-span-7 flex flex-col gap-4">
                {/* Global Header / Add Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Agregar Nuevo
                    </button>
                </div>

                {pendingForms.length === 0 ? (
                    <div className="bg-sky-50/50 dark:bg-slate-800/50 rounded-2xl border border-sky-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                        <svg className="w-16 h-16 text-teal-500 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
                        </svg>
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                            No hay prescripciones en curso
                        </p>
                    </div>
                ) : (
                    pendingForms.map(form => (
                        <SurgicalPrescriptionForm
                            key={form.id}
                            selectedProcedures={form.procedures}
                            data={form.data}
                            isCollapsed={form.isCollapsed}
                            onToggleCollapse={() => handleToggleCollapse(form.id)}
                            onChange={(data) => handleFormChange(form.id, data)}
                            onRemove={() => handleRemoveForm(form.id)}
                        />
                    ))
                )}
            </div>

            {showSearchModal && (
                <SurgicalSearchModal
                    isOpen={showSearchModal}
                    onClose={() => setShowSearchModal(false)}
                    onConfirm={handleConfirmSelection}
                />
            )}
        </div>
    );
}
