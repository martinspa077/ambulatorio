'use client';

import PageLayout from '@/components/Navigation/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { agendaService, AgendaResponse, Cita } from '@/services/agendaService';
import { callerService } from '@/services/callerService';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

export default function AgendaPage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [agendaData, setAgendaData] = useState<AgendaResponse | null>(null);
    const [fetching, setFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modality, setModality] = useState('Todos');
    const [callingId, setCallingId] = useState<number | null>(null);
    const [teleNotice, setTeleNotice] = useState<string | null>(null);
    const [availableAgendas, setAvailableAgendas] = useState<any[]>([]);
    const [selectedAgendaId, setSelectedAgendaId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Inasistencia Modal State
    const [showInasistencia, setShowInasistencia] = useState(false);
    const [inasistenciaDetail, setInasistenciaDetail] = useState<any>(null);
    const [inasistenciaCitaId, setInasistenciaCitaId] = useState<number | null>(null);
    const [inasistenciaObs, setInasistenciaObs] = useState('');
    const [inasistenciaPass, setInasistenciaPass] = useState('');
    const [inasistenciaSubmitting, setInasistenciaSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        const initialize = async () => {
            if (isAuthenticated) {
                setFetching(true);
                try {
                    const agendas = await agendaService.getAvailableAgendas('dummy-token');
                    setAvailableAgendas(agendas);
                    if (agendas.length > 0 && !selectedAgendaId) {
                        setSelectedAgendaId(agendas[0].agendaId);
                    }
                } catch (error) {
                    console.error('Error loading agendas:', error);
                } finally {
                    setFetching(false);
                }
            }
        };
        initialize();
    }, [isAuthenticated]);

    useEffect(() => {
        const loadAgendaData = async () => {
            if (isAuthenticated && selectedAgendaId) {
                setFetching(true);
                try {
                    const data = await agendaService.getAgenda('dummy-token', selectedAgendaId);
                    setAgendaData(data);
                } catch (error) {
                    console.error('Error loading agenda data:', error);
                } finally {
                    setFetching(false);
                }
            }
        };
        loadAgendaData();
    }, [isAuthenticated, selectedAgendaId]);

    // Client-side filtering logic
    const filteredCitas = useMemo(() => {
        if (!agendaData) return [];

        return agendaData.citas.filter(cita => {
            // Check name normally
            const matchesName = cita.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase());

            // Check document stripping symbols (dots, hyphens, etc.)
            const cleanDoc = cita.pacienteDocumento.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanSearchDoc = searchTerm.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchesDoc = cleanSearchDoc !== '' && cleanDoc.includes(cleanSearchDoc);

            const matchesSearch = searchTerm === '' || matchesName || matchesDoc;

            const matchesModality = modality === 'Todos' || cita.modalidad === modality;

            const matchesStatus = !statusFilter || cita.estado === statusFilter;

            return matchesSearch && matchesModality && matchesStatus;
        });
    }, [agendaData, searchTerm, modality, statusFilter]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setModality('Todos');
        setStatusFilter(null);
    };

    const handleCallPatient = (cita: Cita) => {
        // Feedback effect
        setCallingId(cita.citaId);
        setTimeout(() => setCallingId(null), 1000);

        if (cita.modalidad === 'Teleasistencia') {
            setTeleNotice(`${cita.pacienteNombre} se encuentra agendado en modalidad TELEASISTENCIA.`);
            setTimeout(() => setTeleNotice(null), 5000);
        }

        const consultorio = "CONSULTORIO 101";
        callerService.callPatient({
            pacienteId: cita.pacienteId,
            pacienteNombre: cita.pacienteNombre,
            consultorio: consultorio,
            monitorId: cita.monitorId
        });
    };

    const handleOpenInasistencia = async (citaId: number) => {
        setFetching(true);
        try {
            const data = await agendaService.getInasistenciaData('dummy-token', citaId);
            setInasistenciaDetail(data);
            setInasistenciaCitaId(citaId);
            setInasistenciaObs('');
            setInasistenciaPass('');
            setShowInasistencia(true);
        } catch (error) {
            console.error('Error loading inasistencia data:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleConfirmInasistencia = async () => {
        if (!inasistenciaCitaId) return;
        setInasistenciaSubmitting(true);
        try {
            await agendaService.confirmInasistencia('dummy-token', {
                citaId: inasistenciaCitaId,
                observacion: inasistenciaObs,
                password: inasistenciaPass
            });
            setShowInasistencia(false);
            // Refresh agenda to reflect changes
            if (selectedAgendaId) {
                const data = await agendaService.getAgenda('dummy-token', selectedAgendaId);
                setAgendaData(data);
            }
        } catch (error: any) {
            alert(error.message || 'Error al confirmar inasistencia');
        } finally {
            setInasistenciaSubmitting(false);
        }
    };

    if (loading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-slate-200 border-b-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const getStatusStyles = (estado: string) => {
        switch (estado) {
            case 'asistio': return { dot: 'bg-green-500', text: 'text-green-700' };
            case 'espera': return { dot: 'bg-amber-400', text: 'text-amber-700' };
            case 'inasistio': return { dot: 'bg-red-500', text: 'text-red-700' };
            case 'no_anunciado': return { dot: 'bg-slate-400', text: 'text-slate-700' };
            default: return { dot: 'bg-slate-300', text: 'text-slate-600' };
        }
    };

    return (
        <PageLayout>
            <main className="flex-1 p-8 animate-in fade-in duration-1000 relative">

                {/* Telemedicine Notification toast */}
                {teleNotice && (
                    <div className="fixed top-8 right-8 z-[100] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-12 duration-500">
                        <div className="bg-white/20 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase leading-tight">Aviso de Teleasistencia</p>
                            <p className="text-sm opacity-90 font-medium">{teleNotice}</p>
                        </div>
                        <button onClick={() => setTeleNotice(null)} className="ml-4 hover:scale-110 transition-transform">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}

                {/* Agenda Selection Header (Design Ref) */}
                <div className="bg-[#E7F3F6] dark:bg-slate-900 rounded-2xl p-4 mb-6 flex items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-8">
                        {/* Date display */}
                        <div className="flex items-center gap-3">
                            <div className="text-teal-700 dark:text-teal-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                                {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Agenda Selector */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Agenda</span>
                            <select
                                value={selectedAgendaId || ''}
                                onChange={(e) => setSelectedAgendaId(Number(e.target.value))}
                                className="bg-white dark:bg-slate-800 border border-teal-600/30 rounded-xl px-4 py-2 text-sm font-bold text-teal-800 dark:text-teal-300 outline-none focus:ring-2 focus:ring-teal-500 transition-all min-w-[250px] shadow-sm cursor-pointer"
                            >
                                {availableAgendas.map(a => (
                                    <option key={a.agendaId} value={a.agendaId}>{a.descripcion}</option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Agenda Details */}
                        {selectedAgendaId && availableAgendas.find(a => a.agendaId === selectedAgendaId) && (
                            <div className="flex items-center gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Especialidad:</span>
                                    <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
                                        {availableAgendas.find(a => a.agendaId === selectedAgendaId)?.especialidad}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-700 pl-10">
                                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Coordinados:</span>
                                    <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
                                        {availableAgendas.find(a => a.agendaId === selectedAgendaId)?.coordinados}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-12 h-12 bg-teal-800 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-teal-700 group-active:scale-95 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase text-teal-900 dark:text-teal-400">Mis Agendas</span>
                    </button>
                </div>

                {/* Filters and Header */}
                <div className="flex flex-wrap items-end gap-6 mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Usuario</label>
                        <input
                            type="text"
                            placeholder="Ingrese: Nombre, Apellido, Documento..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-[200px]">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Modalidad</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                            value={modality}
                            onChange={(e) => setModality(e.target.value)}
                        >
                            <option>Todos</option>
                            <option>Presencial</option>
                            <option>Teleasistencia</option>
                        </select>
                    </div>

                    <button
                        onClick={handleClearFilters}
                        className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all shadow-sm active:scale-95 group"
                        title="Limpiar filtros"
                    >
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                        </svg>
                    </button>

                    <div className="flex gap-6 ml-auto">
                        <SummaryBadge
                            count={agendaData?.resumen.asistencias}
                            label="Asistencias"
                            color="bg-green-500"
                            status="asistio"
                            active={statusFilter === 'asistio'}
                            onClick={() => setStatusFilter(statusFilter === 'asistio' ? null : 'asistio')}
                        />
                        <SummaryBadge
                            count={agendaData?.resumen.sinAnunciar}
                            label="Sin anunciar"
                            color="bg-slate-400"
                            status="no_anunciado"
                            active={statusFilter === 'no_anunciado'}
                            onClick={() => setStatusFilter(statusFilter === 'no_anunciado' ? null : 'no_anunciado')}
                        />
                        <SummaryBadge
                            count={agendaData?.resumen.enEspera}
                            label="En espera"
                            color="bg-amber-400"
                            status="espera"
                            active={statusFilter === 'espera'}
                            onClick={() => setStatusFilter(statusFilter === 'espera' ? null : 'espera')}
                        />
                        <SummaryBadge
                            count={agendaData?.resumen.inasistencias}
                            label="Inasistencia"
                            color="bg-red-500"
                            status="inasistio"
                            active={statusFilter === 'inasistio'}
                            onClick={() => setStatusFilter(statusFilter === 'inasistio' ? null : 'inasistio')}
                        />
                    </div>
                </div>

                {/* Agenda Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-teal-800 text-white">
                                    <th className="px-4 py-4 font-bold text-sm">Hora</th>
                                    <th className="px-4 py-4 font-bold text-sm">Nº y Tipo</th>
                                    <th className="px-4 py-4 font-bold text-sm">Llamar</th>
                                    <th className="px-4 py-4 font-bold text-sm">Estado</th>
                                    <th className="px-4 py-4 font-bold text-sm">Inasistencia</th>
                                    <th className="px-4 py-4 font-bold text-sm">Nombres y apellidos</th>
                                    <th className="px-4 py-4 font-bold text-sm">Documento</th>
                                    <th className="px-4 py-4 font-bold text-sm">Modalidad</th>
                                    <th className="px-4 py-4 font-bold text-sm">Edad</th>
                                    <th className="px-4 py-4 font-bold text-sm text-center">1er consulta</th>
                                    <th className="px-4 py-4 font-bold text-sm">Dato clínico</th>
                                    <th className="px-4 py-4 font-bold text-sm text-center">Indicaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching ? (
                                    <tr>
                                        <td colSpan={12} className="py-20 text-center">
                                            <div className="flex justify-center">
                                                <div className="w-8 h-8 border-4 border-teal-100 border-b-teal-600 rounded-full animate-spin"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCitas.map((cita, idx) => {
                                        const styles = getStatusStyles(cita.estado);

                                        return (
                                            <tr
                                                key={cita.citaId}
                                                className={`border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                                            >
                                                <td className="px-4 py-4 font-bold text-slate-700 dark:text-slate-300">{cita.hora}</td>
                                                <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-400">{cita.nroTipo}</td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => handleCallPatient(cita)}
                                                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${callingId === cita.citaId ? 'scale-125 bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/30' : 'border-slate-200 dark:border-slate-700 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20'}`}
                                                    >
                                                        {cita.modalidad === 'Teleasistencia' ? (
                                                            <svg className={`w-5 h-5 ${callingId === cita.citaId ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        ) : (
                                                            <svg className={`w-5 h-5 ${callingId === cita.citaId ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-3 h-3 rounded-full ${styles.dot}`}></span>
                                                        <span className={`text-xs font-bold ${styles.text}`}>{cita.estadoDescripcion}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => {
                                                            if (cita.estado !== 'inasistio' && cita.estado !== 'espera') {
                                                                handleOpenInasistencia(cita.citaId);
                                                            }
                                                        }}
                                                        className={`px-4 py-1.5 rounded-lg border text-xs font-bold transition-all ${cita.estado === 'inasistio' || cita.estado === 'espera' ? 'border-sky-500 text-sky-600 hover:bg-sky-50' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                                                    >
                                                        {cita.estado === 'inasistio' || cita.estado === 'espera' ? 'Deshacer' : 'No asistió'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <a href={`/historia-clinica/${cita.citaId}`} className="font-bold text-teal-700 dark:text-teal-400 hover:underline">{cita.pacienteNombre}</a>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{cita.pacienteDocumento}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{cita.modalidad}</td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">{cita.edad}</td>
                                                <td className="px-4 py-4 text-sm text-center font-bold text-slate-700 dark:text-slate-300">
                                                    {cita.esPrimerConsulta ? 'Sí' : 'No'}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 italic">
                                                    {cita.datoClinico}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* Inasistencia Modal */}
            {showInasistencia && inasistenciaDetail && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowInasistencia(false)}></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-[800px] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative z-10">

                        {/* Modal Header */}
                        <div className="bg-teal-800 p-4 flex items-center justify-between text-white">
                            <div className="flex-1 text-center">
                                <h2 className="text-xl font-black uppercase tracking-widest">Inasistencia</h2>
                            </div>
                            <button onClick={() => setShowInasistencia(false)} className="hover:scale-110 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8">
                            {/* User Data Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-black text-teal-900 dark:text-teal-400 mb-4 uppercase tracking-tighter">Datos del usuario</h3>
                                <div className="grid grid-cols-2 gap-8 py-4 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Documento:</span>
                                        <span className="text-lg font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.pacienteDocumento}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Nombre:</span>
                                        <span className="text-lg font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.pacienteNombre}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Consultation Data Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-black text-teal-900 dark:text-teal-400 mb-4 uppercase tracking-tighter">Datos de la consulta</h3>
                                <div className="grid grid-cols-4 gap-y-6 gap-x-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Fecha y hora:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.fechaHora}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Número:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.numero}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Modalidad:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.modalidad}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Agenda:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.agenda}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Servicio:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.servicio}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-slate-500 uppercase">Profesional:</span>
                                        <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{inasistenciaDetail.profesional}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Observations Section */}
                            <div>
                                <h3 className="text-lg font-black text-teal-900 dark:text-teal-400 mb-4 uppercase tracking-tighter">Observaciones</h3>
                                <textarea
                                    value={inasistenciaObs}
                                    onChange={(e) => setInasistenciaObs(e.target.value)}
                                    className="w-full h-32 p-4 bg-[#F0F9FB] dark:bg-slate-800 border-2 border-teal-600/20 rounded-2xl outline-none focus:border-teal-500 transition-all text-slate-800 dark:text-slate-200 font-medium resize-none"
                                    placeholder="Ingrese observaciones aquí..."
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-[#2EB8C1] p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-white/80 uppercase">Usuario</span>
                                    <span className="text-base font-bold text-white tracking-tight">jperez</span>
                                </div>
                                <div className="h-10 w-px bg-white/20 mx-2"></div>
                                <input
                                    type="password"
                                    value={inasistenciaPass}
                                    onChange={(e) => setInasistenciaPass(e.target.value)}
                                    placeholder="Contraseña"
                                    className="bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleConfirmInasistencia}
                                disabled={inasistenciaSubmitting}
                                className="bg-[#0D4B50] hover:bg-[#09363a] text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {inasistenciaSubmitting ? 'Confirmando...' : 'Confirmar'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </PageLayout>
    );
}

function SummaryBadge({ count, label, color, status, active, onClick }: { count?: number, label: string, color: string, status: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center group transition-all duration-300 ${active ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
        >
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white text-xl font-extrabold shadow-md mb-1 transition-all ${active ? 'ring-4 ring-offset-2 ring-slate-200 dark:ring-slate-700' : ''}`}>
                {count ?? 0}
            </div>
            <span className={`text-[10px] uppercase font-bold leading-none transition-colors ${active ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}`}>{label}</span>
        </button>
    );
}
