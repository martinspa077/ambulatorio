export interface PhysicalExamData {
    paSistolica?: number;
    paDiastolica?: number;
    frecuenciaCardiaca?: number;
    temperatura?: number;
    frecuenciaRespiratoria?: number;
    saturacionOxigeno?: number;
    hgt?: number;
    peso?: number;
    talla?: number;
    imc?: number;
    lastUpdate?: string; // ISO date string
    professionalName?: string;
    specialty?: string;
    mode: 'display' | 'update';
}

export const physicalExamService = {
    async getPhysicalExam(token: string, ordsrvnro: number): Promise<PhysicalExamData> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    paSistolica: 120,
                    paDiastolica: 80,
                    frecuenciaCardiaca: 80,
                    temperatura: 36.5,
                    frecuenciaRespiratoria: 15,
                    saturacionOxigeno: 98,
                    hgt: 140,
                    peso: 75,
                    talla: 170,
                    imc: 19, // In a real scenario, this might be calculated on the fly or stored
                    lastUpdate: new Date().toISOString(),
                    professionalName: 'Dr. Ejemplar',
                    specialty: 'Cardiología',
                    mode: 'display'
                });
            }, 600);
        });
    },

    async savePhysicalExam(token: string, ordsrvnro: number, data: PhysicalExamData): Promise<boolean> {
        console.log('Saving physical exam:', data);
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 500);
        });
    },

    async getPhysicalExamHistory(token: string, ordsrvnro: number, examType: keyof PhysicalExamData | 'pa'): Promise<PhysicalExamHistoryItem[]> {
        // Mock API call for history
        return new Promise((resolve) => {
            setTimeout(() => {
                const today = new Date();
                const history: PhysicalExamHistoryItem[] = [];

                // Generate 5 mock points
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i * 7); // Weekly data

                    let value: number;
                    let secondaryValue: number | undefined;

                    switch (examType) {
                        case 'pa': // Special case for Blood Pressure
                            value = 110 + Math.floor(Math.random() * 20); // Systolic
                            secondaryValue = 70 + Math.floor(Math.random() * 15); // Diastolic
                            break;
                        case 'frecuenciaCardiaca':
                            value = 70 + Math.floor(Math.random() * 20);
                            break;
                        case 'temperatura':
                            value = 36 + Math.random();
                            break;
                        case 'peso':
                            value = 74 + Math.random() * 2;
                            break;
                        default:
                            value = 10 + Math.floor(Math.random() * 10);
                    }

                    history.push({
                        date: date.toISOString(),
                        value: Number(value.toFixed(1)),
                        secondaryValue: secondaryValue ? Number(secondaryValue.toFixed(1)) : undefined
                    });
                }

                resolve(history);
            }, 500);
        });
    }
};

export interface PhysicalExamHistoryItem {
    date: string;
    value: number;
    secondaryValue?: number; // For Diastolic BP
}
