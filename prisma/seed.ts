import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const filePath = path.join(process.cwd(), 'prisma', 'data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { brands, powerstations, devices } = JSON.parse(fileContent);

  console.log("🚀 Starte Seeding...");

  // 1. Brands anlegen (Erweitert um Descriptions)
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug }, // Slug ist meist stabiler als Name für den Check
      update: { 
        name: b.name, 
        description: b.description,
        description_section: b.description_section 
      },
      create: { 
        name: b.name, 
        slug: b.slug,
        description: b.description,
        description_section: b.description_section
      },
    });
  }
  console.log("✅ Marken inkl. Beschreibungen geladen");

  // 2. Powerstations anlegen
  for (const p of powerstations) {
    const brand = await prisma.brand.findUnique({ where: { name: p.brandName } });
    if (!brand) {
      console.warn(`⚠️ Marke ${p.brandName} nicht gefunden für Powerstation ${p.name}`);
      continue;
    }

    const { brandName, ...data } = p;
    await prisma.powerstation.upsert({
      where: { slug: p.slug },
      update: { ...data, brandId: brand.id },
      create: { ...data, brandId: brand.id },
    });
  }
  console.log("✅ Powerstations geladen");

  // 3. Endgeräte anlegen
  for (const d of devices) {
    await prisma.device.upsert({
      where: { slug: d.slug },
      update: d,
      create: d,
    });
  }
  console.log("✅ Endgeräte geladen");
}

main()
  .catch((e) => {
    console.error("❌ Fehler beim Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });