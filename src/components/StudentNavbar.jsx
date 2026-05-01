import { useNavigate } from 'react-router-dom';
import '../styles/StudentNavbar.css';

/**
 * StudentNavbar - Barra de navegación exclusiva para la vista de estudiante.
 * NO reemplaza NavbarPpal, es un componente independiente.
 * Diseño inspirado en el concepto "Magmatic Path" generado por Stitch.
 * 
 * @param {Object} currentModule - El módulo actualmente seleccionado.
 * @param {number} currentIndex - Índice del módulo actual (0-based).
 * @param {number} totalModules - Total de módulos disponibles.
 */
const StudentNavbar = ({ currentModule, currentIndex, totalModules }) => {
  const navigate = useNavigate();

  return (
    <nav className="sn-navbar">
      <div className="sn-content">

        {/* Izquierda: Branding contextual */}
        <div className="sn-left">
          <span className="sn-flame">🌋</span>
          <span className="sn-brand">Módulos del Curso</span>
        </div>

        {/* Centro: Info del módulo actual */}
        <div className="sn-center">
          {currentModule && (
            <>
              <span className="sn-badge">
                Módulo {currentModule.content?.orderIndex || currentIndex + 1}
              </span>
              <h1 className="sn-module-name">
                {currentModule.content?.name || 'Sin título'}
              </h1>
            </>
          )}
        </div>

        {/* Derecha: Acciones */}
        <div className="sn-right">
          <div className="sn-progress-pill">
            <span className="sn-progress-text">
              {currentIndex + 1} / {totalModules}
            </span>
            <div className="sn-progress-bar">
              <div
                className="sn-progress-fill"
                style={{ width: `${totalModules > 0 ? ((currentIndex + 1) / totalModules) * 100 : 0}%` }}
              />
            </div>
          </div>
          <button
            className="sn-back-btn"
            onClick={() => navigate('/Course')}
            title="Volver al listado de cursos"
          >
            ← Volver al curso
          </button>
        </div>

      </div>
    </nav>
  );
};

export default StudentNavbar;
