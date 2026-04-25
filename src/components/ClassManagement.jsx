import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/api";
import { 
  getAllSchedules, 
  createAvailability,
  updateSchedule, 
  deleteSchedule 
} from "../services/scheduleService";
import "../styles/ClassManagement.css";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

const ClassManagement = () => {
  const navigate = useNavigate();
  // --- ESTADOS DE VISTA Y DATOS ---
  const [viewMode, setViewMode] = useState("LIST"); // "LIST" o "FORM"
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    professorId: "",
    name: "",
    specialty: "",
    schedules: [] // Array de { id, date, hours: [] }
  });
  
  const [editId, setEditId] = useState(null); // ID del horario que estamos editando
  const [loadingProfessor, setLoadingProfessor] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await getAllSchedules();
      setClassList(data);
    } catch (error) {
      console.error("Error al cargar clases:", error);
      // Fallback a datos de prueba si fallara (opcional, mejor mostrar error)
      // setClassList([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- BUSQUEDA DE PROFESOR POR ID ---
  const fetchProfessor = async (id) => {
    if (!id) return;
    setLoadingProfessor(true);
    try {
      const data = await getUserById(id);
      setFormData(prev => ({
        ...prev,
        name: `${data.profile?.firstName || ""} ${data.profile?.lastName || ""}`.trim(),
        specialty: data.profile?.bio || "Especialidad no definida"
      }));
    } catch (error) {
      console.error("Error al buscar profesor:", error);
      setFormData(prev => ({ ...prev, name: "", specialty: "" }));
    } finally {
      setLoadingProfessor(false);
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, professorId: value }));
    if (value.length >= 1) fetchProfessor(value);
  };

  // --- GESTIÓN DE FECHAS Y HORAS ---
  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { id: Date.now(), date: "", hours: [] }]
    }));
  };

  const removeDate = (id) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== id)
    }));
  };

  const handleDateChange = (id, dateValue) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => s.id === id ? { ...s, date: dateValue } : s)
    }));
  };

  const addHour = (dateId, hourValue) => {
    if (!hourValue) return;
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => {
        if (s.id === dateId) {
          if (s.hours.includes(hourValue)) return s;
          return { ...s, hours: [...s.hours, hourValue] };
        }
        return s;
      })
    }));
  };

  const removeHour = (dateId, hourValue) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map(s => 
        s.id === dateId ? { ...s, hours: s.hours.filter(h => h !== hourValue) } : s
      )
    }));
  };

  // --- ACCIONES CRUD ---
  
  const handleCreateNew = () => {
    setEditId(null);
    setFormData({
      professorId: "",
      name: "",
      specialty: "",
      schedules: []
    });
    setViewMode("FORM");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      professorId: item.professorId || "",
      name: item.professorName || item.name || "",
      specialty: item.specialty || "",
      schedules: item.schedules || []
    });
    setViewMode("FORM");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#472825",
      cancelButtonColor: "#96786f",
      background: "#fff4e2",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await deleteSchedule(id);
        Swal.fire({
          title: "Eliminado",
          text: "La clase ha sido eliminada.",
          icon: "success",
          background: "#fff4e2"
        });
        loadClasses();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la clase", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.professorId || !formData.name) {
      Swal.fire("Error", "Nombre o ID de profesor inválido", "error");
      return;
    }

    if (formData.schedules.length === 0) {
      Swal.fire("Atención", "Agrega al menos una fecha", "warning");
      return;
    }

    Swal.fire({
      title: "Guardando...",
      didOpen: () => Swal.showLoading(),
      background: "#fff4e2"
    });

    try {
      // Limpiamos el payload: convertimos professorId a número 
      // y eliminamos los IDs temporales (Date.now()) de los schedules
      // para que JPA los genere en la DB correctamente.
      const payload = {
        professorId: Number(formData.professorId),
        name: formData.name,
        specialty: formData.specialty,
        schedules: formData.schedules.map(({ date, hours }) => ({ date, hours }))
      };

      if (editId) {
        await updateSchedule(editId, payload);
      } else {
        // createAvailability crea una nueva clase (antes era createSchedule)
        await createAvailability(payload);
      }
      
      Swal.fire({
        icon: "success",
        title: editId ? "Clase Actualizada" : "Clase Creada",
        confirmButtonColor: "#472825",
        background: "#fff4e2"
      });

      setViewMode("LIST");
      loadClasses();
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la información", "error");
    }
  };

  // --- RENDERIZADO ---

  return (
    <div className="class-management-container">
      <div className="management-header">
        <h1 className="management-title">Gestión de Clases</h1>
        <p className="management-subtitle">Administra el catálogo de clases y horarios disponibles.</p>
      </div>

      {viewMode === "LIST" ? (
        <div className="list-view-section">
          <div className="flex justify-between items-center mb-6" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 className="section-title" style={{margin: 0}}>
              <Icon icon="fluent:list-24-filled" />
              Clases Registradas
            </h2>
            <div style={{display: 'flex', gap: '12px'}}>
              <button 
                className="btn-create-init" 
                style={{margin: 0, padding: '12px 24px', fontSize: '15px'}} 
                onClick={() => navigate("/layout/docentes")}
              >
                <Icon icon="fluent:person-add-24-filled" />
                Ingresar Docente
              </button>
              <button 
                className="btn-create-init" 
                style={{margin: 0, padding: '12px 24px', fontSize: '15px'}} 
                onClick={handleCreateNew}
              >
                <Icon icon="fluent:add-circle-24-filled" />
                Nueva Clase
              </button>
            </div>
          </div>

          <div className="class-list-container">
            {loading ? (
              <div className="empty-list">Cargando clases...</div>
            ) : classList.length === 0 ? (
              <div className="empty-list">No hay clases registradas aún.</div>
            ) : (
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Profesor</th>
                    <th>Especialidad</th>
                    <th>Horarios</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {classList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="professor-info-cell">
                          <span className="prof-name">{item.name || item.professorName}</span>
                          <span className="prof-id">ID: {item.professorId}</span>
                        </div>
                      </td>
                      <td>{item.specialty}</td>
                      <td>
                        <div className="schedule-summary">
                          <span className="summary-pill">
                            {item.schedules?.length || 0} fechas disponibles
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-action btn-edit" onClick={() => handleEdit(item)} title="Editar">
                            <Icon icon="fluent:edit-24-filled" />
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(item.id)} title="Eliminar">
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
        </div>
      ) : (
        <form className="class-form-card" onSubmit={handleSubmit}>
          <div className="section-title">
            <Icon icon="fluent:person-board-24-filled" />
            {editId ? "Editar Clase" : "Información del Profesor"}
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">ID PROFESOR</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ingresa el ID"
                value={formData.professorId}
                onChange={handleIdChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre y Apellido</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nombre del profesor"
                value={formData.name}
                readOnly
                disabled
              />
              {loadingProfessor && <span style={{fontSize: '12px', color: 'var(--color-mid)'}}>Buscando...</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Especialidad"
                value={formData.specialty}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="schedules-section">
            <div className="section-title">
              <Icon icon="fluent:calendar-clock-24-filled" />
              Fechas Disponibles
            </div>

            <button type="button" className="add-date-btn" onClick={addDate}>
              + Agregar Fecha
            </button>

            <div className="dates-list">
              {formData.schedules.map((sched) => (
                <div key={sched.id} className="date-item">
                  <div className="date-header">
                    <input 
                      type="date" 
                      className="date-input"
                      value={sched.date}
                      onChange={(e) => handleDateChange(sched.id, e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => removeDate(sched.id)}
                    >
                      <Icon icon="fluent:delete-24-regular" />
                    </button>
                  </div>

                  <div className="hours-container">
                    {sched.hours && sched.hours.map((h, index) => (
                      <div key={index} className="hour-chip">
                        {h}
                        <button 
                          type="button" 
                          className="remove-btn" 
                          style={{fontSize: '12px'}}
                          onClick={() => removeHour(sched.id, h)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <div className="add-hour-wrapper">
                      <input 
                        type="time" 
                        className="hour-input"
                        id={`input-hour-${sched.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHour(sched.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-add-hour"
                        onClick={() => {
                          const input = document.getElementById(`input-hour-${sched.id}`);
                          if (input) {
                            addHour(sched.id, input.value);
                            input.value = "";
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => setViewMode("LIST")}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {editId ? "Actualizar Clase" : "Guardar Clase"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClassManagement;
