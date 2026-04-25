// ============================================================
// PrivateRoute.jsx
// ------------------------------------------------------------
// Este componente protege las rutas que requieren sesión.
//
// ¿Cómo funciona?
//   1. Leemos el objeto "user" del localStorage.
//   2. Si NO existe → redirigimos al Login inmediatamente,
//      sin mostrar nada de la página privada.
//   3. Si SÍ existe → dejamos pasar al componente solicitado.
//
// ¿Por qué es necesario?
//   Sin esto, cualquier persona puede escribir "/layout" en
//   el navegador y entrar aunque nunca haya iniciado sesión.
// ============================================================

import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  // Intentamos leer el usuario guardado al momento del login
  const user = localStorage.getItem("user");

  // Si no hay usuario en localStorage → redirigir al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario → mostrar el componente solicitado
  return children;
}

export default PrivateRoute;
