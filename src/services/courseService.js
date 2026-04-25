/**
 * SERVICIO DE CURSOS (Course API Service)
 * Este archivo centraliza todas las comunicaciones HTTP (AJAX) entre el 
 * Frontend (React) y el Backend (Spring Boot). 
 * Se encarga de hacer las peticiones usando la API Fetch estándar de JS.
 */

// URL relativa: el proxy de Vite redirige /api/* a localhost:8080
// Esto evita el error de CORS y permite que el proyecto funcione
// en cualquier servidor, no solo en localhost.
const API = "/api/courses";

/**
 * [READ] Obtiene la lista completa de cursos.
 * @returns {Promise<Array>} Retorna una Promesa que contiene el arreglo de cursos.
 */
export const getCourses = async () => {
  const res = await fetch(API); // Por defecto fetch hace un GET
  if (!res.ok) throw new Error("Error backend al obtener cursos");
  return await res.json();      // Convierte el texto JSON a objetos JavaScript
};

/**
 * [CREATE] Crea un nuevo curso en la base de datos.
 * @param {Object} course - Objeto con los datos del formulario.
 * @returns {Promise<Object>} Promesa con el curso ya guardado incluyendo su nuevo ID.
 */
export const createCourse = async (course) => {
  const res = await fetch(API, {
    method: 'POST', // Usamos POST para crear
    headers: { 'Content-Type': 'application/json' }, // Indicamos que mandamos un JSON
    body: JSON.stringify(course) // Transformamos el objeto JS a una cadena de texto JSON
  });
  if (!res.ok) throw new Error("Error al crear curso");
  return await res.json();
};

/**
 * [UPDATE] Actualiza un curso existente.
 * @param {Number} id - El ID real del curso a modificar.
 * @param {Object} course - Los nuevos datos a guardar.
 */
export const updateCourse = async (id, course) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT', // PUT se usa convencionalmente para actualizaciones completas
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error("Error al actualizar curso");
  return await res.json();
};

/**
 * [DELETE] Borra físicamente un curso por su ID.
 * @param {Number} id - ID numérico del curso a eliminar.
 */
export const deleteCourse = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE' // Le indicamos al servidor que la acción es destructiva
  });
  if (!res.ok) throw new Error("Error al eliminar curso");
  return true;
};