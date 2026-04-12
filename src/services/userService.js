// ============================================================
// userService.js
// ------------------------------------------------------------
// Este archivo contiene la LÓGICA para hablar con el API.
// Es como un "mensajero" entre nuestro formulario y el servidor.
//
// ¿Qué es el API?
//   Es el backend (Spring Boot) que corre en localhost:8080.
//   Cuando queremos guardar un usuario, le enviamos los datos
//   al API y él los guarda en la base de datos.
// ============================================================


// ----------------------------------------------------------
// CONSTANTE: URL BASE DEL API
// ----------------------------------------------------------
// Aquí guardamos la dirección principal del API.
// Si algún día cambia el puerto o el dominio, solo lo
// cambiamos en esta línea y todo lo demás sigue funcionando.
// ----------------------------------------------------------
// URL relativa: Vite intercepta /api/* y lo redirige a localhost:8080 (sin CORS)
const API_BASE_URL = "/api";


// ----------------------------------------------------------
// FUNCIÓN: registerUser
// ----------------------------------------------------------
// Esta función recibe los datos del formulario y los envía
// al API para crear un nuevo usuario.
//
// PARÁMETRO:
//   formData → objeto con todos los campos que llenó el usuario
//
// RETORNA:
//   La respuesta del servidor (el usuario creado en JSON)
//   O lanza un error si algo salió mal
// ----------------------------------------------------------
export const registerUser = async (formData) => {

  // --------------------------------------------------------
  // PASO 1: Construir el "payload"
  // --------------------------------------------------------
  // El payload es el objeto de datos que le vamos a enviar
  // al API. Debe seguir exactamente la estructura que espera
  // el backend (las entidades User + UserProfile).
  //
  // Estructura esperada por el backend:
  // {
  //   username: "...",
  //   password: "...",
  //   profile: {
  //     firstName: "...",
  //     lastName: "...",
  //     email: "...",
  //     phoneNumber: "...",     // opcional
  //     bio: "...",             // opcional
  //     profilePictureUrl: "...", // opcional
  //     birthDate: "...",       // opcional (formato: YYYY-MM-DD)
  //   }
  // }
  // --------------------------------------------------------
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
      // URL de la foto: se recibe como string Base64 desde el frontend
      profilePictureUrl: formData.profilePictureUrl || null,
      // status es requerido por el backend (ACTIVE por defecto para nuevos usuarios)
      status: "ACTIVE",
    },
  };

  // --------------------------------------------------------
  // PASO 2: Enviar los datos al API con fetch()
  // --------------------------------------------------------
  // fetch() es una función nativa de JavaScript que nos
  // permite hacer peticiones HTTP (hablar con servidores).
  //
  // Usamos "await" porque fetch() tarda un tiempo en
  // conectarse al servidor y necesitamos esperar su respuesta
  // antes de continuar con el código.
  // --------------------------------------------------------
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",           // POST = estamos CREANDO un recurso nuevo
    headers: {
      // Le decimos al servidor que le enviamos datos en formato JSON
      "Content-Type": "application/json",
    },
    // body: aquí van los datos. JSON.stringify convierte el
    // objeto JS a texto JSON que el servidor puede leer.
    body: JSON.stringify(payload),
  });

  // --------------------------------------------------------
  // PASO 3: Revisar si el servidor respondió con un error
  // --------------------------------------------------------
  // response.ok es true si el estado HTTP es 200-299 (éxito)
  // Si el servidor devuelve 400, 500, etc. → response.ok es false
  // --------------------------------------------------------
  if (!response.ok) {
    // Intentamos leer el mensaje de error que envió el servidor
    const errorData = await response.json().catch(() => null);

    // Lanzamos un error con el mensaje del servidor, o uno genérico
    throw new Error(
      errorData?.message || `Error del servidor: ${response.status}`
    );
  }

  // --------------------------------------------------------
  // PASO 4: Devolver la respuesta exitosa
  // --------------------------------------------------------
  // response.json() convierte la respuesta del servidor
  // de texto JSON a un objeto JavaScript normal.
  // --------------------------------------------------------
  const data = await response.json();
  return data;
};


// ----------------------------------------------------------
// FUNCIÓN: loginUser
// ----------------------------------------------------------
// Esta función recibe el username y password del formulario
// y los envía al API para verificar si el usuario existe.
//
// PARÁMETROS:
//   username → el nombre de usuario que escribió el usuario
//   password → la contraseña que escribió el usuario
//
// RETORNA:
//   La respuesta del servidor si el login fue correcto
//   O lanza un error si el usuario/contraseña son incorrectos
// ----------------------------------------------------------
export const loginUser = async (username, password) => {

  // --------------------------------------------------------
  // PASO 1: Construir el payload
  // --------------------------------------------------------
  // El payload es el objeto que le enviamos al backend.
  // El backend espera exactamente: { username, password }
  // --------------------------------------------------------
  const payload = {
    username: username,
    password: password,
  };

  // --------------------------------------------------------
  // PASO 2: Hacer la petición POST al endpoint de login
  // --------------------------------------------------------
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",          // POST = estamos enviando datos
    headers: {
      // Le decimos al servidor que enviamos datos en formato JSON
      "Content-Type": "application/json",
    },
    // Convertimos el objeto JS a texto JSON para enviarlo
    body: JSON.stringify(payload),
  });

  // --------------------------------------------------------
  // PASO 3: Revisar si el servidor respondió con error
  // --------------------------------------------------------
  // response.ok es true si el status es 200-299
  // Si el login falla (usuario/contraseña incorrectos),
  // el servidor responde con 401 y response.ok será false
  // --------------------------------------------------------
  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  // --------------------------------------------------------
  // PASO 4: Devolver la respuesta exitosa
  // --------------------------------------------------------
  // Si el backend devuelve JSON (ej: token o datos del usuario),
  // lo convertimos a objeto JS. Si no devuelve nada, usamos {}.
  // --------------------------------------------------------
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return data;
};
