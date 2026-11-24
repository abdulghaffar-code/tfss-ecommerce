// Demo product catalogue, part B. Names, model codes and prices are fictional.
const p = (o) => o;

export const productsB = [
  p({
    slug: "pvc-heavy-duty-gloves",
    sku: "TF-HG-1002",
    name: "PVC Heavy-Duty Work Gloves — Orange",
    category: "hand-protection",
    brand: "safe-hand",
    short:
      "Rough-handling gloves with a PVC grip for wet, oily and abrasive work.",
    description:
      "A robust general-purpose glove for maintenance, warehousing and outdoor handling. The PVC coating provides a confident grip in damp conditions, with a knitted liner for comfort. Not for electrical work or chemical immersion. Sample product data.",
    price: 620,
    stock: 140,
    featured: false,
    specs: [
      ["Coating", "PVC"],
      ["Liner", "Knitted"],
      ["Grip", "Wet and dry handling"],
      ["Sizes", "M–XL"],
    ],
    images: [
      ["gloves", "4789d454"],
      ["gloves", "4e140bab"],
    ],
  }),
  p({
    slug: "knitflex-handling-gloves",
    sku: "TF-HG-1003",
    name: "KnitFlex General Handling Gloves",
    category: "hand-protection",
    brand: "top-glove",
    short:
      "Lightweight knitted gloves for inspection, packing and precision handling.",
    description:
      "A light knitted glove for tasks where dexterity matters more than heavy abrasion resistance. The breathable liner is comfortable for extended indoor use. Replace when the knit becomes thin or torn. Sample product data for demonstration purposes.",
    price: 290,
    stock: 180,
    featured: false,
    specs: [
      ["Type", "Knit handling glove"],
      ["Coating", "None"],
      ["Use", "Packing and precision handling"],
      ["Sizes", "S–XL"],
    ],
    images: [
      ["gloves", "bf34e666"],
      ["gloves", "6de0c139"],
    ],
  }),
  p({
    slug: "treadmax-steel-toe-shoe",
    sku: "TF-FW-1001",
    name: "TreadMax Steel-Toe Safety Shoe — Black",
    category: "safety-footwear",
    brand: "burly",
    short:
      "Low-cut black safety shoe with steel toe cap and slip-resistant sole.",
    description:
      "A low-cut safety shoe for warehouse, workshop and light industrial environments. The steel toe cap protects against falling objects while the padded collar supports all-day wear. Confirm the required protection standard for your site. Sample product data.",
    price: 6800,
    salePrice: 5990,
    stock: 50,
    featured: true,
    specs: [
      ["Toe cap", "Steel"],
      ["Upper", "Leather (sample)"],
      ["Sole", "Slip-resistant PU"],
      ["Sizes", "EU 39–46 (sample)"],
    ],
    images: [
      ["foot", "133f2095"],
      ["foot", "4ac5cbb2"],
    ],
  }),
  p({
    slug: "treadmax-midcut-boot",
    sku: "TF-FW-1002",
    name: "TreadMax Mid-Cut Safety Boot — Black",
    category: "safety-footwear",
    brand: "burly",
    short:
      "Mid-cut leather safety boot with ankle support for heavier site work.",
    description:
      "A mid-cut safety boot for construction and industrial sites where ankle support and a tougher upper are needed. Lace-up closure, padded tongue and a lugged outsole for uneven ground. Sample product data for demonstration purposes.",
    price: 7900,
    stock: 35,
    featured: false,
    specs: [
      ["Height", "Mid-cut"],
      ["Toe cap", "Steel"],
      ["Upper", "Leather"],
      ["Outsole", "Lugged rubber (sample)"],
    ],
    images: [
      ["foot", "bff222e5"],
      ["foot", "22c7db5e"],
    ],
  }),
  p({
    slug: "pureair-half-face-respirator",
    sku: "TF-RP-1001",
    name: "PureAir Half-Face Respirator",
    category: "respiratory-protection",
    brand: "honeywell",
    short:
      "Reusable half-face respirator body with twin-cartridge fitting for dust and vapour.",
    description:
      "A reusable half-face respirator with a soft sealing surface and twin cartridge ports. Cartridges must be selected for the specific contaminant and replaced on schedule. Fit testing is required before use in a hazardous atmosphere. Sample product data; cartridges shown for illustration.",
    price: 6500,
    stock: 28,
    featured: false,
    specs: [
      ["Type", "Reusable half-face"],
      ["Cartridges", "Twin port, sold separately"],
      ["Seal", "Soft elastomer"],
      ["Sizes", "M / L (sample)"],
    ],
    images: [["ear", "44e5ba05"]],
  }),
  p({
    slug: "escape-hood-smoke",
    sku: "TF-RP-2001",
    name: "Escape Hood — Heat & Smoke Protection",
    category: "respiratory-protection",
    brand: "naffco",
    short:
      "Compact emergency escape hood for short-duration evacuation through smoke.",
    description:
      "A compact escape hood intended to support a short evacuation from smoke-filled areas. The heat-resistant hood and filter unit are sealed until use. This is not a working respirator and does not replace escape planning or training. Sample product data; confirm current certification.",
    price: 12500,
    stock: 20,
    featured: false,
    specs: [
      ["Type", "Emergency escape hood"],
      ["Use", "Short-duration evacuation"],
      ["Storage", "Sealed pouch"],
      ["Certification", "Request current documentation"],
    ],
    images: [
      ["face", "7263e842"],
      ["face", "add0e33e"],
    ],
  }),
  p({
    slug: "hivis-reflective-vest-lime",
    sku: "TF-PPE-1001",
    name: "HiVis Pro Reflective Safety Vest — Lime",
    category: "personal-protective-equipment",
    brand: "rangers",
    short:
      "Breathable lime safety vest with reflective banding for site visibility.",
    description:
      "A lightweight high-visibility vest for site visitors, traffic teams and general work areas. Reflective banding wraps the torso for visibility from multiple angles. Keep the vest clean and replace it when the reflective tape is damaged. Sample product data.",
    price: 1450,
    salePrice: 1250,
    stock: 110,
    featured: true,
    specs: [
      ["Colour", "Fluorescent lime"],
      ["Reflective tape", "Front and back bands"],
      ["Closure", "Zip front"],
      ["Sizes", "M–XXL (sample)"],
    ],
    images: [
      ["ppe", "39053744"],
      ["ppe", "eebe3a68"],
    ],
  }),
  p({
    slug: "hivis-reflective-vest-pink",
    sku: "TF-PPE-1002",
    name: "HiVis Pro Reflective Safety Vest — Pink",
    category: "personal-protective-equipment",
    brand: "rangers",
    short:
      "High-visibility pink vest for clear crew differentiation on busy sites.",
    description:
      "The HiVis Pro vest in a pink finish for visitor groups, event teams or role differentiation. Reflective banding and a simple zip front make it easy to put on over workwear. Sample product data for demonstration purposes.",
    price: 1450,
    stock: 60,
    featured: false,
    specs: [
      ["Colour", "Fluorescent pink"],
      ["Reflective tape", "Front and back"],
      ["Closure", "Zip front"],
      ["Sizes", "M–XXL (sample)"],
    ],
    images: [
      ["ppe", "f0b16c83"],
      ["ppe", "9a9673bd"],
    ],
  }),
  p({
    slug: "surveyor-multi-pocket-vest",
    sku: "TF-PPE-1003",
    name: "Multi-Pocket Surveyor Vest — Lime / Blue",
    category: "personal-protective-equipment",
    brand: "rangers",
    short:
      "Utility vest with multiple pockets for survey, inspection and maintenance crews.",
    description:
      "A high-visibility utility vest with reinforced pockets for tools, notebooks and small equipment. The lime body and blue lower panels aid role identification. Not a substitute for task-specific PPE. Sample product data for demonstration purposes.",
    price: 2650,
    stock: 48,
    featured: false,
    specs: [
      ["Pockets", "Multiple utility pockets"],
      ["Colour", "Lime with blue panels"],
      ["Closure", "Zip front"],
      ["Use", "Survey and inspection"],
    ],
    images: [["ppe", "dcc4c850"]],
  }),
];
