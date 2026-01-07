'use client';

import { ActiveProblem } from '@/services/diagnosticsService';

interface ActiveProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    problem: ActiveProblem | null;
}

export default function ActiveProblemModal({ isOpen, onClose, problem }: ActiveProblemModalProps) {
    if (!isOpen || !problem) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-slate-100 w-full max-w-[600px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans flex flex-col">

                {/* Header */}
                <div className="bg-[#005F61] p-4 flex items-center justify-between text-white relative shrink-0">
                    <h2 className="text-lg font-bold text-center w-full">Detalle del Problema Activo</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Diagnóstico</span>
                            <span className="text-lg font-bold text-slate-800">{problem.diagnosis}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de inicio</span>
                                <span className="text-sm font-semibold text-slate-700">{problem.startDate}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</span>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full inline-block ${problem.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {problem.status === 'active' ? 'ACTIVO' : 'RESUELTO'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Profesional</span>
                            <span className="text-sm font-semibold text-slate-700">{problem.professional}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#005F61] hover:bg-[#004d4f] text-white rounded transition-colors text-sm font-bold shadow-md"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
