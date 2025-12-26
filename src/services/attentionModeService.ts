export type AttentionModeType = 'Presencial' | 'Teleasistencia';

export const attentionModeService = {
    async getAttentionMode(token: string, ordsrvnro: number): Promise<AttentionModeType> {
        // Mock API call
        // GET /Consultation/AttentionMode?ordsrvnro={ordsrvnro}
        console.log('Fetching Attention Mode for:', ordsrvnro);
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return 'Presencial' by default for mock
                resolve('Presencial');
            }, 500);
        });
    },

    async saveAttentionMode(token: string, ordsrvnro: number, mode: AttentionModeType): Promise<boolean> {
        // Mock API call
        // POST /Consultation/AttentionMode
        console.log('Saving Attention Mode:', mode, 'for ordsrvnro:', ordsrvnro);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }
};
