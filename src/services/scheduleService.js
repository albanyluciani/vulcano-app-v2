/**
 * SERVICIO DE HORARIOS (Schedule API Service)
 * Este archivo centraliza las peticiones CRUD para las clases/horarios.
 */

const API_BASE_URL = "/api/schedules";

/**
 * Obtiene todos los horarios (la lista completa para gestión).
 * @returns {Promise<Array>}
 */
export const getAllSchedules = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Error al obtener los horarios");
    return await response.json();
};

/**
 * Obtiene horarios disponibles de un profesor/experto (PARA LOS ALUMNOS).
 * @param {number|string} expertId
 * @returns {Promise<Array>}
 */
export const getAvailableSchedules = async (expertId) => {
    const response = await fetch(`${API_BASE_URL}/available/${expertId}`);
    if (!response.ok) throw new Error("Error al obtener disponibilidad");
    return await response.json();
};

/**
 * Obtiene clases de un estudiante específico (ya agendadas).
 * @param {number|string} studentId
 * @returns {Promise<Array>}
 */
export const getSchedulesByStudent = async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`);
    if (!response.ok) throw new Error("Error al obtener los horarios del estudiante");
    return await response.json();
};

// ----------------------------------------------------------
// Tarea 13: se separó la función createSchedule (que antes
// cambiaba de comportamiento según cuántos argumentos recibía)
// en DOS funciones con nombres claros y responsabilidad única.
//
// ANTES: createSchedule(arg1, arg2) — confuso
// AHORA: createAvailability(formData) — para el docente
//        bookSchedule(studentId, data) — para el alumno
// ----------------------------------------------------------

/**
 * [DOCENTE] Crea un nuevo bloque de disponibilidad (horario disponible).
 * Lo usa el docente/admin para publicar sus horas disponibles.
 * @param {Object} formData - Datos del horario a crear
 * @returns {Promise<Object>}
 */
export const createAvailability = async (formData) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error("Error al crear la disponibilidad");
    return await response.json();
};

/**
 * [ALUMNO] Reserva (agenda) una clase para un estudiante específico.
 * Lo usa el alumno para agendar una clase con un docente.
 * @param {number} studentId - ID del estudiante que agenda
 * @param {Object} scheduleData - Datos de la clase a agendar
 * @returns {Promise<Object>}
 */
export const bookSchedule = async (studentId, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
    });
    if (!response.ok) throw new Error("Error al agendar la clase");
    return await response.json();
};

/**
 * Actualiza una clase existente.
 * @param {number} id
 * @param {Object} scheduleData
 */
export const updateSchedule = async (id, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
    });
    if (!response.ok) throw new Error("Error al actualizar el horario");
    return await response.json();
};

/**
 * Elimina una clase/registro por ID.
 * @param {number} id
 */
export const deleteSchedule = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Error al eliminar el horario");
    return true;
};
