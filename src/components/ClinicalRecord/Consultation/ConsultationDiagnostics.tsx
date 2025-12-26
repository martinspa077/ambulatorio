import { useState, useEffect } from 'react';
import { ConsultationDiagnosis, diagnosticsService, ENOData, SCASTData, ExternalCauseData } from '@/services/diagnosticsService';
import DiagnosisSearchModal from './DiagnosisSearchModal';
import ENOFormModal from './ENOFormModal';
import SCASTFormModal from './SCASTFormModal';
import ExternalCauseFormModal from './ExternalCauseFormModal';

interface ConsultationDiagnosticsProps {
    diagnostics: ConsultationDiagnosis[];
    onDiagnosticsChange: (diagnostics: ConsultationDiagnosis[]) => void;
    diagnosisToAdd?: string | null;
    onDiagnosisProcessed?: () => void;
}

export default function ConsultationDiagnostics({
    diagnostics,
    onDiagnosticsChange,
    diagnosisToAdd,
    onDiagnosisProcessed
}: ConsultationDiagnosticsProps) {
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showInfoTooltip, setShowInfoTooltip] = useState(false);

    // MSP Forms State
    const [pendingDiagnosis, setPendingDiagnosis] = useState<Partial<ConsultationDiagnosis> | null>(null);
    const [showENOForm, setShowENOForm] = useState(false);
    const [showSCASTForm, setShowSCASTForm] = useState(false);
    const [showExternalCauseConfirm, setShowExternalCauseConfirm] = useState(false);
    const [showExternalCauseForm, setShowExternalCauseForm] = useState(false);

    // Effect to handle diagnosis added from parent (e.g. Active Problems)
    useEffect(() => {
        if (diagnosisToAdd) {
            handleAddDiagnosis(diagnosisToAdd);
            if (onDiagnosisProcessed) {
                onDiagnosisProcessed();
            }
        }
    }, [diagnosisToAdd]);

    const handleAddDiagnosis = (diagnosis: string, terminologyId?: string) => {
        const newDiagnosis: Partial<ConsultationDiagnosis> = {
            id: Date.now().toString(),
            diagnosis,
            terminologyId,
            certainty: null,
            type: 'primario',
            isProblem: false,
            isAlert: false,
            startDate: new Date().toISOString().split('T')[0],
            mspNotification: false
        };

        const type = diagnosticsService.checkDiagnosisType(diagnosis);

        if (type === 'ENO') {
            setPendingDiagnosis({ ...newDiagnosis, mspNotification: true });
            setShowENOForm(true);
        } else if (type === 'SCAST') {
            setPendingDiagnosis({ ...newDiagnosis, mspNotification: true });
            setShowSCASTForm(true);
        } else {
            setPendingDiagnosis(newDiagnosis);
            setShowExternalCauseConfirm(true);
        }
    };

    const confirmAddDiagnosis = (finalDiagnosis: ConsultationDiagnosis) => {
        onDiagnosticsChange([...diagnostics, finalDiagnosis]);
        setPendingDiagnosis(null);
    };

    const handleENOSave = (data: ENOData) => {
        if (pendingDiagnosis) {
            confirmAddDiagnosis({
                ...pendingDiagnosis,
                mspNotification: true,
                enoData: data
            } as ConsultationDiagnosis);
        }
        setShowENOForm(false);
    };

    const handleSCASTSave = (data: SCASTData) => {
        if (pendingDiagnosis) {
            confirmAddDiagnosis({
                ...pendingDiagnosis,
                mspNotification: true,
                scastData: data
            } as ConsultationDiagnosis);
        }
        setShowSCASTForm(false);
    };

    const handleExternalCauseConfirm = (isExternalCause: boolean) => {
        setShowExternalCauseConfirm(false);
        if (isExternalCause) {
            setShowExternalCauseForm(true);
        } else {
            if (pendingDiagnosis) {
                confirmAddDiagnosis(pendingDiagnosis as ConsultationDiagnosis);
            }
        }
    };

    const handleExternalCauseSave = (data: ExternalCauseData) => {
        if (pendingDiagnosis) {
            confirmAddDiagnosis({
                ...pendingDiagnosis,
                mspNotification: true,
                externalCauseData: data
            } as ConsultationDiagnosis);
        }
        setShowExternalCauseForm(false);
    };

    const handleUpdateDiagnosis = (id: string, updates: Partial<ConsultationDiagnosis>) => {
        onDiagnosticsChange(
            diagnostics.map(d => d.id === id ? { ...d, ...updates } : d)
        );
    };

    const handleDeleteDiagnosis = (id: string) => {
        onDiagnosticsChange(diagnostics.filter(d => d.id !== id));
    };

    return (
        <div className="bg-[#005F61] rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">Problemas Diagnósticos de la consulta</h3>

                    {/* Info Icon with Tooltip */}
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowInfoTooltip(true)}
                            onMouseLeave={() => setShowInfoTooltip(false)}
                            className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                        </button>
                        {showInfoTooltip && (
                            <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-10">
                                Copie un diagnóstico de la grilla o agregue uno nuevo
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setShowSearchModal(true)}
                    className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar
                </button>
            </div>

            {/* Diagnostics List */}
            <div className="space-y-4">
                {diagnostics.map((diagnosis) => (
                    <DiagnosisItem
                        key={diagnosis.id}
                        diagnosis={diagnosis}
                        onUpdate={(updates) => handleUpdateDiagnosis(diagnosis.id, updates)}
                        onDelete={() => handleDeleteDiagnosis(diagnosis.id)}
                    />
                ))}

                {diagnostics.length === 0 && (
                    <div className="text-center py-8 text-white/70">
                        <p className="text-sm">No hay diagnósticos agregados</p>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <DiagnosisSearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                onSelect={handleAddDiagnosis}
            />

            {/* External Cause Confirmation Dialog */}
            {showExternalCauseConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Consulta
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium">
                            ¿El diagnóstico corresponde a una lesión de causa externa?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => handleExternalCauseConfirm(false)}
                                className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={() => handleExternalCauseConfirm(true)}
                                className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MSP Forms */}
            <ENOFormModal
                key={`eno-${pendingDiagnosis?.id}`}
                isOpen={showENOForm}
                onClose={() => setShowENOForm(false)}
                onSave={handleENOSave}
                diagnosisName={pendingDiagnosis?.diagnosis || ''}
            />

            <SCASTFormModal
                key={`scast-${pendingDiagnosis?.id}`}
                isOpen={showSCASTForm}
                onClose={() => setShowSCASTForm(false)}
                onSave={handleSCASTSave}
                diagnosisName={pendingDiagnosis?.diagnosis || ''}
            />

            <ExternalCauseFormModal
                key={`ext-${pendingDiagnosis?.id}`}
                isOpen={showExternalCauseForm}
                onClose={() => setShowExternalCauseForm(false)}
                onSave={handleExternalCauseSave}
                diagnosisName={pendingDiagnosis?.diagnosis || ''}
            />
        </div>
    );
}

