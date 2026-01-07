import { useState, useEffect } from 'react';
import ContactModal from './ContactModal';
import NotesModal from './NotesModal';
import BackgroundsModal from './BackgroundsModal';
import AlertsModal from './AlertsModal';
import { getPatientNotes, getAntecedentes, getPatientAlerts, getContactInfo, PatientContactInfoResponse } from '@/services/headerServices';

interface ActionIconProps {
    label: string;
    color: string;
    icon: string;
    onClick?: () => void;
}

function ActionIcon({ label, color, icon, onClick }: ActionIconProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1 group w-18"
        >
            <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                {icon === '%' && <span className="font-black text-lg">%</span>}
                {icon === 'doc' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                {icon === 'folder' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>}
                {icon === 'bell' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase text-center leading-tight">{label}</span>
        </button>
    );
}

export interface HeaderData {
    hasNotes: boolean;
    hasBackgrounds: boolean;
    hasAlerts: boolean;
}

// ... other imports

export default function PatientHeader({ patient, ordsrvnro, headerData }: { patient: any, ordsrvnro: string, headerData: HeaderData }) {
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactData, setContactData] = useState<PatientContactInfoResponse | null>(null);
    const [loadingContact, setLoadingContact] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showBackgroundsModal, setShowBackgroundsModal] = useState(false);
    const [showAlertsModal, setShowAlertsModal] = useState(false);

    const [hasNotes, setHasNotes] = useState(headerData.hasNotes);
    const [hasBackgrounds, setHasBackgrounds] = useState(headerData.hasBackgrounds);
    const [hasAlerts, setHasAlerts] = useState(headerData.hasAlerts);

    const [showPhotoModal, setShowPhotoModal] = useState(false);

    // Sync with prop updates if needed (e.g. navigation)
    useEffect(() => {
        setHasNotes(headerData.hasNotes);
        setHasBackgrounds(headerData.hasBackgrounds);
        setHasAlerts(headerData.hasAlerts);
    }, [headerData]);

    const checkNotes = async () => {
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            const notes = await getPatientNotes(token, ordsrvnro);
            setHasNotes(notes.length > 0);
        } catch (error) {
            console.error('Error checking notes:', error);
        }
    };

    const checkBackgrounds = async () => {
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            const backgrounds = await getAntecedentes(token, ordsrvnro);
            setHasBackgrounds(backgrounds.length > 0);
        } catch (error) {
            console.error('Error checking backgrounds:', error);
        }
    };

    const checkAlerts = async () => {
        try {
            const token = localStorage.getItem('gam_access_token') || '';
            const alerts = await getPatientAlerts(token, ordsrvnro);
            setHasAlerts(alerts.length > 0);
        } catch (error) {
            console.error('Error checking alerts:', error);
        }
    };

    const handleContactClick = async () => {
        setShowContactModal(true);
        if (!contactData) {
            setLoadingContact(true);
            try {
                const token = localStorage.getItem('gam_access_token') || '';
                const data = await getContactInfo(token, ordsrvnro);
                setContactData(data);
            } catch (error) {
                console.error('Error fetching contact info:', error);
            } finally {
                setLoadingContact(false);
            }
        }
    };

    if (!patient) return null;

    return (
        <>
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between shadow-sm relative z-20">
                {/* Left Section: Patient Info */}
                <div className="flex items-center gap-6">
                    <div
                        className={`w-12 h-12 rounded-full border-2 border-teal-600 flex items-center justify-center overflow-hidden bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 ${patient.foto ? 'cursor-pointer hover:opacity-80' : ''}`}
                        onClick={() => patient.foto && setShowPhotoModal(true)}
                    >
                        {patient.foto ? (
                            <img src={`data:image/jpeg;base64,${patient.foto}`} alt="Foto Paciente" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <span className="text-xl font-bold text-teal-700 dark:text-teal-400">{patient.nombre} {patient.apellido}</span>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <span className="font-bold text-slate-600 dark:text-slate-400 text-base">CI: {patient.documento}</span>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <span className="font-bold text-slate-600 dark:text-slate-400 text-base">{patient.edad}</span>
                        <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <span className="font-bold text-slate-600 dark:text-slate-400 text-base">{patient.sexo}</span>

                        <button
                            onClick={handleContactClick}
                            className="flex items-center gap-2 ml-4 bg-[#0D4B50] hover:bg-[#09363a] text-white px-4 py-2 rounded-full transition-colors shadow-md active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span className="text-xs font-bold uppercase leading-tight text-left">Datos de<br />contacto</span>
                        </button>
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-8">
                    <ActionIcon label="T. Incap." color="bg-orange-500" icon="%" />
                    <ActionIcon
                        label="Notas"
                        color={hasNotes ? "bg-slate-800" : "bg-slate-300 text-slate-500"}
                        icon="doc"
                        onClick={() => setShowNotesModal(true)}
                    />
                    <ActionIcon
                        label="Antecedentes"
                        color={hasBackgrounds ? "bg-slate-800" : "bg-slate-300 text-slate-500"}
                        icon="folder"
                        onClick={() => setShowBackgroundsModal(true)}
                    />
                    <ActionIcon
                        label="Alertas"
                        color={hasAlerts ? "bg-red-600" : "bg-slate-300 text-slate-500"}
                        icon="bell"
                        onClick={() => setShowAlertsModal(true)}
                    />
                </div>
            </div>

            <ContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                data={contactData}
                loading={loadingContact}
            />

            <NotesModal
                isOpen={showNotesModal}
                onClose={() => setShowNotesModal(false)}
                ordsrvnro={ordsrvnro}
                onNotesUpdate={checkNotes}
            />

            <BackgroundsModal
                isOpen={showBackgroundsModal}
                onClose={() => setShowBackgroundsModal(false)}
                ordsrvnro={ordsrvnro}
                onBackgroundsUpdate={checkBackgrounds}
            />

            <AlertsModal
                isOpen={showAlertsModal}
                onClose={() => setShowAlertsModal(false)}
                ordsrvnro={ordsrvnro}
                onAlertsUpdate={checkAlerts}
            />

            {/* Photo Modal */}
            {showPhotoModal && patient.foto && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPhotoModal(false)}>
                    <div className="relative max-w-2xl max-h-[90vh] p-2 bg-white rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowPhotoModal(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <img
                            src={`data:image/jpeg;base64,${patient.foto}`}
                            alt={`Foto de ${patient.nombre}`}
                            className="max-w-full max-h-[85vh] rounded"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
