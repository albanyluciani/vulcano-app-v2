// ============================================================
// VulcanoRegister.jsx
// ------------------------------------------------------------
// Este es el COMPONENTE PRINCIPAL del formulario de registro.
//
// ¿Qué es un componente?
//   Es un bloque reutilizable de React que tiene su propia
//   apariencia (JSX) y su propia lógica (JavaScript).
//
// ¿Qué hace este componente?
//   1. Muestra el formulario al usuario
//   2. Guarda lo que el usuario escribe (con useState)
//   3. Valida que los datos sean correctos
//   4. Llama al servicio para enviar los datos al API
//   5. Muestra mensajes de éxito o error
//   6. Redirige al dashboard si el registro fue exitoso
// ============================================================

// ----------------------------------------------------------
// IMPORTS (importaciones)
// ----------------------------------------------------------
// Importamos las "herramientas" que vamos a necesitar:
// ----------------------------------------------------------

// useState → nos permite guardar y actualizar datos dentro del componente
// (ej: lo que el usuario escribe en los inputs)
import { useState } from "react";

// useNavigate → nos permite cambiar de página programáticamente
// (ej: después de registrarse, ir al dashboard)
import { useNavigate } from "react-router-dom";

// Link → componente para crear enlaces entre páginas de React
// (como <a href> pero para React Router)
import { Link } from "react-router-dom";

// Importamos la función que creamos en userService.js
// para enviar los datos al API
import { registerUser } from "../services/userService";


