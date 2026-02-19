import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  // 1. Auth-Check (wie gehabt)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ENRICH_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, imageUrls } = await req.json();

    if (!id || !Array.isArray(imageUrls)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 2. Powerstation-Daten laden (für Marken- und Modellnamen)
    const station = await prisma.powerstation.findUnique({
      where: { id },
      include: { brand: true } // Falls du eine Relation zu einer Brand-Tabelle hast
    });

    if (!station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Pfad-Logik: powerstations/brand-name/model-name
    // Wir säubern die Namen (kleinschreiben, Leerzeichen durch Bindestriche ersetzen)
    const brandFolder = station.brand?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    const modelFolder = station.name.toLowerCase().replace(/\s+/g, '-');
    const cloudinaryFolderPath = `powerstations/${brandFolder}/${modelFolder}`;

    console.log(`Starte Upload von ${imageUrls.length} Bildern nach: ${cloudinaryFolderPath}`);

    // 3. Bilder nacheinander zu Cloudinary hochladen
    const uploadedUrls: string[] = [];

    for (const [index, url] of imageUrls.entries()) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(url, {
          folder: cloudinaryFolderPath,
          // Eindeutige ID: z.B. bluetti-ac70-1, bluetti-ac70-2
          public_id: `${modelFolder}-${index + 1}`,
          overwrite: true,
          transformation: [
            { width: 1200, crop: "limit" }, // Qualitätssicherung
            { fetch_format: "auto", quality: "auto" }
          ]
        });
        uploadedUrls.push(uploadResponse.secure_url);
      } catch (uploadError) {
        console.error(`Fehler beim Upload von Bild ${index + 1}:`, uploadError);
        // Wir machen trotzdem mit dem nächsten Bild weiter
      }
    }

    // 4. Datenbank mit dem neuen Array aktualisieren
    if (uploadedUrls.length > 0) {
      await prisma.powerstation.update({
        where: { id },
        data: {
          images: uploadedUrls, // Speichert das Array der Cloudinary-URLs
          // Optional: Setze das erste Bild als Hauptbild, falls du noch ein einzelnes Feld hast
          //images: uploadedUrls[0] 
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      count: uploadedUrls.length,
      folder: cloudinaryFolderPath 
    });

  } catch (error: any) {
    console.error("Enrichment API Error:", error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}