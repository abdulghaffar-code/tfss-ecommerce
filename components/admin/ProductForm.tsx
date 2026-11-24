import Link from "next/link";
import Image from "next/image";
import { saveProductAction } from "@/actions/admin";
import { Field, Select, Textarea } from "@/components/ui/Field";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  categoryId: string;
  brandId: string | null;
  shortDescription: string;
  description: string;
  specs: unknown;
  modelUrl: string | null;
  price: unknown;
  salePrice: unknown;
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: { id: string; url: string }[];
};

function specsToText(specs: unknown) {
  if (!Array.isArray(specs)) return "";
  return specs
    .map((spec) => {
      if (typeof spec !== "object" || spec === null) return "";
      const entry = spec as { label?: string; value?: string };
      return entry.label && entry.value ? `${entry.label}: ${entry.value}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: AdminProduct;
  categories: Category[];
  brands: Brand[];
}) {
  return (
    <form action={saveProductAction} className="space-y-5">
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      <input
        type="hidden"
        name="returnTo"
        value={product ? `/admin/products/${product.id}` : "/admin/products"}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Product identity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Product name"
                name="name"
                defaultValue={product?.name}
                required
                className="sm:col-span-2"
              />
              <Field
                label="SKU"
                name="sku"
                defaultValue={product?.sku}
                required
                placeholder="TF-PPE-1001"
              />
              <Field
                label="URL slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="Auto-generated from name"
                hint="Leave blank to generate. Duplicates get a numeric suffix."
              />
              <Select label="Category" name="categoryId" defaultValue={product?.categoryId} required>
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <Select label="Manufacturer" name="brandId" defaultValue={product?.brandId ?? ""}>
                <option value="">No manufacturer</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Short description"
                name="shortDescription"
                defaultValue={product?.shortDescription}
                required
                className="sm:col-span-2"
                rows={2}
              />
              <Textarea
                label="Full description"
                name="description"
                defaultValue={product?.description}
                required
                className="sm:col-span-2"
                rows={7}
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Specifications</h2>
            <p className="mt-1 text-[11px] text-steel-500">
              One specification per line as <code className="text-steel-300">Label: Value</code>.
            </p>
            <Textarea
              label="Specification lines"
              name="specsText"
              defaultValue={specsToText(product?.specs)}
              className="mt-3"
              rows={6}
              placeholder={"Type: Passive over-ear\nHeadband: Padded, adjustable"}
            />
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Media</h2>
            <p className="mt-1 text-[11px] text-steel-500">
              Images are converted to WebP (max 2000 px). GLB models are displayed
              in the 3D viewer only when uploaded — we never label a photo as 3D.
            </p>

            {product?.images.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative size-16 overflow-hidden rounded-lg border border-white/10 bg-steel-100"
                  >
                    <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="imageFile">
                  Upload product image
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="modelFile">
                  Upload 3D model (.glb)
                </label>
                <input
                  id="modelFile"
                  name="modelFile"
                  type="file"
                  accept=".glb,model/gltf-binary"
                  className="block w-full text-[11px] text-steel-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[11px] file:text-white"
                />
              </div>
              <Textarea
                label="Image URLs"
                name="imagesText"
                defaultValue={product?.images.map((image) => image.url).join("\n")}
                className="sm:col-span-2"
                rows={3}
                hint="One URL per line. Remove a line to remove the image on save."
              />
              <Field
                label="3D model URL"
                name="modelUrl"
                defaultValue={product?.modelUrl ?? ""}
                className="sm:col-span-2"
                placeholder="/uploads/models/....glb"
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Search metadata</h2>
            <div className="mt-4 grid gap-4">
              <Field label="SEO title" name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
              <Textarea
                label="SEO description"
                name="seoDescription"
                defaultValue={product?.seoDescription ?? ""}
                rows={2}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Pricing &amp; stock</h2>
            <div className="mt-4 space-y-4">
              <Field
                label="Regular price (PKR)"
                name="price"
                type="number"
                min="1"
                step="1"
                defaultValue={product ? String(product.price) : ""}
                required
              />
              <Field
                label="Sale price (PKR)"
                name="salePrice"
                type="number"
                min="1"
                step="1"
                defaultValue={product?.salePrice ? String(product.salePrice) : ""}
                hint="Leave blank for no sale."
              />
              <Field
                label="Stock on hand"
                name="stock"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.stock ?? 0}
                required
              />
              <Field
                label="Low-stock threshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.lowStockThreshold ?? 5}
              />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-ink-900 p-5">
            <h2 className="font-display text-sm font-semibold text-white">Visibility</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-steel-300">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={product ? product.isActive : true}
                  className="size-4 accent-flame-500"
                />
                Published on the storefront
              </label>
              <label className="flex items-center gap-2.5 text-xs text-steel-300">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={product?.isFeatured}
                  className="size-4 accent-flame-500"
                />
                Featured on the homepage
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="h-11 rounded-lg bg-flame-500 font-display text-xs font-semibold text-ink-950 transition hover:bg-flame-400"
            >
              {product ? "Save product" : "Create product"}
            </button>
            <Link
              href="/admin/products"
              className="flex h-10 items-center justify-center rounded-lg border border-white/15 text-xs font-semibold text-steel-300 transition hover:border-white/35 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </aside>
      </div>
    </form>
  );
}
