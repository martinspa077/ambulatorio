'use client';

import { useState, useEffect } from 'react';
import { getPatientAlerts, deletePatientAlert, updatePatientAlert, PatientAlert } from '@/services/headerServices';

interface AlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ordsrvnro: string;
    onAlertsUpdate?: () => void;
}

export default function AlertsModal({ isOpen, onClose, ordsrvnro, onAlertsUpdate }: AlertsModalProps) {
    const [alerts, setAlerts] = useState<PatientAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<PatientAlert | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'details' | 'edit'>('list');

    // Edit form state
    const [editObservations, setEditObservations] = useState('');
    const [editEndDate, setEditEndDate] = useState('');
    const [editStartDate, setEditStartDate] = useState('');

    useEffect(() => {
        if (isOpen && ordsrvnro) {
            loadAlerts();
            setViewMode('list');
            setSelectedAlert(null);
        }
    }, [isOpen, ordsrvnro]);

    const loadAlerts = async () => {
        setLoading(true);
        try {
            const data = await getPatientAlerts('dummy-token', ordsrvnro);
            setAlerts(data);
        } catch (error) {
            console.error('Error loading alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de eliminar esta alerta?')) return;

        try {
            await deletePatientAlert('dummy-token', ordsrvnro, id);
            setAlerts(alerts.filter(a => a.id !== id));
            if (onAlertsUpdate) onAlertsUpdate();
        } catch (error) {
            console.error('Error deleting alert:', error);
        }
    };

    const handleViewDetails = (alert: PatientAlert) => {
        setSelectedAlert(alert);
        setViewMode('details');
    };

    const handleEdit = (alert: PatientAlert) => {
        setSelectedAlert(alert);
        setEditObservations(alert.observaciones || '');
        setEditEndDate(alert.fechaFin || '');
        setEditStartDate(alert.fechaInicio || '');
        setViewMode('edit');
    };

    const handleSaveEdit = async () => {
        if (!selectedAlert) return;
        try {
            await updatePatientAlert('dummy-token', ordsrvnro, {
                ...selectedAlert,
                observaciones: editObservations,
                fechaFin: editEndDate,
                fechaInicio: editStartDate
            });
            await loadAlerts();
            setViewMode('list');
            if (onAlertsUpdate) onAlertsUpdate();
        } catch (error) {
            console.error('Error updating alert:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="bg-slate-100 w-full max-w-[900px] h-[70vh] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10 font-sans flex flex-col">

                {/* Header */}
                <div className="bg-[#005F61] p-4 flex items-center justify-between text-white relative shrink-0">
                    <h2 className="text-lg font-bold text-center w-full">Alertas del usuario</h2>
                    <button onClick={onClose} className="absolute right-4 hover:opacity-80 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    <div className="mb-4">
                        <h3 className="font-bold text-lg text-slate-800">Alertas</h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 border-4 border-slate-200 border-b-[#005F61] rounded-full animate-spin"></div>
                        </div>
                    ) : viewMode === 'list' ? (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-[#005F61] text-white px-4 py-3 grid grid-cols-[120px_200px_1fr_120px_120px] gap-2 font-bold text-xs items-center">
                                <div className="pl-2">Acciones</div>
                                <div>Antecedente</div>
                                <div>Observaciones</div>
                                <div>Fecha de inicio</div>
                                <div>Fecha de fin</div>
                            </div>

                            {alerts.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-sm italic bg-slate-50">No hay alertas registradas.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {alerts.map(alert => (
                                        <div key={alert.id} className="grid grid-cols-[120px_200px_1fr_120px_120px] gap-2 px-4 py-4 items-center hover:bg-slate-50 transition-colors text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(alert.id)}
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(alert)}
                                                    className="w-8 h-8 rounded-full bg-[#005F61]/10 text-[#005F61] hover:bg-[#005F61]/20 flex items-center justify-center transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleViewDetails(alert)}
                                                    className="w-8 h-8 rounded-full bg-[#005F61] text-white hover:bg-[#004d4f] flex items-center justify-center transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                </button>
                                            </div>
                                            <div className="font-bold text-slate-800">{alert.descripcion}</div>
                                            <div className="text-slate-600 truncate">{alert.observaciones || '-'}</div>
                                            <div className="text-slate-600">{alert.fechaInicio}</div>
                                            <div className="text-slate-600">{alert.fechaFin || '-'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : viewMode === 'details' && selectedAlert ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h4 className="font-bold text-lg mb-4 text-[#005F61]">Detalles del Registro</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-slate-500 font-bold">Alerta:</span>
                                    <span className="text-slate-800">{selectedAlert.descripcion}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-bold">Fecha Registro:</span>
                                    <span className="text-slate-800">{selectedAlert.registradoPor.fechaRegistro}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-bold">Profesional:</span>
                                    <span className="text-slate-800">{selectedAlert.registradoPor.nombre} {selectedAlert.registradoPor.apellido}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 font-bold">CJPPU:</span>
                                    <span className="text-slate-800">{selectedAlert.registradoPor.cjppu}</span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors text-sm font-bold"
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    ) : viewMode === 'edit' && selectedAlert ? (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h4 className="font-bold text-lg mb-4 text-[#005F61]">Editar Alerta</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Alerta</label>
                                    <input type="text" value={selectedAlert.descripcion} disabled className="w-full p-2 bg-slate-100 border border-slate-300 rounded text-slate-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Observaciones</label>
                                    <textarea
                                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500 h-24 resize-none"
                                        value={editObservations}
                                        onChange={(e) => setEditObservations(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500"
                                            value={editStartDate}
                                            onChange={(e) => setEditStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-teal-500"
                                            value={editEndDate}
                                            onChange={(e) => setEditEndDate(e.target.value)}
                                            min={editStartDate}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors text-sm font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-[#005F61] hover:bg-[#004d4f] text-white rounded transition-colors text-sm font-bold"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
