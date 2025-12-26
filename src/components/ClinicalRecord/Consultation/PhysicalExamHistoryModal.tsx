'use client';

import { useState, useEffect, useMemo } from 'react';
import { physicalExamService, PhysicalExamHistoryItem, PhysicalExamData } from '@/services/physicalExamService';
import { evaService } from '@/services/evaService';

interface PhysicalExamHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    ordsrvnro: number;
    examType: keyof PhysicalExamData | 'pa' | 'eva';
    title: string;
    unit?: string;
}

export default function PhysicalExamHistoryModal({ isOpen, onClose, ordsrvnro, examType, title, unit }: PhysicalExamHistoryModalProps) {
    const [history, setHistory] = useState<PhysicalExamHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);

            const fetchPromise = examType === 'eva'
                ? evaService.getEVAHistory('dummy-token', ordsrvnro)
                : physicalExamService.getPhysicalExamHistory('dummy-token', ordsrvnro, examType as keyof PhysicalExamData | 'pa');

            fetchPromise
                .then(data => {
                    // Sort by date ascending for the graph
                    setHistory(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen, ordsrvnro, examType]);

    // Chart Dimensions
    const width = 600;
    const height = 300;
    const padding = 40;

    // Calculations for scaling
    const { points, pointsSecondary, maxY, minY, xIntevals } = useMemo(() => {
        if (history.length === 0) return { points: '', pointsSecondary: '', maxY: 0, minY: 0, xIntevals: [] };

        const allValues = history.flatMap(h => h.secondaryValue ? [h.value, h.secondaryValue] : [h.value]);
        const maxVal = Math.max(...allValues);
        const minVal = Math.min(...allValues);

        // Add some padding to Y axis
        const range = maxVal - minVal || 10;
        const maxY = Math.ceil(maxVal + range * 0.1);
        const minY = Math.floor(Math.max(0, minVal - range * 0.1));
        const effectiveRange = maxY - minY;

        const getX = (index: number) => padding + (index * (width - 2 * padding) / (history.length - 1 || 1));
        const getY = (val: number) => height - padding - ((val - minY) / effectiveRange) * (height - 2 * padding);

        const pts = history.map((h, i) => `${getX(i)},${getY(h.value)}`).join(' ');
        const ptsSec = history.map((h, i) => h.secondaryValue ? `${getX(i)},${getY(h.secondaryValue)}` : '').filter(Boolean).join(' ');

        const xIntevals = history.map((h, i) => ({
            x: getX(i),
            label: new Date(h.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })
        }));

        return { points: pts, pointsSecondary: ptsSec, maxY, minY, xIntevals };
    }, [history]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-[#005F61] p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Evolución: {title}</h3>
                    <button onClick={onClose}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <div className="w-8 h-8 border-4 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex justify-center items-center h-[300px] text-slate-400 italic">
                            No hay datos históricos para mostrar.
                        </div>
                    ) : (
                        <div className="relative">
                            <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                                {/* Grid Lines (Y Axis) */}
                                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                                    const y = height - padding - (ratio * (height - 2 * padding));
                                    const val = Math.round(minY + ratio * (maxY - minY));
                                    return (
                                        <g key={ratio}>
                                            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                                            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">{val}</text>
                                        </g>
                                    );
                                })}

                                {/* Chart Line - Primary */}
                                <polyline points={points} fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                                {/* Chart Line - Secondary (for BP) */}
                                {pointsSecondary && (
                                    <polyline points={pointsSecondary} fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" />
                                )}

                                {/* Data Points */}
                                {history.map((h, i) => {
                                    const x = xIntevals[i].x;
                                    // Recalculate Y manually inside map to place dots correctly using same logic
                                    const range = maxY - minY || 1;
                                    const y = height - padding - ((h.value - minY) / range) * (height - 2 * padding);

                                    return (
                                        <g key={i} className="group">
                                            <circle cx={x} cy={y} r="5" fill="white" stroke="#0d9488" strokeWidth="2" className="group-hover:r-7 transition-all cursor-pointer" />

                                            {/* Tooltip on hover */}
                                            <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <rect x={x - 30} y={y - 35} width="60" height="25" rx="4" fill="#1e293b" />
                                                <text x={x} y={y - 19} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                                                    {h.value} {unit}
                                                </text>
                                                {/* Triangle */}
                                                <path d={`M${x - 5},${y - 10} L${x + 5},${y - 10} L${x},${y - 5} Z`} fill="#1e293b" />
                                            </g>

                                            {/* Secondary Dot */}
                                            {h.secondaryValue && (
                                                <>
                                                    {(() => {
                                                        const ySec = height - padding - ((h.secondaryValue! - minY) / range) * (height - 2 * padding);
                                                        return (
                                                            <>
                                                                <circle cx={x} cy={ySec} r="4" fill="white" stroke="#64748b" strokeWidth="2" />
                                                                <text x={x} y={ySec - 10} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="bold">{h.secondaryValue}</text>
                                                            </>
                                                        )
                                                    })()}
                                                </>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* X Axis Labels */}
                                {xIntevals.map((tick, i) => (
                                    <text key={i} x={tick.x} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748b">
                                        {tick.label}
                                    </text>
                                ))}
                            </svg>

                            {/* Legend for complex charts */}
                            {examType === 'pa' && (
                                <div className="flex justify-center gap-4 mt-2 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                                        <span>Sistólica</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 border-2 border-slate-500 rounded-full"></div>
                                        <span>Diastólica</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
