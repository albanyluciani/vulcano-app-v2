// ============================================================
// Layout.jsx
// ------------------------------------------------------------
// Página principal a la que llega el usuario después del login
// exitoso. Tiene tres zonas en el sidebar izquierdo:
//
//   ZONA SUPERIOR → Foto de perfil + nombre + username
//   ZONA MEDIA    → Botón "Cursos" (navega a /Course)
//   ZONA INFERIOR → "Modificar Perfil" y "Cerrar sesión"
//
// Los datos del usuario se leen de localStorage.
// Cuando el usuario hizo login, guardamos el objeto User
// completo que devolvió el backend. Aquí lo recuperamos.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Layout.css";
import EditProfileModal from "../../components/EditProfileModal";

const Layout = () => {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // PASO 1: Leer los datos del usuario desde localStorage
  // ----------------------------------------------------------
  // Al hacer login, guardamos: localStorage.setItem("user", JSON.stringify(userData))
  // Aquí recuperamos ese objeto para mostrar la info en el sidebar.
  //
  // JSON.parse  convierte el string guardado en un objeto JavaScript.
  // El "|| null" evita errores si por alguna razón el localStorage está vacío.
  // ----------------------------------------------------------
  const userRaw = localStorage.getItem("user");
  const user    = userRaw ? JSON.parse(userRaw) : null;

  // Extraemos los datos del perfil con valores por defecto (fallbacks)
  // por si algún campo está vacío o es null.
  const firstName  = user?.profile?.firstName       || "Usuario";
  const lastName   = user?.profile?.lastName        || "";
  const username   = user?.username                 || "";
  const profilePic = user?.profile?.profilePictureUrl || null;

  // ----------------------------------------------------------
  // PASO 2: Estado para mostrar/ocultar el modal de edición
  // ----------------------------------------------------------
  const [showEditModal, setShowEditModal] = useState(false);

  // ----------------------------------------------------------
  // handleLogout: Limpia la sesión y redirige al Login
  // ----------------------------------------------------------
  // localStorage.removeItem() borra la llave "user" del almacenamiento.
  // Después de eso, si el usuario intenta volver a /layout, verá los
  // datos como si fuera un desconocido (firstName = "Usuario").
  // ----------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  // ----------------------------------------------------------
  // handleProfileUpdated: Callback que llama el modal al guardar
  // ----------------------------------------------------------
  // Recibe el objeto User actualizado que devolvió el backend.
  // Lo guardamos en localStorage (reemplazando el anterior) y
  // recargamos la página para que el sidebar muestre los nuevos datos.
  // ----------------------------------------------------------
  const handleProfileUpdated = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
    // Recargamos para que el sidebar lea el nuevo localStorage
    window.location.reload();
  };

  return (
    <div className="layout-container">

      {/* ════════════════════════════════════════════════════
          SIDEBAR LATERAL IZQUIERDO
          ════════════════════════════════════════════════════ */}
      <aside className="layout-sidebar">

        {/* ── ZONA SUPERIOR: Foto y nombre del usuario ─── */}
        <div className="sidebar-profile">

          {/* Si el usuario tiene foto → mostramos la imagen.
              Si no tiene → mostramos un emoji de placeholder. */}
          {profilePic ? (
            <img
              src={profilePic}
              alt={`Foto de perfil de ${firstName}`}
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar-placeholder">👤</div>
          )}

          {/* Nombre completo */}
          <p className="sidebar-name">{firstName} {lastName}</p>

          {/* @ username */}
          <p className="sidebar-username">@{username}</p>
        </div>

        {/* ── ZONA MEDIA: Botones de navegación ────────── */}
        <nav className="sidebar-nav">
          {/* Botón "Cursos" → navega normalmente a /Course */}
          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">📚</span>
            Cursos
          </button>
        </nav>

        {/* ── ZONA INFERIOR: Acciones del perfil ─────── */}
        <div className="sidebar-footer">
          {/* Botón para abrir el modal de edición de perfil */}
          <button
            className="sidebar-footer-btn"
            onClick={() => setShowEditModal(true)}
          >
            <span>✏️</span>
            Modificar Perfil
          </button>

          {/* Botón para cerrar sesión */}
          <button
            className="sidebar-footer-btn danger"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════
          ÁREA MAIN — Mensaje de bienvenida + accesos rápidos
          ════════════════════════════════════════════════════ */}
      <main className="layout-main">

        {/* Ícono animado */}
        <div className="layout-welcome-icon">🌋</div>

        {/* Saludo personalizado con el nombre del usuario */}
        <h1 className="layout-welcome-title">
          ¡Bienvenido, {firstName}!
        </h1>

        <p className="layout-welcome-subtitle">
          Estás dentro del sistema Vulcano. Selecciona una opción
          del menú lateral para comenzar.
        </p>

        {/* Accesos rápidos — son clickeables igual que los botones del sidebar */}
        <div className="layout-action-cards">

          {/* Tarjeta: ir a Cursos */}
          <div
            className="layout-action-card"
            onClick={() => navigate("/Course")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/Course")}
          >
            <span className="layout-action-card-icon">📚</span>
            <span className="layout-action-card-title">Cursos</span>
          </div>

          {/* Tarjeta: abrir edición de perfil */}
          <div
            className="layout-action-card"
            onClick={() => setShowEditModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowEditModal(true)}
          >
            <span className="layout-action-card-icon">✏️</span>
            <span className="layout-action-card-title">Mi Perfil</span>
          </div>

        </div>
      </main>

      {/* ════════════════════════════════════════════════════
          MODAL DE EDICIÓN DE PERFIL
          Solo se renderiza cuando showEditModal === true
          y cuando tenemos datos del usuario disponibles.
          ════════════════════════════════════════════════════ */}
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProfileUpdated}
        />
      )}

    </div>
  );
};

export default Layout;
