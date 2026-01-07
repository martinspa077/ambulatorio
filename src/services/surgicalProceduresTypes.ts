export interface SurgicalProcedure {
    id: string;
    description: string;
    requiresAuthorization: boolean;
    requiresConsent: boolean;
}

export type SurgeryOpportunity = 'electiva' | 'urgencia' | 'emergencia';

export type SurgeryType =
    | 'ambulatoria'
    | 'internacion_mismo_dia'
    | 'internacion_24h_previo'
    | 'ya_internada';

export interface HospitalizationInfo {
    piso: string;
    habitacion: string;
    cama: string;
}

export type SurgeryPlant = 'HBSE' | 'Externo';

export interface Professional {
    id?: string;
    nombre: string; // Text
    numeroCaja?: string;
    especialidad?: string;
    rol?: string;
}

export interface ProfessionalRole {
    name: string;
    specialties: string[];
}

export interface SurgicalPrescriptionData {
    id: string;
    procedures: SurgicalProcedure[]; // Can be multiple
    sameInstance: boolean; // Managed by UI grouping

    // Data of prescription
    opportunity: SurgeryOpportunity;
    surgeryType: SurgeryType;
    clinicalData?: string;

    preoperativeDiagnoses: {
        term: string;
        id?: string; // If from terminology server
    }[];

    // Internment data (read-only in UI, but part of context)
    patientInterned?: {
        piso: string;
        habitacion: string;
        cama: string;
    };

    // Surgery Details
    surgeryDate: string;
    surgeryTime: string;
    duration: {
        hours: number;
        minutes: number;
    };
    plant: SurgeryPlant;
    place: string; // BQ, Odontologia, Imagenologia OR 'Externo'
    externalPlaceDescription?: string; // Only if place is 'Externo'

    // Team
    surgeon: Professional;
    assistant?: Professional;

    // Requirements
    intraoperativeXray: boolean;
    anesthesia: 'local' | 'regional' | 'local_vigilada' | 'local_potenciada' | 'a_definir';

    // Preparation
    preparation: {
        fastingHours?: number; // if defined, implies fasting
        vvp: boolean;
        sondaVesical: boolean;
        rasurado: boolean;
        sng: boolean;
        enema: boolean;
        vvc: boolean;
        bloodAvailability: boolean;
        anticoagulantsAdjustment: boolean;
        insulinAdjustment: boolean;
        antibioticProphylaxis: boolean;
        observations?: string;
    };

    // Special Needs
    specialMaterial?: string; // if present, implies Yes
    requiresSpecialPostOpCare?: boolean;
    postOpCare?: 'cuidados_intensivos' | 'cuidados_intermedios' | 'cuidados_especiales_hbse';

    // Status (managed by backend usually, but useful for frontend)
    status: 'pendiente_autorizacion' | 'pendiente_coordinar' | 'coordinado' | 'suspendido' | 'realizado';
    requestDate: string; // Fecha de solicitud
    coordinationDate?: string; // Fecha coordinada
}

export interface SurgicalHistoryItem {
    id: string;
    mainProcedure: string; // Or list of procedures
    requestDate: string;
    coordinationDate?: string;
    status: SurgicalPrescriptionData['status'];
    isCoordinated: boolean; // Derived from status or data
}

// Initial state for a new prescription
export const DEFAULT_PRESCRIPTION_DATA: Partial<SurgicalPrescriptionData> = {
    opportunity: undefined,
    surgeryType: undefined,
    surgeryDate: new Date().toISOString().split('T')[0],
    surgeryTime: '08:00',
    duration: { hours: 1, minutes: 0 },
    plant: 'HBSE',
    place: 'BQ',
    intraoperativeXray: false,
    anesthesia: 'local',
    preparation: {
        vvp: false,
        sondaVesical: false,
        rasurado: false,
        sng: false,
        enema: false,
        vvc: false,
        bloodAvailability: false,
        anticoagulantsAdjustment: false,
        insulinAdjustment: false,
        antibioticProphylaxis: false,
        observations: ''
    },
    status: 'pendiente_coordinar'
};
