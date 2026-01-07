'use server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getEvolution(token: string, ordsrvnro: string): Promise<string> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getEvolution`;
        try {
            console.log('Fetching Evolution with:', { url, method: 'POST', ordsrvnro });
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
                console.error(`Error fetching evolution: ${response.status} ${response.statusText}`, errorText);
                return ''; // Return empty string on error or throw? Returning empty for soft failure in UI.
            }

            const data = await response.json();
            console.log('GetEvolution response:', data);

            return data.evolucion;

        } catch (error) {
            console.error('Network error fetching evolution:', error);
            return '';
        }
    }

    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(''); // Start empty or with some mock text if preferred
        }, 50);
    });
}

export async function saveEvolution(token: string, ordsrvnro: string, text: string): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveEvolution`;
        try {
            console.log('Saving Evolution with:', { url, ordsrvnro, textLength: text.length });
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    evolucion: text
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving evolution: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            // const responseData = await response.json();
            // Assuming 200 OK means saved. Or check responseData.
            return true;

        } catch (error) {
            console.error('Network error saving evolution:', error);
            return false;
        }
    }

    console.log('Saving evolution (MOCK):', text);
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 50);
    });
}
