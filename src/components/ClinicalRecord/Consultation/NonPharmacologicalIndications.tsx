'use client';

import { useState, useEffect, useRef } from 'react';
import { getIndications, saveIndications } from '@/services/nonPharmacologicalService';

interface NonPharmacologicalIndicationsProps {
    ordsrvnro: string;
    initialText: string;
}

export default function NonPharmacologicalIndications({ ordsrvnro, initialText }: NonPharmacologicalIndicationsProps) {
    const [text, setText] = useState(initialText);
    const [loading, setLoading] = useState(false);

    const textRef = useRef(initialText);

    // Sync props
    useEffect(() => {
        setText(initialText);
        textRef.current = initialText;
    }, [initialText]);

    // Update ref whenever text changes
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        // Only for unmount save
        return () => {
            // Save on unmount
            const textToSave = textRef.current;
            if (textToSave) {
                const token = localStorage.getItem('gam_access_token') || '';
                saveIndications(token, ordsrvnro, textToSave).catch(err => {
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
