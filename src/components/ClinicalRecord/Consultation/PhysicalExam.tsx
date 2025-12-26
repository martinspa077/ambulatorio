'use client';

import { useState, useEffect, useRef } from 'react';
import { physicalExamService, PhysicalExamData } from '@/services/physicalExamService';
import PhysicalExamHistoryModal from './PhysicalExamHistoryModal';

interface PhysicalExamProps {
    ordsrvnro: number;
}

interface ExamItemProps {
    icon: React.ReactNode;
    label: string | React.ReactNode;
    unit?: string;
    value: string | number;
    onChange: (val: string) => void;
    onBlur?: () => void;
    readOnly?: boolean;
    color?: string;
    secondaryValue?: string | number;
    onSecondaryChange?: (val: string) => void;
    isDoubleInput?: boolean;
    onHistoryClick?: () => void;
}

const ExamItem = ({ icon, label, unit, value, onChange, onBlur, readOnly, color = "text-[#005F61]", secondaryValue, onSecondaryChange, isDoubleInput, onHistoryClick }: ExamItemProps) => (
    <div className="flex items-center gap-4 p-2">
        <div className={`w-10 h-10 flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div className="flex items-center gap-2">
            {!isDoubleInput ? (
                <div className="relative">
                    <input
                        type="text"
                        className="w-20 border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-700 focus:outline-none focus:border-[#005F61]"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        readOnly={readOnly}
                    />
                </div>
            ) : (
                <div className="flex items-center">
                    <input
                        type="text"
                        className="w-14 border border-slate-300 rounded-l px-2 py-1 text-center font-bold text-slate-700 focus:outline-none focus:border-[#005F61] border-r-0"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Sis"
                    />
                    <span className="bg-slate-100 border-y border-slate-300 py-1 px-1 text-slate-400">/</span>
                    <input
                        type="text"
                        className="w-14 border border-slate-300 rounded-r px-2 py-1 text-center font-bold text-slate-700 focus:outline-none focus:border-[#005F61] border-l-0"
                        value={secondaryValue || ''}
                        onChange={(e) => onSecondaryChange && onSecondaryChange(e.target.value)}
                        placeholder="Dia"
                    />
                </div>
            )}

            {unit && <span className="text-sm font-bold text-slate-700 min-w-[30px]">{unit}</span>}

            {onHistoryClick && (
                <button
                    onClick={onHistoryClick}
                    className="w-8 h-8 rounded-full bg-[#005F61] text-white flex items-center justify-center hover:bg-[#004d4f] transition-colors ml-2"
                    title="Ver evolución"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </button>
            )}
        </div>
    </div>
);

export default function PhysicalExam({ ordsrvnro }: PhysicalExamProps) {
    const [data, setData] = useState<PhysicalExamData>({} as PhysicalExamData);
    const [loading, setLoading] = useState(true);
    const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; type: keyof PhysicalExamData | 'pa'; title: string; unit?: string }>({
        isOpen: false,
        type: 'frecuenciaCardiaca',
        title: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await physicalExamService.getPhysicalExam('dummy-token', ordsrvnro);
                setData(result);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [ordsrvnro]);

    const handleChange = (field: keyof PhysicalExamData, value: string) => {
        setData(prev => {
            const newData = { ...prev, [field]: value === '' ? undefined : Number(value) };

            // Calculate BMI if Weight or Height changes
            if (field === 'peso' || field === 'talla') {
                const weight = field === 'peso' ? Number(value) : prev.peso;
                const heightCm = field === 'talla' ? Number(value) : prev.talla;

                if (weight && heightCm && heightCm > 0) {
                    const heightM = heightCm / 100;
                    const bmi = weight / (heightM * heightM);
                    newData.imc = parseFloat(bmi.toFixed(2));
                } else {
                    newData.imc = undefined; // Or keep previous if preferred, but usually clear if invalid
                }
            }
            return newData;
        });
    };

    const openHistory = (type: keyof PhysicalExamData | 'pa', title: string, unit?: string) => {
        setHistoryModal({ isOpen: true, type, title, unit });
    };

    // Ref to track current data for save on unmount
    const dataRef = useRef(data);

    // Update ref whenever data changes
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Save on unmount
    useEffect(() => {
        return () => {
            const dataToSave = dataRef.current;
            // Only save if we have data to save
            if (Object.keys(dataToSave).length > 0) {
                physicalExamService.savePhysicalExam('dummy-token', ordsrvnro, dataToSave).catch((err) => {
                    console.error('Error saving physical exam on unmount:', err);
                });
            }
        };
    }, [ordsrvnro]);

    // Icons
    const HeartIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 11l-3-3L12 19l4.54-9-2.5-3.5" /></svg>; // Combined heart rate-ish
    const LungsIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12v8" /><path d="M14 12v8" /><path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1 9 9" /><path d="M12 3a9 9 0 0 0 0 18" /></svg>; // Placeholder for lungs/respiratory
    const ScaleIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>;
    const ThermometerIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>;
    const GlucoseIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v19" /><path d="M5 10h14" /><path d="M5 15h14" /></svg>; // Placeholder
    const RulerIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" /></svg>;
    const StethoscopeIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 0 1 5 2h14a.3.3 0 0 1 .2.3v3a.3.3 0 0 1-.3.3H5a.3.3 0 0 1-.3-.3v-3" /><path d="M6 5v6a6 6 0 0 0 12 0V5" /><path d="M12 11v10" /><path d="M8 21h8" /><circle cx="12" cy="18" r="3" /></svg>; // For BP
    const O2Icon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>; // Placeholder O2
    const CalculatorIcon = <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>;

    const isReadOnly = data.mode === 'display';

    if (loading) return <div className="p-4 text-center text-slate-400">Cargando examen físico...</div>;

    return (
        <div className="bg-cyan-50/50 rounded-xl p-6 border border-cyan-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 sr-only">Examen Físico</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

                {/* Column 1 */}
                <div className="flex flex-col gap-6">
                    <ExamItem
                        icon={HeartIcon}
                        label="Frecuencia Cardiaca"
                        unit="lat/min"
                        value={data.frecuenciaCardiaca || ''}
                        onChange={(v) => handleChange('frecuenciaCardiaca', v)}
                        color="text-red-500"
                        onHistoryClick={() => openHistory('frecuenciaCardiaca', 'Frecuencia Cardiaca', 'lat/min')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={LungsIcon}
                        label="Frecuencia Respiratoria"
                        unit="res/min"
                        value={data.frecuenciaRespiratoria || ''}
                        onChange={(v) => handleChange('frecuenciaRespiratoria', v)}
                        color="text-blue-500"
                        onHistoryClick={() => openHistory('frecuenciaRespiratoria', 'Frecuencia Respiratoria', 'res/min')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={ScaleIcon}
                        label="Peso"
                        unit="Kg"
                        value={data.peso || ''}
                        onChange={(v) => handleChange('peso', v)}
                        color="text-purple-700"
                        onHistoryClick={() => openHistory('peso', 'Peso', 'Kg')}
                        readOnly={isReadOnly}
                    />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-6">
                    <ExamItem
                        icon={ThermometerIcon}
                        label="Temperatura"
                        unit="°C"
                        value={data.temperatura || ''}
                        onChange={(v) => handleChange('temperatura', v)}
                        color="text-blue-600"
                        onHistoryClick={() => openHistory('temperatura', 'Temperatura', '°C')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={GlucoseIcon}
                        label="HGT"
                        unit="mg/dl"
                        value={data.hgt || ''}
                        onChange={(v) => handleChange('hgt', v)}
                        color="text-orange-500"
                        onHistoryClick={() => openHistory('hgt', 'HGT', 'mg/dl')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={RulerIcon}
                        label="Talla"
                        unit="Cm"
                        value={data.talla || ''}
                        onChange={(v) => handleChange('talla', v)}
                        color="text-red-500"
                        onHistoryClick={() => openHistory('talla', 'Talla', 'Cm')}
                        readOnly={isReadOnly}
                    />
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-6">
                    <ExamItem
                        isDoubleInput
                        icon={StethoscopeIcon}
                        label="Presión Arterial"
                        unit="mm HG"
                        value={data.paSistolica || ''}
                        secondaryValue={data.paDiastolica || ''}
                        onChange={(v) => handleChange('paSistolica', v)}
                        onSecondaryChange={(v) => handleChange('paDiastolica', v)}
                        color="text-green-600"
                        onHistoryClick={() => openHistory('pa', 'Presión Arterial', 'mm HG')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={O2Icon}
                        label="Saturación O2"
                        unit="% sO2"
                        value={data.saturacionOxigeno || ''}
                        onChange={(v) => handleChange('saturacionOxigeno', v)}
                        color="text-teal-500"
                        onHistoryClick={() => openHistory('saturacionOxigeno', 'Saturación O2', '%')}
                        readOnly={isReadOnly}
                    />
                    <ExamItem
                        icon={CalculatorIcon}
                        label="IMC"
                        unit="IMC"
                        value={data.imc || ''}
                        onChange={() => { }}
                        readOnly
                        color="text-blue-600"
                        onHistoryClick={() => openHistory('imc', 'Índice de Masa Corporal', 'IMC')}
                    />
                </div>
            </div>

            {/* Footer: Date/Professional (Display Mode) or nothing (Update Mode) */}
            {isReadOnly && (
                <div className="flex justify-between items-end mt-6">
                    <button
                        onClick={() => setData(prev => ({
                            ...prev,
                            mode: 'update',
                            paSistolica: undefined,
                            paDiastolica: undefined,
                            frecuenciaCardiaca: undefined,
                            temperatura: undefined,
                            frecuenciaRespiratoria: undefined,
                            saturacionOxigeno: undefined,
                            hgt: undefined,
                            peso: undefined,
                            talla: undefined,
                            imc: undefined
                        }))}
                        className="bg-[#005F61] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#004d4f] transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Modificar
                    </button>

                    {data.lastUpdate && (
                        <div className="flex flex-col items-end gap-1 text-xs font-bold text-slate-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span>
                                    {new Date(data.lastUpdate).toLocaleDateString()} {new Date(data.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {data.professionalName && (
                                <div className="text-slate-500 font-normal">
                                    {data.professionalName} {data.specialty ? `(${data.specialty})` : ''}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <PhysicalExamHistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal(prev => ({ ...prev, isOpen: false }))}
                ordsrvnro={ordsrvnro}
                examType={historyModal.type}
                title={historyModal.title}
                unit={historyModal.unit}
            />
        </div>
    );
}
