'use server';

export interface TerminologyResult {
    id: string;
    description: string;
    relatedTerms?: { id: string; description: string }[];
}

export async function searchTerminology(term: string): Promise<TerminologyResult[]> {
    // Mock API call to terminology server
    // GET /Terminology/Search?term={term}
    console.log('Searching terminology for:', term);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mocking some results based on the term
            if (!term) {
                resolve([]);
                return;
            }

            resolve([
                {
                    id: '12345',
                    description: `${term} Tipo 1`,
                    relatedTerms: [
                        { id: '12345-1', description: `${term} Tipo 1 Complicada` }
                    ]
                },
                {
                    id: '67890',
                    description: `${term} Tipo 2`,
                    relatedTerms: []
                },
                {
                    id: '11223',
                    description: `Historia familiar de ${term}`,
                    relatedTerms: []
                }
            ]);
        }, 50);
    });
}
