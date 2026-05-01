/**
 * Storage Helper - Manejo centralizado de localStorage para Vulcano App.
 * Permite guardar, obtener y eliminar datos de forma segura (con manejo de JSON).
 */

const storage = {
  /**
   * Guarda un valor en localStorage.
   * @param {string} key - La clave.
   * @param {any} value - El valor (se convertirá a JSON).
   */
  set: (key, value) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(`vulcano_${key}`, stringValue);
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
    }
  },

  /**
   * Obtiene un valor de localStorage.
   * @param {string} key - La clave.
   * @returns {any|null} - El valor parseado o null si no existe.
   */
  get: (key) => {
    try {
      const value = localStorage.getItem(`vulcano_${key}`);
      if (!value) return null;
      // Intentar parsear como JSON, si falla devolver el string original
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Elimina una clave de localStorage.
   * @param {string} key - La clave.
   */
  remove: (key) => {
    localStorage.removeItem(`vulcano_${key}`);
  },

  /**
   * Limpia todas las claves que empiecen con el prefijo 'vulcano_'.
   */
  clearApp: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('vulcano_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

export default storage;
