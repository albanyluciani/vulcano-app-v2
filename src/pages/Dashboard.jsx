// ============================================================
// Dashboard.jsx
// ------------------------------------------------------------
// Esta es una página PLACEHOLDER (temporal/de relleno).
// Un "placeholder" es algo que ponemos mientras construimos
// la versión real. En este caso, el dashboard completo
// aún no está construido, pero lo necesitamos para que
// cuando el usuario se registre, tenga a dónde ir.
// ============================================================

const Dashboard = () => {
  return (
    // Contenedor principal que ocupa toda la pantalla
    // bg-gray-900 = fondo gris muy oscuro (igual que el login)
    // text-white = texto blanco
    // flex flex-col items-center justify-center = centra el contenido
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">

      {/* Icono decorativo (un emoji de volcán para mantener el tema) */}
      <div className="text-8xl mb-6">🌋</div>

      {/* Título principal */}
      <h1 className="text-4xl font-bold text-orange-400 mb-4">
        ¡Bienvenido al Dashboard!
      </h1>

      {/* Mensaje de que esta sección está en construcción */}
      <p className="text-gray-400 text-lg">
        Esta sección está en construcción. Vuelve pronto 🔧
      </p>
    </div>
  );
};

export default Dashboard;
