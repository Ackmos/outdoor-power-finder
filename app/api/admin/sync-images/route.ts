// src/app/api/admin/sync-images/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (token !== process.env.ADMIN_SYNC_TOKEN) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const stations = await prisma.powerstation.findMany({
      include: { brand: true },
    });

    const results = [];

    for (const station of stations) {
      const brandSlug = station.brand.name.toLowerCase().replace(/\s+/g, '-');
      const stationname = station.name.toLowerCase().replace(/\s+/g, '-');
      
      // Wir suchen im Hauptordner UND allen Unterordnern (/*)
      const folderPath = `powerstations/${brandSlug}/${stationname}`;

      const resources = await cloudinary.search
        .expression(`folder:${folderPath}/*`)
        .sort_by('public_id', 'desc')
        .max_results(100)
        .execute();

      const allImages = resources.resources;

      // --- LOGIK-UPDATE: TRENNUNG VON THUMBNAIL UND GALERIE ---
      
      // 1. Das Thumbnail finden (liegt im Unterordner /thumbnail)
      const thumbResource = allImages.find((r: any) => 
        r.folder.endsWith('/thumbnail')
      );

      // 2. Die Galerie-Bilder filtern (alles, was NICHT im /thumbnail Ordner liegt)
      const galleryUrls = allImages
        .filter((r: any) => !r.folder.endsWith('/thumbnail'))
        .map((r: any) => r.secure_url);

      const thumbnailUrl = thumbResource ? thumbResource.secure_url : null;

      console.log(`[SYNC] ${station.name}: Thumbnail ${thumbnailUrl ? '✅' : '❌'} | Galerie: ${galleryUrls.length} Bilder`);

      // Datenbank-Update mit beiden Feldern
      await prisma.powerstation.update({
        where: { id: station.id },
        data: {
          images: galleryUrls,
          thumbnailUrl: thumbnailUrl, // Jetzt wird auch das Thumbnail-Feld befüllt
        }
      });

      results.push({ 
        name: station.name, 
        galleryCount: galleryUrls.length, 
        hasThumbnail: !!thumbnailUrl 
      });
    }

    // Revalidation der betroffenen Seiten
    revalidatePath("/"); 
    revalidatePath("/powerstation-test/[slug]", "page"); 
    revalidatePath("/vergleich/[slug]", "page");

    return NextResponse.json({ 
      message: "Sync erfolgreich abgeschlossen", 
      details: results 
    });

  } catch (error: any) {
    console.error("Sync Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}