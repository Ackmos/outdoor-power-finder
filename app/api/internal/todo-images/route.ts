import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ENRICH_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const todoList = await prisma.powerstation.findMany({
      where: {
        OR: [
          { images: { equals: null } }, // Findet die echten NULL-Werte aus deinem Screenshot
          { images: { isEmpty: true } } // Findet Einträge, die ein leeres Array [] haben
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        // Wichtig für die Cloudinary-Ordnerstruktur im Worker-Skript
        brand: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(todoList);
  } catch (error: any) {
    console.error("Fehler beim Abrufen der Todo-Liste:", error.message);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}