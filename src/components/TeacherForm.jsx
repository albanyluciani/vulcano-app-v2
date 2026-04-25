import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getAllUsers } from "../services/api";
import Swal from "sweetalert2";
import "../styles/TeacherForm.css";

// ────────────────────────────────────────────────────────────
// TeacherForm
// • Lista de docentes registrados con su ID
// • Formulario de datos personales (sin credenciales)
// • Tras guardar: toast de éxito + vuelve a la lista
// ────────────────────────────────────────────────────────────

/** Genera username, password y email-placeholder a partir del nombre */
const generateCredentials = (firstName, lastName) => {
  const base = `${firstName.toLowerCase().charAt(0)}${lastName.toLowerCase().replace(/\s+/g, "")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return {
    username: `${base}${rand}`,
    password: `vulcano${rand}`,
    emailPlaceholder: `${base}${rand}@vulcano.internal`,
  };
};

const TeacherForm = () => {
  const [view, setView] = useState("LIST"); // "LIST" | "FORM"
  const [teachers, setTeachers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    specialty: "",
    phoneNumber: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  // ── Cargar lista ──────────────────────────────────────────
  useEffect(() => {
    if (view === "LIST") loadTeachers();
  }, [view]);

  const loadTeachers = async () => {
    setLoadingList(true);
    try {
      const all = await getAllUsers();
      setTeachers(all.filter((u) => u.role === "TEACHER"));
    } catch {
      setTeachers([]);
    } finally {
      setLoadingList(false);
    }
  };

  // ── Handlers ─────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Swal.fire("Campos requeridos", "Nombre y apellido son obligatorios.", "warning");
      return;
    }

    setSaving(true);

    // Genera credenciales automáticas
    const { username, password, emailPlaceholder } = generateCredentials(formData.firstName, formData.lastName);

    const payload = {
      username,
      password,
      // NO enviamos role aquí para que el backend use el default (USER)
      // Luego lo actualizamos con PATCH para evitar problemas de compatibilidad
      profile: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        // email NO puede ser null en la DB (NOT NULL + UNIQUE) → usamos placeholder si no lo ingresaron
        email: formData.email.trim() || emailPlaceholder,
        bio: formData.specialty.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        status: "ACTIVE",
      },
    };

    try {
      // PASO 1: Crear el usuario
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Error al crear usuario:", errText);
        throw new Error(errText);
      }

      const saved = await res.json();

      // PASO 2: Actualizar role a TEACHER (ignoramos si falla — el usuario igual se creó)
      try {
        await fetch(`/api/users/${saved.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "TEACHER" }),
        });
      } catch (roleErr) {
        console.warn("No se pudo asignar rol TEACHER:", roleErr);
      }

      // ✅ Toast de éxito
      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        html: `
          <p style="margin-bottom:12px">
            <strong>${saved.profile?.firstName} ${saved.profile?.lastName}</strong>
            fue registrado correctamente.
          </p>
          <div style="
            display:inline-flex;align-items:center;gap:10px;
            background:#472825;color:#fff4e2;
            padding:10px 22px;border-radius:14px;
            font-size:20px;font-weight:900;letter-spacing:1px
          ">
            🔑 ID: ${saved.id}
          </div>
          <p style="font-size:13px;color:#96786f;margin-top:10px">
            Usa este ID al crear una nueva clase.
          </p>
        `,
        confirmButtonColor: "#472825",
        confirmButtonText: "Ver docentes",
        background: "#fff4e2",
      });

      setFormData(emptyForm);
      setView("LIST"); // ← volvemos a la lista tras confirmar
    } catch {
      Swal.fire("Error", "No se pudo registrar el docente.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const { isConfirmed } = await Swal.fire({
      title: `¿Eliminar a ${name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#472825",
      cancelButtonColor: "#96786f",
      background: "#fff4e2",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        Swal.fire({ title: "Eliminado", icon: "success", background: "#fff4e2" });
        loadTeachers();
      } catch {
        Swal.fire("Error", "No se pudo eliminar el docente.", "error");
      }
    }
  };

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div className="teacher-form-page">

      {/* HEADER */}
      <div className="tf-header">
        <h1 className="tf-title">
          {view === "FORM" ? "Registrar Nuevo Docente" : "Gestión de Docentes"}
        </h1>
        <p className="tf-subtitle">
          {view === "FORM"
            ? "Completa los datos del docente. El ID se genera automáticamente."
            : "Administra el equipo de docentes. Usa el ID al crear una nueva clase."}
        </p>
      </div>

      {/* ═══════════════ LISTA ═══════════════ */}
      {view === "LIST" && (
        <>
          <div className="tf-toolbar">
            <h2 className="tf-section-title">
              <Icon icon="fluent:people-team-24-filled" />
              Docentes Registrados
            </h2>
            <button className="tf-btn-primary" onClick={() => setView("FORM")}>
              <Icon icon="fluent:person-add-24-filled" />
              Nuevo Docente
            </button>
          </div>

          <div className="tf-list-wrapper">
            {loadingList ? (
              <div className="tf-empty">Cargando docentes...</div>
            ) : teachers.length === 0 ? (
              <div className="tf-empty">No hay docentes registrados aún.</div>
            ) : (
              <table className="tf-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Docente</th>
                    <th>Especialidad</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span className="id-badge">
                          <Icon icon="fluent:key-24-filled" width={12} />
                          {t.id}
                        </span>
                      </td>
                      <td>
                        <div className="tf-info-cell">
                          <span className="tf-name">
                            {t.profile?.firstName} {t.profile?.lastName}
                          </span>
                          <span className="tf-specialty">
                            {t.profile?.phoneNumber || ""}
                          </span>
                        </div>
                      </td>
                      <td>{t.profile?.bio || <span style={{ color: "#aaa" }}>—</span>}</td>
                      <td>{t.profile?.email || <span style={{ color: "#aaa" }}>—</span>}</td>
                      <td>
                        <div className="tf-actions-cell">
                          <button
                            className="tf-btn-action tf-btn-delete"
                            onClick={() =>
                              handleDelete(t.id, `${t.profile?.firstName} ${t.profile?.lastName}`)
                            }
                            title="Eliminar"
                          >
                            <Icon icon="fluent:delete-24-filled" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ═══════════════ FORMULARIO ═══════════════ */}
      {view === "FORM" && (
        <form className="tf-form-card" onSubmit={handleSubmit}>
          <p className="tf-form-section-title">
            <Icon icon="fluent:person-24-filled" />
            Datos del Docente
          </p>

          <div className="tf-form-grid">
            <div className="tf-form-group">
              <label className="tf-label">Nombre *</label>
              <input
                className="tf-input"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej: Carlos"
                required
              />
            </div>
            <div className="tf-form-group">
              <label className="tf-label">Apellido *</label>
              <input
                className="tf-input"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej: Ramírez"
                required
              />
            </div>
            <div className="tf-form-group">
              <label className="tf-label">Correo Electrónico</label>
              <input
                className="tf-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="docente@vulcano.com"
              />
            </div>
            <div className="tf-form-group">
              <label className="tf-label">Teléfono</label>
              <input
                className="tf-input"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="tf-form-grid full">
            <div className="tf-form-group">
              <label className="tf-label">Especialidad</label>
              <textarea
                className="tf-textarea"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ej: Matemáticas avanzadas, Programación Python..."
                rows={3}
              />
            </div>
          </div>

          <div className="tf-form-actions">
            <button
              type="button"
              className="tf-btn-cancel"
              onClick={() => { setFormData(emptyForm); setView("LIST"); }}
            >
              Cancelar
            </button>
            <button type="submit" className="tf-btn-submit" disabled={saving}>
              <Icon icon="fluent:person-add-24-filled" style={{ marginRight: 8 }} />
              {saving ? "Registrando..." : "Registrar Docente"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default TeacherForm;
