'use client';

import { useState, useEffect } from 'react';
import { SCASTData } from '@/services/diagnosticsService';

interface SCASTFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: SCASTData) => void;
    diagnosisName: string;
    initialData?: SCASTData;
}

export default function SCASTFormModal({ isOpen, onClose, onSave, diagnosisName, initialData }: SCASTFormModalProps) {
    const [strategy, setStrategy] = useState<SCASTData['reperfusionStrategy']>('no_aplica');
    const [timeMinutes, setTimeMinutes] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setStrategy(initialData.reperfusionStrategy || 'no_aplica');
                setTimeMinutes(initialData.timeMinutes ? initialData.timeMinutes.toString() : '');
            } else {
                setStrategy('no_aplica');
                setTimeMinutes('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // ... rest of component

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            reperfusionStrategy: strategy,
            timeMinutes: timeMinutes ? Number(timeMinutes) : undefined
        });
        onClose();
    };

    const getTimeLabel = () => {
        switch (strategy) {
            case 'fibrinolisis':
                return 'Tiempo aprox. entre dx y administración (min)';
            case 'acp_primaria':
            case 'acp_sistematica':
            case 'acp_rescate':
                return 'Tiempo puerta balón (min)';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-red-600 p-6 text-white">
                    <h2 className="text-xl font-bold">Registro SCAST</h2>
                    <p className="text-white/80 text-sm mt-1">{diagnosisName}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Estrategia de reperfusión */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Estrategia de reperfusión realizada
                        </label>
                        <select
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value as SCASTData['reperfusionStrategy'])}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-red-500 dark:bg-slate-700 dark:text-white"
                        >
                            <option value="no_aplica">No aplica al evento</option>
                            <option value="fibrinolisis">Infusión intravenosa de agente fibrinolítico</option>
                            <option value="acp_primaria">Intervención coronaria percutánea primaria</option>
                            <option value="acp_sistematica">Intervención coronaria percutánea sistemática</option>
                            <option value="acp_rescate">Intervención coronaria percutánea de rescate</option>
                        </select>
                    </div>

                    {/* Tiempo en minutos (condicional) */}
                    {strategy !== 'no_aplica' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {getTimeLabel()}
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={timeMinutes}
                                onChange={(e) => setTimeMinutes(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-red-500 dark:bg-slate-700 dark:text-white"
                                placeholder="Minutos"
                            />
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
                            disabled={strategy !== 'no_aplica' && !timeMinutes}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
