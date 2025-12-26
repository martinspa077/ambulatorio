import { PhysicalExamHistoryItem } from './physicalExamService';

export const evaService = {
    async getEVA(token: string, ordsrvnro: number): Promise<number | null> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(null); // Default to no selection
            }, 500);
        });
    },

    async saveEVA(token: string, ordsrvnro: number, value: number): Promise<boolean> {
        console.log('Saving EVA:', value);
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 500);
        });
    },

    async getEVAHistory(token: string, ordsrvnro: number): Promise<PhysicalExamHistoryItem[]> {
        // Mock API call for history
        return new Promise((resolve) => {
            setTimeout(() => {
                const today = new Date();
                const history: PhysicalExamHistoryItem[] = [];

                // Generate 5 mock points
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i * 7); // Weekly data

                    // Random EVA value between 0 and 10
                    const value = Math.floor(Math.random() * 11);

                    history.push({
                        date: date.toISOString(),
                        value: value
                    });
                }

                resolve(history);
            }, 500);
        });
    }
};
