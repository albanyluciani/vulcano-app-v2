// ============================================================
// VulcanoRegister.jsx
// ------------------------------------------------------------
// Layout de DOS COLUMNAS en desktop para evitar scroll.
// La foto de perfil se convierte a Base64 con FileReader
// y se envía como string al campo profilePictureUrl del backend.
// ============================================================

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import Swal from "sweetalert2";

const VulcanoRegister = () => {
  const navigate  = useNavigate();
  const fileRef   = useRef(null); // referencia al input[type=file] oculto

  const [formData, setFormData] = useState({
    username:        "",
    password:        "",
    confirmPassword: "",
    firstName:       "",
    lastName:        "",
    email:           "",
    phoneNumber:     "",
    bio:             "",
    birthDate:       "",
  });

  // Vista previa local (Object URL)
  const [preview, setPreview] = useState(null);
  // Archivo real para subir al servidor
  const [selectedFile, setSelectedFile] = useState(null);

  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Manejador de texto / fecha / etc. ─────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Manejador de imagen ───────────────────────────────────
  // Convierte el archivo seleccionado a Base64 y guarda en formData
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }

    // Validar tamaño: máximo 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar los 2 MB.");
      return;
    }

    setError(null);

    // Generamos la vista previa rápida (URL de objeto local)
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Validación ────────────────────────────────────────────
  const validateForm = () => {
    if (!formData.username.trim())        return "El nombre de usuario es obligatorio.";
    if (!formData.password.trim())        return "La contraseña es obligatoria.";
    if (!formData.confirmPassword.trim()) return "Debes confirmar tu contraseña.";
    if (!formData.firstName.trim())       return "El nombre es obligatorio.";
    if (!formData.lastName.trim())        return "El apellido es obligatorio.";
    if (!formData.email.trim())           return "El correo electrónico es obligatorio.";
    if (formData.password !== formData.confirmPassword)
      return "Las contraseñas no coinciden.";
    if (formData.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (!formData.email.includes("@") || !formData.email.includes("."))
      return "El correo electrónico no tiene un formato válido.";
    return null;
  };

  // ── Envío ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errorMessage = validateForm();
    if (errorMessage) { setError(errorMessage); return; }
    setLoading(true);
    try {
      await registerUser(formData, selectedFile);
      Swal.fire({
        title: "¡Éxito!",
        text: "Tu cuenta ha sido creada exitosamente. Redirigiendo al login...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#472825",
        background: "#fff4e2",
        color: "#472825"
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      Swal.fire({
        title: "Error al registrar",
        text: err.message || "Ocurrió un error inesperado. Intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#472825",
        background: "#fff4e2",
        color: "#472825"
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Clases base ───────────────────────────────────────────
  const inputClass =
    "w-full p-2.5 border-2 border-[#D3ABB0] rounded-lg text-[#472825] bg-[#FFF4E2] " +
    "placeholder-[#96786F] text-sm focus:outline-none focus:border-[#96786F] " +
    "focus:ring-2 focus:ring-[#96786F] focus:ring-opacity-30 transition-colors duration-200";

  const labelClass = "block font-semibold text-[#472825] mb-1 text-sm";

  return (
    <div className="min-h-screen bg-[#FFF4E2] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-3xl bg-[#FFF4E2] border-2 border-[#D3ABB0] rounded-xl shadow-md px-6 py-8">

        {/* ── Encabezado ── */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🌋</div>
          <h1 className="text-2xl font-bold text-[#472825]">Crear Cuenta</h1>
          <p className="text-[#96786F] text-sm mt-1">Únete a la comunidad Vulcano</p>
        </div>



        {/* ── Foto de perfil — centrada y visible antes del formulario ── */}
        <div className="flex flex-col items-center mb-6">
          {/* Círculo de avatar / vista previa */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full border-2 border-[#D3ABB0] 
                       bg-[#FDE4BC] flex items-center justify-center 
                       cursor-pointer overflow-hidden group
                       hover:border-[#96786F] transition-colors duration-200"
            title="Haz clic para seleccionar una foto"
          >
            {preview ? (
              // Vista previa de la imagen elegida
              <img
                src={preview}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : (
              // Placeholder cuando no hay imagen
              <span className="text-4xl select-none">👤</span>
            )}

            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-[#472825] bg-opacity-0 group-hover:bg-opacity-30 
                            flex items-center justify-center transition-all duration-200">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 text-center px-1">
                📷 Cambiar
              </span>
            </div>
          </div>

          {/* Input oculto — se activa al hacer clic en el círculo */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Texto de ayuda o botón para quitar */}
          {preview ? (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 text-xs text-[#96786F] hover:text-[#472825] 
                         font-semibold transition-colors duration-200 underline"
            >
              Quitar foto
            </button>
          ) : (
            <p className="mt-2 text-xs text-[#96786F] text-center">
              Haz clic para subir tu foto{" "}
              <span className="font-normal">(opcional · máx. 2 MB)</span>
            </p>
          )}
        </div>

        {/* ── Formulario ── */}
        <form onSubmit={handleSubmit}>

          {/* ══ GRID 2 columnas en desktop, 1 en móvil ══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">

            {/* ─── COLUMNA IZQUIERDA: Datos de acceso ─── */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#96786F] mb-3 pb-2 border-b border-[#D3ABB0]">
                Datos de acceso
              </p>

              <div className="mb-3">
                <label className={labelClass}>
                  Nombre de usuario <span className="text-[#96786F]">*</span>
                </label>
                <input type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="Ej: mario_munera" className={inputClass} />
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  Contraseña <span className="text-[#96786F]">*</span>
                </label>
                <input type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="Mínimo 6 caracteres" className={inputClass} />
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  Confirmar contraseña <span className="text-[#96786F]">*</span>
                </label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Repite tu contraseña" className={inputClass} />
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  Teléfono <span className="text-[#96786F] font-normal">(opcional)</span>
                </label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber}
                  onChange={handleChange} placeholder="Ej: +57 300 123 4567" className={inputClass} />
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  Fecha de nacimiento <span className="text-[#96786F] font-normal">(opcional)</span>
                </label>
                <input type="date" name="birthDate" value={formData.birthDate}
                  onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* ─── COLUMNA DERECHA: Datos del perfil ─── */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#96786F] mb-3 pb-2 border-b border-[#D3ABB0]">
                Datos del perfil
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={labelClass}>
                    Nombre <span className="text-[#96786F]">*</span>
                  </label>
                  <input type="text" name="firstName" value={formData.firstName}
                    onChange={handleChange} placeholder="Ej: Mario" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    Apellido <span className="text-[#96786F]">*</span>
                  </label>
                  <input type="text" name="lastName" value={formData.lastName}
                    onChange={handleChange} placeholder="Ej: Munera" className={inputClass} />
                </div>
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  Correo electrónico <span className="text-[#96786F]">*</span>
                </label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Ej: mario@correo.com" className={inputClass} />
              </div>

              <div className="mb-3">
                <label className={labelClass}>
                  ¿A qué te dedicas? <span className="text-[#96786F] font-normal">(opcional)</span>
                </label>
                <textarea name="bio" value={formData.bio} onChange={handleChange}
                  placeholder="Cuéntanos un poco sobre ti..." rows={5}
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* ── Botón y pie ── */}
          <div className="mt-5">
            <button type="submit" disabled={loading}
              className="w-full bg-[#472825] text-[#FFF4E2] py-3 rounded-lg font-bold text-base
                         hover:bg-[#96786F] transition-colors duration-300
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Registrando... ⏳" : "Crear cuenta 🌋"}
            </button>

            <p className="text-center text-[#96786F] text-sm mt-3">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/Login"
                className="text-[#472825] font-bold hover:text-[#96786F] transition-colors duration-200">
                Inicia sesión aquí
              </Link>
            </p>

            <div className="border-t border-[#D3ABB0] mt-4 pt-3">
              <p className="text-center text-[#96786F] text-xs">
                Al registrarte en Vulcano, aceptas nuestros{" "}
                <a href="#" className="text-[#472825] font-semibold hover:underline">Términos</a>{" "}
                y{" "}
                <a href="#" className="text-[#472825] font-semibold hover:underline">Política de privacidad</a>.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VulcanoRegister;
