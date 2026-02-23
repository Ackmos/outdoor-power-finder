// scripts/sync-json-to-db.ts
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const jsonPath = path.join(process.cwd(), 'prisma/data.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`📂 Abgleich von ${data.powerstations.length} Stationen startet...`);

  for (const stationJson of data.powerstations) {
    const cleanSlug = stationJson.slug.trim(); // ✅ Leerzeichen entfernen
    const cleanUrl = stationJson.affiliateUrl.trim();

    if (cleanUrl !== "") {
      // Wir nutzen updateMany, falls 'slug' kein Unique-Key im Schema ist
      const result = await prisma.powerstation.updateMany({
        where: { 
          slug: { equals: cleanSlug } 
        },
        data: { affiliateUrl: cleanUrl },
      });

      if (result.count > 0) {
        console.log(`✅ ${cleanSlug}: Link aktualisiert.`);
      } else {
        console.error(`⚠️  ${cleanSlug}: Nicht in der Datenbank gefunden!`);
      }
    }
  }
}

main().finally(() => prisma.$disconnect());