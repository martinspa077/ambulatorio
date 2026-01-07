'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getIndications(token: string, ordsrvnro: string): Promise<string> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getIndications`;
        try {
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
                // If 404, just return empty string instead of error, avoiding UI break
                if (response.status === 404) return '';
                console.error(`Error fetching indications: ${response.status} ${response.statusText}`, errorText);
                return '';
            }

            const data = await response.json();

            return data.indicacion;
        } catch (error) {
            console.error('Network error fetching indications:', error);
            return '';
        }
    }

    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(''); // Start empty
        }, 50);
    });
}

export async function saveIndications(token: string, ordsrvnro: string, text: string): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveIndications`;
        try {
            console.log('Saving non-pharmacological indications:', text);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    indicacion: text // Assuming property name
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving indications: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Network error saving indications:', error);
            return false;
        }
    }

    console.log('Saving non-pharmacological indications:', text);
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 50);
    });
}
