import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (token !== process.env.ADMIN_SYNC_TOKEN) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const stations = await prisma.powerstation.findMany({
      include: { brand: true }
    });

    

    const results = [];

    for (const station of stations) {
      const brandSlug = station.brand?.name.toLowerCase().replace(/\s+/g, '-') || 'unknown';
      const modelSlug = (station.slug || station.name.toLowerCase()).replace(/\s+/g, '-');
      
      const folderPath = `${brandSlug}/${modelSlug}`;

      // 1. Dateien im Hauptordner (Galerie) abrufen
      const { data: mainFiles } = await supabase.storage
      .from('powerstations')
      .list(folderPath, { sortBy: { column: 'name', order: 'asc' } });
      // 2. Dateien im Thumbnail-Unterordner abrufen
      const { data: thumbFiles } = await supabase.storage
        .from('powerstations')
        .list(`${folderPath}/thumbnail`);

      // 3. URLs generieren
      const galleryUrls = (mainFiles || [])
      .filter(f => f.name !== ".emptyKeepFile") // Systemdateien ignorieren
      .filter(f => f.name !== "thumbnail")      // 🚀 WICHTIG: Den Thumbnail-ORDNER ignorieren!
      .filter(f => f.metadata)                  // Nur Einträge mit Metadaten sind echte Dateien
      .map(f => supabase.storage.from('powerstations').getPublicUrl(`${folderPath}/${f.name}`).data.publicUrl);

      const thumbnailUrl = (thumbFiles && thumbFiles.length > 0)
      ? supabase.storage.from('powerstations').getPublicUrl(`${folderPath}/thumbnail/${thumbFiles[0].name}`).data.publicUrl
      : (galleryUrls[0] || null);

      // Ergänzung für dein Sync-Skript, um das Array zu säubern:
      const cleanedImages = galleryUrls.filter(url => !url.endsWith('/thumbnail'));

      await prisma.powerstation.update({
        where: { id: station.id },
        data: {
          images: { set: cleanedImages }, // Setzt das Array ohne den Ordner-Pfad neu
          thumbnailUrl: thumbnailUrl      // thumbnailUrl ist ja laut dir bereits korrekt
        }
      });

      // 4. Datenbank Update mit Prisma
      await prisma.powerstation.update({
        where: { id: station.id },
        data: {
          images: { set: galleryUrls },
          thumbnailUrl: thumbnailUrl
        }
      });

      results.push({ name: station.name, images: galleryUrls.length });
    }

    revalidatePath("/");
    return NextResponse.json({ message: "Supabase Sync abgeschlossen", details: results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}