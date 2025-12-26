export interface LastConsultationReason {
    date: string;
    reason: string;
    professionalName?: string;
}

export const consultationReasonService = {
    async getLastReasons(token: string, ordsrvnro: number): Promise<LastConsultationReason[]> {
        // Mock API call
        console.log('Fetching Last Reasons for:', ordsrvnro);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { date: '11/02/2025', reason: 'Control fractura de fémur' },
                    { date: '11/02/2025', reason: 'Control fractura de fémur' }, // Duplicate as per screenshot example?
                    { date: '11/02/2025', reason: 'Andrea González', professionalName: 'Andrea González' } // Screenshot shows name sometimes? treating as reason text for now
                ]);
            }, 600);
        });
    },

    async getCurrentReason(token: string, ordsrvnro: number): Promise<string[]> {
        // Mock API call
        console.log('Fetching Current Reason for:', ordsrvnro);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([]); // Start empty
            }, 400);
        });
    },

    async saveCurrentReason(token: string, ordsrvnro: number, reasons: string[]): Promise<boolean> {
        // Mock API call
        console.log('Saving Current Reasons:', reasons, 'for ordsrvnro:', ordsrvnro);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
    }
};
