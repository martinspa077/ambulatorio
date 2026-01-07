'use client';

import { getMutualistas, updateMutualista, PatientContactInfoResponse, MutualistaContactInfo } from '@/services/headerServices';
import { useState, useEffect } from 'react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: PatientContactInfoResponse | null;
    loading: boolean;
}

export default function ContactModal({ isOpen, onClose, data, loading }: ContactModalProps) {
    const [availableMutualistas, setAvailableMutualistas] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);

    // We use a local state to allow optimistic updates when changing the mutualista
    const [currentData, setCurrentData] = useState<PatientContactInfoResponse | null>(null);

    useEffect(() => {
        if (data) {
            setCurrentData(data);
        }
        getMutualistas('dummy-token').then(setAvailableMutualistas);
    }, [data]);

    const handleMutualistaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMutualistaName = e.target.value;
        if (!currentData) return;

        setUpdating(true);
        try {
            // Update on server
            await updateMutualista('dummy-token', '12345', newMutualistaName); // Note: ordsrvnro passed as dummy here, ideally should be valid

            // Optimistic update
            setCurrentData({
                ...currentData,
                mutualista: newMutualistaName
            });
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-[900px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans">

                {/* Header */}
                <div className="bg-[#005F61] p-4 flex items-center justify-between text-white relative">
                    <h2 className="text-lg font-bold text-center w-full">Datos de Contacto</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {loading || !currentData ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="text-sm text-slate-800">
                        {/* Main Info Section */}
                        <div className="p-8 grid grid-cols-3 gap-y-8 gap-x-4">

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Fecha de Nacimiento:</span>
                                <span className="font-bold text-[#005F61]">{currentData.fechaNacimiento}</span>
                            </div>

                            <div className="flex flex-col gap-1 col-span-2">
                                <span className="font-bold text-slate-900">Nombre:</span>
                                <div className="border border-teal-600/30 rounded-full px-4 py-1.5 w-fit min-w-[200px] bg-slate-50 flex justify-between items-center text-[#005F61] font-bold relative">
                                    <select
                                        className="appearance-none bg-transparent w-full h-full focus:outline-none pr-8 cursor-pointer"
                                        value={currentData.mutualista}
                                        onChange={handleMutualistaChange}
                                    >
                                        {availableMutualistas.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    {updating && <div className="absolute right-8 w-4 h-4 border-2 border-slate-400 border-b-teal-600 rounded-full animate-spin"></div>}
                                    <svg className="w-4 h-4 absolute right-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Domicilio:</span>
                                <span className="font-bold text-[#005F61]">{currentData.domicilio}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Departamento:</span>
                                <span className="font-bold text-[#005F61]">{currentData.departamento}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Localidad:</span>
                                <span className="font-bold text-[#005F61]">{currentData.localidad}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Teléfono Primario:</span>
                                <span className="font-bold text-[#005F61]">{currentData.telefonoPrimario}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Teléfono Alternativo:</span>
                                <span className="font-bold text-[#005F61]">{currentData.telefonoAlternativo}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Correo electrónico;</span>
                                <span className="font-bold text-[#005F61]">{currentData.email}</span>
                            </div>
                        </div>

                        {/* Reference Contact Section */}
                        <div className="bg-[#EAF6F8] p-8 grid grid-cols-3 gap-y-8 gap-x-4">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Persona de Contacto</span>
                                <span className="font-bold text-[#005F61]">{currentData.contactoRef.nombre}</span>
                            </div>

                            <div className="flex flex-col gap-1 col-span-2">
                                <span className="font-bold text-slate-900">Teléfono:</span>
                                <span className="font-bold text-[#005F61]">{currentData.contactoRef.telefono}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Domicilio:</span>
                                <span className="font-bold text-[#005F61]">{currentData.contactoRef.domicilio}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Departamento:</span>
                                <span className="font-bold text-[#005F61]">{currentData.contactoRef.departamento}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-slate-900">Localidad:</span>
                                <span className="font-bold text-[#005F61]">{currentData.contactoRef.localidad}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
