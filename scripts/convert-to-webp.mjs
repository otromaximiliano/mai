import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import sharp from "sharp";

const productsDir = path.resolve(process.cwd(), "public/images/products");
const jsonPath = path.resolve(process.cwd(), "src/data/initial-products.json");
const csvPath = path.resolve(process.cwd(), "productos-catalogo-completo.csv");

console.log(`Buscando imágenes en ${productsDir}...`);

const files = fs.readdirSync(productsDir);
let convertedCount = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  const inputPath = path.join(productsDir, file);
  const outputPath = path.join(productsDir, `${baseName}.webp`);

  if (ext === ".png") {
    try {
      // Use cwebp or sharp
      execSync(`/usr/local/bin/cwebp -q 85 "${inputPath}" -o "${outputPath}"`, { stdio: "ignore" });
      fs.unlinkSync(inputPath);
      convertedCount++;
      console.log(`Convertido (PNG -> WebP): ${file} -> ${baseName}.webp`);
    } catch {
      // Fallback to sharp
      await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath);
      fs.unlinkSync(inputPath);
      convertedCount++;
      console.log(`Convertido con sharp (PNG -> WebP): ${file} -> ${baseName}.webp`);
    }
  } else if (ext === ".svg") {
    try {
      // Convert SVG vector to high-res 600x600 WebP with sharp
      await sharp(inputPath, { density: 150 })
        .resize(600, 600)
        .webp({ quality: 90 })
        .toFile(outputPath);
      fs.unlinkSync(inputPath);
      convertedCount++;
      console.log(`Convertido con sharp (SVG -> WebP): ${file} -> ${baseName}.webp`);
    } catch (err) {
      console.error(`Error al convertir SVG ${file}:`, err);
    }
  }
}

console.log(`\n¡${convertedCount} imágenes convertidas a .webp con éxito!`);

// Update initial-products.json
const products = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
products.forEach((p) => {
  p.image_filename = p.image_filename.replace(/\.(png|svg)$/i, ".webp");
});
fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), "utf8");
console.log(`Actualizado src/data/initial-products.json con nombres .webp`);

// Update productos-catalogo-completo.csv
const headers = [
  "id",
  "name",
  "category",
  "brand",
  "presentation",
  "price",
  "stock",
  "featured",
  "image_filename",
  "zip_file",
  "description",
];

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const csvLines = [headers.join(",")];
products.forEach((p) => {
  const row = headers.map((h) => escapeCsv(p[h]));
  csvLines.push(row.join(","));
});
fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");
console.log(`Actualizado productos-catalogo-completo.csv con extensiones .webp`);
