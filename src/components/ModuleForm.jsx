import { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import { emptyModule } from '../constants/moduleConstants';
import storage from '../helpers/storage';

const ModuleForm = ({ initial = emptyModule, onSave, onCancel, saving }) => {
  const isEditing = !!initial.id;
  
  // Intentar cargar borrador solo si NO estamos editando
  const savedDraft = !isEditing ? storage.get('module_form_draft') : null;
  
  const [form, setForm] = useState(savedDraft || initial);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(
    initial.courseId || initial.course?.id || savedDraft?.courseId || ''
  );

  // Sincronizar cuando cambia el inicial (ej: al abrir editar)
  useEffect(() => {
    if (isEditing) {
      setForm(initial);
      setSelectedCourseId(initial.courseId || initial.course?.id || '');
    }
  }, [initial, isEditing]);

  // Guardar borrador automáticamente si es un nuevo módulo
  useEffect(() => {
    if (!isEditing) {
      storage.set('module_form_draft', { ...form, courseId: selectedCourseId });
    }
  }, [form, selectedCourseId, isEditing]);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const setContent = (key) => (e) =>
    setForm((f) => ({
      ...f,
      content: { ...f.content, [key]: e.target.value }
    }));

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const clearDraft = () => {
    storage.remove('module_form_draft');
  };

  const handleSave = () => {
    onSave(form, selectedCourseId);
    if (!isEditing) clearDraft();
  };

  return (
    <div className="mv-form">
      <div className="mv-form-group">
        <label className="mv-label">Curso</label>
        <select
          className="mv-input"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">Selecciona un curso</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mv-form-group">
        <label className="mv-label">Nombre del módulo</label>
        <input
          className="mv-input"
          type="text"
          maxLength={80}
          placeholder="Ej: Variables y tipos de datos"
          value={form.content.name}
          onChange={setContent('name')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">Descripción</label>
        <textarea
          className="mv-input mv-textarea"
          placeholder="¿Qué aprenderá el estudiante en este módulo?"
          rows={3}
          value={form.content.description}
          onChange={setContent('description')}
        />
      </div>

      <div className="mv-form-row">
        <div className="mv-form-group">
          <label className="mv-label">Orden</label>
          <input
            className="mv-input"
            type="number"
            min={1}
            value={form.content.orderIndex}
            onChange={setContent('orderIndex')}
          />
        </div>
        <div className="mv-form-group">
          <label className="mv-label">Duración (min)</label>
          <input
            className="mv-input"
            type="number"
            min={1}
            value={form.durationInMinutes}
            onChange={setField('durationInMinutes')}
          />
        </div>
      </div>

      <div className="mv-form-group">
        <label className="mv-label">URL del Video</label>
        <input
          className="mv-input"
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.videoUrl}
          onChange={setField('videoUrl')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">URL del Markdown (Texto)</label>
        <input
          className="mv-input"
          type="text"
          placeholder="https://example.com/lesson.md"
          value={form.markdownUrl}
          onChange={setField('markdownUrl')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">URL del Juego Interactivo</label>
        <input
          className="mv-input"
          type="text"
          placeholder="https://wordwall.net/..."
          value={form.interactiveGameUrl}
          onChange={setField('interactiveGameUrl')}
        />
      </div>

      <div className="mv-form-group">
        <label className="mv-label">Estado</label>
        <select className="mv-input" value={form.status} onChange={setField('status')}>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      <div className="mv-form-actions">
        <button className="mv-btn mv-btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="mv-btn mv-btn-primary"
          onClick={handleSave}
          disabled={saving || !form.content.name.trim() || !selectedCourseId}
        >
          {saving ? 'Guardando...' : 'Guardar módulo'}
        </button>
      </div>
    </div>
  );
};

export default ModuleForm;
