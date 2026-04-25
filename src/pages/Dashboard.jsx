import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import EditProfileModal from "../components/EditProfileModal";

const Dashboard = () => {
  const navigate = useNavigate();

  // Recuperamos el usuario de localStorage
  const [user, setUser] = useState(() => {
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  });

  const firstName = user?.profile?.firstName || "Usuario";
  const [showEditModal, setShowEditModal] = useState(false);

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
  };

  return (
    <Layout>
      <div className="layout-main">
        <div className="layout-welcome-icon">🌋</div>
        <h1 className="layout-welcome-title">¡Bienvenido, {firstName}!</h1>
        <p className="layout-welcome-subtitle">
          Estás dentro del sistema Vulcano. Selecciona una opción del menú
          lateral para comenzar.
        </p>

        <div className="layout-action-cards">
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
      </div>

      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProfileUpdated}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
