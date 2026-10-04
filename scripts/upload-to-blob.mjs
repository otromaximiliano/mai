import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

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

async function uploadImagesToBlob() {
  loadEnv();

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("❌ Error: No se encontró BLOB_READ_WRITE_TOKEN en .env.local.");
    console.error("👉 Obtén tu token en el dashboard de Vercel (Storage > Blob) y colócalo en .env.local");
    process.exit(1);
  }

  const productsDir = path.resolve(process.cwd(), "public/images/products");
  const jsonPath = path.resolve(process.cwd(), "src/data/initial-products.json");

  if (!fs.existsSync(productsDir)) {
    console.error(`❌ El directorio ${productsDir} no existe.`);
    process.exit(1);
  }

  const files = fs.readdirSync(productsDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".webp", ".png", ".jpg", ".jpeg", ".svg"].includes(ext);
  });

  console.log(`📦 Encontradas ${files.length} imágenes para procesar...\n`);

  const products = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
  const urlMap = new Map();

  let uploadedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(productsDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    try {
      console.log(`[${i + 1}/${files.length}] Subiendo ${file}...`);
      const blob = await put(`products/${file}`, fileBuffer, {
        access: "public",
        token: token,
      });

      urlMap.set(file, blob.url);
      uploadedCount++;
      console.log(`   ✅ Subido: ${blob.url}`);
    } catch (err) {
      console.error(`   ❌ Error subiendo ${file}:`, err.message);
    }
  }

  console.log(`\n🎉 ${uploadedCount} imágenes subidas con éxito a Vercel Blob.`);

  // Actualizar initial-products.json con las URLs de Blob
  if (products.length > 0 && urlMap.size > 0) {
    let updatedProducts = 0;
    products.forEach((p) => {
      const currentFilename = p.image_filename ? path.basename(p.image_filename) : "";
      if (urlMap.has(currentFilename)) {
        p.image_filename = urlMap.get(currentFilename);
        updatedProducts++;
      }
    });

    fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), "utf8");
    console.log(`✨ ${updatedProducts} productos actualizados en src/data/initial-products.json con URLs de Vercel Blob.`);
    console.log(`💡 Tip: Ahora puedes ejecutar 'pnpm run seed' para reflejar estas URLs en tu base de datos MongoDB.`);
  }
}

uploadImagesToBlob().catch((err) => {
  console.error("Error general en el script de subida:", err);
  process.exit(1);
});
