// Copies and optimizes the supplied brand assets into /public.
// Safe to re-run: generated folders are replaced, uploads are left untouched.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { categories, brands, folders } from "./catalog.mjs";
import { products } from "./products.mjs";

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, "Assets");
const PUBLIC = path.join(ROOT, "public");
const PRODUCT_ROOT = path.join(ASSETS, "Product 3D Images");
const SLIDER_ROOT = path.join(ASSETS, "Slider Images");

async function reset(...dirs) {
  for (const dir of dirs) {
    await fs.rm(path.join(PUBLIC, dir), { recursive: true, force: true });
  }
}

async function imageToWebp(src, dest, max = 1400, quality = 84) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await sharp(src)
    .rotate()
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
}

// Remove the white studio background while keeping anti-aliased edges.
// Also produces a pure-white silhouette for dark headers.
async function makeLogoVariants(src, baseName) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const color = Buffer.alloc(data.length);
  const mono = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const darkness = 255 - Math.min(r, g, b);
    const alpha = darkness < 10 ? 0 : Math.min(255, Math.round(darkness * 1.12));
    color[i] = r;
    color[i + 1] = g;
    color[i + 2] = b;
    color[i + 3] = alpha;
    mono[i] = 255;
    mono[i + 1] = 255;
    mono[i + 2] = 255;
    mono[i + 3] = alpha;
  }
  const raw = { width: info.width, height: info.height, channels: 4 };
  // Trim the generous studio margins so the wordmark fills its layout box.
  await sharp(color, { raw })
    .trim({ threshold: 6 })
    .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "brand", `${baseName}-transparent.png`));
  await sharp(mono, { raw })
    .trim({ threshold: 6 })
    .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "brand", `${baseName}-mono.png`));
  await sharp(src)
    .resize({ width: 1200, withoutEnlargement: true })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "brand", `${baseName}.png`));
}

async function main() {
  console.log("Preparing public asset folders…");
  await reset("products", "hero", "brand", "company", "video");
  await fs.mkdir(path.join(PUBLIC, "uploads"), { recursive: true });
  await fs.writeFile(path.join(PUBLIC, "uploads", ".gitkeep"), "");
  await fs.mkdir(path.join(PUBLIC, "brand"), { recursive: true });

  // Brand marks
  await makeLogoVariants(
    path.join(ASSETS, "Logo", "Total Fire & Safety Emblem.png"),
    "logo-emblem"
  );
  await makeLogoVariants(
    path.join(ASSETS, "Logo", "Total Fire & Safety Shield Logo.png"),
    "logo-shield"
  );

  // Owner portrait
  await fs.mkdir(path.join(PUBLIC, "company"), { recursive: true });
  await imageToWebp(
    path.join(ASSETS, "About", "Company owner.jpg"),
    path.join(PUBLIC, "company", "owner.webp"),
    900,
    88
  );

  // Manufacturer logos
  await fs.mkdir(path.join(PUBLIC, "brand", "manufacturers"), { recursive: true });
  for (const brand of brands) {
    if (!brand.logo) continue;
    await sharp(path.join(ASSETS, "Companies Logo", brand.logo))
      .resize({ height: 180, withoutEnlargement: true })
      .trim({ threshold: 12 })
      .extend({ top: 20, bottom: 20, left: 20, right: 20, background: "#ffffff" })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC, "brand", "manufacturers", brand.slug + ".png"));
  }

  // Hero slider
  const sliderFiles = (await fs.readdir(SLIDER_ROOT))
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort();
  await fs.mkdir(path.join(PUBLIC, "hero"), { recursive: true });
  for (let i = 0; i < sliderFiles.length && i < 7; i++) {
    await imageToWebp(
      path.join(SLIDER_ROOT, sliderFiles[i]),
      path.join(PUBLIC, "hero", `slider-${String(i + 1).padStart(2, "0")}.webp`),
      2200,
      82
    );
  }
  console.log(`  hero slides: ${Math.min(sliderFiles.length, 7)}`);

  // Promotional video
  const videoSrc = path.join(ASSETS, "Products Video", "lv_0_20261124123922.mp4");
  await fs.mkdir(path.join(PUBLIC, "video"), { recursive: true });
  const videoStat = await fs.stat(videoSrc);
  await fs.copyFile(videoSrc, path.join(PUBLIC, "video", "company-promo.mp4"));
  console.log(`  video: ${(videoStat.size / 1024 / 1024).toFixed(1)} MB`);

  // Product images
  const folderFiles = {};
  for (const [key, folderName] of Object.entries(folders)) {
    folderFiles[key] = await fs.readdir(path.join(PRODUCT_ROOT, folderName));
  }
  let copied = 0;
  const missing = [];
  for (const product of products) {
    let index = 0;
    for (const [folderKey, marker] of product.images) {
      const file = folderFiles[folderKey]?.find(
        (f) => f.includes(marker) && /\.(jpg|jpeg|png|webp)$/i.test(f)
      );
      if (!file) {
        missing.push(`${product.slug}: ${folderKey}/${marker}`);
        continue;
      }
      index += 1;
      await imageToWebp(
        path.join(PRODUCT_ROOT, folders[folderKey], file),
        path.join(PUBLIC, "products", product.slug, `${index}.webp`),
        1400,
        84
      );
      copied += 1;
    }
  }

  // Report category images
  for (const category of categories) {
    if (!category.imageSlug) continue;
    const img = path.join(PUBLIC, "products", category.imageSlug, "1.webp");
    try {
      await fs.access(img);
    } catch {
      console.warn(`  missing category image for ${category.slug}`);
    }
  }

  console.log(`  product images: ${copied}`);
  if (missing.length) {
    console.warn("  MISSING SOURCES:\n   " + missing.join("\n   "));
  }
  console.log("Assets ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
