// src/app/api/enrich/image/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ENRICH_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, thumbnailUrl, galleryUrls, append } = await req.json();

    const station = await prisma.powerstation.findUnique({
      where: { id },
      include: { brand: true }
    });

    if (!station) return NextResponse.json({ error: 'Station not found' }, { status: 404 });

    const brandFolder = (station.brand?.name || "unknown").toLowerCase().replace(/\s+/g, '-');
    const modelFolder = (station.slug || station.name.toLowerCase()).replace(/\s+/g, '-');
    const basePath = `${brandFolder}/${modelFolder}`;

    // Hilfsfunktion zum Downloaden und Hochladen nach Supabase
    async function uploadToSupabase(url: string, path: string) {
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..." }
        });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        
        const blob = await response.blob();
        const { data, error } = await supabase.storage
          .from('powerstations')
          .upload(path, blob, { contentType: 'image/png', upsert: true });

        if (error) throw error;
        return supabase.storage.from('powerstations').getPublicUrl(path).data.publicUrl;
      } catch (err) {
        console.error(`Upload failed for ${url}:`, err);
        return null;
      }
    }

    // --- 1. THUMBNAIL UPLOAD ---
    let finalThumbnail = station.thumbnailUrl;
    // Wir laden ein neues Thumbnail nur hoch, wenn noch keines existiert oder append false ist
    if (thumbnailUrl && (!station.thumbnailUrl || !append)) {
      const thumbPath = `${basePath}/thumbnail/main-thumb.png`;
      const uploadedUrl = await uploadToSupabase(thumbnailUrl, thumbPath);
      if (uploadedUrl) finalThumbnail = uploadedUrl;
    }

    // --- 2. GALERIE UPLOAD (APPEND LOGIK) ---
    const existingImages = (Array.isArray(station.images) && append) ? (station.images as string[]) : [];
    const newUploadedUrls: string[] = [];
    
    // Wir berechnen, wie viele Bilder wir noch hinzufügen dürfen (max. 5 insgesamt)
    const maxNewImages = 5 - existingImages.length;

    if (galleryUrls && galleryUrls.length > 0 && maxNewImages > 0) {
      // Wir nehmen nur so viele neue URLs, wie noch Platz ist
      const limitedGalleryUrls = galleryUrls.slice(0, maxNewImages);

      for (const [index, url] of limitedGalleryUrls.entries()) {
        // Der Dateiname nutzt den Index basierend auf den bereits vorhandenen Bildern
        const fileIndex = existingImages.length + index + 1;
        const filePath = `${basePath}/gallery-${fileIndex}.png`;
        
        const uploadedUrl = await uploadToSupabase(url, filePath);
        if (uploadedUrl) newUploadedUrls.push(uploadedUrl);
      }
    }

    // Kombinieren der alten und neuen Bilder
    const finalGallery = [...existingImages, ...newUploadedUrls];

    // --- 3. DATENBANK UPDATE ---
    await prisma.powerstation.update({
      where: { id },
      data: {
        thumbnailUrl: finalThumbnail,
        images: { set: finalGallery }
      },
    });

    return NextResponse.json({ 
      success: true, 
      totalImages: finalGallery.length,
      newImages: newUploadedUrls.length,
      thumbnail: !!finalThumbnail
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
  }
}