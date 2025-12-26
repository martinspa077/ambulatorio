'use client';

import { useState, useEffect } from 'react';
import { SurgicalProcedure, SurgicalPrescriptionData, surgicalProceduresService } from '@/services/surgicalProceduresService';

interface SurgicalPrescriptionFormProps {
    selectedProcedures: SurgicalProcedure[];
    data: Partial<SurgicalPrescriptionData>;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onChange: (data: Partial<SurgicalPrescriptionData>) => void;
    onRemove?: () => void;
}

export default function SurgicalPrescriptionForm({ selectedProcedures, data, isCollapsed, onToggleCollapse, onChange, onRemove }: SurgicalPrescriptionFormProps) {
    // Use data prop directly. Alias for easier refactoring if needed, though direct usage is cleaner.
    // To minimize changes to JSX, we can alias:
    const formData = data;

    // Helper to update parent
    const setFormData = (newData: Partial<SurgicalPrescriptionData>) => {
        onChange(newData);
    };

    // Helper to update nested state
    const updatePrep = (field: string, value: any) => {
        setFormData({
            ...formData,
            preparation: { ...formData.preparation!, [field]: value }
        });
    };

    const handleConfirmClick = () => {
        onToggleCollapse();
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
            {/* Header / Selected Procedures Summary */}
            <div
                className={`bg-[#005F61] p-4 text-white flex justify-between items-center shadow-md cursor-pointer select-none ${isCollapsed ? 'rounded-2xl' : 'rounded-t-2xl'}`}
                onClick={onToggleCollapse}
            >
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`transform transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <h3 className="font-bold truncate text-lg">
                        {selectedProcedures.map(p => p.description).join(' + ')}
                    </h3>
                </div>
                {onRemove && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="bg-red-500/80 hover:bg-red-500 p-2 rounded-lg transition-colors"
                        title="Eliminar prescripción"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                )}
            </div>

            {/* Form Content - only visible if not collapsed */}
            {!isCollapsed && (
                <>
                    <div className="p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900/50">

                        {/* Section 1: Basic Data */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Oportunidad</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                    value={formData.opportunity || ''}
                                    onChange={e => setFormData({ ...formData, opportunity: e.target.value as any })}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="electiva">Cirugía Electiva</option>
                                    <option value="urgencia">Cirugía de Urgencia</option>
                                    <option value="emergencia">Cirugía de Emergencia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tipo de cirugía</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                    value={formData.surgeryType || ''}
                                    onChange={e => setFormData({ ...formData, surgeryType: e.target.value as any })}
                                >
                                    <option value="ambulatoria">Ambulatoria</option>
                                    <option value="internacion_mismo_dia">Con internación - El mismo día de la cirugía</option>
                                    <option value="internacion_24h_previo">Con internación - 24 hs. previo a la cirugía</option>
                                    <option value="ya_internada">Con internación - No aplica, persona ya internada</option>
                                </select>
                            </div>
                        </div>

                        {/* Conditional: Persona Internada (Read Only) */}
                        {formData.surgeryType === 'ya_internada' && (
                            <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800">
                                <label className="block text-sm font-bold text-sky-800 dark:text-sky-300 mb-2">Persona internada</label>
                                <div className="flex gap-4">
                                    <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                        <span className="font-bold">Piso:</span> 5
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                        <span className="font-bold">Habitación:</span> 515
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                        <span className="font-bold">Cama:</span> A
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Clinical Data */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Dato clínico</label>
                            <textarea
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all resize-none"
                                value={formData.clinicalData || ''}
                                onChange={e => setFormData({ ...formData, clinicalData: e.target.value })}
                            />
                        </div>

                        {/* Diagnosis */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Diagnóstico Preoperatorio</label>
                            <button className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm">
                                Agregar
                            </button>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Surgery Logistics */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fecha cirugía:</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                        value={formData.surgeryDate}
                                        onChange={e => setFormData({ ...formData, surgeryDate: e.target.value })}
                                    />
                                    <input
                                        type="time"
                                        className="w-32 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                        value={formData.surgeryTime}
                                        onChange={e => setFormData({ ...formData, surgeryTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duración estimada</label>
                                <div className="flex gap-2 items-center">
                                    <select
                                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                        value={formData.duration?.hours}
                                        onChange={e => setFormData({ ...formData, duration: { ...formData.duration!, hours: parseInt(e.target.value) } })}
                                    >
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <span className="text-sm font-medium">Hora</span>
                                    <select
                                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                        value={formData.duration?.minutes}
                                        onChange={e => setFormData({ ...formData, duration: { ...formData.duration!, minutes: parseInt(e.target.value) } })}
                                    >
                                        <option value="0">00</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                    </select>
                                    <span className="text-sm font-medium">Minuto</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Planta</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    value={formData.plant}
                                    onChange={e => setFormData({ ...formData, plant: e.target.value as any })}
                                >
                                    <option value="HBSE">HBSE</option>
                                    <option value="externo">Externo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lugar</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    value={formData.place}
                                    onChange={e => setFormData({ ...formData, place: e.target.value })}
                                >
                                    <option value="BQ">BQ (Block Quirúrgico)</option>
                                    <option value="Odontologia">Odontología</option>
                                    <option value="Imagenologia">Imagenología</option>
                                </select>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cirujano</label>
                                <input className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none" placeholder="Buscar profesional..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ayudante</label>
                                <input className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none" placeholder="Buscar profesional..." />
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Requirements */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Anestesia</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    value={formData.anesthesia}
                                    onChange={e => setFormData({ ...formData, anesthesia: e.target.value as any })}
                                >
                                    <option value="local">Local</option>
                                    <option value="regional">Regional</option>
                                    <option value="local_vigilada">Local vigilada</option>
                                    <option value="local_potenciada">Local potenciada</option>
                                    <option value="a_definir">A definir por anestesista</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requiere radiografía intraoperatoria</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    value={formData.intraoperativeXray ? 'si' : 'no'}
                                    onChange={e => setFormData({ ...formData, intraoperativeXray: e.target.value === 'si' })}
                                >
                                    <option value="no">No</option>
                                    <option value="si">Sí</option>
                                </select>
                            </div>
                        </div>

                        {/* Preps */}
                        <div className="bg-sky-50/50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                            <div>
                                <label className="inline-flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.fastingHours !== undefined}
                                        onChange={e => updatePrep('fastingHours', e.target.checked ? 8 : undefined)}
                                    />
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Ayuno</span>
                                </label>
                                {formData.preparation?.fastingHours !== undefined && (
                                    <div className="ml-7 flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="w-20 px-2 py-1 border border-slate-300 rounded-lg text-sm"
                                            value={formData.preparation.fastingHours}
                                            onChange={e => updatePrep('fastingHours', parseInt(e.target.value))}
                                        />
                                        <span className="text-sm">Horas</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {['vvp', 'sondaVesical', 'rasurado', 'sng', 'enema', 'vvc'].map(key => (
                                    <label key={key} className="inline-flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                            checked={(formData.preparation as any)?.[key]}
                                            onChange={e => updatePrep(key, e.target.checked)}
                                        />
                                        <span className="text-slate-700 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Special Material */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Material especial</label>
                            <div className="inline-flex items-center gap-4 mb-2">
                                <input type="checkbox" checked={!!formData.specialMaterial} onChange={e => setFormData({ ...formData, specialMaterial: e.target.checked ? ' ' : undefined })} className="w-5 h-5 rounded text-teal-600" />
                                <span>Requiere</span>
                            </div>
                            {formData.specialMaterial !== undefined && (
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white"
                                    placeholder="Describa el material requerido..."
                                    value={formData.specialMaterial}
                                    onChange={e => setFormData({ ...formData, specialMaterial: e.target.value })}
                                />
                            )}
                        </div>

                        {/* Post Op */}
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pos operatorio</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold mb-1 block">Nivel de atención</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                                        onChange={e => setFormData({ ...formData, postOpCare: e.target.value as any })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="cuidados_intensivos">Cuidados Intensivos</option>
                                        <option value="cuidados_intermedios">Cuidados Intermedios</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Consent */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gestión del consentimiento informado</label>
                            <div className="flex gap-6">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" className="w-5 h-5 rounded text-teal-600" />
                                    <span>Se entrega</span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" className="w-5 h-5 rounded text-teal-600" />
                                    <span>Se firma</span>
                                </label>
                            </div>
                        </div>

                    </div>

                </>
            )}

        </div>
    );
}
