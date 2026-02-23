// src/lib/image-utils.ts
export function getCloudinaryId(path: string): string {
  if (!path) return "";
  
  let id = path;
  
  // Falls noch eine komplette URL drinsteckt, kürzen wir sie
  if (path.startsWith('http')) {
    const parts = path.split('/upload/');
    if (parts.length > 1) {
      // Wir nehmen alles nach /upload/ und entfernen die Version (v123...)
      id = parts[1].replace(/^v\d+\//, '');
      // Wir entfernen auch eventuelle Transformations-Strings, die noch in der DB stehen könnten
      if (id.includes('/')) {
         const subParts = id.split('/');
         // Wenn der erste Teil Transformationen enthält (z.B. f_auto), nehmen wir den Rest
         if (subParts[0].includes('_')) {
           id = subParts.slice(1).join('/');
         }
      }
    }
  }

  // ✅ WICHTIG: KEIN führender Slash mehr für den Custom Loader!
  return id.startsWith('/') ? id.slice(1) : id;
}