// Individual Diagnosis Item Component
interface DiagnosisItemProps {
    diagnosis: ConsultationDiagnosis;
    onUpdate: (updates: Partial<ConsultationDiagnosis>) => void;
    onDelete: () => void;
}

function DiagnosisItem({ diagnosis, onUpdate, onDelete }: DiagnosisItemProps) {
    const [showCertaintyTooltip, setShowCertaintyTooltip] = useState(false);
    const [showTypeTooltip, setShowTypeTooltip] = useState(false);
    const [showProblemTooltip, setShowProblemTooltip] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4">
            {/* Diagnosis Name & MSP Badge */}
            <div className="flex justify-between items-start">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Problema Diagnóstico
                    </label>
                    <div className="text-lg font-bold text-[#005F61] dark:text-teal-400">
                        {diagnosis.diagnosis}
                    </div>
                </div>
                {diagnosis.mspNotification && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-200 dark:border-teal-700/50 text-xs font-medium" title="Notificación MSP Activa">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>MSP</span>
                    </div>
                )}
            </div>

            {/* Form Fields Row 1 */}
            <div className="grid grid-cols-3 gap-4">
                {/* Certainty */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Certeza</label>
                        <div className="relative">
                            <button
                                onMouseEnter={() => setShowCertaintyTooltip(true)}
                                onMouseLeave={() => setShowCertaintyTooltip(false)}
                                className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 text-white flex items-center justify-center text-xs hover:bg-slate-400 transition-colors"
                            >
                                i
                            </button>
                            {showCertaintyTooltip && (
                                <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-10">
                                    <p className="font-bold mb-1">Diagnóstico presuntivo:</p>
                                    <p className="mb-2">Es una hipótesis diagnóstica a partir de los hallazgos clínicos, pero sin contar todavía con la evidencia suficiente para confirmarla con certeza.</p>
                                    <p className="font-bold mb-1">Diagnóstico Confirmado:</p>
                                    <p>Es el diagnóstico final al que se llega una vez realizados los estudios confirmatorios necesarios.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <select
                        value={diagnosis.certainty || ''}
                        onChange={(e) => onUpdate({ certainty: e.target.value as 'presuntivo' | 'definitivo' | null })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#005F61] dark:bg-slate-700 dark:text-white"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="definitivo">Definitivo</option>
                        <option value="presuntivo">Presuntivo</option>
                    </select>
                </div>

                {/* Type */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo</label>
                        <div className="relative">
                            <button
                                onMouseEnter={() => setShowTypeTooltip(true)}
                                onMouseLeave={() => setShowTypeTooltip(false)}
                                className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 text-white flex items-center justify-center text-xs hover:bg-slate-400 transition-colors"
                            >
                                i
                            </button>
                            {showTypeTooltip && (
                                <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-10">
                                    <p><strong>Diagnóstico Primario:</strong> Causa principal de la consulta médica actual.</p>
                                    <p className="mt-1"><strong>Diagnóstico Secundario:</strong> Condición identificada durante o después del tratamiento de una enfermedad principal.</p>
                                    <p className="mt-1"><strong>Comorbilidad:</strong> Condición coexistente, que no es el principal motivo de la atención actual.</p>
                                    <p className="mt-1"><strong>Evento adverso:</strong> Cualquier daño no deseado para el paciente.</p>
                                    <p className="mt-1"><strong>Complicación:</strong> Condición que surge como resultado de la enfermedad primaria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <select
                        value={diagnosis.type}
                        onChange={(e) => onUpdate({ type: e.target.value as ConsultationDiagnosis['type'] })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#005F61] dark:bg-slate-700 dark:text-white"
                    >
                        <option value="primario">Primario</option>
                        <option value="secundario">Secundario</option>
                        <option value="comorbilidad">Comorbilidad</option>
                        <option value="evento_adverso">Evento adverso</option>
                        <option value="complicacion">Complicación</option>
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                        Fecha Inicio
                    </label>
                    <input
                        type="date"
                        value={diagnosis.startDate}
                        onChange={(e) => onUpdate({ startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#005F61] dark:bg-slate-700 dark:text-white"
                    />
                </div>


            </div>

            {/* Form Fields Row 2 */}
            <div className="grid grid-cols-3 gap-4">
                {/* Problem Status */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">¿Es problema?</label>
                        <div className="relative">
                            <button
                                onMouseEnter={() => setShowProblemTooltip(true)}
                                onMouseLeave={() => setShowProblemTooltip(false)}
                                className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 text-white flex items-center justify-center text-xs hover:bg-slate-400 transition-colors"
                            >
                                i
                            </button>
                            {showProblemTooltip && (
                                <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-10">
                                    <p>Un problema es cualquier situación que afecte o pueda afectar la salud del paciente y que requiera atención activa, registro claro y seguimiento organizado por parte del equipo de salud.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <select
                        value={diagnosis.isProblem ? (diagnosis.problemStatus || 'activo') : 'no'}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'no') {
                                onUpdate({ isProblem: false, problemStatus: undefined });
                            } else {
                                onUpdate({ isProblem: true, problemStatus: value as 'activo' | 'resuelto' });
                            }
                        }}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:border-[#005F61] dark:bg-slate-700 dark:text-white"
                    >
                        <option value="no">No</option>
                        <option value="activo">Sí - Activo</option>
                        <option value="resuelto">Sí - Resuelto</option>
                    </select>
                </div>

                {/* Alert Toggle */}
                <div className="flex items-end">
                    <button
                        onClick={() => onUpdate({ isAlert: !diagnosis.isAlert })}
                        className={`w-full px-4 py-2 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-colors ${diagnosis.isAlert
                            ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            : 'border-slate-300 dark:border-slate-600 text-slate-400 hover:border-red-300'
                            }`}
                        title={diagnosis.isAlert ? 'Alerta activa' : 'Sin alerta'}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                        Alerta
                    </button>
                </div>



                {/* Delete Button */}
                <div className="flex items-end">
                    <button
                        onClick={onDelete}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
