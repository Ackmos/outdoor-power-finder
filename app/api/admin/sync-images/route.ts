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
    const normalize = (path: string) => (path || "").replace(/^\/+|\/+$/g, "").toLowerCase();

    for (const station of stations) {
      try {
        const brandSlug = station.brand?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
        const stationSlug = station.name.toLowerCase().replace(/\s+/g, '-');
        
        const mainFolderPath = `powerstations/${brandSlug}/${stationSlug}`;
        const thumbnailFolderPath = `${mainFolderPath}/thumbnail`;
        const normalizedMain = normalize(mainFolderPath);

        // ✅ EXAKTE SUCHE: Wir suchen nur in diesen zwei spezifischen Ordnern
        // Die Anführungszeichen (") sind wichtig, falls Leerzeichen in Pfaden vorkommen
        const searchResponse = await cloudinary.search
          .expression(`folder:"${mainFolderPath}" OR folder:"${thumbnailFolderPath}"`)
          .sort_by('public_id', 'asc')
          .max_results(100)
          .execute();

        const allResources = searchResponse.resources || [];

        // Ordnerpfad aus der public_id berechnen (als Sicherheitsnetz)
        const processedResources = allResources.map((r: any) => {
          const parts = r.public_id.split('/');
          const derivedFolder = parts.slice(0, -1).join('/');
          return {
            ...r,
            calculatedFolder: normalize(derivedFolder)
          };
        });
        console.log(processedResources.map((r: any) => r.calculatedFolder));
        // 1. Galerie-Bilder (exakt im Hauptordner)
        const galleryUrls = processedResources
          .filter((r: any) => r.calculatedFolder === normalizedMain)
          .map((r: any) => r.secure_url);

        // 2. Thumbnail (im /thumbnail Ordner)
        const thumbResource = processedResources.find((r: any) => 
          r.calculatedFolder.endsWith('thumbnail')
        );

        let finalThumbnailUrl = thumbResource ? thumbResource.secure_url : null;
        let usedFallback = false;

        if (!finalThumbnailUrl && galleryUrls.length > 0) {
          finalThumbnailUrl = galleryUrls[0];
          usedFallback = true;
        }

        // Datenbank Update
        await prisma.powerstation.update({
          where: { id: station.id },
          data: {
            thumbnailUrl: finalThumbnailUrl,
            images: { set: galleryUrls },
          }
        });

        console.log(`[SYNC] ${station.name}: Galerie=${galleryUrls.length} | Thumbnail=${finalThumbnailUrl ? (usedFallback ? "Fallback ✅" : "Ordner ✅") : "❌"}`);

        results.push({ name: station.name, galleryCount: galleryUrls.length });

      } catch (stationError: any) {
        console.error(`❌ [ERROR] ${station.name}:`, stationError);
        results.push({ name: station.name, error: stationError?.message });
      }
    }

    revalidatePath("/");
    return NextResponse.json({ message: "Sync präzise abgeschlossen", details: results });

  } catch (error: any) {
    return NextResponse.json({ error: "Kritischer Fehler" }, { status: 500 });
  }
}