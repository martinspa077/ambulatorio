'use server';

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
export async function getPatients(token: string): Promise<Patient[]> {
    // This endpoint should be defined in your GeneXus project
    // Using apiGet wrapper which already handles url construction with GAM_BASE_URL
    return apiClient.get<Patient[]>('/patients', token);
}

export async function getPatientById(id: string, token: string): Promise<Patient> {
    return apiClient.get<Patient>(`/patients/${id}`, token);
}

export async function searchPatients(query: string, token: string): Promise<Patient[]> {
    return apiClient.get<Patient[]>(`/patients?q=${encodeURIComponent(query)}`, token);
}
