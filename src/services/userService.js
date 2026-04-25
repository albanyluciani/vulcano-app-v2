// ============================================================
// userService.js
// ------------------------------------------------------------
// ⚠️ ESTE ARCHIVO YA NO CONTIENE LÓGICA PROPIA.
//
// Toda la lógica de usuarios está centralizada en api.js
// para evitar duplicación de código.
//
// Si necesitas funciones de usuario, importa desde api.js:
//   import { registerUser, loginUser, getUserById } from "./api";
//
// Este archivo se conserva por si alguna parte del proyecto
// lo importa en el futuro, pero sus funciones solo delegan
// a las funciones reales de api.js.
// ============================================================

export { registerUser, loginUser, getUserById, updateUser } from "./api";
