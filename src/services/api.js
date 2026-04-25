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

// ----------------------------------------------------------
// getUserById
// ----------------------------------------------------------
// Obtiene la información fresca del usuario desde la BD.
// ----------------------------------------------------------
export async function getUserById(id) {
  const response = await fetch(`${end_points.users}/${id}`);

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al obtener datos del usuario");
  }

  return response.json();
}

// ----------------------------------------------------------
// registerUser
// ----------------------------------------------------------
// Crea un nuevo usuario y, si se seleccionó una imagen, la sube.
// Este es un proceso de dos pasos para mantener la consistencia.
// ----------------------------------------------------------
export async function registerUser(formData, file = null) {
  // 1. Preparar el payload para crear el usuario
  const payload = {
    username: formData.username,
    password: formData.password,
    profile: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      bio: formData.bio || null,
      birthDate: formData.birthDate || null,
      phoneNumber: formData.phoneNumber || null,
      status: "ACTIVE",
    },
  };

  // 2. Llamar al endpoint de creación de usuario
  const response = await fetch(end_points.users, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error al registrar usuario: ${response.status}`);
  }

  let user = await response.json();

  // 3. Si hay un archivo, subirlo usando el ID del perfil recién creado
  if (file && user.profile?.id) {
    const updatedProfile = await uploadProfilePicture(user.profile.id, file);
    // Actualizamos el objeto user local con la nueva URL de la imagen
    user.profile = updatedProfile;
  }

  return user;
}

// ----------------------------------------------------------
// uploadProfilePicture
// ----------------------------------------------------------
// Sube un archivo de imagen real al backend.
// Llama a: POST /api/userProfiles/{profileId}/upload-image
// ----------------------------------------------------------
export async function uploadProfilePicture(profileId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}userProfiles/${profileId}/upload-image`, {
    method: "POST",
    body: formData, // fetch configura automáticamente el Content-Type como multipart/form-data
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al subir la imagen");
  }

  return response.json();
}

// ----------------------------------------------------------
// getAllUsers
// ----------------------------------------------------------
// Obtiene la lista de todos los usuarios (solo Admin).
// ----------------------------------------------------------
export async function getAllUsers() {
  const response = await fetch(end_points.users);

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al obtener la lista de usuarios");
  }

  return response.json();
}

// ----------------------------------------------------------
// updateUserRole
// ----------------------------------------------------------
// Cambia el rol de un usuario (solo Admin).
// Llama a: PATCH /api/users/{id}/role
// ----------------------------------------------------------
export async function updateUserRole(userId, newRole) {
  const response = await fetch(`${end_points.users}/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al actualizar el rol");
  }

  return response.json();
}