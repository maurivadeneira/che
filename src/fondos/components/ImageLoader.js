/**
 * Utilidad para cargar imágenes de fondos con mejor manejo de errores y respaldo
 */
export const getFondoImageUrl = (id) => {
  // Si no hay ID o es inválido, usar el placeholder
  if (!id || isNaN(parseInt(id))) {
    return "/images/fondos/fondo-placeholder.svg";
  }

  // Verificar si la imagen existe con su ID exacto
  const idNum = parseInt(id);
  
  // Lista de IDs disponibles
  const availableIds = [1, 2, 6, 8];
  
  // Si el ID no está en la lista de disponibles, usar el placeholder
  if (!availableIds.includes(idNum)) {
    return "/images/fondos/fondo-placeholder.svg";
  }

  // Devolver la ruta correcta a la imagen PNG
  return `/images/fondos/fondo-${id}.png`;
};

/**
 * Función que maneja errores de carga de imágenes en componentes
 * @param {Event} event - El evento de error
 * @param {boolean} useElement - Si debe crear un elemento en lugar de cambiar la src
 */
export const handleImageError = (event, useElement = false) => {
  // Eliminar el handler para evitar loops
  event.target.onerror = null;
  
  if (useElement) {
    // Crear un elemento div con el texto "Imagen en desarrollo"
    const div = document.createElement('div');
    div.innerHTML = 'Imagen en desarrollo';
    div.style.fontSize = '28px';
    div.style.color = '#888';
    div.style.fontWeight = 'normal';
    div.style.textAlign = 'center';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    
    // Reemplazar la imagen por el div
    if (event.target.parentNode) {
      event.target.parentNode.replaceChild(div, event.target);
    }
  } else {
    // Simplemente cambiar la src al placeholder
    event.target.src = "/images/placeholder-400x200.svg";
  }
};
