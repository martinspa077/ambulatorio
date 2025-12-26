'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { callerService, CallData } from '@/services/callerService';
import { useSearchParams } from 'next/navigation';

function MonitorContent() {
    const searchParams = useSearchParams();
    const monitorId = searchParams.get('id') || 'GENERAL';

    const [currentCall, setCurrentCall] = useState<CallData | null>(null);
    const [history, setHistory] = useState<CallData[]>([]);
    const [isAnimate, setIsAnimate] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastCallTimestamp = useRef<number>(0);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audioRef.current.load();

        const processNewCall = (data: CallData) => {
            // IGNORE IF OLD
            if (data.timestamp <= lastCallTimestamp.current) return;

            // Double check filter (though server handles SSE filtering, local storage doesn't)
            if (data.monitorId !== monitorId && data.monitorId !== 'GENERAL') {
                return;
            }

            console.log(`[Monitor ${monitorId}] Processing new call:`, data);
            lastCallTimestamp.current = data.timestamp;
            setCurrentCall(data);
            setIsAnimate(true);

            // Add to history
            setHistory(prev => [data, ...prev.slice(0, 3)]);

            // Play sound if enabled
            if (audioEnabled && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.log('Audio playback blocked'));
            }

            setTimeout(() => setIsAnimate(false), 5000);
        };

        // 1. Same-PC instant sync via Storage API (backup)
        const unsubLocal = callerService.onLocalCallReceived(processNewCall);

        // 2. Real-time Push via SSE (Primary Cross-PC mechanism)
        const unsubSSE = callerService.subscribeToCalls(monitorId, processNewCall);

        return () => {
            console.log(`[Monitor ${monitorId}] Cleaning up subscriptions`);
            unsubLocal();
            unsubSSE();
        };
    }, [audioEnabled, monitorId]);

    const enableAudio = () => {
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    audioRef.current?.pause();
                    setAudioEnabled(true);
                })
                .catch(e => console.log('Audio priming failed'));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col relative text-left">
            {/* Audio Activation Overlay */}
            {!audioEnabled && (
                <div className="absolute inset-0 z-[100] bg-slate-900/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="max-w-md space-y-8 p-12 bg-slate-800 rounded-[3rem] border border-slate-700 shadow-2xl">
                        <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 animate-bounce">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </div>
                        <div className="space-y-4 text-center">
                            <h2 className="text-3xl font-black">Monitor: <span className="text-teal-400">{monitorId}</span></h2>
                            <p className="text-slate-400 font-medium">Activa el sonido para recibir alertas de llamados.</p>
                        </div>
                        <button
                            onClick={enableAudio}
                            className="w-full py-5 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95"
                        >
                            ACTIVAR MONITOR
                        </button>
                    </div>
                </div>
            )}

            {/* Header / Logo */}
            <header className="p-8 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">
                        CENTRO MÉDICO <span className="text-teal-400">ESPERA</span>
                        {monitorId !== 'GENERAL' && <span className="ml-4 text-slate-500 border-l border-slate-700 pl-4">{monitorId}</span>}
                    </h1>
                </div>
                <div className="text-2xl font-mono text-slate-400">
                    {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row p-8 gap-8">
                {/* Main Announcement Area */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {currentCall ? (
                        <div className={`text-center space-y-12 transition-all duration-700 ${isAnimate ? 'scale-110' : 'scale-100'}`}>
                            <div className="space-y-4">
                                <p className="text-teal-400 text-2xl font-bold uppercase tracking-[0.2em] animate-pulse">Llamando a:</p>
                                <h2 className="text-7xl lg:text-9xl font-black leading-tight text-white drop-shadow-2xl">
                                    {currentCall.pacienteNombre}
                                </h2>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <div className="h-[2px] w-20 bg-slate-700"></div>
                                <div className="bg-white text-slate-900 px-12 py-6 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                    <p className="text-slate-500 text-xl font-bold uppercase mb-2">Diríjase a:</p>
                                    <p className="text-6xl font-black">{currentCall.consultorio}</p>
                                </div>
                                <div className="h-[2px] w-20 bg-slate-700"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-700 text-center">
                            <svg className="w-32 h-32 mx-auto mb-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-4xl font-bold italic opacity-30 uppercase">Esperando otros pacientes...</p>
                        </div>
                    )}
                </div>

                {/* History Sidebar */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
                        Últimos llamados
                    </h3>
                    <div className="flex flex-col gap-4">
                        {history.length > 0 ? history.map((item, idx) => (
                            <div key={item.timestamp} className={`p-6 rounded-3xl border transition-all duration-500 ${idx === 0 ? 'bg-slate-800 border-teal-500/50 shadow-lg shadow-teal-500/10 translate-x-[-10px]' : 'bg-slate-800/30 border-slate-800 text-slate-400'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${idx === 0 ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        {item.consultorio}
                                    </span>
                                    <span className="text-xs font-mono">{new Date(item.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className={`text-xl font-bold truncate ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>
                                    {item.pacienteNombre}
                                </p>
                            </div>
                        )) : (
                            <div className="py-20 text-center border-4 border-dashed border-slate-800 rounded-3xl">
                                <p className="text-slate-600 font-bold uppercase">Sin registros</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer / Info */}
            <footer className="p-8 bg-teal-600 text-white flex justify-between items-center">
                <p className="font-bold text-xl">Por favor, esté atento a su nombre en pantalla.</p>
                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                        <span className="font-medium tracking-widest">SISTEMA ACTIVO</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function MonitorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-800 border-b-teal-500 rounded-full animate-spin"></div>
            </div>
        }>
            <MonitorContent />
        </Suspense>
    );
}
