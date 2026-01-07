'use server';

// Service for managing diagnostic data

export interface ActiveProblem {
    id: string;
    startDate: string;
    diagnosis: string;
}

export interface DiagnosticHistoryItem {
    id: string;
    isProblem: boolean;
    problemStatus: 'active' | 'resolved' | null;
    startDate: string;
    diagnosis: string;
    professional: string;
    status: string;
}

export interface ENOData {
    symptomStartDate: string;
    contactWithSuspiciousCase: boolean;
}

export interface SCASTData {
    reperfusionStrategy: 'fibrinolisis' | 'acp_primaria' | 'acp_sistematica' | 'acp_rescate' | 'no_aplica';
    timeMinutes?: number;
}

export interface ExternalCauseData {
    intentionality: 'accidental' | 'agresiones' | 'intervencion_legal' | 'autoinfligidas' | 'complicaciones_medicas' | 'sin_dato';
    mechanism: 'agresion_sexual' | 'ahogamiento' | 'ahorcamiento' | 'caida' | 'contacto_animal_venenoso' | 'contacto_calor' | 'contacto_persona' | 'disparo' | 'electricidad' | 'fuego' | 'golpe' | 'intoxicacion' | 'mordedura' | 'corte' | 'cuerpo_extrano' | 'transito' | 'otros' | 'sin_dato';
    role?: 'peaton' | 'ciclista' | 'motociclista' | 'ocupante' | 'otros' | 'sin_dato';
}

export interface ConsultationDiagnosis {
    id: string;
    diagnosis: string;
    certainty: 'presuntivo' | 'definitivo' | null;
    type: 'primario' | 'secundario' | 'comorbilidad' | 'evento_adverso' | 'complicacion';
    isProblem: boolean;
    problemStatus?: 'activo' | 'resuelto';
    isAlert: boolean;
    startDate: string;
    mspNotification: boolean;
    enoData?: ENOData;
    scastData?: SCASTData;
    externalCauseData?: ExternalCauseData;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getActiveProblems(token: string, ordsrvnro: string): Promise<ActiveProblem[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getActiveProblems`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ordsrvnro })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 404) return [];
                console.error(`Error fetching active problems: ${response.status} ${response.statusText}`, errorText);
                return []; // Return empty on error to avoid breaking UI, or throw?
            }

            const data = await response.json();
            if (data && data.SDTActiveProblems) {
                return data.SDTActiveProblems;
            }
            return [];
        } catch (error) {
            console.error('Network error fetching active problems:', error);
            return [];
        }
    }

    // Mock data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 50));

    return [
        {
            id: '1',
            startDate: '11/02/2025',
            diagnosis: 'Control fractura de fémur'
        },
        {
            id: '2',
            startDate: '11/02/2025',
            diagnosis: 'Control fractura de fémur'
        },
        {
            id: '3',
            startDate: '11/02/2025',
            diagnosis: 'Migraña'
        }
    ];
}

export async function getDiagnosticHistory(token: string, ordsrvnro: string): Promise<DiagnosticHistoryItem[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getDiagnosticHistory`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ordsrvnro })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 404) return [];
                console.error(`Error fetching diagnostic history: ${response.status} ${response.statusText}`, errorText);
                return [];
            }

            const data = await response.json();
            if (data && data.SDTDiagnosticHistory) {
                return data.SDTDiagnosticHistory;
            }
            return [];

        } catch (error) {
            console.error('Network error fetching diagnostic history:', error);
            return [];
        }
    }

    // Mock data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 50));

    return [
        {
            id: '1',
            isProblem: true,
            problemStatus: 'active',
            startDate: '11/02/2025',
            diagnosis: 'Control fractura de fémur',
            professional: 'Dr. García',
            status: 'Activo'
        },
        {
            id: '2',
            isProblem: true,
            problemStatus: 'active',
            startDate: '11/02/2025',
            diagnosis: 'Migraña',
            professional: 'Dr. Rodríguez',
            status: 'Activo'
        },
        {
            id: '3',
            isProblem: true,
            problemStatus: 'resolved',
            startDate: '05/01/2025',
            diagnosis: 'Gripe común',
            professional: 'Dr. Martínez',
            status: 'Resuelto'
        },
        {
            id: '4',
            isProblem: false,
            problemStatus: null,
            startDate: '15/12/2024',
            diagnosis: 'Hipertensión arterial',
            professional: 'Dr. López',
            status: 'Confirmado'
        },
        {
            id: '5',
            isProblem: false,
            problemStatus: null,
            startDate: '20/11/2024',
            diagnosis: 'Diabetes tipo 2',
            professional: 'Dr. Fernández',
            status: 'Confirmado'
        }
    ];
}

// NOTE: checkDiagnosisType was synchronous helper. Since we are moving to server actions suitable for RPC,
// we could keep it exported as utility or keep it running on client.
// However, if the user requested ALL services to be server side, we should treat it as such.
// But for simple logic helpers, it's often better to keep them as util functions.
// I'll make it async to be consistent with the "service" pattern refactor, although it's strict logic.
// NOTE: checkDiagnosisType was synchronous helper. Since we are moving to server actions suitable for RPC,
// we could keep it exported as utility or keep it running on client.
// However, if the user requested ALL services to be server side, we should treat it as such.
// But for simple logic helpers, it's often better to keep them as util functions.
// I'll make it async to be consistent with the "service" pattern refactor, although it's strict logic.
export async function checkDiagnosisType(token: string, diagnosisName: string): Promise<'ENO' | 'SCAST' | 'LESION' | null> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/checkDiagnosisType`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ diagnosisName })
            });

            if (!response.ok) {
                console.error(`Error checking diagnosis type: ${response.status} ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            return data.type || null; // Assuming { type: 'ENO' | ... } response

        } catch (error) {
            console.error('Network error checking diagnosis type:', error);
            return null;
        }
    }

    const lowerName = diagnosisName.toLowerCase();

    // Mock checking for ENO
    if (lowerName.includes('dengue') || lowerName.includes('tuberculosis') || lowerName.includes('sarampion') || lowerName.includes('covid')) {
        return 'ENO';
    }

    // Mock checking for SCAST
    if (lowerName.includes('infarto') || lowerName.includes('scast') || lowerName.includes('elevacion st')) {
        return 'SCAST';
    }

    return 'LESION';
}

export async function getConsultationDiagnostics(token: string, ordsrvnro: string): Promise<ConsultationDiagnosis[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getConsultationDiagnostics`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ordsrvnro })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 404) return [];
                console.error(`Error fetching consultation diagnostics: ${response.status} ${response.statusText}`, errorText);
                return [];
            }

            const data = await response.json();
            if (data && data.SDTConsultationDiagnostics) {
                return data.SDTConsultationDiagnostics;
            }
            return [];
        } catch (error) {
            console.error('Network error fetching consultation diagnostics:', error);
            return [];
        }
    }

    // Mock data - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log('getConsultationDiagnostics:', ordsrvnro);
    return [];
}

export async function saveConsultationDiagnostics(token: string, ordsrvnro: string, diagnostics: ConsultationDiagnosis[]): Promise<void> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveConsultationDiagnostics`;
        try {
            console.log('Saving consultation diagnostics:', diagnostics);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    SDTConsultationDiagnostics: diagnostics
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving consultation diagnostics: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to save consultation diagnostics: ${response.status}`);
            }

        } catch (error) {
            console.error('Network error saving consultation diagnostics:', error);
            throw error;
        }
    } else {
        // Mock save - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Saving consultation diagnostics:', diagnostics);
    }
}
