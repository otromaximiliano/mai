import fs from "fs";
import path from "path";
import mongoose from "mongoose";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
    });
  }
}

async function runSeed() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No se encontró MONGODB_URI en .env.local. Por favor configure su conexión a MongoDB.");
    process.exit(1);
  }

  const prefix = process.env.MONGODB_COLLECTION_PREFIX || "naminami_";
  const collectionName = `${prefix}products`;

  console.log(`Conectando a MongoDB para poblar colección: ${collectionName}...`);
  await mongoose.connect(uri);

  const dataPath = path.resolve(process.cwd(), "src/data/initial-products.json");
  const rawProducts = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  const collection = mongoose.connection.collection(collectionName);

  let upsertedCount = 0;
  for (const item of rawProducts) {
    await collection.updateOne(
      { id: item.id },
      {
        $set: {
          id: item.id,
          name: item.name,
          category: item.category,
          brand: item.brand,
          presentation: item.presentation,
          price: item.price,
          stock: item.stock !== false,
          featured: Boolean(item.featured),
          image_filename: item.image_filename,
          description: item.description,
          updated_at: new Date(),
        },
        $setOnInsert: {
          created_at: new Date(),
        },
      },
      { upsert: true }
    );
    upsertedCount++;
  }

  console.log(`¡Semilla completada! Se insertaron o actualizaron ${upsertedCount} productos en ${collectionName}.`);
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error("Error al ejecutar seed:", err);
  process.exit(1);
});
