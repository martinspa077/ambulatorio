export const evolutionService = {
    async getEvolution(token: string, ordsrvnro: number): Promise<string> {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(''); // Start empty or with some mock text if preferred
            }, 600);
        });
    },

    async saveEvolution(token: string, ordsrvnro: number, text: string): Promise<boolean> {
        console.log('Saving evolution:', text);
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), 500);
        });
    }
};
