'use client';

import { useState, useEffect } from 'react';
import { getProcedures } from '@/services/surgicalProceduresService';
import { SurgicalProcedure } from '@/services/surgicalProceduresTypes';

interface SurgicalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selected: SurgicalProcedure[], sameInstance: boolean) => void;
}

export default function SurgicalSearchModal({ isOpen, onClose, onConfirm }: SurgicalSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SurgicalProcedure[]>([]);
    const [selectedProcedures, setSelectedProcedures] = useState<SurgicalProcedure[]>([]);
    const [searching, setSearching] = useState(false);

    // Per-procedure "Same instance" check? 
    // The prompt says: "con la posibilidad de seleccionar más de una opción y asociarlas en el caso que los procedimientos quirúrgicos se realicen en una misma instancia."
    // Image 0 shows a global list "Procedimientos quirúrgicos seleccionados" and a column "En la misma instancia" with checkboxes next to each item? 
    // Or maybe it's a global setting for the group?
    // Looking at Image 0 closely: It has "En la misma instancia" column header, and checkboxes "SI" for each row. 
    // This implies you can group some but maybe not others? 
    // But the prompt also says: "Al seleccionar uno o varios procedimientos quirúrgicos asociados, ... En caso de prescribirse más de un procedimiento quirúrgico no asociado entre sí, será necesario completar los datos de forma individual".
    // This suggests that if you check "Same instance", they are grouped into ONE form. If not, they generate multiple forms.
    // For simplicity provided the mock data structure `sameInstance: boolean` in my service type, I will assume for now we group ALL selected in this modal as "Associated".
    // Wait, the image shows independent checks. Let's support independent checks but maybe for this iteration's MVP of the form, we assume if they are in this list they are being grouped for the *current* prescription action.
    // Actually, looking at the image 0 again, it seems ALL items in the "Selected" list have a checkbox. Maybe it defaults to checked. 
    // Let's implement it as: User selects N procedures. User checks which ones are "Associated". 
    // BUT the prompt says "Al seleccionar uno o varios ... asociados, el sistema despliega una única pantalla".
    // This strongly implies that the OUTPUT of this modal is a list of procedures to be treated as ONE prescription event.
    // So I will maintain a list `selectedProcedures`. The checkbox in the image might be to confirm they are indeed part of this instance. 
    // Let's stick to the prompt's simplicity: "asociarlas en el caso que ... se realicen en una misma instancia".
    // I'll add a state `sameInstance` map or just a global toggle?
    // Image 0 shows individual checkboxes. I'll add a `sameInstance` boolean property to the selection state for UI fidelity, but functionally pass them all to the form.

    const [sameInstance, setSameInstance] = useState(false);

    useEffect(() => {
        const search = async () => {
            // Only search if length > 1 or empty (to show all?) Prompt says "despliega todas las opciones".
            setSearching(true);
            try {
                const results = await getProcedures(searchTerm);
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

    const handleSelect = (proc: SurgicalProcedure) => {
        if (!selectedProcedures.find(p => p.id === proc.id)) {
            setSelectedProcedures([...selectedProcedures, proc]);
        }
    };

    const handleRemove = (id: string) => {
        setSelectedProcedures(selectedProcedures.filter(p => p.id !== id));
    };

    const handleConfirm = () => {
        onConfirm(selectedProcedures, sameInstance);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#005F61] p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Prescripciones de Procedimientos Quirúrgicos</h3>
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
                                placeholder="Ingrese los procedimientos quirúrgicos a prescribir"
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
                                Procedimiento quirúrgicos
                            </div>
                            <div className="flex-1 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {searching ? (
                                    <div className="p-8 text-center text-slate-500">Buscando...</div>
                                ) : (
                                    searchResults.map(proc => (
                                        <button
                                            key={proc.id}
                                            onClick={() => handleSelect(proc)}
                                            className="w-full text-left px-6 py-4 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
                                        >
                                            {proc.description}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Selected List */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
                            <div className="bg-[#005F61] text-white p-3 flex justify-between items-center px-6">
                                <span className="font-bold">Procedimientos quirúrgicos seleccionados</span>
                                <div className="text-xs bg-white/20 px-2 py-1 rounded">
                                    <span className="font-bold text-lg">{selectedProcedures.length}</span> Seleccionados
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-teal-500 text-white font-bold text-sm items-center">
                                <div className="flex-1">Procedimientos</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="flex-1 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {selectedProcedures.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 italic">
                                        Seleccione procedimientos de la lista izquierda
                                    </div>
                                ) : (
                                    selectedProcedures.map(proc => (
                                        <div key={proc.id} className="flex items-center gap-4 p-4">
                                            <div className="flex-1 font-bold text-slate-800 dark:text-white">
                                                {proc.description}
                                            </div>
                                            <div className="w-8 flex justify-center">
                                                <button
                                                    onClick={() => handleRemove(proc.id)}
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
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                    <label className="flex items-center gap-3 px-4 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={sameInstance}
                            onChange={e => setSameInstance(e.target.checked)}
                            className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                            Asociar en la misma instancia
                        </span>
                    </label>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold uppercase tracking-wide transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedProcedures.length === 0}
                            className="px-8 py-3 bg-[#005F61] hover:bg-[#004A4C] text-white rounded-xl font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
