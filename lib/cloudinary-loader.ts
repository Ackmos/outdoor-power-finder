// src/lib/cloudinary-loader.ts

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps) {
  // ✅ FIX: Wenn die src bereits eine komplette URL ist (Supabase), 
  // geben wir sie einfach direkt zurück.
  if (src.startsWith('http')) {
    return src;
  }

  const cloudName = 'dw8mkffls';
  const validatedWidth = width > 2000 ? 2000 : width;
  
  const params = [
    'f_auto',
    'q_auto',
    `w_${validatedWidth}`,
    'c_pad',
    'b_white'
  ].join(',');

  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanSrc}`;
}