'use client';

import { useState, useEffect } from 'react';
import { ENOData } from '@/services/diagnosticsService';

interface ENOFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ENOData) => void;
    diagnosisName: string;
    initialData?: ENOData;
}

export default function ENOFormModal({ isOpen, onClose, onSave, diagnosisName, initialData }: ENOFormModalProps) {
    const [startDate, setStartDate] = useState('');
    const [contact, setContact] = useState<'yes' | 'no' | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStartDate(initialData.symptomStartDate || '');
                setContact(initialData.contactWithSuspiciousCase ? 'yes' : 'no');
            } else {
                setStartDate('');
                setContact(null);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;
    // ... rest of component

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            symptomStartDate: startDate,
            contactWithSuspiciousCase: contact === 'yes'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#005F61] p-6 text-white">
                    <h2 className="text-xl font-bold">Notificación Obligatoria (ENO)</h2>
                    <p className="text-white/80 text-sm mt-1">{diagnosisName}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Fecha de inicio de síntomas */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Fecha de inicio de síntomas
                        </label>
                        <input
                            type="date"
                            required
                            max={new Date().toISOString().split('T')[0]}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#005F61] dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Contacto con caso sospechoso */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Contacto con caso sospechoso de enfermedad
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-center gap-2 font-bold ${contact === 'yes'
                                ? 'border-[#005F61] bg-teal-50 text-[#005F61]'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}>
                                <input
                                    type="radio"
                                    name="contact"
                                    className="hidden"
                                    checked={contact === 'yes'}
                                    onChange={() => setContact('yes')}
                                />
                                Sí
                            </label>
                            <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-center gap-2 font-bold ${contact === 'no'
                                ? 'border-[#005F61] bg-teal-50 text-[#005F61]'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}>
                                <input
                                    type="radio"
                                    name="contact"
                                    className="hidden"
                                    checked={contact === 'no'}
                                    onChange={() => setContact('no')}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!startDate || contact === null}
                            className="px-6 py-2 bg-[#005F61] text-white rounded-xl font-bold hover:bg-[#004d4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
