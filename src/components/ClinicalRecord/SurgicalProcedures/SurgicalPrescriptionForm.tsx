'use client';

import { useState, useEffect } from 'react';
import { SurgicalProcedure, SurgicalPrescriptionData, HospitalizationInfo, Professional } from '@/services/surgicalProceduresTypes';
import { getHospitalizationInfo } from '@/services/surgicalProceduresService';
import DiagnosisSearchModal from '../Consultation/DiagnosisSearchModal';
import ProfessionalSearchModal from './ProfessionalSearchModal';

interface SurgicalPrescriptionFormProps {
    ordsrvnro: string;
    selectedProcedures: SurgicalProcedure[];
    data: Partial<SurgicalPrescriptionData>;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onChange: (data: Partial<SurgicalPrescriptionData>) => void;
    onRemove?: () => void;
}

export default function SurgicalPrescriptionForm({ ordsrvnro, selectedProcedures, data, isCollapsed, onToggleCollapse, onChange, onRemove }: SurgicalPrescriptionFormProps) {
    // Use data prop directly. Alias for easier refactoring if needed, though direct usage is cleaner.
    const formData = data;
    const [hospitalizationInfo, setHospitalizationInfo] = useState<HospitalizationInfo | null>(null);
    const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
    const [showProfessionalModal, setShowProfessionalModal] = useState(false);
    const [professionalModalTarget, setProfessionalModalTarget] = useState<'surgeon' | 'assistant' | null>(null);

    useEffect(() => {
        if (formData.surgeryType === 'ya_internada') {
            getHospitalizationInfo(ordsrvnro).then(info => {
                setHospitalizationInfo(info);
            });
        }
    }, [formData.surgeryType, ordsrvnro]);

    // Helper to update parent
    const setFormData = (newData: Partial<SurgicalPrescriptionData>) => {
        onChange(newData);
    };

    // ... rest of component helper functions ...
    const updatePrep = (field: string, value: any) => {
        setFormData({
            ...formData,
            preparation: { ...formData.preparation!, [field]: value }
        });
    };

    const handleConfirmClick = () => {
        onToggleCollapse();
    };

    const handleDiagnosisSelect = (term: string, id?: string) => {
        const currentDiagnoses = formData.preoperativeDiagnoses || [];
        setFormData({
            ...formData,
            preoperativeDiagnoses: [
                ...currentDiagnoses,
                { term, id }
            ]
        });
        setShowDiagnosisModal(false);
    };

    const handleRemoveDiagnosis = (index: number) => {
        const currentDiagnoses = formData.preoperativeDiagnoses || [];
        const newDiagnoses = [...currentDiagnoses];
        newDiagnoses.splice(index, 1);
        setFormData({
            ...formData,
            preoperativeDiagnoses: newDiagnoses
        });
    };

    const handleOpenProfessionalModal = (target: 'surgeon' | 'assistant') => {
        setProfessionalModalTarget(target);
        setShowProfessionalModal(true);
    };

    const handleProfessionalSelect = (professional: Professional) => {
        if (professionalModalTarget === 'surgeon') {
            setFormData({ ...formData, surgeon: professional });
        } else if (professionalModalTarget === 'assistant') {
            setFormData({ ...formData, assistant: professional });
        }
        setShowProfessionalModal(false);
        setProfessionalModalTarget(null);
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
                    <div className="flex flex-col">
                        <h3 className="font-bold truncate text-lg">
                            {selectedProcedures.map(p => p.description).join(' + ')}
                        </h3>
                        {/*{selectedProcedures.some(p => p.requiresAuthorization) && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-200 bg-amber-900/40 px-2 py-0.5 rounded-full w-fit">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Requiere Autorización
                            </span>
                        )}
                        {selectedProcedures.some(p => p.requiresConsent) && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-200 bg-blue-900/40 px-2 py-0.5 rounded-full w-fit">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Requiere Consentimiento
                            </span>
                        )}*/}
                    </div>
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

                        {/* Authorization Warning */}
                        {selectedProcedures.some(p => p.requiresAuthorization) && (
                            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-start gap-3">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h4 className="font-bold text-amber-800 dark:text-amber-200">Requiere Autorización</h4>
                                </div>
                            </div>
                        )}

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
                                <div className="flex flex-col gap-4">
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                        value={
                                            formData.surgeryType === 'ambulatoria'
                                                ? 'ambulatoria'
                                                : (['internacion_mismo_dia', 'internacion_24h_previo', 'ya_internada'].includes(formData.surgeryType as string) ? 'internacion' : '')
                                        }
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val === 'ambulatoria') {
                                                setFormData({ ...formData, surgeryType: 'ambulatoria' });
                                            } else if (val === 'internacion') {
                                                setFormData({ ...formData, surgeryType: 'internacion_mismo_dia' });
                                            } else {
                                                setFormData({ ...formData, surgeryType: undefined });
                                            }
                                        }}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="ambulatoria">Ambulatoria</option>
                                        <option value="internacion">Internación</option>
                                    </select>

                                    {/* Secondary Combo for Internacion */}
                                    {['internacion_mismo_dia', 'internacion_24h_previo', 'ya_internada'].includes(formData.surgeryType as string) && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Debe ingresar a internación</label>
                                            <select
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none transition-all"
                                                value={formData.surgeryType || ''}
                                                onChange={e => setFormData({ ...formData, surgeryType: e.target.value as any })}
                                            >
                                                <option value="internacion_mismo_dia">El mismo día de la cirugía</option>
                                                <option value="internacion_24h_previo">24 hs. previo a la cirugía</option>
                                                <option value="ya_internada">No aplica, persona ya internada</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Conditional: Persona Internada (Read Only) */}
                        {formData.surgeryType === 'ya_internada' && (
                            <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800">
                                <label className="block text-sm font-bold text-sky-800 dark:text-sky-300 mb-2">Persona internada</label>
                                {hospitalizationInfo ? (
                                    <div className="flex gap-4">
                                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                            <span className="font-bold">Piso:</span> {hospitalizationInfo.piso}
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                            <span className="font-bold">Habitación:</span> {hospitalizationInfo.habitacion}
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-sky-100 flex-1 text-sm">
                                            <span className="font-bold">Cama:</span> {hospitalizationInfo.cama}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-sky-700 dark:text-sky-400 italic">Cargando información de internación...</div>
                                )}
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

                            <div className="space-y-3 mb-3">
                                {formData.preoperativeDiagnoses?.map((diag, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex-1 px-4 py-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 dark:text-slate-200">{diag.term}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDiagnosis(index)}
                                            className="p-3 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-transparent hover:border-red-200"
                                            title="Eliminar diagnóstico"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowDiagnosisModal(true)}
                                className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Agregar Diagnóstico
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
                                <div className="space-y-3">
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                        value={formData.place}
                                        onChange={e => {
                                            const newPlace = e.target.value;
                                            setFormData({
                                                ...formData,
                                                place: newPlace,
                                                externalPlaceDescription: newPlace !== 'Externo' ? undefined : formData.externalPlaceDescription
                                            });
                                        }}
                                    >
                                        <option value="BQ">BQ (Block Quirúrgico)</option>
                                        <option value="Odontologia">Odontología</option>
                                        <option value="Imagenologia">Imagenología</option>
                                        <option value="Externo">Externo</option>
                                    </select>

                                    {formData.place === 'Externo' && (
                                        <div className="animate-fadeIn">
                                            <input
                                                type="text"
                                                maxLength={256}
                                                placeholder="Especifique el lugar externo..."
                                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                                value={formData.externalPlaceDescription || ''}
                                                onChange={e => setFormData({ ...formData, externalPlaceDescription: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cirujano</label>
                                {formData.surgeon?.nombre ? (
                                    <div className="flex items-center gap-2 p-2 px-3 border border-teal-200 bg-teal-50/50 rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-700">{formData.surgeon.nombre}</p>
                                            <p className="text-xs text-slate-500">{formData.surgeon.especialidad} {formData.surgeon.numeroCaja && `• Caja: ${formData.surgeon.numeroCaja}`}</p>
                                        </div>
                                        <button
                                            onClick={() => handleOpenProfessionalModal('surgeon')}
                                            className="text-slate-400 hover:text-teal-600"
                                            title="Cambiar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleOpenProfessionalModal('surgeon')}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-left text-slate-400 hover:border-teal-500 transition-colors"
                                    >
                                        Buscar profesional...
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ayudante</label>
                                {formData.assistant?.nombre ? (
                                    <div className="flex items-center gap-2 p-2 px-3 border border-teal-200 bg-teal-50/50 rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-700">{formData.assistant.nombre}</p>
                                            <p className="text-xs text-slate-500">{formData.assistant.especialidad} {formData.assistant.numeroCaja && `• Caja: ${formData.assistant.numeroCaja}`}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFormData({ ...formData, assistant: undefined });
                                            }}
                                            className="text-slate-400 hover:text-red-500 mr-1"
                                            title="Eliminar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleOpenProfessionalModal('assistant')}
                                            className="text-slate-400 hover:text-teal-600"
                                            title="Cambiar"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleOpenProfessionalModal('assistant')}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-left text-slate-400 hover:border-teal-500 transition-colors"
                                    >
                                        Buscar profesional...
                                    </button>
                                )}
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
                            <div className="flex items-center gap-4">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.fastingHours !== undefined}
                                        onChange={e => updatePrep('fastingHours', e.target.checked ? 8 : undefined)}
                                    />
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Ayuno</span>
                                </label>
                                {formData.preparation?.fastingHours !== undefined && (
                                    <div className="flex items-center gap-2">
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

                            {/* Additional Protocol Checks */}
                            <div className="space-y-3 pt-2">
                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.bloodAvailability || false}
                                        onChange={e => updatePrep('bloodAvailability', e.target.checked)}
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">Disponibilidad de sangre/hemoderivados</span>
                                </label>

                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.anticoagulantsAdjustment || false}
                                        onChange={e => updatePrep('anticoagulantsAdjustment', e.target.checked)}
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">Suspensión o ajuste de anticoagulantes/antiagregantes según protocolo</span>
                                </label>

                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.insulinAdjustment || false}
                                        onChange={e => updatePrep('insulinAdjustment', e.target.checked)}
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">Ajuste de insulina o hipoglucemiantes orales según protocolo</span>
                                </label>

                                <label className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        checked={formData.preparation?.antibioticProphylaxis || false}
                                        onChange={e => updatePrep('antibioticProphylaxis', e.target.checked)}
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">Profilaxis antibiótica planificada</span>
                                </label>
                            </div>

                            {/* Observations */}
                            <div className="pt-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Observaciones relevantes</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    placeholder="Ingrese observaciones..."
                                    rows={2}
                                    value={formData.preparation?.observations || ''}
                                    onChange={e => updatePrep('observations', e.target.value)}
                                />
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
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Pos operatorio</label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        ¿Requiere cuidados especiales en otro nivel de atención en post operatorio? *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 ring-teal-500 outline-none"
                                        value={
                                            formData.requiresSpecialPostOpCare === undefined
                                                ? ''
                                                : formData.requiresSpecialPostOpCare
                                                    ? 'true'
                                                    : 'false'
                                        }
                                        onChange={e => {
                                            const val = e.target.value;
                                            const isRequired = val === 'true';
                                            setFormData({
                                                ...formData,
                                                requiresSpecialPostOpCare: val === '' ? undefined : isRequired,
                                                postOpCare: isRequired ? formData.postOpCare : undefined
                                            });
                                        }}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="true">SI</option>
                                        <option value="false">NO</option>
                                    </select>
                                </div>

                                {formData.requiresSpecialPostOpCare === true && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Nivel requerido *
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 ring-teal-500 outline-none"
                                            value={formData.postOpCare || ''}
                                            onChange={e => setFormData({ ...formData, postOpCare: e.target.value as any })}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="cuidados_intensivos">Cuidados Intensivos</option>
                                            <option value="cuidados_intermedios">Cuidados Intermedios</option>
                                            <option value="cuidados_especiales_hbse">Cuidados especiales en HBSE</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Consent - Conditionally Rendered */}
                        {selectedProcedures.some(p => p.requiresConsent) && (
                            <div>
                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 flex items-start gap-3 mb-4">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-blue-800 dark:text-blue-200">Requiere Consentimiento Informado</h4>
                                    </div>
                                </div>

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
                        )}

                    </div>

                </>
            )}

            {/* Diagnosis Search Modal */}
            {showDiagnosisModal && (
                <DiagnosisSearchModal
                    isOpen={showDiagnosisModal}
                    onClose={() => setShowDiagnosisModal(false)}
                    onSelect={handleDiagnosisSelect}
                />
            )}

            {/* Professional Search Modal */}
            {showProfessionalModal && (
                <ProfessionalSearchModal
                    isOpen={showProfessionalModal}
                    onClose={() => setShowProfessionalModal(false)}
                    onSelect={handleProfessionalSelect}
                    title={professionalModalTarget === 'surgeon' ? 'Seleccionar Cirujano' : 'Seleccionar Ayudante'}
                    initialRole={professionalModalTarget === 'surgeon' ? 'Cirujano Principal' : 'Ayudante'}
                />
            )}

        </div>
    );
}
