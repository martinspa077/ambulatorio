'use client';

import { useState, useEffect, useRef } from 'react';
import { consultationReasonService, LastConsultationReason } from '@/services/consultationReasonService';
import { generalService, TerminologyResult } from '@/services/generalService';

interface ConsultationReasonProps {
    ordsrvnro: number;
}

export default function ConsultationReason({ ordsrvnro }: ConsultationReasonProps) {
    // State
    const [lastReasons, setLastReasons] = useState<LastConsultationReason[]>([]);
    const [currentReasons, setCurrentReasons] = useState<string[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [loadingCurrent, setLoadingCurrent] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    // Search Modal State
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<TerminologyResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const currentReasonsRef = useRef<string[]>([]);

    // Fetch Data
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            // Load History
            try {
                const history = await consultationReasonService.getLastReasons('dummy-token', ordsrvnro);
                if (mounted) {
                    setLastReasons(history);
                    setLoadingHistory(false);
                }
            } catch (e) {
                console.error(e);
                if (mounted) setLoadingHistory(false);
            }

            // Load Current
            try {
                const current = await consultationReasonService.getCurrentReason('dummy-token', ordsrvnro);
                if (mounted) {
                    setCurrentReasons(current);
                    currentReasonsRef.current = current;
                    setLoadingCurrent(false);
                }
            } catch (e) {
                console.error(e);
                if (mounted) setLoadingCurrent(false);
            }
        };

        loadData();

        return () => { mounted = false; };
    }, [ordsrvnro]);

    // Save on unmount
    useEffect(() => {
        return () => {
            if (!loadingCurrent) {
                consultationReasonService.saveCurrentReason('dummy-token', ordsrvnro, currentReasonsRef.current);
            }
        };
    }, [ordsrvnro, loadingCurrent]);

    // Search Logic
    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setSearching(true);
        setSearchError(false);
        try {
            // Simulate error randomly or just success? User prompt implies handling unavailability.
            // Let's implement success by default, but user can trigger manual fallback visually if needed.
            const results = await generalService.searchTerminology(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error(error);
            setSearchError(true);
        } finally {
            setSearching(false);
            setHasSearched(true);
        }
    };

    const handleSelectResult = (result: TerminologyResult) => {
        const newReason = result.description;
        const newReasons = [...currentReasons, newReason];
        setCurrentReasons(newReasons);
        currentReasonsRef.current = newReasons;
        setShowSearchModal(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleManualEntry = () => {
        if (!searchTerm.trim()) return;
        const newReasons = [...currentReasons, searchTerm];
        setCurrentReasons(newReasons);
        currentReasonsRef.current = newReasons;
        setShowSearchModal(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleDeleteReason = (index: number) => {
        const newReasons = currentReasons.filter((_, i) => i !== index);
        setCurrentReasons(newReasons);
        currentReasonsRef.current = newReasons;
    };

    const handleCopyFromHistory = (reason: string) => {
        const newReasons = [...currentReasons, reason];
        setCurrentReasons(newReasons);
        currentReasonsRef.current = newReasons;
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Motivo de consulta</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Last Reasons */}
                <div className="bg-[#005F61] rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-[#004d4f] px-4 py-2 text-white font-bold text-sm">
                        Motivo de consulta
                    </div>
                    <div className="bg-white min-h-[150px]">
                        {loadingHistory ? (
                            <div className="p-4 text-center text-slate-400">Cargando...</div>
                        ) : lastReasons.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 italic">No hay registros anteriores.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {lastReasons.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group">
                                        <div className="flex gap-4 text-sm font-bold text-slate-700">
                                            <span className="w-24 text-slate-900">{item.date}</span>
                                            <span>{item.reason}</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopyFromHistory(item.reason)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#005F61] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Current Reason */}
                <div className="bg-[#005F61] rounded-lg overflow-hidden shadow-sm flex flex-col h-full min-h-[200px]">
                    <div className="bg-[#004d4f] px-4 py-2 text-white font-bold text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>Motivo de consulta</span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-serif italic font-bold hover:bg-orange-600 transition-colors"
                                >
                                    i
                                </button>
                                {showInfo && (
                                    <div className="absolute left-0 top-8 z-20 w-64 bg-slate-800 text-white text-xs p-3 rounded shadow-xl">
                                        El motivo de consulta es la razón principal por la cual el paciente solicitó atención médica.
                                        <div className="absolute -top-1 left-2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSearchModal(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded font-bold uppercase transition-colors"
                        >
                            Agregar
                        </button>
                    </div>
                    <div className="bg-white flex-1 p-6 relative">
                        {loadingCurrent ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                            </div>
                        ) : currentReasons.length > 0 ? (
                            <div className="space-y-2">
                                {currentReasons.map((reason, idx) => (
                                    <div key={idx} className="flex items-start justify-between bg-slate-50 p-3 rounded group hover:bg-slate-100 transition-colors">
                                        <span className="text-slate-800 font-medium">{reason}</span>
                                        <button
                                            onClick={() => handleDeleteReason(idx)}
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            title="Eliminar motivo"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-400 italic text-lg text-center mt-4">
                                Copie un motivo de consulta de la grilla o agregue uno nuevo
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowSearchModal(false)}></div>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-[#005F61] p-4 text-white font-bold flex justify-between items-center">
                            <h3>Agregar Motivo de Consulta</h3>
                            <button onClick={() => setShowSearchModal(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    className="flex-1 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-[#005F61]"
                                    placeholder="Buscar término..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setHasSearched(false);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#005F61] text-white px-4 py-2 rounded hover:bg-[#004d4f] font-bold"
                                    disabled={searching}
                                >
                                    {searching ? '...' : 'Buscar'}
                                </button>
                            </div>

                            {searchError ? (
                                <div className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded">
                                    El servidor se encuentra indisponible, ingrese el termino manual
                                </div>
                            ) : null}

                            <div className="max-h-60 overflow-y-auto border-t border-slate-100">
                                {searchResults.map(res => (
                                    <button
                                        key={res.id}
                                        onClick={() => handleSelectResult(res)}
                                        className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 text-slate-700"
                                    >
                                        {res.description}
                                    </button>
                                ))}
                                {searchResults.length === 0 && !searching && hasSearched && !searchError && (
                                    <div className="p-4 text-center text-slate-500 text-sm">
                                        No se encontraron resultados.
                                    </div>
                                )}
                            </div>

                            {(searchResults.length === 0 || searchError) && hasSearched && (
                                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                                    <button
                                        onClick={handleManualEntry}
                                        className="text-[#005F61] font-bold hover:underline text-sm"
                                    >
                                        Ingresar "{searchTerm}" manualmente
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
