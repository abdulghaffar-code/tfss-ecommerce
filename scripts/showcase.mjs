// Builds the 3D showcase set used by the homepage hero.
// Reads every render in Assets/Product 3D Images, writes webp copies to
// public/showcase/3d and a manifest the app imports. Safe to re-run.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "Assets", "Product 3D Images");
const OUT = path.join(ROOT, "public", "showcase", "3d");
const MANIFEST = path.join(ROOT, "lib", "showcase.json");

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const folders = (await fs.readdir(SOURCE, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const manifest = [];

  for (const folder of folders) {
    const category = folder.split(" - ")[0].trim();
    const slug = slugify(category);
    const files = (await fs.readdir(path.join(SOURCE, folder)))
      .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));

    let index = 0;
    for (const file of files) {
      index += 1;
      const name = `${slug}-${String(index).padStart(2, "0")}.webp`;
      await sharp(path.join(SOURCE, folder, file))
        .rotate()
        .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(OUT, name));
      manifest.push({ src: `/showcase/3d/${name}`, category });
    }
  }

  await fs.writeFile(
    MANIFEST,
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log(`showcase: ${manifest.length} images from ${folders.length} categories`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
