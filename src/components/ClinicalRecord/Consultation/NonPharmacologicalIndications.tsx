'use client';

import { useState, useEffect, useRef } from 'react';
import { nonPharmacologicalService } from '@/services/nonPharmacologicalService';

interface NonPharmacologicalIndicationsProps {
    ordsrvnro: number;
}

export default function NonPharmacologicalIndications({ ordsrvnro }: NonPharmacologicalIndicationsProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    const textRef = useRef(text);

    // Update ref whenever text changes
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        nonPharmacologicalService.getIndications('dummy-token', ordsrvnro)
            .then(data => {
                if (mounted) {
                    setText(data);
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
            const textToSave = textRef.current;
            if (textToSave) {
                nonPharmacologicalService.saveIndications('dummy-token', ordsrvnro, textToSave).catch(err => {
                    console.error('Error saving non-pharmacological indications on unmount:', err);
                });
            }
        };
    }, [ordsrvnro]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Indicaciones no farmacológicas</h3>
            <div className={`bg-cyan-50/50 rounded-xl p-4 border border-cyan-100 relative transition-colors`}>

                {loading ? (
                    <div className="h-20 flex items-center justify-center text-slate-400">
                        Cargando...
                    </div>
                ) : (
                    <textarea
                        className="w-full h-32 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder-slate-400"
                        placeholder="Registré indicaciones no farmacológicas."
                        value={text}
                        onChange={handleChange}
                    />
                )}
            </div>
        </div>
    );
}
