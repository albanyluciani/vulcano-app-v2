
import { useState, useEffect, useCallback } from 'react';

import Swal from 'sweetalert2';
import ModuleCard from '../components/ModuleCard';
import ModuleForm from '../components/ModuleForm';
import { getModules, createModule, updateModule, deleteModule } from '../services/moduleService';
import '../styles/ModuleView.css';

const mascotSvg = '/Icons/vulcancito.svg';

const ModuleView = () => {
  const [modules, setModules] = useState([]);
  const [status, setStatus] = useState('loading');
  const [modal, setModal] = useState(null);     // null | 'create' | 'edit' | 'confirm'
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ---- Toast con Swal ---- */
  const showToast = (msg, icon = 'success') => {
    Swal.fire({
      text: msg,
      icon: icon,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#fff4e2",
      color: "#472825"
    });
  };


  /* ---- Carga de datos ---- */
  const load = useCallback(() => {
    setStatus('loading');
    getModules()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => (a.content?.orderIndex || 0) - (b.content?.orderIndex || 0)
        );
        setModules(sorted);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  /* ---- CRUD handlers ---- */
  const handleCreate = (form, courseId) => {
    setSaving(true);
    createModule(form, courseId)
      .then(() => {
        setSaving(false);
        setModal(null);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Módulo creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
        load();
      })
      .catch(() => {
        setSaving(false);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear el módulo',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
      });
  };

  const handleUpdate = (form) => {
    setSaving(true);
    updateModule(editing.id, form)
      .then(() => {
        setSaving(false);
        setModal(null);
        setEditing(null);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Módulo actualizado',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
        load();
      })
      .catch(() => {
        setSaving(false);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el módulo',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
      });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModal('confirm');
  };

  const handleDelete = () => {
    deleteModule(deleteId)
      .then(() => {
        setDeleteId(null);
        setModal(null);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Módulo eliminado',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
        load();
      })
      .catch(() => {
        setDeleteId(null);
        setModal(null);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el módulo',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#472825'
        });
      });
  };

  const openEdit = (mod) => {
    setEditing(mod);
    setModal('edit');
  };

  /* ---- Estadísticas rápidas ---- */
  const activeCount = modules.filter((m) => m.status === 'ACTIVE').length;
  const totalMinutes = modules.reduce((sum, m) => sum + (Number(m.durationInMinutes) || 0), 0);

  return (
    <div className="w-full">
      <main className="mv-page">
        {/* ---- Hero con mascota ---- */}
        <div className="mv-hero">
          <div className="mv-mascot-frame">
            <img src={mascotSvg} alt="Vulcancito mascota" />
          </div>
          <div className="mv-hero-text">
            <h1 className="mv-hero-title">Módulos de Aprendizaje</h1>
            <p className="mv-hero-subtitle">
              {status === 'ok'
                ? `${modules.length} módulo${modules.length !== 1 ? 's' : ''} en el camino de lava 🌋`
                : 'Cargando tu camino volcánico...'}
            </p>
          </div>
          <div className="mv-hero-actions">
            <button className="mv-btn mv-btn-primary" onClick={() => setModal('create')}>
              + Nuevo módulo
            </button>
          </div>
        </div>

        {/* ---- Estadísticas ---- */}
        {status === 'ok' && modules.length > 0 && (
          <div className="mv-stats-bar">
            <div className="mv-stat">
              <span className="mv-stat-icon">📦</span>
              {modules.length} módulos
            </div>
            <div className="mv-stat">
              <span className="mv-stat-icon">🟢</span>
              {activeCount} activos
            </div>
            <div className="mv-stat">
              <span className="mv-stat-icon">⏱</span>
              {totalMinutes} min totales
            </div>
          </div>
        )}

        {/* ---- Estado: Cargando ---- */}
        {status === 'loading' && (
          <div className="mv-state">
            <div className="mv-spinner" />
            <p>Cargando módulos...</p>
          </div>
        )}

        {/* ---- Estado: Error ---- */}
        {status === 'error' && (
          <div className="mv-error-box">
            <span className="mv-error-icon">🌋</span>
            <p>No se pudo conectar con el backend.</p>
            <small>
              Asegúrate de que Spring Boot corra en <code>localhost:8080</code> y que tengas <code>@CrossOrigin</code> en el controller.
            </small>
            <button className="mv-btn mv-btn-secondary" onClick={load} style={{ marginTop: '12px' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* ---- Estado: Vacío ---- */}
        {status === 'ok' && modules.length === 0 && (
          <div className="mv-empty-path">
            <span className="mv-empty-icon">🗺️</span>
            <h3 className="mv-empty-title">El camino de lava está vacío</h3>
            <p className="mv-empty-desc">
              Crea tu primer módulo para comenzar a construir el recorrido de aprendizaje.
            </p>
            <button className="mv-btn mv-btn-primary" onClick={() => setModal('create')}>
              🌋 Crear primer módulo
            </button>
          </div>
        )}

        {/* ---- Camino Vertical (Lava Path) ---- */}
        {status === 'ok' && modules.length > 0 && (
          <div className="mv-path">
            {modules.map((mod, i) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                index={i}
                total={modules.length}
                onEdit={openEdit}
                onDelete={confirmDelete}
              />
            ))}

            {/* FAB para crear nuevo módulo al final del camino */}
            <button
              className="mv-fab"
              onClick={() => setModal('create')}
              title="Agregar módulo al camino"
            >
              +
            </button>
          </div>
        )}
      </main>

      {/* ---- Modal: Crear ---- */}
      {modal === 'create' && (
        <div className="mv-overlay" onClick={() => setModal(null)}>
          <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-header">
              <h2 className="mv-modal-title">🌋 Nuevo módulo</h2>
              <button className="mv-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <ModuleForm onSave={handleCreate} onCancel={() => setModal(null)} saving={saving} />
          </div>
        </div>
      )}

      {/* ---- Modal: Editar ---- */}
      {modal === 'edit' && editing && (
        <div className="mv-overlay" onClick={() => { setModal(null); setEditing(null); }}>
          <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-header">
              <h2 className="mv-modal-title">✏️ Editar módulo</h2>
              <button className="mv-modal-close" onClick={() => { setModal(null); setEditing(null); }}>✕</button>
            </div>
            <ModuleForm
              initial={editing}
              onSave={handleUpdate}
              onCancel={() => { setModal(null); setEditing(null); }}
              saving={saving}
            />
          </div>
        </div>
      )}

      {/* ---- Modal: Confirmar eliminación ---- */}
      {modal === 'confirm' && (
        <div className="mv-overlay" onClick={() => setModal(null)}>
          <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mv-modal-header">
              <h2 className="mv-modal-title">⚠️ ¿Eliminar módulo?</h2>
              <button className="mv-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="mv-confirm">
              <p>Esta acción no se puede deshacer. El módulo será eliminado permanentemente del camino.</p>
              <div className="mv-confirm-actions">
                <button className="mv-btn mv-btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
                <button className="mv-btn mv-btn-danger" onClick={handleDelete}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ModuleView;