// ----------------------------------------------------------
// COMPONENTE: VulcanoRegister
// ----------------------------------------------------------
const VulcanoRegister = () => {

  // --------------------------------------------------------
  // HOOK: useNavigate
  // --------------------------------------------------------
  // Creamos la función "navigate" que usaremos para
  // redirigir al usuario a otra página después del registro.
  // Ejemplo: navigate('/dashboard') → va al dashboard
  // --------------------------------------------------------
  const navigate = useNavigate();


  // --------------------------------------------------------
  // ESTADO 1: formData
  // --------------------------------------------------------
  // useState nos permite crear una "caja" para guardar datos.
  // formData → contiene todos los valores de los inputs
  // setFormData → es la función para actualizar esos valores
  //
  // Cada campo empieza vacío ("") para que el formulario
  // inicie sin datos prellenados.
  // --------------------------------------------------------
  const [formData, setFormData] = useState({
    // Campos de la entidad User
    username: "",
    password: "",
    confirmPassword: "", // Este campo NO va al API, solo sirve para validar

    // Campos de la entidad UserProfile
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",   // Opcional
    bio: "",           // Opcional
    profilePictureUrl: "", // Opcional
    birthDate: "",     // Opcional
  });


  // --------------------------------------------------------
  // ESTADO 2: error
  // --------------------------------------------------------
  // Aquí guardamos el mensaje de error que le mostramos
  // al usuario si algo sale mal.
  // Empieza en null (sin error).
  // --------------------------------------------------------
  const [error, setError] = useState(null);


  // --------------------------------------------------------
  // ESTADO 3: loading
  // --------------------------------------------------------
  // Nos indica si estamos esperando respuesta del API.
  // Cuando loading = true, mostramos un texto de carga
  // y desactivamos el botón para evitar múltiples envíos.
  // --------------------------------------------------------
  const [loading, setLoading] = useState(false);


  // --------------------------------------------------------
  // ESTADO 4: success
  // --------------------------------------------------------
  // Nos indica si el registro fue exitoso.
  // Cuando success = true, mostramos un mensaje de éxito.
  // --------------------------------------------------------
  const [success, setSuccess] = useState(false);


  // --------------------------------------------------------
  // FUNCIÓN: handleChange
  // --------------------------------------------------------
  // Esta función se ejecuta CADA VEZ que el usuario
  // escribe algo en cualquier input del formulario.
  //
  // PARÁMETRO:
  //   e → el "evento" del input (contiene info del campo)
  //
  // ¿Cómo funciona?
  //   1. Lee el "name" del input (ej: "username")
  //   2. Lee el "value" del input (lo que escribió el usuario)
  //   3. Actualiza solo ese campo en formData
  // --------------------------------------------------------
  const handleChange = (e) => {
    // Desestructuramos: sacamos name y value del evento
    const { name, value } = e.target;

    // Actualizamos formData:
    // "...formData" → copiamos todos los campos anteriores
    // [name]: value → actualizamos solo el campo que cambió
    setFormData({ ...formData, [name]: value });
  };


  // --------------------------------------------------------
  // FUNCIÓN: validateForm
  // --------------------------------------------------------
  // Revisa que los datos del formulario sean correctos
  // ANTES de enviarlos al API.
  //
  // RETORNA:
  //   null → si todo está bien (sin errores)
  //   string → el mensaje de error si algo está mal
  // --------------------------------------------------------
  const validateForm = () => {
    // Verificar que los campos obligatorios no estén vacíos
    // trim() elimina espacios en blanco al inicio y al final
    if (!formData.username.trim()) return "El nombre de usuario es obligatorio.";
    if (!formData.password.trim()) return "La contraseña es obligatoria.";
    if (!formData.confirmPassword.trim()) return "Debes confirmar tu contraseña.";
    if (!formData.firstName.trim()) return "El nombre es obligatorio.";
    if (!formData.lastName.trim()) return "El apellido es obligatorio.";
    if (!formData.email.trim()) return "El correo electrónico es obligatorio.";

    // Verificar que la contraseña y la confirmación sean iguales
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden. Por favor verifica.";
    }

    // Verificar que la contraseña tenga al menos 6 caracteres
    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    // Verificar formato básico de email (debe contener @ y un punto)
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      return "El correo electrónico no tiene un formato válido.";
    }

    // Si llegamos aquí, todo está bien → retornamos null (sin error)
    return null;
  };


  // --------------------------------------------------------
  // FUNCIÓN: handleSubmit
  // --------------------------------------------------------
  // Esta función se ejecuta cuando el usuario hace clic
  // en el botón "Crear cuenta" (submit del formulario).
  //
  // PARÁMETRO:
  //   e → el evento del formulario
  // --------------------------------------------------------
  const handleSubmit = async (e) => {
    // Evitamos que la página se recargue (comportamiento por
    // defecto del formulario HTML al hacer submit)
    e.preventDefault();

    // ---- Limpiar estados anteriores ----
    // Limpiamos cualquier error previo antes de intentar de nuevo
    setError(null);
    setSuccess(false);

    // ---- Validar el formulario ----
    const errorMessage = validateForm();

    // Si hay un error de validación → mostramos el error y PARAMOS
    if (errorMessage) {
      setError(errorMessage);
      return; // "return" detiene la ejecución de la función aquí
    }

    // ---- Intentar registrar el usuario ----
    // Activamos el estado de carga (mostramos "Registrando...")
    setLoading(true);

    // try/catch → intentamos hacer algo, y si falla lo "capturamos"
    try {
      // Llamamos a la función del servicio para enviar los datos al API
      // "await" → esperamos la respuesta antes de continuar
      await registerUser(formData);

      // Si llegamos aquí, el registro fue EXITOSO
      setSuccess(true);

      // Esperamos 2 segundos para que el usuario vea el mensaje
      // y luego lo redirigimos al dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // 2000 milisegundos = 2 segundos

    } catch (err) {
      // Si algo salió mal (error del API, sin conexión, etc.)
      // guardamos el mensaje de error para mostrárselo al usuario
      setError(err.message || "Ocurrió un error inesperado. Intenta de nuevo.");

    } finally {
      // "finally" siempre se ejecuta, haya éxito o error
      // Desactivamos el estado de carga
      setLoading(false);
    }
  };


  // --------------------------------------------------------
  // RETURN: Lo que se muestra en pantalla (JSX)
  // --------------------------------------------------------
  // JSX es la "mezcla" de HTML y JavaScript que usa React.
  // Todo lo que está aquí se convierte en HTML real en el
  // navegador.
  // --------------------------------------------------------
  return (
    // Contenedor que ocupa toda la pantalla
    // min-h-screen → altura mínima igual a la pantalla
    // bg-gray-950 → fondo casi negro (tema volcán)
    // flex flex-col items-center justify-center → centra el contenido
    // py-10 → padding vertical para que no quede pegado en móviles
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-10">

      {/* ---- TARJETA DEL FORMULARIO ---- */}
      {/* Caja blanca/oscura centrada que contiene el formulario */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg px-8 py-10 mx-4">

        {/* ---- ENCABEZADO ---- */}
        {/* Título y subtítulo del formulario */}
        <div className="text-center mb-8">
          {/* Emoji decorativo del volcán */}
          <div className="text-5xl mb-3">🌋</div>
          <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-gray-400 text-sm mt-2">
            Únete a la comunidad Vulcano
          </p>
        </div>


        {/* ---- MENSAJE DE ÉXITO ---- */}
        {/* Solo se muestra cuando success = true */}
        {success && (
          <div className="bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            ✅ ¡Cuenta creada exitosamente! Redirigiendo al dashboard...
          </div>
        )}

        {/* ---- MENSAJE DE ERROR ---- */}
        {/* Solo se muestra cuando hay un error (error !== null) */}
        {error && (
          <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            ❌ {error}
          </div>
        )}


        {/* ---- FORMULARIO ---- */}
        {/* onSubmit → llama a handleSubmit cuando el usuario hace submit */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ==================================================== */}
          {/* SECCIÓN: Datos de acceso (entidad User)               */}
          {/* ==================================================== */}
          <div>
            <h2 className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Datos de acceso
            </h2>

            {/* -- Campo: Nombre de usuario -- */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Nombre de usuario <span className="text-red-400">*</span>
              </label>
              {/* 
                name="username" → debe coincidir con la clave en formData
                value={formData.username} → muestra el valor actual
                onChange={handleChange} → llama a handleChange al escribir
              */}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ej: juanvolcano"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: Contraseña -- */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Contraseña <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: Confirmar Contraseña -- */}
            {/* Este campo NO se envía al API, solo sirve para validar */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Confirmar contraseña <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>


          {/* Línea separadora visual entre secciones */}
          <div className="border-t border-gray-700"></div>


          {/* ==================================================== */}
          {/* SECCIÓN: Datos del perfil (entidad UserProfile)        */}
          {/* ==================================================== */}
          <div>
            <h2 className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Datos del perfil
            </h2>

            {/* -- Fila: Nombre y Apellido (dos columnas en desktop) -- */}
            {/* grid grid-cols-2 → dos columnas iguales */}
            {/* gap-4 → espacio entre las columnas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* -- Campo: Nombre -- */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* -- Campo: Apellido -- */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Apellido <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* -- Campo: Email -- */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@correo.com"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: Teléfono (OPCIONAL) -- */}
            {/* La etiqueta NO tiene el asterisco rojo porque es opcional */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Teléfono{" "}
                <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Ej: +57 300 123 4567"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: Fecha de nacimiento (OPCIONAL) -- */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Fecha de nacimiento{" "}
                <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              {/* type="date" → muestra el selector de fecha del navegador */}
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: URL foto de perfil (OPCIONAL) -- */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                URL foto de perfil{" "}
                <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              <input
                type="url"
                name="profilePictureUrl"
                value={formData.profilePictureUrl}
                onChange={handleChange}
                placeholder="https://... (link de tu foto)"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* -- Campo: Bio (OPCIONAL) -- */}
            {/* textarea → cuadro de texto multi-línea */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                ¿A qué te dedicas?{" "}
                <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Cuéntanos un poco sobre ti..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              />
            </div>
          </div>


          {/* ---- BOTÓN DE ENVÍO ---- */}
          {/*
            disabled={loading} → desactiva el botón mientras carga
            para evitar que el usuario haga clic múltiples veces
          */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
          >
            {/* Mostramos texto diferente según si está cargando o no */}
            {loading ? "Registrando... ⏳" : "Crear cuenta 🌋"}
          </button>


          {/* ---- PIE DEL FORMULARIO ---- */}
          {/* Texto con enlace para ir al login si ya tiene cuenta */}
          <p className="text-center text-gray-400 text-sm mt-4">
            ¿Ya tienes una cuenta?{" "}
            {/* Link → navega a /Login sin recargar la página */}
            <Link
              to="/Login"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>

          {/* ---- TEXTO LEGAL ---- */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-center text-gray-500 text-xs">
              Al registrarte en Vulcano, aceptas nuestros{" "}
              <a href="#" className="text-orange-400 hover:underline">
                Términos
              </a>{" "}
              y{" "}
              <a href="#" className="text-orange-400 hover:underline">
                Política de privacidad
              </a>
              .
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VulcanoRegister;
