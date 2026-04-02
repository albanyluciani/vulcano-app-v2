import { useState } from 'react';

export const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  courseLevel: 'BEGINNER',
  isPublished: false,
  status: 'ACTIVE',
};

const CourseForm = ({ initial = emptyForm, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial);
  const set = key => e => setForm(f => ({ 
    ...f, 
    [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value 
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="cp-label">Nombre del curso</label>
        <input className="cp-input" type="text" maxLength={50} placeholder="Ej: Java desde cero" value={form.name} onChange={set('name')} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="cp-label">Descripción</label>
        <textarea className="cp-input cp-textarea" placeholder="¿De qué trata este curso?" rows={3} value={form.description} onChange={set('description')} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="cp-label">URL de la Imagen</label>
        <input className="cp-input" type="text" placeholder="https://ejemplo.com/imagen.jpg" value={form.imageUrl} onChange={set('imageUrl')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="cp-label">Nivel</label>
          <select className="cp-input" value={form.courseLevel} onChange={set('courseLevel')}>
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="ADVANCED">Avanzado</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="cp-label">Estado</label>
          <select className="cp-input" value={form.status} onChange={set('status')}>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={set('isPublished')} />
        <label htmlFor="isPublished" className="cp-label cursor-pointer mb-0">Publicar inmediatamente</label>
      </div>

      <div className="flex gap-3 justify-end mt-2">
        <button className="cp-btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="cp-btn-primary" onClick={() => onSave(form)} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar curso'}
        </button>
      </div>
    </div>
  );
};

export default CourseForm;
