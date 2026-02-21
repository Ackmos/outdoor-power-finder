import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🧹 Starte Reinigung der Bild-Daten...");

  const result = await prisma.powerstation.updateMany({
    data: {
      thumbnailUrl: null, // Setzt das Feld auf leer
      images: [],         // Setzt das Array auf leer
    },
  });

  console.log(`✅ Fertig! ${result.count} Powerstations wurden zurückgesetzt.`);
}

main()
  .catch((e) => {
    console.error("❌ Fehler beim Reset:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });