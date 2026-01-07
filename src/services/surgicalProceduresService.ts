'use server';

import {
    SurgicalProcedure,
    SurgicalHistoryItem,
    SurgicalPrescriptionData,
    HospitalizationInfo,
    Professional
} from './surgicalProceduresTypes';

export async function searchProfessionals(query: string = ''): Promise<Professional[]> {
    const allProfessionals: Professional[] = [
        { id: '1', nombre: 'Dr. Gregory House', especialidad: 'Diagnóstico', rol: 'Jefe de Departamento' },
        { id: '2', nombre: 'Dr. James Wilson', especialidad: 'Oncología', rol: 'Jefe de Departamento' },
        { id: '3', nombre: 'Dr. Eric Foreman', especialidad: 'Neurología', rol: 'Médico' },
        { id: '4', nombre: 'Dra. Allison Cameron', especialidad: 'Inmunología', rol: 'Médico' },
        { id: '5', nombre: 'Dr. Robert Chase', especialidad: 'Cuidados Intensivos', rol: 'Médico' },
        { id: '6', nombre: 'Dra. Lisa Cuddy', especialidad: 'Endocrinología', rol: 'Decana de Medicina' }
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) resolve([]);
            const lowerQuery = query.toLowerCase();
            resolve(allProfessionals.filter(p => p.nombre.toLowerCase().includes(lowerQuery)));
        }, 500);
    });
}

export async function getProfessionalRoles(): Promise<{ name: string; specialties: string[] }[]> {
    const roles = [
        {
            name: 'Cirujano Principal',
            specialties: ['Cirugía General', 'Traumatología', 'Urología', 'Neurocirugía', 'Cardiocirugía']
        },
        {
            name: 'Ayudante',
            specialties: ['Cirugía General', 'Traumatología', 'Medicina General', 'Residente']
        },
        {
            name: 'Anestesista',
            specialties: ['Anestesiología']
        },
        {
            name: 'Instrumentista',
            specialties: ['Instrumentación Quirúrgica', 'Enfermería']
        },
        {
            name: 'Circulante',
            specialties: ['Enfermería', 'Auxiliar de Enfermería']
        }
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(roles);
        }, 50);
    });
}

export async function getProcedures(query: string = ''): Promise<SurgicalProcedure[]> {
    // Mock Catalog
    const allProcedures: SurgicalProcedure[] = [
        { id: '1', description: 'Secuestromía', requiresAuthorization: false, requiresConsent: false },
        { id: '2', description: 'Osteosíntesis', requiresAuthorization: true, requiresConsent: true },
        { id: '3', description: 'Osteosíntesis con placas y tornillos', requiresAuthorization: true, requiresConsent: true },
        { id: '4', description: 'Fijación externa', requiresAuthorization: false, requiresConsent: true },
        { id: '5', description: 'Limpieza quirúrgica', requiresAuthorization: false, requiresConsent: true },
        { id: '6', description: 'Clavo endomedular en tibia', requiresAuthorization: true, requiresConsent: true },
        { id: '7', description: 'Amputación traumatica', requiresAuthorization: true, requiresConsent: true },
        { id: '8', description: 'Sutura de tendón', requiresAuthorization: false, requiresConsent: false }, // Simple procedure logic
        { id: '9', description: 'Artroscopia de rodilla', requiresAuthorization: true, requiresConsent: true },
        { id: '10', description: 'Reemplazo total de cadera', requiresAuthorization: true, requiresConsent: true }
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) resolve(allProcedures);
            const lowerQuery = query.toLowerCase();
            resolve(allProcedures.filter(p => p.description.toLowerCase().includes(lowerQuery)));
        }, 50);
    });
}

export async function getHistory(ordsrvnro: string): Promise<SurgicalHistoryItem[]> {
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
        }, 50);
    });
}

export async function getPrescription(ordsrvnro: string): Promise<SurgicalPrescriptionData[]> {
    // Mock API call
    console.log('Fetching prescriptions for:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return mock data or empty array
            // resolve([]); 

            // Example mock data
            resolve([
                {
                    id: 'mock-1',
                    procedures: [{ id: '10', description: 'Apendicectomía', requiresAuthorization: false, requiresConsent: true }],
                    sameInstance: true,
                    opportunity: 'urgencia',
                    surgeryType: 'internacion_mismo_dia',
                    preoperativeDiagnoses: [{ term: 'Apendicitis aguda' }],
                    surgeryDate: '2025-10-10',
                    surgeryTime: '10:00',
                    duration: { hours: 1, minutes: 30 },
                    plant: 'HBSE',
                    place: 'BQ',
                    surgeon: { nombre: 'Dr. House' },
                    intraoperativeXray: false,
                    anesthesia: 'a_definir', // Changed from 'general' to 'a_definir' to match existing types.

                    preparation: {
                        vvp: true,
                        sondaVesical: false,
                        rasurado: false,
                        sng: false,
                        enema: false,
                        vvc: false,
                        bloodAvailability: false,
                        anticoagulantsAdjustment: false,
                        insulinAdjustment: false,
                        antibioticProphylaxis: true
                    },
                    status: 'pendiente_coordinar',
                    requestDate: '2025-10-09'
                }
            ]);
        }, 50);
    });
}

export async function getHospitalizationInfo(ordsrvnro: string): Promise<HospitalizationInfo | null> {
    console.log('Fetching hospitalization info for:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                piso: '6',
                habitacion: '615',
                cama: 'A'
            });
        }, 50);
    });
}

export async function savePrescription(ordsrvnro: string, data: Omit<SurgicalPrescriptionData, 'id' | 'status' | 'requestDate'>): Promise<boolean> {
    console.log('Saving surgical prescription for', ordsrvnro, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
}
