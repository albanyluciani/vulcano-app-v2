// ============================================================
// EditProfileModal.jsx
// ------------------------------------------------------------
// Modal para que el usuario edite su información de perfil.
//
// Props que recibe:
//   user    → objeto User completo (leído de localStorage)
//   onClose → función para cerrar el modal sin guardar
//   onSaved → función que se llama con el User actualizado
//             al guardar exitosamente
//
// Estilos: usa las mismas clases de Tailwind y colores que
// VulcanoRegister.jsx para no desentonar con el proyecto.
// ============================================================

import { useState, useRef } from "react";
import { updateUser } from "../services/api";

const EditProfileModal = ({ user, onClose, onSaved }) => {
  // Referencia al input[type=file] oculto (para la foto)
  const fileRef = useRef(null);

  // ----------------------------------------------------------
  // PASO 1: Inicializamos el formulario con los datos actuales
  // ----------------------------------------------------------
  // De esta forma el usuario ve su información actual y solo
  // modifica lo que quiere cambiar.
  // ----------------------------------------------------------
  const [formData, setFormData] = useState({
    firstName:         user.profile?.firstName         || "",
    lastName:          user.profile?.lastName          || "",
    email:             user.profile?.email             || "",
    phoneNumber:       user.profile?.phoneNumber       || "",
    bio:               user.profile?.bio               || "",
    profilePictureUrl: user.profile?.profilePictureUrl || "",
  });

  // Vista previa de la foto (URL local o Base64 que ya tenía)
  const [preview, setPreview]   = useState(user.profile?.profilePictureUrl || null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  // ----------------------------------------------------------
  // handleChange: actualiza el estado cuando el usuario escribe
  // ----------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------------------------
  // handleImageChange: convierte la imagen a Base64
  // ----------------------------------------------------------
  // Es exactamente la misma lógica que en VulcanoRegister.jsx.
  // FileReader lee el archivo local y lo convierte a un string
  // "data:image/jpeg;base64,..." que podemos enviar al backend.
  // ----------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar los 2 MB.");
      return;
    }

    setError(null);
    // Vista previa rápida usando URL de objeto local
    setPreview(URL.createObjectURL(file));

    // Convertimos a Base64 para enviarlo al backend
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, profilePictureUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Quitar la foto seleccionada
  const handleRemoveImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, profilePictureUrl: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  // ----------------------------------------------------------
  // handleSubmit: envía los cambios al backend
  // ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.firstName.trim()) { setError("El nombre es obligatorio.");           return; }
    if (!formData.lastName.trim())  { setError("El apellido es obligatorio.");         return; }
    if (!formData.email.trim())     { setError("El correo es obligatorio.");           return; }
    if (!formData.email.includes("@")) { setError("El correo no tiene formato válido."); return; }

    setError(null);
    setLoading(true);

    try {
      // --------------------------------------------------------
      // Construimos el payload que espera el backend.
      // El endpoint PUT /api/users/{id} recibe un objeto User
      // con su perfil anidado — igual que el POST de registro.
      // --------------------------------------------------------
      const payload = {
        username: user.username,
        password: user.password,    // lo requerimos para que la entidad sea válida
        profile: {
          ...user.profile,           // conservamos los campos que no vienen en el form
          firstName:         formData.firstName,
          lastName:          formData.lastName,
          email:             formData.email,
          phoneNumber:       formData.phoneNumber       || null,
          bio:               formData.bio               || null,
          profilePictureUrl: formData.profilePictureUrl || null,
          status:            user.profile?.status       || "ACTIVE",
        },
      };

      // Llamamos a: PUT /api/users/{id}
      const updatedUser = await updateUser(user.id, payload);

      // Le avisamos al Layout que guardamos — el Layout actualizará localStorage
      onSaved(updatedUser);

    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  // ── Clases reutilizadas de VulcanoRegister.jsx ───────────
  const inputClass =
    "w-full p-2.5 border-2 border-[#D3ABB0] rounded-lg text-[#472825] bg-[#FFF4E2] " +
    "placeholder-[#96786F] text-sm focus:outline-none focus:border-[#96786F] " +
    "focus:ring-2 focus:ring-[#96786F] focus:ring-opacity-30 transition-colors duration-200";

  const labelClass = "block font-semibold text-[#472825] mb-1 text-sm";

  return (
    // ──────────────────────────────────────────────────────
    // OVERLAY: fondo semitransparente que cubre toda la pantalla
    // Al hacer clic FUERA del modal (en el overlay) → se cierra
    // ──────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(71, 40, 37, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* ──────────────────────────────────────────────────
          TARJETA DEL MODAL
          stopPropagation evita que el clic dentro del modal
          llegue al overlay y lo cierre accidentalmente.
          ────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-lg bg-[#FFF4E2] border-2 border-[#D3ABB0] rounded-2xl shadow-2xl px-6 py-8 mx-4"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar (X) en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#96786F] hover:text-[#472825] hover:bg-[#D3ABB0] text-lg font-bold transition-all duration-200"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* ── Encabezado ── */}
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">✏️</div>
          <h2 className="text-xl font-bold text-[#472825]">Modificar Perfil</h2>
          <p className="text-[#96786F] text-sm mt-1">Actualiza tu información personal</p>
        </div>

        {/* ── Mensaje de error ── */}
        {error && (
          <div className="mb-4 p-3 rounded-lg border-2 border-[#D3ABB0] text-[#472825] text-sm text-center font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* ── Foto de perfil (igual que en VulcanoRegister) ── */}
        <div className="flex flex-col items-center mb-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full border-2 border-[#D3ABB0]
                       bg-[#FDE4BC] flex items-center justify-center
                       cursor-pointer overflow-hidden group
                       hover:border-[#96786F] transition-colors duration-200"
            title="Haz clic para cambiar tu foto"
          >
            {preview ? (
              <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl select-none">👤</span>
            )}
            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-[#472825] bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 text-center px-1">
                📷 Cambiar
              </span>
            </div>
          </div>

          {/* Input de archivo oculto — se activa desde el círculo de arriba */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {preview ? (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 text-xs text-[#96786F] hover:text-[#472825] font-semibold underline transition-colors duration-200"
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

          {/* Nombre y Apellido — dos columnas */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={labelClass}>
                Nombre <span className="text-[#96786F]">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Apellido <span className="text-[#96786F]">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                className={inputClass}
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div className="mb-3">
            <label className={labelClass}>
              Correo electrónico <span className="text-[#96786F]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              className={inputClass}
            />
          </div>

          {/* Teléfono (opcional) */}
          <div className="mb-3">
            <label className={labelClass}>
              Teléfono{" "}
              <span className="text-[#96786F] font-normal">(opcional)</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+57 300 123 4567"
              className={inputClass}
            />
          </div>

          {/* Bio (opcional) */}
          <div className="mb-5">
            <label className={labelClass}>
              ¿A qué te dedicas?{" "}
              <span className="text-[#96786F] font-normal">(opcional)</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos un poco sobre ti..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Botones: Cancelar y Guardar */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border-2 border-[#D3ABB0] text-[#96786F] font-bold text-sm hover:border-[#96786F] hover:text-[#472825] transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#472825] text-[#FFF4E2] py-3 rounded-lg font-bold text-sm hover:bg-[#96786F] transition-colors duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando... ⏳" : "Guardar cambios ✅"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
