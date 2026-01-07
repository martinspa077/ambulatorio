'use server';

export interface AgendaInfo {
    agendaId: number;
    descripcion: string;
    especialidad: string;
    coordinados: string;
}

export interface Cita {
    ordsrvnro: string;
    hora: string;
    nroTipo: string;
    estado: 'PDE' | 'CUM' | 'INA' | 'PDR';
    estadoDescripcion: string;
    pacienteId: number;
    pacienteNombre: string;
    pacienteDocumento: string;
    modalidad: string;
    edad: string;
    esPrimerConsulta: boolean;
    datoClinico: string;
    tieneIndicaciones: boolean;
    tipoLlamada: 'megafono' | 'telefono';
    monitorId: string;
}

export interface AgendaResponse {
    resumen: {
        asistencias: number;
        sinAnunciar: number;
        enEspera: number;
        inasistencias: number;
    };
    citas: Cita[];
}

export interface InasistenciaDetail {
    pacienteDocumento: string;
    pacienteNombre: string;
    fechaHora: string;
    numero: string;
    modalidad: string;
    agenda: string;
    servicio: string;
    profesional: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';

export async function getAvailableAgendas(token: string): Promise<AgendaInfo[]> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';
    console.log('Fetching getAvailableAgendas');
    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getAvailableAgendas`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(`Error fetching agendas: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch agendas');
            }


            const data = await response.json();
            console.log(data.SDTAvailableAgendas);
            return data.SDTAvailableAgendas || [];
        } catch (error) {
            console.error('Network error fetching agendas:', error);
            return [];
        }
    }

    // Mock Data (Default)
    return [
        {
            agendaId: 1001,
            descripcion: 'PT1 Hora Inicio: 11:00',
            especialidad: 'Traumatologíaaa',
            coordinados: '5 Normales / 1 Sobrante'
        },
        {
            agendaId: 1002,
            descripcion: 'PT2 Hora Inicio: 14:00',
            especialidad: 'Traumatología',
            coordinados: '3 Normales / 0 Sobrante'
        }
    ];
}

