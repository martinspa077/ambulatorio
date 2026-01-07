'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export interface LastConsultationReason {
    id: string;
    date: string;
    reason: string;
    // professionalName removed
}

export interface CurrentConsultationReason {
    id: string;
    reason: string;
}

export async function getLastReasons(token: string, ordsrvnro: string): Promise<LastConsultationReason[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getLastReasons`;
        try {
            console.log('Fetching Last Reasons with:', { url, method: 'POST', ordsrvnro });
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
                console.error(`Error fetching last reasons: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to fetch last reasons: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('GetLastReasons response:', data);

            // Check for wrapped array in SDTLastReason
            if (data && Array.isArray(data.SDTLastReason)) {
                return data.SDTLastReason;
            } else if (Array.isArray(data)) {
                return data;
            } else if (data && typeof data === 'object') {
                const keys = Object.keys(data);
                console.warn("GetLastReasons returned an object, not an array. Keys:", keys);
                return [];
            }

            console.warn("GetLastReasons returned unexpected type:", typeof data);
            return [];
        } catch (error) {
            console.error('Network error fetching last reasons:', error);
            throw error;
        }
    }

    // Mock API call
    console.log('Fetching Last Reasons for:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', date: '11/02/2025', reason: 'Control de salud' },
                { id: '2', date: '11/02/2025', reason: 'Control fractura de fémur' },
                { id: '3', date: '11/02/2025', reason: 'Gripe' }
            ]);
        }, 50);
    });
}

export async function getCurrentReason(token: string, ordsrvnro: string): Promise<CurrentConsultationReason[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getCurrentReason`;
        try {
            // console.log('Fetching Current Reasons with:', { url, method: 'POST', ordsrvnro });
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
                console.error(`Error fetching current reasons: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to fetch current reasons: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            // console.log('GetCurrentReason response:', data);

            if (data && Array.isArray(data.SDTCurrentReason)) {
                return data.SDTCurrentReason;
            }

            return [];
        } catch (error) {
            console.error('Network error fetching current reasons:', error);
            throw error;
        }
    }

    // Mock API call
    console.log('Fetching Current Reason for:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]); // Start empty
        }, 50);
    });
}

export async function saveCurrentReason(token: string, ordsrvnro: string, reasons: CurrentConsultationReason[]): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveCurrentReason`;
        try {
            // console.log('Saving Current Reasons with:', { url, method: 'POST', ordsrvnro, reasons });
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    SDTCurrentReason: reasons
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving current reasons: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            const data = await response.json();
            // console.log('SaveCurrentReason response:', data);

            return data.isOK === true;
        } catch (error) {
            console.error('Network error saving current reasons:', error);
            return false;
        }
    }

    // Mock API call
    console.log('Saving Current Reasons:', reasons, 'for ordsrvnro:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
}

