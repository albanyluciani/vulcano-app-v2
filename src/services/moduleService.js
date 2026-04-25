// URL relativa: el proxy de Vite redirige /api/* a localhost:8080
// Igual que courseService.js y scheduleService.js
const API = "/api/modules";

export const getModules = async () => {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Error backend al obtener módulos");
  return await res.json();
};

export const createModule = async (mod) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mod)
  });
  if (!res.ok) throw new Error("Error al crear módulo");
  return await res.json();
};

export const updateModule = async (id, mod) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mod)
  });
  if (!res.ok) throw new Error("Error al actualizar módulo");
  return await res.json();
};

export const deleteModule = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Error al eliminar módulo");
  return true;
};