export async function getAgenda(token: string, agendaId: number): Promise<AgendaResponse> {
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND_SERVICES === 'true';

    if (useBackend) {
        const url = `${API_BASE_URL}/rest/Ambulatorio/getAgenda`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ agendaId })
            });

            if (!response.ok) {
                console.error(`Error fetching agenda details: ${response.status} ${response.statusText}`);
                throw new Error('Failed to fetch agenda details');
            }

            const data = await response.json();
            console.log("Agenda Data:", data.SDTAgendaResponse);
            return data.SDTAgendaResponse;
        } catch (error) {
            console.error('Network error fetching agenda details:', error);
            // Fallback to mock on error? Or rethrow?
            // For dev stability, maybe fallback or throw. Let's throw to be explicit if backend is expected.
            // But preserving "fallback to mock" behavior from getAvailableAgendas pattern might be safer if backend is flaky.
            // However, getAvailableAgendas returns empty array on error. Here we need a full object.
            // Let's return mock data if backend fails for now, or just throw.
            // Given the instruction "ya genere en el backend", user expects it to work.
            throw error;
        }
    }

    // Mock data logic based on agendaId
    if (agendaId === 1002) {
        return {
            resumen: { asistencias: 0, sinAnunciar: 1, enEspera: 1, inasistencias: 0 },
            citas: [
                {
                    ordsrvnro: '1ceeb001-682f-4a52-9379-423663139cc5',
                    hora: '14:00',
                    nroTipo: '1-P',
                    estado: 'PDE',
                    estadoDescripcion: 'En espera',
                    pacienteId: 6001,
                    pacienteNombre: 'Laura Sosa',
                    pacienteDocumento: 'C.I. 8.888.888-8',
                    modalidad: 'Presencial',
                    edad: '29 años',
                    esPrimerConsulta: false,
                    datoClinico: 'dolor rodilla',
                    tieneIndicaciones: false,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_B'
                }
            ]
        };
    }

    // Default mock (Agenda 1001)
    return {
        resumen: {
            asistencias: 1,
            sinAnunciar: 1,
            enEspera: 3,
            inasistencias: 1
        },
        citas: [
            {
                ordsrvnro: '4fd0829b-6996-4641-82b9-f7cb1d75d4f4',
                hora: '09:00',
                nroTipo: '1-P',
                estado: 'PDE',
                estadoDescripcion: 'En espera',
                pacienteId: 5001,
                pacienteNombre: 'Juan Perez',
                pacienteDocumento: 'C.I. 1.111.111-1',
                modalidad: 'Presencial',
                edad: '45 años',
                esPrimerConsulta: true,
                datoClinico: 'dolor abdominal cronico',
                tieneIndicaciones: true,
                tipoLlamada: 'megafono',
                monitorId: 'SALA_A'
            },
            {
                ordsrvnro: '79c1bff7-ca56-4883-8af6-f85f984f1f03',
                hora: '09:15',
                nroTipo: '2 N',
                estado: 'CUM',
                estadoDescripcion: 'Asistió',
                pacienteId: 5002,
                pacienteNombre: 'Maria Dominguez',
                pacienteDocumento: 'C.I. 2.222.222-2',
                modalidad: 'Presencial',
                edad: '36 años',
                esPrimerConsulta: false,
                datoClinico: 'control post-op',
                tieneIndicaciones: true,
                tipoLlamada: 'megafono',
                monitorId: 'SALA_B'
            },
            {
                ordsrvnro: '98a6c7b7-7c35-4ced-8a30-88c946f229ef',
                hora: '09:45',
                nroTipo: '3-I',
                estado: 'INA',
                estadoDescripcion: 'Inasistencia',
                pacienteId: 5003,
                pacienteNombre: 'Jose Rodriguez',
                pacienteDocumento: 'C.I. 3.333.333-3',
                modalidad: 'Presencial',
                edad: '62 años',
                esPrimerConsulta: false,
                datoClinico: 'hipertension',
                tieneIndicaciones: false,
                tipoLlamada: 'megafono',
                monitorId: 'SALA_A'
            },
            {
                ordsrvnro: '4a927577-cb1e-479f-8bd7-6e625f706893',
                hora: '10:00',
                nroTipo: '4-E',
                estado: 'PDR',
                estadoDescripcion: 'Sin anunciar',
                pacienteId: 5004,
                pacienteNombre: 'Roberto Garcia',
                pacienteDocumento: 'C.I. 4.444.444-4',
                modalidad: 'Presencial',
                edad: '55 años',
                esPrimerConsulta: false,
                datoClinico: '',
                tieneIndicaciones: false,
                tipoLlamada: 'megafono',
                monitorId: 'SALA_A'
            },
            {
                ordsrvnro: 'bc7076c3-d12e-496a-a1c3-e9c2b12cbf7e',
                hora: '10:15',
                nroTipo: '5-P',
                estado: 'PDE',
                estadoDescripcion: 'En espera',
                pacienteId: 5005,
                pacienteNombre: 'Ana Lopez',
                pacienteDocumento: 'C.I. 5.555.555-5',
                modalidad: 'Presencial',
                edad: '22 años',
                esPrimerConsulta: true,
                datoClinico: 'primera vez cardiologia',
                tieneIndicaciones: true,
                tipoLlamada: 'megafono',
                monitorId: 'SALA_B'
            },
            {
                ordsrvnro: 'b7d00c85-376b-4bb9-8bb3-d3488e3b2702',
                hora: '10:30',
                nroTipo: '6-V',
                estado: 'PDE',
                estadoDescripcion: 'En espera',
                pacienteId: 5006,
                pacienteNombre: 'Carlos Ruiz',
                pacienteDocumento: 'C.I. 6.666.666-6',
                modalidad: 'Teleasistencia',
                edad: '40 años',
                esPrimerConsulta: false,
                datoClinico: 'seguimiento regular',
                tieneIndicaciones: true,
                tipoLlamada: 'telefono',
                monitorId: 'SALA_B'
            }
        ]
    };
}

export async function getInasistenciaData(token: string, ordsrvnro: string): Promise<InasistenciaDetail> {
    // En un futuro: GET /DetalleInasistencia?ordsrvnro={ordsrvnro}
    return {
        pacienteDocumento: "CI 3.333.333-3",
        pacienteNombre: "José Lopez",
        fechaHora: "27/06/2025 11:15",
        numero: "3N",
        modalidad: "Presencial",
        agenda: "PT1",
        servicio: "Traumatología",
        profesional: "Juan Perez"
    };
}

export async function confirmInasistencia(token: string, data: { ordsrvnro: string, observacion: string, password: string }): Promise<boolean> {
    console.log('[AgendaService] Confirming inasistencia:', data);
    // Simular validación de password (en mock aceptamos cualquier cosa > 3 chars)
    if (data.password.length < 3) throw new Error("Contraseña incorrecta");
    return true;
}

const scheduleService = {
    getAvailableAgendas,
    getAgenda,
    getInasistenciaData,
    confirmInasistencia
};

