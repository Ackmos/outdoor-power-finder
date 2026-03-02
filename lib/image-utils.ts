// src/lib/image-utils.ts

export function getCloudinaryId(path: string): string {
  if (!path) return "";
  
  // ✅ FIX: Wenn es eine Supabase-URL ist, geben wir sie 1:1 zurück
  if (path.includes('supabase.co')) {
    return path;
  }

  let id = path;
  
  if (path.startsWith('http')) {
    const parts = path.split('/upload/');
    if (parts.length > 1) {
      id = parts[1].replace(/^v\d+\//, '');
      // ... restliche Logik
    }
  }

  return id.startsWith('/') ? id.slice(1) : id;
}