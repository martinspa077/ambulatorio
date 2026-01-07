import { ConsultationHistoryItem, ConsultationPrescriptionData, Specialty } from './nextConsultationsTypes';

export async function getSpecialties(query: string = ''): Promise<Specialty[]> {
    const allSpecialties: Specialty[] = [
        { id: '1', description: 'Traumatología', requiresAuthorization: true },
        { id: '2', description: 'Dermatología', requiresAuthorization: false },
        { id: '3', description: 'Infectología', requiresAuthorization: false },
        { id: '4', description: 'Cardiología', requiresAuthorization: false },
        { id: '5', description: 'Medicina General', requiresAuthorization: false },
        { id: '6', description: 'Neurología', requiresAuthorization: true },
        { id: '7', description: 'Oftalmología', requiresAuthorization: false },
        { id: '8', description: 'Endocrinología', requiresAuthorization: false },
        { id: '9', description: 'Reumatología', requiresAuthorization: true },
        { id: '10', description: 'Gastroenterología', requiresAuthorization: false },
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) resolve(allSpecialties);
            const lowerQuery = query.toLowerCase();
            resolve(allSpecialties.filter(s => s.description.toLowerCase().includes(lowerQuery)));
        }, 100);
    });
}

export async function getConsultationHistory(ordsrvnro: string, filters?: any): Promise<ConsultationHistoryItem[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData: ConsultationHistoryItem[] = [
                { id: '101', specialty: 'Dermatología', requestDate: '2025-01-11', status: 'pendiente_coordinar' },
                { id: '102', specialty: 'Traumatología', requestDate: '2025-01-11', status: 'pendiente_coordinar' },
                { id: '103', specialty: 'Traumatología', requestDate: '2024-12-15', coordinationDate: '2024-12-25', polyclinic: 'PT1', status: 'coordinado' },
                { id: '104', specialty: 'Traumatología', requestDate: '2024-11-15', coordinationDate: '2024-11-25', polyclinic: 'PT1', status: 'cumplido' },
                { id: '105', specialty: 'Infectología', requestDate: '2024-11-15', coordinationDate: '2024-11-25', polyclinic: 'Infectología', status: 'cumplido' },
                { id: '106', specialty: 'Infectología', requestDate: '2024-11-15', coordinationDate: '2024-11-25', polyclinic: 'Infectología', status: 'cumplido' },
                { id: '107', specialty: 'Infectología', requestDate: '2024-11-15', coordinationDate: '2024-11-25', polyclinic: 'Infectología', status: 'cumplido' },
            ];
            resolve(mockData);
        }, 300);
    });
}

export async function saveConsultationPrescription(ordsrvnro: string, prescriptions: ConsultationPrescriptionData[]): Promise<void> {
    console.log('Saving consultation prescriptions for:', ordsrvnro, prescriptions);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
}
