export interface AgendaInfo {
    agendaId: number;
    descripcion: string;
    especialidad: string;
    coordinados: string;
}

export interface Cita {
    citaId: number;
    hora: string;
    nroTipo: string;
    estado: 'espera' | 'asistio' | 'inasistio' | 'no_anunciado';
    estadoDescripcion: string;
    pacienteId: number;
    pacienteNombre: string;
    pacienteDocumento: string;
    modalidad: string;
    edad: string;
    esPrimerConsulta: boolean;
    datoClinico: string;
    tieneIndicaciones: boolean;
    puedeLlamar: boolean;
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

export const agendaService = {
    async getAvailableAgendas(token: string): Promise<AgendaInfo[]> {
        // En un futuro: GET /AgendasDisponibles
        return [
            {
                agendaId: 1001,
                descripcion: 'PT1 Hora Inicio: 11:00',
                especialidad: 'Traumatología',
                coordinados: '5 Normales / 1 Sobrante'
            },
            {
                agendaId: 1002,
                descripcion: 'PT2 Hora Inicio: 14:00',
                especialidad: 'Traumatología',
                coordinados: '3 Normales / 0 Sobrante'
            }
        ];
    },

    async getAgenda(token: string, agendaId: number): Promise<AgendaResponse> {
        // En un futuro: GET /AgendaDia?agendaId={agendaId}

        // Mock data logic based on agendaId
        if (agendaId === 1002) {
            return {
                resumen: { asistencias: 0, sinAnunciar: 1, enEspera: 1, inasistencias: 0 },
                citas: [
                    {
                        citaId: 201,
                        hora: '14:00',
                        nroTipo: '1-P',
                        estado: 'espera',
                        estadoDescripcion: 'En espera',
                        pacienteId: 6001,
                        pacienteNombre: 'Laura Sosa',
                        pacienteDocumento: 'C.I. 8.888.888-8',
                        modalidad: 'Presencial',
                        edad: '29 años',
                        esPrimerConsulta: false,
                        datoClinico: 'dolor rodilla',
                        tieneIndicaciones: false,
                        puedeLlamar: true,
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
                    citaId: 101,
                    hora: '09:00',
                    nroTipo: '1-P',
                    estado: 'espera',
                    estadoDescripcion: 'En espera',
                    pacienteId: 5001,
                    pacienteNombre: 'Juan Perez',
                    pacienteDocumento: 'C.I. 1.111.111-1',
                    modalidad: 'Presencial',
                    edad: '45 años',
                    esPrimerConsulta: true,
                    datoClinico: 'dolor abdominal cronico',
                    tieneIndicaciones: true,
                    puedeLlamar: true,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_A'
                },
                {
                    citaId: 102,
                    hora: '09:15',
                    nroTipo: '2 N',
                    estado: 'asistio',
                    estadoDescripcion: 'Asistió',
                    pacienteId: 5002,
                    pacienteNombre: 'Maria Dominguez',
                    pacienteDocumento: 'C.I. 2.222.222-2',
                    modalidad: 'Presencial',
                    edad: '36 años',
                    esPrimerConsulta: false,
                    datoClinico: 'control post-op',
                    tieneIndicaciones: true,
                    puedeLlamar: true,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_B'
                },
                {
                    citaId: 103,
                    hora: '09:45',
                    nroTipo: '3-I',
                    estado: 'inasistio',
                    estadoDescripcion: 'Inasistencia',
                    pacienteId: 5003,
                    pacienteNombre: 'Jose Rodriguez',
                    pacienteDocumento: 'C.I. 3.333.333-3',
                    modalidad: 'Presencial',
                    edad: '62 años',
                    esPrimerConsulta: false,
                    datoClinico: 'hipertension',
                    tieneIndicaciones: false,
                    puedeLlamar: true,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_A'
                },
                {
                    citaId: 104,
                    hora: '10:00',
                    nroTipo: '4-E',
                    estado: 'no_anunciado',
                    estadoDescripcion: 'Sin anunciar',
                    pacienteId: 5004,
                    pacienteNombre: 'Roberto Garcia',
                    pacienteDocumento: 'C.I. 4.444.444-4',
                    modalidad: 'Presencial',
                    edad: '55 años',
                    esPrimerConsulta: false,
                    datoClinico: '',
                    tieneIndicaciones: false,
                    puedeLlamar: true,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_A'
                },
                {
                    citaId: 105,
                    hora: '10:15',
                    nroTipo: '5-P',
                    estado: 'espera',
                    estadoDescripcion: 'En espera',
                    pacienteId: 5005,
                    pacienteNombre: 'Ana Lopez',
                    pacienteDocumento: 'C.I. 5.555.555-5',
                    modalidad: 'Presencial',
                    edad: '22 años',
                    esPrimerConsulta: true,
                    datoClinico: 'primera vez cardiologia',
                    tieneIndicaciones: true,
                    puedeLlamar: true,
                    tipoLlamada: 'megafono',
                    monitorId: 'SALA_B'
                },
                {
                    citaId: 106,
                    hora: '10:30',
                    nroTipo: '6-V',
                    estado: 'espera',
                    estadoDescripcion: 'En espera',
                    pacienteId: 5006,
                    pacienteNombre: 'Carlos Ruiz',
                    pacienteDocumento: 'C.I. 6.666.666-6',
                    modalidad: 'Teleasistencia',
                    edad: '40 años',
                    esPrimerConsulta: false,
                    datoClinico: 'seguimiento regular',
                    tieneIndicaciones: true,
                    puedeLlamar: true,
                    tipoLlamada: 'telefono',
                    monitorId: 'SALA_B'
                }
            ]
        };
    },

    async getInasistenciaData(token: string, citaId: number): Promise<InasistenciaDetail> {
        // En un futuro: GET /DetalleInasistencia?citaId={citaId}
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
    },

    async confirmInasistencia(token: string, data: { citaId: number, observacion: string, password: string }): Promise<boolean> {
        console.log('[AgendaService] Confirming inasistencia:', data);
        // Simular validación de password (en mock aceptamos cualquier cosa > 3 chars)
        if (data.password.length < 3) throw new Error("Contraseña incorrecta");
        return true;
    }
};
