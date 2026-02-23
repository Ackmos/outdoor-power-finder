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

        const searchResponse = await cloudinary.search
          .expression(`folder:"${mainFolderPath}" OR folder:"${thumbnailFolderPath}"`)
          .sort_by('public_id', 'asc')
          .max_results(100)
          .execute();

        const allResources = searchResponse.resources || [];

        const processedResources = allResources.map((r: any) => {
          const parts = r.public_id.split('/');
          const derivedFolder = parts.slice(0, -1).join('/');
          return {
            ...r,
            calculatedFolder: normalize(derivedFolder)
          };
        });

        // ✅ ÄNDERUNG: Wir speichern nun die public_id statt der secure_url
        const galleryIds = processedResources
          .filter((r: any) => r.calculatedFolder === normalizedMain)
          .map((r: any) => r.public_id);

        // ✅ ÄNDERUNG: Auch beim Thumbnail nehmen wir die public_id
        const thumbResource = processedResources.find((r: any) => 
          r.calculatedFolder.endsWith('thumbnail')
        );

        let finalThumbnailId = thumbResource ? thumbResource.public_id : null;
        let usedFallback = false;

        if (!finalThumbnailId && galleryIds.length > 0) {
          finalThumbnailId = galleryIds[0];
          usedFallback = true;
        }

        // Datenbank Update mit den IDs
        await prisma.powerstation.update({
          where: { id: station.id },
          data: {
            thumbnailUrl: finalThumbnailId, // Speichert jetzt z.B. "powerstations/anker/..."
            images: { set: galleryIds },
          }
        });

        console.log(`[SYNC] ${station.name}: Galerie=${galleryIds.length} | Thumbnail=${finalThumbnailId ? (usedFallback ? "Fallback ✅" : "ID ✅") : "❌"}`);

        results.push({ name: station.name, galleryCount: galleryIds.length });

      } catch (stationError: any) {
        console.error(`❌ [ERROR] ${station.name}:`, stationError);
        results.push({ name: station.name, error: stationError?.message });
      }
    }

    revalidatePath("/");
    return NextResponse.json({ message: "Sync mit Public IDs abgeschlossen", details: results });

  } catch (error: any) {
    return NextResponse.json({ error: "Kritischer Fehler" }, { status: 500 });
  }
}