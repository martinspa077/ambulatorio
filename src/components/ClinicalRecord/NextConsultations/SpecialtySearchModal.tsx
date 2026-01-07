'use client';

import { useState, useEffect } from 'react';
import { getSpecialties } from '@/services/nextConsultationsService';
import { Specialty } from '@/services/nextConsultationsTypes';

interface SpecialtySearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selected: Specialty[]) => void;
}

export default function SpecialtySearchModal({ isOpen, onClose, onConfirm }: SpecialtySearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Specialty[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const search = async () => {
            setSearching(true);
            try {
                const results = await getSpecialties(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error(error);
            } finally {
                setSearching(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    if (!isOpen) return null;

    const handleSelect = (spec: Specialty) => {
        if (!selectedSpecialties.find(s => s.id === spec.id)) {
            setSelectedSpecialties([...selectedSpecialties, spec]);
        }
    };

    const handleRemove = (id: string) => {
        setSelectedSpecialties(selectedSpecialties.filter(s => s.id !== id));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#005F61] p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Prescripciones de Consultas</h3>
                    <button onClick={onClose} className="hover:text-white/80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6 bg-slate-50 dark:bg-slate-800">
                    {/* Search Bar */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Ingrese la especialidad a prescribir"
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:border-teal-500 shadow-sm dark:bg-slate-700 dark:text-white"
                                autoFocus
                            />
                        </div>
                        <button className="p-3 bg-[#005F61] text-white rounded-xl hover:bg-[#004A4C] shadow-lg shadow-teal-900/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                        {/* Results List */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                            <div className="bg-[#005F61] text-white p-3 font-bold text-center">
                                Especialidades
                            </div>
                            <div className="flex-1 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {searching ? (
                                    <div className="p-8 text-center text-slate-500">Buscando...</div>
                                ) : (
                                    searchResults.map(spec => (
                                        <button
                                            key={spec.id}
                                            onClick={() => handleSelect(spec)}
                                            className="w-full text-left px-6 py-4 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
                                        >
                                            {spec.description}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Selected List */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                            <div className="bg-[#005F61] text-white p-3 flex justify-between items-center px-6">
                                <span className="font-bold">Especialidades seleccionadas</span>
                                <div className="text-xs bg-white/20 px-2 py-1 rounded">
                                    <span className="font-bold text-lg">{selectedSpecialties.length}</span> Seleccionados
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-teal-500 text-white font-bold text-sm items-center">
                                <div className="flex-1">Especialidad</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="flex-1 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {selectedSpecialties.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 italic">
                                        Seleccione especialidades de la lista izquierda
                                    </div>
                                ) : (
                                    selectedSpecialties.map(spec => (
                                        <div key={spec.id} className="flex items-center gap-4 p-4">
                                            <div className="flex-1 font-bold text-slate-800 dark:text-white">
                                                {spec.description}
                                            </div>
                                            <div className="w-8 flex justify-center">
                                                <button
                                                    onClick={() => handleRemove(spec.id)}
                                                    className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md transform hover:scale-105 transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 bg-white dark:bg-slate-900">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold uppercase tracking-wide transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(selectedSpecialties)}
                        disabled={selectedSpecialties.length === 0}
                        className="px-8 py-3 bg-[#005F61] hover:bg-[#004A4C] text-white rounded-xl font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
