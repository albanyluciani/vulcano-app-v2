import { useState } from 'react';
import Swal from 'sweetalert2';

/**
 * OBJETO MOLDE: emptyForm
 * Estado inicial limpio. Se utiliza cuando el usuario presiona "Nuevo curso".
 * Si presiona "Editar", en lugar de esto, se usan los datos pre-existentes del curso.
 */
export const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  courseLevel: 'BEGINNER',
  isPublished: false,
  status: 'ACTIVE',
};

/**
 * COMPONENTE: CourseForm (Formulario de Cursos)
 * Es responsable de leer, almacenar temporalmente y validar lo que el usuario 
 * teclea en las cajas de texto y selects, para enviárselo completo a CoursePage.
 * 
 * @param {Object} initial - Los datos iniciales con los que arranca el formulario.
 * @param {Function} onSave - Función padre a ejecutar cuando el usuario le da a "Guardar".
 * @param {Function} onCancel - Función padre a ejecutar para cerrar el formulario.
 * @param {Boolean} saving - Variable que bloquea el botón si está cargando.
 */
const CourseForm = ({ initial = emptyForm, onSave, onCancel, saving }) => {
  // Guardamos los datos que el usuario va escribiendo de forma local usando un "Hook" (useState).
  const [form, setForm] = useState(initial);

  // Función Avanzada "Curry": set('name') crea una función dinámica al vuelo.
  // Cuando el usuario teclea algo, esta función clona los datos anteriores (...f)
  // y reemplaza única y exclusivamente el valor de la clave (key) que le pasemos.
  const set = key => e => setForm(f => ({
    ...f,
    // [key] es una propiedad calculada. Si el evento vino de una caja tipo "checkbox",
    // capturamos su estado booleano (e.target.checked). Si fue un input o select, su valor (e.target.value).
    [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  }));

  /**
   * Función que valida los campos antes de enviar los datos al componente padre.
   */
  const handleSubmit = () => {
    // Verificamos que el nombre y la descripción no estén vacíos ni solo tengan espacios
    if (!form.name.trim() || !form.description.trim()) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, ingresa al menos el nombre y la descripción del curso.",
        icon: "warning",
        confirmButtonColor: "#472825",
        background: "#fff4e2",
        color: "#472825"
      });
      return;
    }
    // Si pasa la validación, llamamos al onSave original
    onSave(form);
  };

  return (
    // Contenedor principal del formulario. Colocamos todo en columna con flex-col y gap-4 (espaciado).
    <div className="flex flex-col gap-4">

      {/* ----------------- CAMPO: NOMBRE DEL CURSO ----------------- */}
      <div className="flex flex-col gap-1 cp-form-group">
        <label className="cp-label">Nombre del curso</label>
        {/* Usamos value={} para forzar a que la caja de texto siempre muestre lo que tenemos en la memoria (form.name).
            Usamos onChange={} para atrapar cada letra que el usuario teclea y mandarla a guardar. */}
        <input className="cp-input" type="text" maxLength={50} placeholder="Ej: Java desde cero" value={form.name} onChange={set('name')} />
      </div>

      {/* ----------------- CAMPO: DESCRIPCIÓN ----------------- */}
      <div className="flex flex-col gap-1 cp-form-group">
        <label className="cp-label">Descripción</label>
        {/* textarea permite que la caja tenga múltiples renglones (rows=3). */}
        <textarea className="cp-input cp-textarea" placeholder="¿De qué trata este curso?" rows={3} value={form.description} onChange={set('description')} />
      </div>

      {/* ----------------- CAMPO: URL DE LA IMAGEN ----------------- */}
      <div className="flex flex-col gap-1 cp-form-group">
        <label className="cp-label">URL de la Imagen</label>
        <input className="cp-input" type="text" placeholder="https://ejemplo.com/imagen.jpg" value={form.imageUrl} onChange={set('imageUrl')} />
      </div>

      {/* ----------------- GRID DE DOS COLUMNAS: NIVEL Y ESTADO ----------------- */}
      {/* Esto crea dos columnas en pantallas medianas (sm:grid-cols-2) o una columna en celulares (grid-cols-1). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Selector de Nivel de Dificultad */}
        <div className="flex flex-col gap-1 cp-form-group">
          <label className="cp-label">Nivel</label>
          <select className="cp-input" value={form.courseLevel} onChange={set('courseLevel')}>
            <option value="BEGINNER">🐣 Principiante</option>
            <option value="INTERMEDIATE">🛠️ Intermedio</option>
            <option value="ADVANCED">🔥 Avanzado</option>
          </select>
        </div>

        {/* Selector de Estado (Activo o Inactivo) */}
        <div className="flex flex-col gap-1 cp-form-group">
          <label className="cp-label">Estado</label>
          <select className="cp-input" value={form.status} onChange={set('status')}>
            <option value="ACTIVE">🟢 Activo</option>
            <option value="INACTIVE">🔴 Inactivo</option>
          </select>
        </div>

      </div>

      {/* ----------------- CHECKBOX: PUBLICACIÓN RÁPIDA ----------------- */}
      <div className="flex items-center gap-2 mt-2">
        {/* Tipo checkbox se comporta un poco distinto a los inputs de texto normales en React */}
        <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={set('isPublished')} />
        {/* htmlFor="isPublished" hace que si el usuario presiona las letras del label, se marque la cajita automáticamente */}
        <label htmlFor="isPublished" className="cp-label cursor-pointer mb-0 !text-blue-600 flex items-center gap-1.5">
          <span className="text-xl leading-none">🌐</span> Publicar inmediatamente
        </label>
      </div>

      {/* ----------------- BOTONES DE GUARDADO / CANCELACIÓN ----------------- */}
      <div className="flex gap-3 justify-end mt-2">
        {/* El botón secundario simplemente avisa hacia "arriba" (el componente padre) que queremos cancelar */}
        <button className="cp-btn-secondary" onClick={onCancel}>Cancelar</button>

        {/* El grandioso botón verde primario. 
            onClick={() => handleSubmit()} le envía todo el empaquetado final a la página principal tras validar.
            disabled={saving} es para evitar que el usuario de doble clic si el internet está lento guardando. */}
        <button className="cp-btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar curso'}
        </button>
      </div>
    </div>
  );
};

export default CourseForm;
