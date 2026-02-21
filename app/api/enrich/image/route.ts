// src/app/api/enrich/image/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ENRICH_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, thumbnailUrl, galleryUrls } = await req.json();

    const station = await prisma.powerstation.findUnique({
      where: { id },
      include: { brand: true }
    });

    if (!station) return NextResponse.json({ error: 'Station not found' }, { status: 404 });

    const brandFolder = station.brand?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    const modelFolder = station.name.toLowerCase().replace(/\s+/g, '-');
    
    const mainPath = `powerstations/${brandFolder}/${modelFolder}`;
    const thumbPath = `${mainPath}/thumbnail`;

    let finalThumbnail = station.thumbnailUrl; // Behalte altes Thumbnail, falls kein neues kommt
    const finalGallery: string[] = [];

    // --- 1. THUMBNAIL UPLOAD (Verbraucht 1 Credit des AI Add-ons) ---
    // Wir prüfen zusätzlich, ob station.thumbnailUrl schon existiert, 
    // um ein doppeltes Verarbeiten (und damit Credit-Verlust) zu vermeiden.
    if (thumbnailUrl && !station.thumbnailUrl) {
      try {
        const res = await cloudinary.uploader.upload(thumbnailUrl, {
          folder: thumbPath,
          public_id: `${modelFolder}-preview`,
          overwrite: true,
          transformation: [
            { effect: "background_removal" }, // NUR HIER wird der Credit verbraucht
            { width: 1200, height: 1200, crop: "pad", background: "transparent" },
            { fetch_format: "png" }
          ]
        });
        finalThumbnail = res.secure_url;
        console.log(`[AI] Hintergrund entfernt für ${station.name}`);
      } catch (err) {
        console.error("AI Background Removal Error:", err);
      }
    }

    // --- 2. GALERIE UPLOAD (Kostenlos / Standard) ---
    if (galleryUrls && galleryUrls.length > 0) {
      for (const [index, url] of galleryUrls.entries()) {
        try {
          const res = await cloudinary.uploader.upload(url, {
            folder: mainPath,
            public_id: `${modelFolder}-gallery-${index + 1}`,
            overwrite: true,
            transformation: [
              { width: 1500, crop: "limit" },
              { fetch_format: "auto", quality: "auto" }
              // KEIN background_removal hier!
            ]
          });
          finalGallery.push(res.secure_url);
        } catch (err) { console.error("Gallery Upload Error", err); }
      }
    }

    // 3. DATENBANK UPDATE
    await prisma.powerstation.update({
      where: { id },
      data: {
        thumbnailUrl: finalThumbnail,
        images: {
          set: finalGallery.length > 0 ? finalGallery : station.images
        }
      },
    });

    return NextResponse.json({ 
      success: true, 
      aiProcessed: !!(thumbnailUrl && !station.thumbnailUrl),
      galleryCount: finalGallery.length 
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
  }
}