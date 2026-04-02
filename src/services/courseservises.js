const API = "http://localhost:8080/api/courses";

export const getCourses = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error backend al obtener cursos");
  return await res.json();
};

export const createCourse = async (course) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error("Error al crear curso");
  return await res.json();
};

export const updateCourse = async (id, course) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error("Error al actualizar curso");
  return await res.json();
};

export const deleteCourse = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Error al eliminar curso");
  return true;
};