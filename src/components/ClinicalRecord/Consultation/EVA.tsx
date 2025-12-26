'use client';

import { useState, useEffect, useRef } from 'react';
import { evaService } from '@/services/evaService';
import PhysicalExamHistoryModal from './PhysicalExamHistoryModal';

interface EVAProps {
    ordsrvnro: number;
}

export default function EVA({ ordsrvnro }: EVAProps) {
    const [value, setValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [showHistory, setShowHistory] = useState(false);

    // Ref to track current value for save on unmount
    const valueRef = useRef(value);

    // Update ref whenever value changes
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        evaService.getEVA('dummy-token', ordsrvnro)
            .then(val => {
                if (mounted) {
                    setValue(val);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;

            // Save on unmount
            const valToSave = valueRef.current;
            if (valToSave !== null) {
                evaService.saveEVA('dummy-token', ordsrvnro, valToSave).catch(err => {
                    console.error('Error saving EVA on unmount:', err);
                });
            }
        };
    }, [ordsrvnro]);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value === '' ? null : Number(e.target.value);
        setValue(newValue);
    };

    const getDescription = (val: number | null) => {
        if (val === null) return '';
        if (val === 0) return 'Sin dolor';
        if (val >= 1 && val <= 3) return 'Dolor leve';
        if (val >= 4 && val <= 6) return 'Dolor moderado';
        if (val >= 7 && val <= 9) return 'Dolor intenso';
        if (val === 10) return 'Dolor insoportable';
        return '';
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">EVA</h3>
            <div className={`bg-cyan-50/50 rounded-xl p-6 border border-cyan-100 flex items-center gap-6`}>

                {loading ? (
                    <div className="text-slate-400">Cargando...</div>
                ) : (
                    <>
                        <select
                            className="bg-white border border-[#005F61] text-[#005F61] font-bold rounded-lg px-4 py-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-[#005F61]/50"
                            value={value === null ? '' : value}
                            onChange={handleChange}
                        >
                            <option value="">-</option>
                            {[...Array(11)].map((_, i) => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowHistory(true)}
                            className="w-10 h-10 rounded-full bg-[#005F61] text-white flex items-center justify-center hover:bg-[#004d4f] transition-colors"
                            title="Ver evolución"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </button>

                        <span className="font-bold text-[#005F61] text-lg">
                            {getDescription(value)}
                        </span>
                    </>
                )}
            </div>

            <PhysicalExamHistoryModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                ordsrvnro={ordsrvnro}
                examType="eva" // Custom type for EVA
                title="EVA (Escala Visual Analógica)"
                unit=""
            />
        </div>
    );
}
