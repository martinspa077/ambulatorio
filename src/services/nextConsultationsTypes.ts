export interface Specialty {
    id: string;
    description: string;
    requiresAuthorization: boolean;
}

export type ConsultationMode = 'presencial' | 'teleasistencia';
export type TransferType = 'ambulancia_comun' | 'ambulancia_especializada' | 'camioneta';
export type TripType = 'ida' | 'ida_vuelta';

export interface ConsultationPrescriptionData {
    id: string; // Temporary ID for UI tracking
    specialty: Specialty;
    mode?: ConsultationMode; // Mandatory
    clinicalData?: string;
    observations: string; // Mandatory, placeholder: "Detallar policlínica y fecha..."
    requiresCompanion: boolean; // Mandatory, default NO (false)
    requiresTransfer: boolean | undefined; // Mandatory, no default
    transferType?: TransferType; // Mandatory if requiresTransfer=true
    tripType?: TripType; // Mandatory if requiresTransfer=true

    // Status tracking for UI
    isCollapsed?: boolean;
}

export interface ConsultationHistoryItem {
    id: string;
    specialty: string;
    requestDate?: string; // Empty if manual
    coordinationDate?: string;
    polyclinic?: string;
    status: 'pendiente_coordinar' | 'coordinado' | 'cumplido';
}

export const DEFAULT_CONSULTATION_DATA = {
    mode: undefined,
    clinicalData: '',
    observations: '',
    requiresCompanion: false,
    requiresTransfer: undefined,
};
