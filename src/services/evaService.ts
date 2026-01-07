'use server';

import { PhysicalExamHistoryItem } from './physicalExamService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getEVA(token: string, ordsrvnro: string): Promise<number | null> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getEVA`;
        try {
            console.log('Fetching EVA with:', { url, method: 'POST', ordsrvnro });
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
                // 404 might mean no value set yet
                if (response.status === 404) return null;
                console.error(`Error fetching EVA: ${response.status} ${response.statusText}`, errorText);
                return null;
            }

            const data = await response.json();
            console.log('GetEVA response:', data);

            return Number(data.eva);

        } catch (error) {
            console.error('Network error fetching EVA:', error);
            return null;
        }
    }

    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null); // Default to no selection
        }, 50);
    });
}

export async function saveEVA(token: string, ordsrvnro: string, value: number): Promise<boolean> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/saveEVA`;
        try {
            console.log('Saving EVA with:', { url, ordsrvnro, value });
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ordsrvnro,
                    eva: value
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error saving EVA: ${response.status} ${response.statusText}`, errorText);
                return false;
            }

            return true;

        } catch (error) {
            console.error('Network error saving EVA:', error);
            return false;
        }
    }

    console.log('Saving EVA (MOCK):', value);
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 50);
    });
}

export async function getEVAHistory(token: string, ordsrvnro: string): Promise<PhysicalExamHistoryItem[]> {
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
        }, 50);
    });
}
