'use server';

export interface TemporariaData {
    diasSiniestro: number;
    diasReapertura: number;
}

export interface ConstanciaData {
    motivos: string[];
}

export interface LastConsultationData {
    fecha: string;
    descripcion: string;
}


export async function getTemporaria(token: string, ordsrvnro: string): Promise<TemporariaData> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                diasSiniestro: 45,
                diasReapertura: 9
            });
        }, 50);
    });
}

export async function getConstancia(token: string, ordsrvnro: string): Promise<ConstanciaData> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                motivos: ['DIABETES MELLITUS', 'HIPERTENSION ARTERIAL']
            });
        }, 50);
    });
}

export async function getLastConsultation(token: string, ordsrvnro: string): Promise<LastConsultationData> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                fecha: '23/09/25',
                descripcion: 'El paciente se presenta para controlar evolución postquirúrgica'
            });
        }, 50);
    });
}

