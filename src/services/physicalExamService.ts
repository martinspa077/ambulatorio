'use server';

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

export interface PhysicalExamHistoryItem {
    date: string;
    value: number;
    secondaryValue?: number; // For Diastolic BP
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getPhysicalExam(token: string, ordsrvnro: string): Promise<PhysicalExamData | null> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getPhysicalExam`;
        try {
            // console.log('Fetching Physical Exam with:', { url, method: 'POST', ordsrvnro });
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
                // 404 is valid if no exam exists yet? Or just return null.
                if (response.status === 404) return null;
                console.error(`Error fetching physical exam: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to fetch physical exam: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            // console.log('GetPhysicalExam response:', data);

            if (data && data.SDTPhysicalExam) {
                return data.SDTPhysicalExam;
            }
            return null;

        } catch (error) {
            console.error('Network error fetching physical exam:', error);
            throw error;
        }
    }

    // Mock implementation
    console.log(`Fetching physical exam for ${ordsrvnro}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return null sometimes to simulate empty state, or data
            // For now return data
            resolve({
                paSistolica: 120,
                paDiastolica: 80,
                frecuenciaCardiaca: 75,
                peso: 70,
                talla: 175,
                temperatura: 36.5,
                frecuenciaRespiratoria: 16,
                saturacionOxigeno: 98,
                imc: 25,
                hgt: 175,
                lastUpdate: '10/02/2025 09:30',
                professionalName: 'Dr. John Doe',
                specialty: 'Cardiología',
                mode: 'display'
            });
        }, 500);
    });
}

export async function savePhysicalExam(token: string, ordsrvnro: string, data: PhysicalExamData): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/savePhysicalExam`;
        try {
            data.mode = 'update';

            console.log('Saving Physical Exam with:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    SDTPhysicalExam: data
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving physical exam: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            const responseData = await response.json();
            return responseData.isOK === true;
        } catch (error) {
            console.error('Network error saving physical exam:', error);
            return false;
        }
    }

    // Mock implementation
    console.log(`Saving physical exam for ${ordsrvnro}`, data);
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
    });
}

export async function getPhysicalExamHistory(token: string, ordsrvnro: string, examType: keyof PhysicalExamData | 'pa'): Promise<PhysicalExamHistoryItem[]> {
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
        }, 50);
    });
}
