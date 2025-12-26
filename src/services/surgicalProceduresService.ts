export interface SurgicalProcedure {
    id: string;
    description: string;
}

export type SurgeryOpportunity = 'electiva' | 'urgencia' | 'emergencia';

export type SurgeryType =
    | 'ambulatoria'
    | 'internacion_mismo_dia'
    | 'internacion_24h_previo'
    | 'ya_internada';

export type SurgeryPlant = 'HBSE' | 'Externo';

export interface Professional {
    id?: string;
    nombre: string; // Text
    numeroCaja?: string;
    especialidad?: string;
    rol?: string;
}

export interface SurgicalPrescriptionData {
    id: string;
    procedures: SurgicalProcedure[]; // Can be multiple
    sameInstance: boolean; // Managed by UI grouping

    // Data of prescription
    opportunity: SurgeryOpportunity;
    surgeryType: SurgeryType;
    clinicalData?: string;

    preoperativeDiagnosis: {
        term: string;
        id?: string; // If from terminology server
    };

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
    place: string; // BQ, Odontologia, Imagenologia OR text if External

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

export const surgicalProceduresService = {
    async getProcedures(query: string = ''): Promise<SurgicalProcedure[]> {
        // Mock Catalog
        const allProcedures: SurgicalProcedure[] = [
            { id: '1', description: 'Secuestromía' },
            { id: '2', description: 'Osteosíntesis' },
            { id: '3', description: 'Osteosíntesis con placas y tornillos' },
            { id: '4', description: 'Fijación externa' },
            { id: '5', description: 'Limpieza quirúrgica' },
            { id: '6', description: 'Clavo endomedular en tibia' },
            { id: '7', description: 'Amputación traumatica' },
            { id: '8', description: 'Sutura de tendón' },
            { id: '9', description: 'Artroscopia de rodilla' },
            { id: '10', description: 'Reemplazo total de cadera' }
        ];

        return new Promise((resolve) => {
            setTimeout(() => {
                if (!query) resolve(allProcedures);
                const lowerQuery = query.toLowerCase();
                resolve(allProcedures.filter(p => p.description.toLowerCase().includes(lowerQuery)));
            }, 300);
        });
    },

    async getHistory(ordsrvnro: number): Promise<SurgicalHistoryItem[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '101', mainProcedure: 'Secuestromía', requestDate: '2025-11-11', status: 'pendiente_coordinar', isCoordinated: false },
                    { id: '102', mainProcedure: 'Osteosíntesis', requestDate: '2025-01-11', status: 'pendiente_coordinar', isCoordinated: false },
                    { id: '103', mainProcedure: 'Osteosíntesis con placas y tornillos', requestDate: '2024-12-15', coordinationDate: '2024-12-25', status: 'realizado', isCoordinated: true },
                    { id: '104', mainProcedure: 'Clavo endomedular en tibia', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '105', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '106', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '107', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '108', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '109', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '110', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '111', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '112', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '113', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '114', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '115', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '116', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '117', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '118', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '119', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '120', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                    { id: '121', mainProcedure: 'Fijación externa', requestDate: '2024-11-15', coordinationDate: '2024-11-25', status: 'realizado', isCoordinated: true },
                ]);
            }, 500);
        });
    },

    async savePrescription(ordsrvnro: number, data: Omit<SurgicalPrescriptionData, 'id' | 'status' | 'requestDate'>): Promise<boolean> {
        console.log('Saving surgical prescription for', ordsrvnro, data);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
};

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
