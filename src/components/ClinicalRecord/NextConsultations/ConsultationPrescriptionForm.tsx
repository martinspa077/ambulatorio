'use client';

import { ConsultationPrescriptionData, ConsultationMode, TransferType, TripType } from '@/services/nextConsultationsTypes';

interface ConsultationPrescriptionFormProps {
    data: ConsultationPrescriptionData;
    onChange: (data: Partial<ConsultationPrescriptionData>) => void;
    onRemove?: () => void;
    onToggleCollapse: () => void;
}

export default function ConsultationPrescriptionForm({ data, onChange, onRemove, onToggleCollapse }: ConsultationPrescriptionFormProps) {
    const isCollapsed = data.isCollapsed;

    const handleUpdate = (field: keyof ConsultationPrescriptionData, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
            {/* Header */}
            <div
                className={`bg-[#005F61] p-4 text-white flex justify-between items-center shadow-md cursor-pointer select-none ${isCollapsed ? 'rounded-2xl' : 'rounded-t-2xl'}`}
                onClick={onToggleCollapse}
            >
                <div className="flex items-center gap-4">
                    <div className={`transform transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <h3 className="font-bold text-lg">{data.specialty.description}</h3>
                </div>
                {onRemove && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="bg-red-500/80 hover:bg-red-500 p-2 rounded-lg transition-colors"
                        title="Eliminar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                )}
            </div>

            {/* Body */}
            {!isCollapsed && (
                <div className="p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">
                    {/* Authorization Warning */}
                    {data.specialty.requiresAuthorization && (
                        <div className="bg-orange-500 text-white p-4 rounded-xl flex items-start gap-3 shadow-sm">
                            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div>
                                <p className="font-medium text-sm">
                                    La especialidad seleccionada requiere autorización. El flujo de autorización se ejecutará automáticamente.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mode */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Modalidad *</label>
                            <select
                                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                value={data.mode || ''}
                                onChange={e => handleUpdate('mode', e.target.value)}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="presencial">Presencial</option>
                                <option value="teleasistencia">Teleasistencia</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Clinical Data */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dato clínico *</label>
                            <textarea
                                className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 resize-none focus:ring-2 ring-teal-500 outline-none transition-all"
                                value={data.clinicalData || ''}
                                onChange={e => handleUpdate('clinicalData', e.target.value)}
                            />
                        </div>

                        {/* Observations */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Observaciones *</label>
                            <textarea
                                className="w-full h-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 resize-none focus:ring-2 ring-teal-500 outline-none transition-all"
                                placeholder="Detallar policlínica y fecha..."
                                value={data.observations || ''}
                                onChange={e => handleUpdate('observations', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="space-y-4">
                        {/* Companion */}
                        <div className="flex items-center gap-4">
                            <label className="w-50 text-sm font-bold text-slate-700 dark:text-slate-300">Requiere acompañante *</label>
                            <select
                                className="w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                value={data.requiresCompanion ? 'yes' : 'no'}
                                onChange={e => handleUpdate('requiresCompanion', e.target.value === 'yes')}
                            >
                                <option value="no">No</option>
                                <option value="yes">Si</option>
                            </select>
                        </div>

                        {/* Transfer */}
                        <div className="flex items-center gap-4">
                            <label className="w-50 text-sm font-bold text-slate-700 dark:text-slate-300">Requiere traslado *</label>
                            <select
                                className="w-48 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                value={data.requiresTransfer === undefined ? '' : (data.requiresTransfer ? 'yes' : 'no')}
                                onChange={e => {
                                    const val = e.target.value;
                                    handleUpdate('requiresTransfer', val === '' ? undefined : val === 'yes');
                                }}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="no">No</option>
                                <option value="yes">Si</option>
                            </select>
                        </div>

                        {data.requiresTransfer && (
                            <>
                                <div className="flex items-center gap-4">
                                    <label className="w-50 text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de traslado</label>
                                    <select
                                        className="w-64 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                        value={data.transferType || ''}
                                        onChange={e => handleUpdate('transferType', e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="ambulancia_comun">Ambulancia común</option>
                                        <option value="ambulancia_especializada">Ambulancia especializada</option>
                                        <option value="camioneta">Camioneta</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-50 text-sm font-bold text-slate-700 dark:text-slate-300">Tramo *</label>
                                    <select
                                        className="w-64 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                        value={data.tripType || ''}
                                        onChange={e => handleUpdate('tripType', e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="ida">Ida</option>
                                        <option value="ida_vuelta">Ida y vuelta</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
