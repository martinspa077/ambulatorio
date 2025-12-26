'use client';

import { useState, useEffect, useRef } from 'react';
import { attentionModeService, AttentionModeType } from '@/services/attentionModeService';

interface AttentionModeProps {
    ordsrvnro: number;
}

export default function AttentionMode({ ordsrvnro }: AttentionModeProps) {
    const [mode, setMode] = useState<AttentionModeType>('Presencial');
    const [loading, setLoading] = useState(true);
    const modeRef = useRef<AttentionModeType>('Presencial'); // Ref to keep track of latest value for unmount save

    useEffect(() => {
        let mounted = true;

        const fetchMode = async () => {
            try {
                const data = await attentionModeService.getAttentionMode('dummy-token', ordsrvnro);
                if (mounted) {
                    setMode(data);
                    modeRef.current = data;
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching attention mode:', error);
                if (mounted) setLoading(false);
            }
        };

        fetchMode();

        return () => {
            mounted = false;
        };
    }, [ordsrvnro]);

    // Save on unmount
    useEffect(() => {
        return () => {
            // Only save if data was loaded to avoid overwriting with default on quick unmounts before fetch
            if (!loading) {
                attentionModeService.saveAttentionMode('dummy-token', ordsrvnro, modeRef.current);
            }
        };
    }, [ordsrvnro, loading]);

    const handleChange = (newMode: AttentionModeType) => {
        setMode(newMode);
        modeRef.current = newMode;
    };

    if (loading) {
        return <div className="animate-pulse h-10 w-48 bg-slate-100 rounded"></div>;
    }

    return (
        <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-600 mb-2">Modalidad de atención</h3>
            <div className="relative w-64">
                <select
                    value={mode}
                    onChange={(e) => handleChange(e.target.value as AttentionModeType)}
                    className="w-full appearance-none bg-[#EAF6F8] border border-[#005F61] text-[#005F61] font-bold py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                >
                    <option value="Presencial">Presencial</option>
                    <option value="Teleasistencia">Teleasistencia</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#005F61]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
