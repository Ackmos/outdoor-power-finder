// src/app/api/admin/sync-images/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary"; // Deine Cloudinary-Konfiguration

export async function GET(req: Request) {
  // Sicherheits-Check: Nur mit korrektem Token ausführbar
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
      // Pfad zum Cloudinary-Ordner der Station
      const folderPath = `powerstations/${station.brand.name.toLowerCase()}/${station.slug}`;

      // Ressourcen aus Cloudinary abrufen
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPath,
        max_results: 100
      });

      const imageUrls = resources.resources.map((r: any) => r.secure_url);
      

      // Datenbank-Update
      await prisma.powerstation.update({
        where: { id: station.id },
        data: {
          images: imageUrls,

        }
      });

      results.push({ name: station.name, count: imageUrls.length });
    }

    return NextResponse.json({ message: "Sync erfolgreich", details: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}