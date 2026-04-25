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

import { useState, useRef, useEffect } from "react";
import { updateUser, uploadProfilePicture } from "../services/api";

const EditProfileModal = ({ user, onClose, onSaved }) => {
  const fileRef = useRef(null);

  // ----------------------------------------------------------
  // PASO 1: Estado para los datos del formulario (Textos)
  // ----------------------------------------------------------
  const [formData, setFormData] = useState({
    firstName:   user.profile?.firstName   || "",
    lastName:    user.profile?.lastName    || "",
    email:       user.profile?.email       || "",
    phoneNumber: user.profile?.phoneNumber || "",
    bio:         user.profile?.bio         || "",
  });

  // ----------------------------------------------------------
  // PASO 2: Gestión de la Imagen (Visual y Archivo)
  // ----------------------------------------------------------
  // 'preview' maneja lo que el usuario ve EN EL MOMENTO.
  // Puede ser la URL del servidor o la URL temporal del archivo seleccionado.
  const [preview, setPreview]   = useState(user.profile?.profilePictureUrl || null);
  // 'selectedFile' guarda el archivo real para el momento del Guardar.
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  // LIMPIEZA DE MEMORIA (Nivel Senior):
  // Cuando creamos previsualizaciones con URL.createObjectURL, ocupan memoria.
  // Es buena práctica liberarlas cuando el componente se cierra o la imagen cambia.
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * handleImageChange: Genera efecto de "Tiempo Real"
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones rápidas
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona una imagen válida.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen es muy pesada (máx 2MB).");
      return;
    }

    setError(null);
    setSelectedFile(file);

    // ESTO ES LO QUE CREA EL EFECTO EN TIEMPO REAL:
    // Generamos una URL temporal que solo existe en la memoria del navegador.
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
  };

  // Quitar la foto seleccionada (vuelve a la original o ninguna)
  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ----------------------------------------------------------
  // handleSubmit: envía los cambios al backend
  // ----------------------------------------------------------
  // Haremos dos pasos: 
  // 1. Actualizar los datos de texto (PUT /api/users/{id})
  // 2. Si hay imagen nueva, subirla (POST /api/userProfiles/{id}/upload-image)
  // ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim()) { setError("El nombre es obligatorio."); return; }
    if (!formData.lastName.trim())  { setError("El apellido es obligatorio."); return; }
    if (!formData.email.trim())     { setError("El correo es obligatorio."); return; }

    setError(null);
    setLoading(true);

    try {
      // 1. Actualizamos datos de texto
      const payload = {
        username: user.username,
        password: user.password,
        profile: {
          ...user.profile,
          firstName: formData.firstName,
          lastName:  formData.lastName,
          email:     formData.email,
          phoneNumber: formData.phoneNumber || null,
          bio:       formData.bio || null,
        },
      };

      let finalUser = await updateUser(user.id, payload);

      // 2. Si el usuario eligió una foto nueva, la subimos
      if (selectedFile) {
        // El endpoint requiere el ID del perfil
        const profileId = finalUser.profile?.id;
        const updatedProfile = await uploadProfilePicture(profileId, selectedFile);
        // MERGE: Actualizamos el perfil dentro del objeto de usuario
        finalUser = { ...finalUser, profile: updatedProfile };
      }

      // 3. Notificamos al Layout y cerramos
      onSaved(finalUser);

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
