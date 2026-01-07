'use client';

import { useState, useEffect } from 'react';
import { getAntecedentes, deleteAntecedente, addAntecedente, Antecedente, AntecedenteType } from '@/services/headerServices';
import { searchTerminology, TerminologyResult } from '@/services/generalService';

interface BackgroundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ordsrvnro: string;
    onBackgroundsUpdate?: () => void;
}

export default function BackgroundsModal({ isOpen, onClose, ordsrvnro, onBackgroundsUpdate }: BackgroundsModalProps) {
    const [antecedentes, setAntecedentes] = useState<Antecedente[]>([]);
    const [loading, setLoading] = useState(false);

    // Add Mode State
    const [addingType, setAddingType] = useState<AntecedenteType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<TerminologyResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState<TerminologyResult | null>(null);
    const [observations, setObservations] = useState('');
    const [parentesco, setParentesco] = useState('');
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && ordsrvnro) {
            loadAntecedentes();
        }
    }, [isOpen, ordsrvnro]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setSearching(true);
        setErrorMessage(null);
        try {
            const results = await searchTerminology(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setSearching(false);
        }
    };

    const loadAntecedentes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            const data = await getAntecedentes(token, ordsrvnro);
            setAntecedentes(data);
        } catch (error) {
            console.error('Error loading antecedents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (key: string, id: string) => {
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            await deleteAntecedente(token, ordsrvnro, key, id);
            setAntecedentes(antecedentes.filter(a => a.key !== key));
            if (onBackgroundsUpdate) onBackgroundsUpdate();
        } catch (error) {
            console.error('Error deleting antecedent:', error);
        }
    };

    const handleAdd = (type: AntecedenteType) => {
        setAddingType(type);
        setSearchTerm('');
        setSelectedTerm(null);
        setObservations('');
        setParentesco('');
        setSearchResults([]);
        setIsManualEntry(false);
        setErrorMessage(null);
    };

    const handleCancelAdd = () => {
        setAddingType(null);
        setErrorMessage(null);
    };

    const handleSelectTerm = (term: TerminologyResult) => {
        setSelectedTerm(term);
        setSearchTerm(term.description);
        setSearchResults([]);
        setErrorMessage(null);
    };

    const handleSave = async () => {
        if (!addingType) return;
        if (!isManualEntry && !selectedTerm) return;
        if (isManualEntry && !searchTerm.trim()) return;

        // Validar duplicados
        const description = selectedTerm ? selectedTerm.description : searchTerm;
        const newId = selectedTerm ? selectedTerm.id : '0';

        const isDuplicate = antecedentes.some(a => {
            if (a.tipo !== addingType) return false;

            // Comparar por ID si existe y no es 0, o por descripción
            const sameItem = (newId !== '0' && a.id === newId) ||
                (a.descripcion.toLowerCase() === description.toLowerCase());

            if (!sameItem) return false;

            // Si es familiar, permitir mismo antecedente solo si es diferente parentesco
            if (addingType === 'ANT') {
                return a.parentesco === parentesco;
            }

            return true;
        });

        if (isDuplicate) {
            setErrorMessage('Este antecedente ya se encuentra registrado para el paciente.');
            return;
        }

        try {
            const token = localStorage.getItem('gam_access_token') || '';
            await addAntecedente(token, ordsrvnro, {
                id: newId,
                descripcion: description,
                tipo: addingType,
                fechaRegistro: new Date().toLocaleDateString(),
                observaciones: observations,
                parentesco: addingType === 'ANT' ? parentesco : undefined
            });

            await loadAntecedentes();
            setAddingType(null);
            if (onBackgroundsUpdate) onBackgroundsUpdate();
        } catch (error) {
            console.error('Error saving antecedent:', error);
        }
    };

    if (!isOpen) return null;

    const renderSection = (title: string, type: AntecedenteType) => {
        const items = antecedentes.filter(a => a.tipo === type);
        const isAddingThisSection = addingType === type;

        return (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-white border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                    {!isAddingThisSection && (
                        <button
                            onClick={() => handleAdd(type)}
                            className="flex items-center gap-1 text-[#F59E0B] font-bold text-sm hover:text-orange-600 transition-colors"
                        >
                            Agregar
                            <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            </div>
                        </button>
                    )}
                </div>

                {isAddingThisSection && (
                    <div className="p-4 bg-orange-50/50 border-b border-orange-100 animate-in fade-in slide-in-from-top-2">
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 mb-1">Buscar término / Descripción</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500"
                                            placeholder="Escriba para buscar..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                if (selectedTerm && e.target.value !== selectedTerm.description) {
                                                    setSelectedTerm(null);
                                                }
                                            }}
                                            disabled={isManualEntry}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            autoFocus
                                        />
                                        {searching && <div className="absolute right-3 top-2.5 text-xs text-slate-400">Buscando...</div>}

                                        {/* Search Results Dropdown */}
                                        {searchResults.length > 0 && (
                                            <div className="absolute top-full left-0 w-full bg-white shadow-lg border border-slate-200 rounded-b mt-1 z-20 max-h-48 overflow-y-auto">
                                                {searchResults.map(res => (
                                                    <button
                                                        key={res.id}
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-teal-50 text-slate-700 block border-b border-slate-50 last:border-0"
                                                        onClick={() => handleSelectTerm(res)}
                                                    >
                                                        {res.description}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="px-3 py-2 text-xs font-bold rounded bg-[#005F61] text-white hover:bg-[#004d4f] disabled:opacity-50 ml-2"
                                        disabled={searching || isManualEntry}
                                    >
                                        Buscar
                                    </button>
                                    <button
                                        className={`px-3 py-2 text-xs font-bold rounded border ${isManualEntry ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setIsManualEntry(!isManualEntry);
                                            setSelectedTerm(null);
                                            setSearchResults([]);
                                        }}
                                    >
                                        Manual
                                    </button>
                                </div>
                                {isManualEntry && <p className="text-[10px] text-orange-600 mt-1">* Ingreso manual activado. El término no estará codificado.</p>}
                            </div>

                            {type === 'ANT' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Parentesco</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500"
                                        value={parentesco}
                                        onChange={(e) => setParentesco(e.target.value)}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="Madre">Madre</option>
                                        <option value="Padre">Padre</option>
                                        <option value="Abuelo">Abuelo</option>
                                        <option value="Hermano">Hermano</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Observaciones</label>
                                <textarea
                                    className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500 h-20 resize-none"
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={handleCancelAdd}
                                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={(!isManualEntry && !selectedTerm) || (isManualEntry && !searchTerm.trim()) || (type === 'ANT' && !parentesco)}
                                    className="px-4 py-2 text-sm bg-teal-600 text-white hover:bg-teal-700 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-[#005F61] text-white px-4 py-2 grid grid-cols-[80px_1fr_1fr_100px] gap-2 font-bold text-xs items-center">
                    <div className="pl-4">Acciones</div>
                    <div>Antecedente</div>
                    <div>Observaciones</div>
                    {type === 'ANT' && <div>Parentesco</div>}
                </div>

                {items.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm italic bg-slate-50">No hay antecedentes registrados.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map(item => (
                            <div key={item.key} className="grid grid-cols-[80px_1fr_1fr_100px] gap-2 px-4 py-3 items-center hover:bg-slate-50 transition-colors text-sm">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(item.key, item.id)}
                                        className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <div className="font-bold text-slate-800">{item.descripcion}</div>
                                <div className="text-slate-600 truncate">{item.observaciones || '-'}</div>
                                {type === 'ANT' && <div className="text-slate-700 font-medium">{item.parentesco}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-slate-100 w-full max-w-[900px] h-[85vh] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans flex flex-col">

                {/* Header */}
                <div className="bg-[#005F61] p-4 flex items-center justify-between text-white relative shrink-0">
                    <h2 className="text-lg font-bold text-center w-full">Antecedentes del usuario</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {renderSection('Antecedentes personales', 'APE')}
                            {renderSection('Antecedentes familiares', 'ANT')}
                            {renderSection('Antecedentes socioeconómicos', 'ASE')}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
