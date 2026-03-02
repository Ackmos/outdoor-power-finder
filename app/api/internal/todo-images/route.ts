import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ENRICH_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Wir laden alle Stationen und prüfen die Bild-Anzahl im Code
    const allStations = await prisma.powerstation.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true, // Wir brauchen das Array zum Zählen
        brand: { select: { name: true } }
      }
    });

    // Filter: Nur Stationen mit weniger als 5 Bildern
    const todoList = allStations
      .map(s => ({
        ...s,
        currentCount: Array.isArray(s.images) ? s.images.length : 0,
        missingCount: 5 - (Array.isArray(s.images) ? s.images.length : 0)
      }))
      .filter(s => s.missingCount > 0);

    return NextResponse.json(todoList);
  } catch (error: any) {
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}