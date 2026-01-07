'use client';

import { Antecedente } from '@/services/headerServices';

interface AntecedenteModalProps {
    isOpen: boolean;
    onClose: () => void;
    antecedente: Antecedente | null;
}

export default function AntecedenteModal({ isOpen, onClose, antecedente }: AntecedenteModalProps) {
    if (!isOpen || !antecedente) return null;

    const getTitle = (type: string) => {
        switch (type) {
            case 'Personal': return 'Antecedente Personal';
            case 'Familiar': return 'Antecedente Familiar';
            case 'Socioeconomico': return 'Antecedente Socioeconómico';
            default: return 'Detalle de Antecedente';
        }
    };

    const getHeaderColor = (type: string) => {
        switch (type) {
            case 'Personal': return 'bg-amber-500';
            case 'Familiar': return 'bg-blue-500';
            case 'Socioeconomico': return 'bg-emerald-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-slate-100 w-full max-w-[600px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans flex flex-col">

                {/* Header */}
                <div className={`${getHeaderColor(antecedente.tipo)} p-4 flex items-center justify-between text-white relative shrink-0`}>
                    <h2 className="text-lg font-bold text-center w-full">{getTitle(antecedente.tipo)}</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</span>
                            <span className="text-lg font-bold text-slate-800">{antecedente.descripcion}</span>
                        </div>

                        {antecedente.parentesco && (
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Parentesco</span>
                                <span className="text-sm font-semibold text-slate-700">{antecedente.parentesco}</span>
                            </div>
                        )}

                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Registro</span>
                            <span className="text-sm font-semibold text-slate-700">{antecedente.fechaRegistro}</span>
                        </div>

                        {antecedente.observaciones && (
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</span>
                                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
                                    {antecedente.observaciones}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 ${getHeaderColor(antecedente.tipo)} hover:brightness-110 text-white rounded transition-all text-sm font-bold shadow-md`}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
