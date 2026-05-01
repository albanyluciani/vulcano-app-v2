/**
 * ==============================================================================
 * ARCHIVO PRINCIPAL: CoursePage.jsx (Página de Gestión de Cursos)
 * ==============================================================================
 * Tipo: "Smart Component" o "Container".
 * Este archivo es el CEREBRO del módulo. Mientras que otros como CourseCard son
 * sólo elementos visuales mudos, CoursePage se encarga de:
 * 1. Llamar a la Base de Datos (CourseService).
 * 2. Guardar todos los cursos en la memoria de React usando `useState()`.
 * 3. Ejecutar los filtros pesados (buscador asíncrono, filtros de nivel/estado).
 * 4. Orquestar los Modales de Confirmación, Formularios y Notificaciones flotantes.
 */

import { useState, useEffect, useCallback } from 'react';
import NavbarPpal from '../components/NavbarPpal';
import VulcanoFooter from '../components/VulcanoFooter';
import Swal from 'sweetalert2';

import '../styles/Course.css';
import { getCourses, createCourse, updateCourse, deleteCourse } from "../services/courseService";
import Modal from '../components/Modal';
import CourseForm from '../components/CourseForm';
import CourseCard from '../components/CourseCard';

const CourseCardSkeleton = () => (
  <div className="cp-skeleton-card">
    <div className="flex justify-between items-center mb-3">
      <div className="skeleton-shimmer sk-id"></div>
      <div className="skeleton-shimmer sk-status"></div>
    </div>
    <div className="skeleton-shimmer sk-img"></div>
    <div className="skeleton-shimmer sk-title"></div>
    <div className="skeleton-shimmer sk-desc"></div>
    <div className="skeleton-shimmer sk-desc-2"></div>
    <div className="flex gap-2 mt-1">
      <div className="skeleton-shimmer sk-btn"></div>
      <div className="skeleton-shimmer sk-btn"></div>
    </div>
  </div>
);

