// src/lib/cloudinary-loader.ts

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps) {
  // Wir nutzen deine Cloudinary-ID (Cloud Name)
  const cloudName = 'dw8mkffls';
  
  // Parameter für Cloudinary: Format-Auto, Qualität-Auto, Breite, Padding und weißer Hintergrund
  const params = [
    'f_auto',
    'q_auto',
    `w_${width}`,
    'c_pad',
    'b_white'
  ].join(',');

  // Sicherheit: Wir entfernen einen führenden Slash, falls vorhanden, 
  // damit die URL nicht // bekommt
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

  // Die fertige URL, die direkt auf Cloudinary zeigt
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${cleanSrc}`;
}