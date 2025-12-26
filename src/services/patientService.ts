import { apiClient } from '@/lib/apiClient';

export interface Patient {
    id: string;
    name: string;
    lastName: string;
    birthDate: string;
    gender: string;
    documentId: string;
    lastVisit?: string;
}

/**
 * Service to handle patient-related API calls to GeneXus REST endpoints
 */
export const patientService = {
    async getPatients(token: string): Promise<Patient[]> {
        // This endpoint should be defined in your GeneXus project
        return apiClient.get<Patient[]>('/patients', token);
    },

    async getPatientById(id: string, token: string): Promise<Patient> {
        return apiClient.get<Patient>(`/patients/${id}`, token);
    },

    async searchPatients(query: string, token: string): Promise<Patient[]> {
        return apiClient.get<Patient[]>(`/patients?q=${encodeURIComponent(query)}`, token);
    }
};
