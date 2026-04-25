import React, { useState } from 'react';
import NavbarPpal from '../components/NavbarPpal';
import VulcanoFooter from '../components/VulcanoFooter';

const Review = () => {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : null;

  const firstName = user?.profile?.firstName || 'Usuario';
  const lastName = user?.profile?.lastName || '';
  const username = user?.username || '';
  const profilePic = user?.profile?.profilePictureUrl || null;

  const [showEditModal, setShowEditModal] = useState(false);

  // ========== ESTADOS (States) ==========
  // Almacena el nombre del usuario que escribe la review
  const [usuario, setUsuario] = useState("");

  // Almacena el texto del comentario/opinión del usuario
  const [comentario, setComentario] = useState("");

  // Almacena el tipo de experiencia seleccionada (Excelente, Buena, Neutral, Mejorable)
  const [tipo, setTipo] = useState("");

  // Array que almacena todas las reviews enviadas por los usuarios
  const [reviews, setReviews] = useState([]);

  // ========== FUNCIÓN: MANEJAR ENVÍO DEL FORMULARIO ==========
  // Se ejecuta cuando el usuario clickea el botón "Enviar Review"
  const manejarEnvio = (e) => {
    // Previene que la página se recargue al enviar el formulario
    e.preventDefault();

    // Validación: Verifica que todos los campos estén completos
    // Si alguno está vacío, muestra una alerta y detiene la ejecución
    if (!usuario || !comentario || !tipo) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
        icon: "warning",
        confirmButtonColor: "#472825",
        background: "#fff4e2",
        color: "#472825"
      });
      return;
    }

    // Crea un objeto con los datos de la nueva review
    // Date.now() genera un ID único basado en la fecha/hora actual
    const nuevaReview = {
      id: Date.now(),           // ID único para cada review
      usuario,                  // Nombre del usuario
      comentario,               // Texto del comentario
      tipo                      // Tipo de experiencia
    };

    // Agrega la nueva review al array usando spread operator (...)
    // Esto crea un nuevo array con todas las reviews anteriores + la nueva
    setReviews([...reviews, nuevaReview]);

    // Limpia todos los campos del formulario para que el usuario pueda escribir otra review
    setUsuario("");
    setComentario("");
    setTipo("");
  };

  // ========== FUNCIÓN: ELIMINAR UNA REVIEW ==========
  // Se ejecuta cuando el usuario clickea el botón "Eliminar" en una tarjeta de review
  // Recibe el ID de la review a eliminar
  const eliminarReview = (id) => {
    // Filter crea un nuevo array sin la review que tiene el ID coincidente
    // Sólo mantiene las reviews donde el ID no coincide con el ID a eliminar
    const nuevas = reviews.filter(r => r.id !== id);

    // Actualiza el estado con el nuevo array (sin la review eliminada)
    setReviews(nuevas);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/Login');
  };

  const handleProfileUpdated = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowEditModal(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF4E2]">
      {/* Barra de navegación superior */}
      <NavbarPpal />
      
      {/* Contenedor principal */}
      <div className="flex-1 max-w-4xl mx-auto py-12 px-4 w-full">
        {/* Título principal de la página */}
        <h1 className="text-4xl font-bold text-center text-[#472825] mb-12">
          📝 Comparte tu Experiencia
        </h1>

        {/* ========== FORMULARIO DE ENVÍO DE REVIEW ========== */}
        <form onSubmit={manejarEnvio} className="bg-[#FFF4E2] p-8 rounded-lg border-2 border-[#D3ABB0] shadow-md mb-12">

          {/* ===== CAMPO 1: NOMBRE DEL USUARIO ===== */}
          <div className="mb-6">
            {/* Etiqueta para el campo de nombre */}
            <label htmlFor="usuario" className="block font-semibold text-[#472825] mb-2 text-lg">
              Tu nombre
            </label>

            {/* Campo de entrada de texto:
                - value={usuario}: vincula el valor del input con el estado 'usuario'
                - onChange: se ejecuta cada vez que el usuario escribe, actualizando el estado
                - htmlFor/id: conectan la etiqueta con el input para mejor accesibilidad
            */}
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu nombre"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-3 border-2 border-[#D3ABB0] rounded-lg text-[#472825] bg-[#FFF4E2] focus:outline-none focus:border-[#96786F] focus:ring-2 focus:ring-[#96786F] focus:ring-opacity-30"
            />
          </div>

          {/* ===== CAMPO 2: COMENTARIO/OPINIÓN ===== */}
          <div className="mb-6">
            {/* Etiqueta para el textarea */}
            <label htmlFor="comentario" className="block font-semibold text-[#472825] mb-2 text-lg">
              Tu comentario
            </label>

            {/* Área de texto para comentarios largos:
                - Similar al input pero permite múltiples líneas
                - min-h-32: altura mínima de 32 unidades
                - resize-none: impide que el usuario redimensione el textarea
            */}
            <textarea
              id="comentario"
              placeholder="Comparte tu experiencia y opinión..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-3 border-2 border-[#D3ABB0] rounded-lg text-[#472825] bg-[#FFF4E2] focus:outline-none focus:border-[#96786F] focus:ring-2 focus:ring-[#96786F] focus:ring-opacity-30 min-h-32 resize-none"
            ></textarea>
          </div>

          {/* ===== CAMPO 3: SELECTOR DE EXPERIENCIA ===== */}
          <div className="mb-6">
            {/* Etiqueta para el selector */}
            <label htmlFor="tipo" className="block font-semibold text-[#472825] mb-2 text-lg">
              ¿Cómo fue tu experiencia?
            </label>

            {/* Dropdown/Select para elegir el tipo de experiencia:
                - Muestra 4 opciones predefinidas con emojis
                - El usuario solo puede seleccionar una
                - onChange actualiza el estado 'tipo' con la opción seleccionada
            */}
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-3 border-2 border-[#D3ABB0] rounded-lg text-[#472825] bg-[#FFF4E2] focus:outline-none focus:border-[#96786F] focus:ring-2 focus:ring-[#96786F] focus:ring-opacity-30"
            >
              <option value="">Selecciona una opción</option>
              <option value="⭐ AGRADABLE">⭐ Agradable</option>
              <option value="😊 DESAFIANTE">😊 Desafíante</option>
              <option value="😐 NEUTRAL">😐 Neutral</option>
              <option value="😞 DESAGRADABLE">😞 Desagradable</option>
            </select>
          </div>

          {/* ===== BOTÓN DE ENVÍO ===== */}
          {/* Cuando se clickea:
              1. Se ejecuta manejarEnvio (e)
              2. Valida que los campos no estén vacíos
              3. Crea un objeto con los datos
              4. Lo agrega al array de reviews
              5. Limpia los campos del formulario
          */}
          <button
            type="submit"
            className="w-full bg-[#472825] text-[#FFF4E2] py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#96786F] transition-colors duration-300 active:transform active:scale-95"
          >
            Enviar Review
          </button>
        </form>

        {/* ========== SECCIÓN DE VISUALIZACIÓN DE REVIEWS ======si==== */}
        <div>
          {/* Condicional: Si hay reviews, mostrar la lista; si no, mostrar mensaje */}
          {reviews.length > 0 ? (
            <div className="grid gap-5">
              {/* Map: Itera sobre cada review del array y crea una tarjeta para cada una */}
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#FFF4E2] border-2 border-[#D3ABB0] rounded-lg p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* ===== NOMBRE DEL USUARIO ===== */}
                  <div className="text-xl font-bold text-[#472825] mb-3">
                    👤 {r.usuario}
                  </div>

                  {/* ===== TEXTO DEL COMENTARIO ===== */}
                  <p className="text-[#96786F] leading-relaxed mb-4">
                    "{r.comentario}"
                  </p>

                  {/* ===== PIE DE LA TARJETA: TIPO + BOTÓN ELIMINAR ===== */}
                  <div className="flex justify-between items-center">
                    {/* Badge/Etiqueta mostrando el tipo de experiencia */}
                    <span className="inline-block bg-[#FDE4BC] text-[#472825] px-4 py-2 rounded-full text-sm font-semibold">
                      {r.tipo}
                    </span>

                    {/* ===== BOTÓN ELIMINAR ===== */}
                    {/* Cuando se clickea:
                        1. Se ejecuta eliminarReview(r.id)
                        2. Filtra el array removiendo la review con ese ID
                        3. Actualiza el estado de reviews
                    */}
                    <button
                      onClick={() => eliminarReview(r.id)}
                      className="bg-[#D3ABB0] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#96786F] transition-colors duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mensaje cuando no hay reviews aún */
            <div className="text-center text-[#96786F] py-12 text-lg">
              ℹ️ No hay reviews aún. ¡Sé el primero en dejar tu comentario!
            </div>
          )}
        </div>
      </div>

      {/* Footer de la página */}
      <VulcanoFooter />
    </div>
  );
};

export default Review;
