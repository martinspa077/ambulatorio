'use client';

import { useState, useEffect, useRef } from 'react';
import { evolutionService } from '@/services/evolutionService';

interface EvolutionProps {
    ordsrvnro: number;
}

export default function Evolution({ ordsrvnro }: EvolutionProps) {
    const [evolution, setEvolution] = useState('');
    const [loading, setLoading] = useState(true);

    const evolutionRef = useRef(evolution);

    // Update ref whenever evolution changes
    useEffect(() => {
        evolutionRef.current = evolution;
    }, [evolution]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        evolutionService.getEvolution('dummy-token', ordsrvnro)
            .then(text => {
                if (mounted) {
                    setEvolution(text);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;

            // Save on unmount
            const textToSave = evolutionRef.current;
            // logic to determine if we should save (e.g. dirty check or just save if not empty)
            // matching previous behavior of saving whatever is there
            if (textToSave) {
                evolutionService.saveEvolution('dummy-token', ordsrvnro, textToSave).catch(err => {
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
