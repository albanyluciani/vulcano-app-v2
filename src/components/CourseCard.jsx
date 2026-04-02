const CourseCard = ({ course, onEdit, onDelete, index }) => (
  <div className="cp-card hover:-translate-y-2 hover:scale-[1.03] hover:border-[var(--color-mid)] hover:shadow-[0_12px_0_var(--color-mid)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" style={{ animationDelay: `${index * 0.07}s` }}>
    <div className="flex justify-between items-center mb-3">
      <span className="cp-card-id">#{course.id}</span>
      <div className="flex gap-2">
        <span className={course.isPublished ? "cp-pill bg-blue-100 text-blue-700" : "cp-pill bg-gray-200 text-gray-700"}>
          {course.isPublished ? '📝 Publicado' : 'Oculto'}
        </span>
      </div>
    </div>

    {course.imageUrl && (
      <img src={course.imageUrl} alt={course.name} className="w-full h-40 object-cover rounded-xl mt-1 mb-4 shadow-sm" />
    )}
    {!course.imageUrl && (
      <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-indigo-50 rounded-xl mt-1 mb-4 flex items-center justify-center shadow-sm">
        <span className="text-5xl opacity-40">🌋</span>
      </div>
    )}

    <h3 className="cp-card-title">{course.name || 'Sin nombre'}</h3>

    {course.description && (
      <p className="cp-card-desc">{course.description}</p>
    )}

    <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
      <span className="cp-pill bg-purple-100 text-purple-700">
        🎓 {course.courseLevel}
      </span>
      <span className={course.status === 'ACTIVE' ? "cp-pill bg-green-100 text-green-700" : "cp-pill bg-red-100 text-red-700"}>
        {course.status === 'ACTIVE' ? '🟢 Activo' : '🔴 Inactivo'}
      </span>
    </div>

    <div className="flex gap-2 mt-1">
      <button className="cp-card-btn cp-card-edit flex-1" onClick={() => onEdit(course)}>Editar</button>
      <button className="cp-card-btn cp-card-delete flex-1" onClick={() => onDelete(course.id)}>Eliminar</button>
    </div>
  </div>
);

export default CourseCard;
