'use client';

import { useState, useEffect } from 'react';
import { ExternalCauseData } from '@/services/diagnosticsService';

interface ExternalCauseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ExternalCauseData) => void;
    diagnosisName: string;
    initialData?: ExternalCauseData;
}

export default function ExternalCauseFormModal({ isOpen, onClose, onSave, diagnosisName, initialData }: ExternalCauseFormModalProps) {
    const [intentionality, setIntentionality] = useState<ExternalCauseData['intentionality'] | ''>('');
    const [mechanism, setMechanism] = useState<ExternalCauseData['mechanism'] | ''>('');
    const [role, setRole] = useState<ExternalCauseData['role'] | ''>('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setIntentionality(initialData.intentionality || '');
                setMechanism(initialData.mechanism || '');
                setRole(initialData.role || '');
            } else {
                setIntentionality('');
                setMechanism('');
                setRole('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;
    // ... rest

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            intentionality: intentionality as ExternalCauseData['intentionality'],
            mechanism: mechanism as ExternalCauseData['mechanism'],
            role: mechanism === 'transito' ? (role as ExternalCauseData['role']) : undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-amber-500 p-6 text-white">
                    <h2 className="text-xl font-bold">Lesión de Causa Externa</h2>
                    <p className="text-white/80 text-sm mt-1">{diagnosisName}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Intencionalidad */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Intencionalidad
                        </label>
                        <select
                            required
                            value={intentionality}
                            onChange={(e) => setIntentionality(e.target.value as ExternalCauseData['intentionality'])}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="accidental">Accidental</option>
                            <option value="agresiones">Agresiones</option>
                            <option value="intervencion_legal">Intervención Legal</option>
                            <option value="lesiones_autoinfligidas">Lesiones autoinfligidas</option>
                            <option value="complicaciones_medicas">Complicaciones de atención médica</option>
                            <option value="sin_dato">Sin dato</option>
                        </select>
                    </div>

                    {/* Mecanismo */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Mecanismo
                        </label>
                        <select
                            required
                            value={mechanism}
                            onChange={(e) => {
                                setMechanism(e.target.value as ExternalCauseData['mechanism']);
                                if (e.target.value !== 'transito') setRole('');
                            }}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="transito">Tránsito</option>
                            <option value="caida">Caída</option>
                            <option value="golpe">Golpe con objeto</option>
                            <option value="objeto_cortante">Objeto cortante</option>
                            <option value="mordedura">Mordedura o picadura</option>
                            <option value="intoxicacion">Intoxicaciones</option>
                            <option value="fuego">Fuego / Quemadura</option>
                            <option value="ahogamiento">Ahogamiento</option>
                            <option value="agresion_sexual">Agresión sexual</option>
                            <option value="disparo">Disparo de arma de fuego</option>
                            <option value="electricidad">Corriente eléctrica</option>
                            <option value="cuerpo_extrano">Cuerpo extraño</option>
                            <option value="otros">Otros</option>
                            <option value="sin_dato">Sin dato</option>
                        </select>
                    </div>

                    {/* Rol (Solo si es tránsito) */}
                    {mechanism === 'transito' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Rol en el siniestro
                            </label>
                            <select
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value as ExternalCauseData['role'])}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="peaton">Peatón</option>
                                <option value="ciclista">Ciclista</option>
                                <option value="motociclista">Motociclista</option>
                                <option value="ocupante">Ocupante de automóvil</option>
                                <option value="otros">Otros</option>
                                <option value="sin_dato">Sin dato</option>
                            </select>
                        </div>
                    )}

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
                            disabled={!intentionality || !mechanism || (mechanism === 'transito' && !role)}
                            className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
