// src/lib/cloudinary-loader.ts

export function getOptimizedImage(url: string, width = 800, height = 800) {
  if (!url || !url.includes("cloudinary.com")) return url;

  // Wir fügen die Parameter nach "/upload/" ein
  const transformationString = `f_auto,q_auto,c_pad,b_white,w_${width},h_${height}`;
  return url.replace("/upload/", `/upload/${transformationString}/`);
}