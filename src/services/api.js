// ============================================================
// api.js
// ------------------------------------------------------------
// Funciones centrales para hablar con el backend.
// Todas las llamadas HTTP del proyecto de auth pasan por aquí.
// ============================================================

// URL relativa: Vite intercepta /api/* y lo redirige a localhost:8080
// Esto evita el error de CORS en desarrollo
const API_BASE_URL = "/api/";

// Objeto con todos los endpoints del backend
export const end_points = {
  users: `${API_BASE_URL}users`,
  login: `${API_BASE_URL}auth/login`,
};

// ----------------------------------------------------------
// loginUser
// ----------------------------------------------------------
// Envía las credenciales al backend.
// ANTES: el backend devolvía texto plano ("Login exitoso")
// AHORA: el backend devuelve el objeto User completo en JSON
//         { id, username, password, profile: { firstName, ... } }
// ----------------------------------------------------------
export async function loginUser(username, password) {
  const response = await fetch(end_points.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    // El backend devuelve el motivo del error como texto (ej: "Contraseña incorrecta")
    const errorMsg = await response.text();
    throw new Error(errorMsg);
  }

  // El backend ahora devuelve el objeto User en JSON — lo parseamos y retornamos
  return response.json();
}

// ----------------------------------------------------------
// updateUser
// ----------------------------------------------------------
// Envía los datos actualizados del perfil al backend.
// Llama a: PUT /api/users/{id}
//
// PARÁMETROS:
//   id      → ID del usuario a actualizar (número)
//   payload → objeto con la nueva info: { username, password, profile: { ... } }
//
// RETORNA:
//   El objeto User actualizado completo (con su perfil)
// ----------------------------------------------------------
export async function updateUser(id, payload) {
  const response = await fetch(`${end_points.users}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al actualizar el perfil");
  }

  // Retornamos el usuario actualizado
  return response.json();
}