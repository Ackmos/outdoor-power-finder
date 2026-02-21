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
      try {
        const brandSlug = station.brand?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
        const stationname = station.name.toLowerCase().replace(/\s+/g, '-');
        const folderPath = `powerstations/${brandSlug}/${stationname}`;

        const resources = await cloudinary.search
          .expression(`folder:${folderPath}/*`)
          .sort_by('public_id', 'desc')
          .max_results(100)
          .execute();

        const allImages = resources.resources || [];

        // --- THUMBNAIL IDENTIFIZIEREN ---
        const thumbResource = allImages.find((r: any) => {
          const folderPathInCloudinary = (r.folder || "").toLowerCase();
          const publicId = (r.public_id || "").toLowerCase();
          const isInThumbnailFolder = folderPathInCloudinary.split('/').includes("thumbnail");
          const isPreviewFile = publicId.endsWith("-preview");
          return isInThumbnailFolder || isPreviewFile;
        });

        // --- GALERIE FILTERN ---
        const galleryUrls = allImages
          .filter((r: any) => {
            const folderPathInCloudinary = (r.folder || "").toLowerCase();
            const publicId = (r.public_id || "").toLowerCase();
            const isThumb = folderPathInCloudinary.split('/').includes("thumbnail") || publicId.endsWith("-preview");
            return !isThumb;
          })
          .map((r: any) => r.secure_url);

        const thumbnailUrl = thumbResource ? thumbResource.secure_url : null;

        // --- DEBUG: VOR DEM SCHREIBEN ---
        console.log(`[DB-PREPARE] ${station.name}:`, {
          thumb: thumbnailUrl ? "VOHANDEN" : "FEHLT",
          galleryCount: galleryUrls.length
        });

        // --- DATENBANK UPDATE (MIT 'SET' SYNTAX) ---
        const updatedStation = await prisma.powerstation.update({
          where: { id: station.id },
          data: {
            thumbnailUrl: thumbnailUrl,
            images: {
              set: galleryUrls // Explizites Überschreiben des Arrays
            },
          }
        });

        console.log(`[SYNC-SUCCESS] ${station.name}: DB-Update bestätigt.`);

        results.push({ 
          name: station.name, 
          galleryCount: galleryUrls.length, 
          hasThumbnail: !!thumbnailUrl,
          dbUpdated: !!updatedStation
        });

      } catch (stationError: any) {
        console.error(`[ERROR] Fehler bei Station ${station.name}:`, stationError.message);
        results.push({ name: station.name, error: stationError.message });
      }
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ 
      message: "Sync erfolgreich abgeschlossen", 
      details: results 
    });

  } catch (error: any) {
    console.error("[CRITICAL] Sync abgebrochen:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}