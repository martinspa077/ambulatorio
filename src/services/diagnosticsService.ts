import { type } from "os";

// Service for managing diagnostic data

export interface ActiveProblem {
    id: string;
    startDate: string;
    diagnosis: string;
    professional: string;
    status: 'active' | 'resolved';
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
    terminologyId?: string;
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

class DiagnosticsService {
    async getActiveProblems(ordsrvnro: number): Promise<ActiveProblem[]> {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));

        return [
            {
                id: '1',
                startDate: '11/02/2025',
                diagnosis: 'Control fractura de fémur',
                professional: 'Dr. García',
                status: 'active'
            },
            {
                id: '2',
                startDate: '11/02/2025',
                diagnosis: 'Control fractura de fémur',
                professional: 'Dr. García',
                status: 'active'
            },
            {
                id: '3',
                startDate: '11/02/2025',
                diagnosis: 'Migraña',
                professional: 'Dr. Rodríguez',
                status: 'active'
            }
        ];
    }

    async getDiagnosticHistory(ordsrvnro: number): Promise<DiagnosticHistoryItem[]> {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));

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

    checkDiagnosisType(diagnosisName: string): 'ENO' | 'SCAST' | 'LESION' | null {
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

    async getConsultationDiagnostics(ordsrvnro: number): Promise<ConsultationDiagnosis[]> {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('getConsultationDiagnostics:', ordsrvnro);
        return [];
    }

    async saveConsultationDiagnostics(ordsrvnro: number, diagnostics: ConsultationDiagnosis[]): Promise<void> {
        // Mock save - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Saving consultation diagnostics:', diagnostics);
    }


}

export const diagnosticsService = new DiagnosticsService();
