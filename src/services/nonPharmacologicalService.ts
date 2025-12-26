export const nonPharmacologicalService = {
    async getIndications(token: string, ordsrvnro: number): Promise<string> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(''); // Start empty
            }, 500);
        });
    },

    async saveIndications(token: string, ordsrvnro: number, text: string): Promise<boolean> {
        console.log('Saving non-pharmacological indications:', text);
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 500);
        });
    }
};
