/**
 * Caller Service
 * Handles real-time communication between the Doctor's Agenda and the Waiting Room Monitor.
 * Uses SSE (Server-Sent Events) for real-time pushing from server to client.
 */

export interface CallData {
    pacienteId: number;
    pacienteNombre: string;
    consultorio: string;
    monitorId: string;
    timestamp: number;
}

const BRIDGE_API_URL = '/api/calling-bridge';

export const callerService = {
    /**
     * Call a patient (POST to Bridge)
     */
    async callPatient(data: Omit<CallData, 'timestamp'>) {
        try {
            const response = await fetch(BRIDGE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to push call to server');
        } catch (error) {
            console.error('[CallerService] Error pushing call:', error);
        }
    },

    /**
     * Subscribe to real-time calls via SSE
     */
    subscribeToCalls(monitorId: string, onCall: (data: CallData) => void) {
        const eventSource = new EventSource(`${BRIDGE_API_URL}?monitorId=${monitorId}`);

        eventSource.addEventListener('call', (event) => {
            try {
                const data = JSON.parse(event.data);
                onCall(data);
            } catch (e) {
                console.error('Error parsing SSE data', e);
            }
        });

        eventSource.onerror = (err) => {
            console.error('[SSE] EventSource error:', err);
            // Browser automatically tries to reconnect SSE, but we log it
        };

        return () => {
            console.log('[SSE] Closing connection');
            eventSource.close();
        };
    },

    /**
     * Still useful for instant sync on same PC
     */
    onLocalCallReceived(callback: (data: CallData) => void) {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'emr_patient_call' && event.newValue) {
                try {
                    const data = JSON.parse(event.newValue);
                    callback(data);
                } catch (e) { }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    },

    getHighlightDuration(): number {
        return 30000;
    }
};