/* ---- Página principal ---- */
const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [publishedFilter, setPublishedFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [status, setStatus] = useState('loading');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [viewMode, setViewMode] = useState('grid');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [undoSeconds, setUndoSeconds] = useState(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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

  const updateFilter = (setter, value) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => setter(value));
    } else {
      setter(value);
    }
  };

  const load = useCallback(() => {
    setStatus('loading');
    getCourses()
      .then(d => { setCourses(d); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = form => {
    setSaving(true);
    createCourse(form)
      .then(() => {
        setSaving(false); setModal(null); showToast('✅ Curso creado exitosamente');
        if (document.startViewTransition) document.startViewTransition(() => load());
        else load();
      })
      .catch(() => { setSaving(false); showToast('❌ Error al crear el curso'); });
  };

  const handleUpdate = form => {
    setSaving(true);
    updateCourse(editing.id, form)
      .then(() => {
        setSaving(false); setModal(null); setEditing(null); showToast('✅ Curso actualizado');
        if (document.startViewTransition) document.startViewTransition(() => load());
        else load();
      })
      .catch(() => { setSaving(false); showToast('❌ Error al actualizar el curso'); });
  };

  const confirmDelete = course => {
    setCourseToDelete(course);
    setDeleteConfirmText('');
    setModal('confirm');
  };

  const initiateDelete = () => {
    const course = courseToDelete;
    setModal(null);
    setCourseToDelete(null);
    setDeleteConfirmText('');

    if (pendingDelete) {
      clearTimeout(pendingDelete.timeoutId);
      if (pendingDelete.intervalId) clearInterval(pendingDelete.intervalId);
    }

    setUndoSeconds(20);
    const intervalId = setInterval(() => {
      setUndoSeconds(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      executeDelete(course.id);
    }, 20000);

    setPendingDelete({ id: course.id, timeoutId, intervalId, course });

    const removeFn = () => setCourses(prev => prev.filter(c => c.id !== course.id));
    if (document.startViewTransition) document.startViewTransition(removeFn);
    else removeFn();
  };

  const undoDelete = () => {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timeoutId);
      if (pendingDelete.intervalId) clearInterval(pendingDelete.intervalId);
      const addFn = () => {
        setCourses(prev => [...prev, pendingDelete.course].sort((a, b) => a.id - b.id));
        setPendingDelete(null);
      };
      if (document.startViewTransition) document.startViewTransition(addFn);
      else addFn();
    }
  };

  const executeDelete = (id) => {
    deleteCourse(id)
      .then(() => {
        setPendingDelete(null);
      })
      .catch(() => {
        showToast('❌ Error al eliminar el curso en el servidor');
        // Fallback: reload courses to be safe
        load();
      });
  };

  const openEdit = course => { setEditing(course); setModal('edit'); };

  const inactiveCourses = courses.filter(c => c.status !== 'ACTIVE').length;
  const privateCourses = courses.filter(c => !c.isPublished).length;

  const filteredCourses = courses
    .filter(c => {
      if (statusFilter === 'ACTIVE' && c.status !== 'ACTIVE') return false;
      if (statusFilter === 'INACTIVE' && c.status === 'ACTIVE') return false;
      if (publishedFilter === 'PUBLISHED' && !c.isPublished) return false;
      if (publishedFilter === 'UNPUBLISHED' && c.isPublished) return false;
      if (levelFilter !== 'ALL' && c.courseLevel !== levelFilter) return false;
      return true;
    })
    .filter(c =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <div className="w-full">
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 py-10">

        {/* Encabezado */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-4">
          <div>
            <h1 className="cp-heading">Cursos</h1>
            {status === 'loading' && <p className="cp-subheading">Cargando catálogo...</p>}
          </div>
          <button className="cp-btn-primary" onClick={() => setModal('create')}>
            + Nuevo curso
          </button>
        </div>

        {/* Top Stats Widgets */}
        {status === 'ok' && (
          <div className="cp-stats-row">
            <div className="cp-stat-card">
              <div className="cp-stat-icon">📚</div>
              <div className="cp-stat-info">
                <span className="cp-stat-value">{courses.length}</span>
                <span className="cp-stat-label">{courses.length === 1 ? 'Curso' : 'Cursos'}</span>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon">🔴</div>
              <div className="cp-stat-info">
                <span className="cp-stat-value">{inactiveCourses}</span>
                <span className="cp-stat-label">{inactiveCourses === 1 ? 'Inactivo' : 'Inactivos'}</span>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon">🔒</div>
              <div className="cp-stat-info">
                <span className="cp-stat-value">{privateCourses}</span>
                <span className="cp-stat-label">{privateCourses === 1 ? 'Oculto' : 'Ocultos'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="🔎 Buscar curso por nombre o descripción..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-ppal)] focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.01] hover:shadow-md hover:z-10 font-medium text-slate-700 bg-white/50 backdrop-blur-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => updateFilter(setSearchQuery, e.target.value)}
            />
            {/* View Toggles */}
            <div className="cp-view-toggle">
              <button
                className={`cp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => updateFilter(setViewMode, 'grid')}
                title="Vista Cuadrícula"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              </button>
              <button
                className={`cp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => updateFilter(setViewMode, 'list')}
                title="Vista Lista"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-ppal)] focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.03] hover:shadow-md hover:z-10 font-medium text-slate-700 bg-white/50 backdrop-blur-sm shadow-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => updateFilter(setStatusFilter, e.target.value)}
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">🟢 Activos ({courses.filter(c => c.status === 'ACTIVE').length})</option>
              <option value="INACTIVE">🔴 Inactivos ({courses.filter(c => c.status !== 'ACTIVE').length})</option>
            </select>
            <select
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-ppal)] focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.03] hover:shadow-md hover:z-10 font-medium text-slate-700 bg-white/50 backdrop-blur-sm shadow-sm cursor-pointer"
              value={publishedFilter}
              onChange={(e) => updateFilter(setPublishedFilter, e.target.value)}
            >
              <option value="ALL">Toda visibilidad</option>
              <option value="PUBLISHED">🌐 Públicos ({courses.filter(c => c.isPublished).length})</option>
              <option value="UNPUBLISHED">🔒 Ocultos ({courses.filter(c => !c.isPublished).length})</option>
            </select>
            <select
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-ppal)] focus:ring-4 focus:ring-indigo-100 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.03] hover:shadow-md hover:z-10 font-medium text-slate-700 bg-white/50 backdrop-blur-sm shadow-sm cursor-pointer"
              value={levelFilter}
              onChange={(e) => updateFilter(setLevelFilter, e.target.value)}
            >
              <option value="ALL">Cualquier nivel</option>
              <option value="BEGINNER">🐣 Principiante ({courses.filter(c => c.courseLevel === 'BEGINNER').length})</option>
              <option value="INTERMEDIATE">🛠️ Intermedio ({courses.filter(c => c.courseLevel === 'INTERMEDIATE').length})</option>
              <option value="ADVANCED">🔥 Avanzado ({courses.filter(c => c.courseLevel === 'ADVANCED').length})</option>
            </select>
          </div>
        </div>

        {/* Estado: cargando */}
        {status === 'loading' && (
          <div className="cp-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
          </div>
        )}

        {/* Estado: error */}
        {status === 'error' && (
          <div className="cp-error-box">
            <span className="cp-error-icon">🌋</span>
            <p>No se pudo conectar con el backend.</p>
            <small>
              Asegúrate de que Spring Boot corra en <code>localhost:8080</code> y que tengas <code>@CrossOrigin</code> en el controller.
            </small>
            <button className="cp-btn-secondary" onClick={load} style={{ marginTop: '12px' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* Estado: vacío pero con filtros */}
        {status === 'ok' && filteredCourses.length === 0 && courses.length > 0 && (
          <div className="cp-empty">
            <span className="cp-empty-icon">🔍</span>
            <p>No se encontraron cursos que coincidan con los filtros de búsqueda.</p>
            <button className="cp-btn-primary" onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setPublishedFilter('ALL'); setLevelFilter('ALL'); }}>
              Limpiar filtros
            </button>
          </div>
        )}

        {status === 'ok' && courses.length === 0 && (
          <div className="cp-empty">
            <span className="cp-empty-icon">📚</span>
            <p>No hay cursos todavía.</p>
            <button className="cp-btn-primary" onClick={() => setModal('create')}>
              Crear el primero
            </button>
          </div>
        )}

        {/* Grid de tarjetas */}
        {status === 'ok' && filteredCourses.length > 0 && (
          <div className={viewMode === 'grid' ? "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5" : "flex flex-col gap-5"}>
            {filteredCourses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} viewMode={viewMode} onEdit={openEdit} onDelete={confirmDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Modal: crear */}
      {modal === 'create' && (
        <Modal title="Nuevo curso" onClose={() => setModal(null)}>
          <CourseForm onSave={handleCreate} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}

      {/* Modal: editar */}
      {modal === 'edit' && editing && (
        <Modal title="Editar curso" onClose={() => { setModal(null); setEditing(null); }}>
          <CourseForm initial={editing} onSave={handleUpdate} onCancel={() => { setModal(null); setEditing(null); }} saving={saving} />
        </Modal>
      )}

      {/* Modal: confirmar eliminación */}
      {modal === 'confirm' && courseToDelete && (
        <Modal title="¿Eliminar curso?" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-5">
            <p className="cp-subheading" style={{ fontSize: '14px' }}>
              ¿Estás seguro de que deseas eliminar el curso <strong>{courseToDelete.name}</strong>? 
              Esta acción se puede deshacer durante los primeros 20 segundos.
            </p>

            <div className="cp-form-group">
              <label className="cp-label">Escribe <span className="text-red-600 font-black">ELIMINAR</span> para confirmar:</label>
              <input
                type="text"
                className="cp-input"
                placeholder="Escribe aquí..."
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button className="cp-btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button
                className="cp-btn-danger"
                onClick={initiateDelete}
                disabled={deleteConfirmText !== 'ELIMINAR'}
              >
                Sí, eliminar curso
              </button>
            </div>
          </div>
        </Modal>
      )}



      {/* Notificación Toast (solo para eliminación pendiente, o dejar que Swal maneje todo) */}
      {pendingDelete && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-50 flex items-center font-medium border border-slate-700 animate-[cp-fadeup_0.3s_ease]">
          {`🗑️ Se eliminará el curso en ${undoSeconds}s.`}
          <button className="cp-undo-btn" onClick={undoDelete}>
            Deshacer
          </button>
        </div>
      )}

    </div>
  );
};

export default CoursePage;