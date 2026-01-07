'use server';

export type AttentionModeType = 'Presencial' | 'Teleasistencia';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getAttentionMode(token: string, ordsrvnro: string): Promise<AttentionModeType> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getAttentionMode`;
        try {
            //console.log('Fetching Attention Mode with:', { url, method: 'POST', ordsrvnro });
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
                console.error(`Error fetching attention mode: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to fetch attention mode: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            //console.log('GetAttentionMode response:', data);
            return data.modoAtencion || 'Presencial';
        } catch (error) {
            console.error('Network error fetching attention mode detailed:', error);
            throw error;
        }
    }

    // Mock API call    
    console.log('Fetching Attention Mode for:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return 'Presencial' by default for mock
            resolve('Presencial');
        }, 50);
    });
}

export async function saveAttentionMode(token: string, ordsrvnro: string, mode: AttentionModeType): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveAttentionMode`;
        try {
            //console.log('Sending saveAttentionMode request:', { url, method: 'POST', body: JSON.stringify({ ordsrvnro, attentionMode: mode }) });
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ordsrvnro, modoAtencion: mode })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving attention mode: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            const data = await response.json();
            //console.log('Save response:', data);
            return true;
        } catch (error) {
            console.error('Network error saving attention mode:', error);
            return false;
        }
    }

    // Mock API call
    console.log('Saving Attention Mode:', mode, 'for ordsrvnro:', ordsrvnro);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
}
