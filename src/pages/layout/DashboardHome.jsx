import { useNavigate, useOutletContext } from "react-router-dom";

const DashboardHome = () => {
  const navigate = useNavigate();
  // Recibimos las propiedades que Layout nos pasa a través del Outlet
  const { setShowEditModal, firstName } = useOutletContext();

  return (
    <>
      {/* Ícono animado */}
      <div className="layout-welcome-icon">🌋</div>

      {/* Saludo personalizado con el nombre del usuario */}
      <h1 className="layout-welcome-title">¡Bienvenido, {firstName}!</h1>

      <p className="layout-welcome-subtitle">
        Estás dentro del sistema Vulcano. Selecciona una opción del menú lateral para comenzar.
      </p>

      {/* Accesos rápidos — son clickeables igual que los botones del sidebar */}
      <div className="layout-action-cards">
        {/* Tarjeta: ir a Cursos */}
        <div
          className="layout-action-card"
          onClick={() => navigate("/layout/Course")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/layout/Course")}
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
    </>
  );
};

export default DashboardHome;
