'use client';

import { useState, useEffect } from 'react';
import { Professional, ProfessionalRole } from '@/services/surgicalProceduresTypes';
import { searchProfessionals, getProfessionalRoles } from '@/services/surgicalProceduresService';

interface ProfessionalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (professional: Professional) => void;
    title?: string;
    initialRole?: string;
}

export default function ProfessionalSearchModal({ isOpen, onClose, onSelect, title = 'Buscar Profesional', initialRole }: ProfessionalSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Professional[]>([]);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Manual Entry State
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualData, setManualData] = useState<Professional>({
        nombre: '',
        numeroCaja: '',
        especialidad: '',
        rol: initialRole || ''
    });

    // Roles and Specialties
    const [availableRoles, setAvailableRoles] = useState<ProfessionalRole[]>([]);
    const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);

    useEffect(() => {
        if (showManualForm) {
            // Load roles when entering manual mode
            getProfessionalRoles().then(roles => setAvailableRoles(roles));
        }
    }, [showManualForm]);

    useEffect(() => {
        if (!manualData.rol) {
            setAvailableSpecialties([]);
            return;
        }
        const selectedRole = availableRoles.find(r => r.name === manualData.rol);
        setAvailableSpecialties(selectedRole ? selectedRole.specialties : []);

        // Clear specialty if not in the new list (unless it's empty/new)
        // Check if current specialty is valid for new role
        if (manualData.especialidad && selectedRole && !selectedRole.specialties.includes(manualData.especialidad)) {
            setManualData(prev => ({ ...prev, especialidad: '' }));
        }

    }, [manualData.rol, availableRoles]);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) return;

        setSearching(true);
        setHasSearched(true);

        try {
            const results = await searchProfessionals(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error('Professional search error:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectResult = (professional: Professional) => {
        onSelect(professional);
        onClose();
        resetState();
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSelect(manualData);
        onClose();
        resetState();
    };

    const resetState = () => {
        setSearchTerm('');
        setSearchResults([]);
        setHasSearched(false);
        setShowManualForm(false);
        setManualData({ nombre: '', numeroCaja: '', especialidad: '', rol: initialRole || '' });
    };

    const handleClose = () => {
        onClose();
        resetState();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {showManualForm ? 'Ingreso Manual de Profesional' : title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!showManualForm ? (
                    // Search View
                    <>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    className="flex-1 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:border-teal-500 dark:bg-slate-800 dark:text-white"
                                    placeholder="Buscar por nombre..."
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

                        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                            {searching && (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
                                </div>
                            )}

                            {!searching && hasSearched && searchResults.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 mb-4">No se encontraron profesionales.</p>
                                    <button
                                        onClick={() => setShowManualForm(true)}
                                        className="text-teal-600 font-bold hover:underline"
                                    >
                                        Agregar Participante Manual
                                    </button>
                                </div>
                            )}

                            {!searching && searchResults.length > 0 && (
                                <div className="space-y-2">
                                    {searchResults.map((professional) => (
                                        <button
                                            key={professional.id}
                                            onClick={() => handleSelectResult(professional)}
                                            className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                                                        {professional.nombre}
                                                    </p>
                                                    <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        <span>{professional.especialidad}</span>
                                                        <span>•</span>
                                                        <span>{professional.rol}</span>
                                                    </div>
                                                </div>
                                                <div className="text-slate-400 group-hover:text-teal-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Allow manual entry even if results found */}
                                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-sm text-slate-500 mb-2">¿No encuentra al profesional?</p>
                                        <button
                                            onClick={() => setShowManualForm(true)}
                                            className="text-teal-600 font-bold hover:underline text-sm"
                                        >
                                            Agregar Participante Manual
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // Manual Form View
                    <form onSubmit={handleManualSubmit} className="p-6 flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Profesional *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                placeholder="Nombre completo"
                                value={manualData.nombre}
                                onChange={e => setManualData({ ...manualData, nombre: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Número de caja profesional</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                placeholder="Ej: 123456"
                                value={manualData.numeroCaja || ''}
                                onChange={e => setManualData({ ...manualData, numeroCaja: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Swapped Order: Role First, then Specialty */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rol</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none"
                                    value={manualData.rol || ''}
                                    onChange={e => setManualData({ ...manualData, rol: e.target.value })}
                                >
                                    <option value="">Seleccionar...</option>
                                    {availableRoles.map(role => (
                                        <option key={role.name} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Especialidad</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 ring-teal-500 outline-none disabled:opacity-50 disabled:bg-slate-100"
                                    value={manualData.especialidad || ''}
                                    onChange={e => setManualData({ ...manualData, especialidad: e.target.value })}
                                    disabled={!manualData.rol}
                                >
                                    <option value="">Seleccionar...</option>
                                    {availableSpecialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowManualForm(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                            >
                                Volver a buscar
                            </button>
                            <button
                                type="submit"
                                disabled={!manualData.nombre}
                                className="px-6 py-2 bg-[#005F61] text-white rounded-xl font-bold hover:bg-[#004A4C] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-900/20"
                            >
                                Guardar Profesional
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
