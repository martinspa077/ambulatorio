'use client';

import { useState } from 'react';
import { generalService, TerminologyResult } from '@/services/generalService';

interface DiagnosisSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (diagnosis: string, terminologyId?: string) => void;
}

export default function DiagnosisSearchModal({ isOpen, onClose, onSelect }: DiagnosisSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<TerminologyResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) return;

        setSearching(true);
        setSearchError(false);
        setHasSearched(true);

        try {
            const results = await generalService.searchTerminology(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error('Terminology search error:', error);
            setSearchError(true);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectResult = (result: TerminologyResult) => {
        onSelect(result.description, result.id);
        handleClose();
    };

    const handleManualEntry = () => {
        onSelect(searchTerm);
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSearchError(false);
        setHasSearched(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Buscar Diagnóstico</h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="flex-1 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:border-[#005F61] dark:bg-slate-800 dark:text-white"
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
                            disabled={searching || searchTerm.trim().length < 2}
                            className="px-6 py-2 bg-[#005F61] text-white rounded-xl font-bold hover:bg-[#004A4C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {searching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-6">
                    {searchError && (
                        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                El servidor se encuentra indisponible, ingrese el término manual
                            </p>
                        </div>
                    )}

                    {searching && (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!searching && hasSearched && searchResults.length === 0 && !searchError && (
                        <div className="text-center py-8 text-slate-500">
                            <p className="text-sm">No se encontraron resultados.</p>
                        </div>
                    )}

                    {!searching && searchResults.length > 0 && (
                        <div className="space-y-2">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => handleSelectResult(result)}
                                    className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                    {result.description}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Manual Entry Option */}
                    {hasSearched && searchTerm && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                            <button
                                onClick={handleManualEntry}
                                className="text-[#005F61] dark:text-teal-400 font-bold hover:underline text-sm"
                            >
                                Ingresar "{searchTerm}" manualmente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
