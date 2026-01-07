'use client';

import { useState, useEffect, useRef } from 'react';
import { getEvolution, saveEvolution } from '@/services/evolutionService';

interface EvolutionProps {
    ordsrvnro: string;
    initialEvolution: string;
}

export default function Evolution({ ordsrvnro, initialEvolution }: EvolutionProps) {
    const [evolution, setEvolution] = useState(initialEvolution);
    const [loading, setLoading] = useState(false);

    const evolutionRef = useRef(initialEvolution);

    // Sync props
    useEffect(() => {
        setEvolution(initialEvolution);
        evolutionRef.current = initialEvolution;
    }, [initialEvolution]);

    // Update ref whenever evolution changes
    useEffect(() => {
        evolutionRef.current = evolution;
    }, [evolution]);

    useEffect(() => {
        // Only for unmount save
        return () => {
            // Save on unmount
            const textToSave = evolutionRef.current;
            if (textToSave) {
                const token = localStorage.getItem('gam_access_token') || '';
                saveEvolution(token, ordsrvnro, textToSave).catch(err => {
                    console.error('Error saving evolution on unmount:', err);
                });
            }
        };
    }, [ordsrvnro]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEvolution(e.target.value);
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Evolución</h3>
            <div className={`bg-cyan-50/50 rounded-xl p-4 border border-cyan-100 relative transition-colors`}>

                {loading ? (
                    <div className="h-32 flex items-center justify-center text-slate-400">
                        Cargando...
                    </div>
                ) : (
                    <textarea
                        className="w-full h-40 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder-slate-400"
                        placeholder="Registre evolución y examen físico"
                        value={evolution}
                        onChange={handleChange}
                    />
                )}


            </div>
        </div>
    );
}
