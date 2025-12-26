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

export const summaryService = {
    async getTemporaria(token: string, ordsrvnro: number): Promise<TemporariaData> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    diasSiniestro: 45,
                    diasReapertura: 9
                });
            }, 500);
        });
    },

    async getConstancia(token: string, ordsrvnro: number): Promise<ConstanciaData> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    motivos: ['DIABETES MELLITUS', 'HIPERTENSION ARTERIAL']
                });
            }, 500);
        });
    },

    async getLastConsultation(token: string, ordsrvnro: number): Promise<LastConsultationData> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    fecha: '23/09/25',
                    descripcion: 'El paciente se presenta para controlar evolución postquirúrgica'
                });
            }, 500);
        });
    }
};
