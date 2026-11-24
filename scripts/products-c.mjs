// Demo product catalogue, part C. Names, model codes and prices are fictional.
const p = (o) => o;

export const productsC = [
  p({
    slug: "eardefend-pro-ear-muffs",
    sku: "TF-PPE-2001",
    name: "EarDefend Pro Passive Ear Muffs",
    category: "personal-protective-equipment",
    brand: "blue-eagle",
    short:
      "Over-ear passive hearing protectors with padded headband for workshop noise.",
    description:
      "Passive ear muffs for sustained workshop and plant noise. The padded headband and soft ear cushions maintain a comfortable seal over long shifts. Noise reduction figures must be checked against measured site noise levels. Sample product data.",
    price: 3350,
    stock: 55,
    featured: false,
    specs: [
      ["Type", "Passive over-ear"],
      ["Headband", "Padded, adjustable"],
      ["Cushions", "Replaceable"],
      ["Use", "Workshop and plant noise"],
    ],
    images: [
      ["ear", "87c30aa6"],
      ["ear", "2b4698d9"],
    ],
  }),
  p({
    slug: "eardefend-corded-plugs",
    sku: "TF-PPE-2002",
    name: "EarDefend Corded Foam Plugs — Box of 50 Pairs",
    category: "personal-protective-equipment",
    brand: "total-safety",
    short:
      "Disposable corded foam earplugs supplied in a 50-pair dispenser box.",
    description:
      "Soft foam earplugs with a cord to keep pairs together between uses. Supplied in a box of 50 pairs for site dispensers. Roll and insert correctly for an effective seal. Sample product data for demonstration purposes.",
    price: 1900,
    stock: 100,
    featured: false,
    specs: [
      ["Quantity", "50 pairs"],
      ["Type", "Corded foam"],
      ["Packaging", "Dispenser box"],
      ["Use", "General noise reduction"],
    ],
    images: [["ear", "d93baa8c"]],
  }),
  p({
    slug: "traffic-cone-750mm",
    sku: "TF-RS-1001",
    name: "Traffic Cone 750 mm — Orange",
    category: "other-products",
    brand: "citex",
    short:
      "750 mm orange traffic cone with reflective collar for road and site marking.",
    description:
      "A stable 750 mm traffic cone for temporary lane marking, site boundaries and hazard identification. The reflective collar improves visibility in headlights. Use cones in combination with appropriate signage and site planning. Sample product data.",
    price: 1850,
    stock: 90,
    featured: true,
    specs: [
      ["Height", "750 mm"],
      ["Colour", "Orange"],
      ["Reflective collar", "Yes"],
      ["Base", "Weighted (sample)"],
    ],
    images: [
      ["road", "3a7d7978"],
      ["road", "b8048476"],
    ],
  }),
  p({
    slug: "convex-traffic-mirror",
    sku: "TF-RS-2001",
    name: "Convex Traffic Safety Mirror — 800 mm",
    category: "other-products",
    brand: "citex",
    short:
      "Convex mirror for blind corners, loading bays and site entrances.",
    description:
      "A wide-angle convex mirror for improving sight lines at blind corners, driveways and loading areas. The mirror is supplied with mounting hardware for a suitable post or wall. Check placement from the driver's eye height before installation. Sample product data.",
    price: 9800,
    stock: 14,
    featured: false,
    specs: [
      ["Diameter", "800 mm"],
      ["Type", "Convex"],
      ["Mounting", "Post / wall bracket"],
      ["Use", "Blind corners and loading bays"],
    ],
    images: [
      ["road", "baa57238"],
      ["road", "83a77f07"],
    ],
  }),
  p({
    slug: "road-safety-barrier",
    sku: "TF-RS-2002",
    name: "Heavy-Duty Road Safety Barrier",
    category: "other-products",
    brand: "citex",
    short:
      "Interlocking plastic barrier for temporary traffic and pedestrian separation.",
    description:
      "A robust interlocking barrier for temporary traffic control and pedestrian separation. The hollow body can be ballasted for stability, and the bright colour remains visible in poor weather. Plan barrier layouts with appropriate signage. Sample product data for demonstration purposes.",
    price: 12500,
    stock: 18,
    featured: false,
    specs: [
      ["Type", "Interlocking plastic barrier"],
      ["Colour", "Red"],
      ["Ballast", "Fillable"],
      ["Length", "Sample — confirm dimensions"],
    ],
    images: [
      ["road", "8e18dee4"],
      ["road", "f36f9d15"],
    ],
  }),
  p({
    slug: "speed-bump-section",
    sku: "TF-RS-2003",
    name: "Speed Bump Section — 1 m",
    category: "other-products",
    brand: "citex",
    short:
      "Modular rubber speed bump section with fixings for car parks and site roads.",
    description:
      "A modular speed-restriction section for car parks, warehouses and site access roads. Sections join to cover the required width and can be fixed to a suitable surface. Confirm load and vehicle requirements before ordering. Sample product data.",
    price: 8200,
    stock: 22,
    featured: false,
    specs: [
      ["Length", "1 m section"],
      ["Material", "Rubber"],
      ["Fixings", "Included (sample)"],
      ["Use", "Car parks and site roads"],
    ],
    images: [
      ["road", "779f0985"],
      ["road", "ce16bbb7"],
    ],
  }),
  p({
    slug: "corner-guard-chevron",
    sku: "TF-RS-2004",
    name: "Chevron Corner Guard — Yellow / Black",
    category: "other-products",
    brand: "total-safety",
    short:
      "Adhesive-backed foam corner guard for highlighting columns and racking edges.",
    description:
      "A high-visibility corner guard for warehouse columns, racking and wall edges. The chevron pattern draws attention to hard-to-see corners, while the foam body absorbs light impacts. Surface preparation is required for reliable adhesion. Sample product data.",
    price: 780,
    stock: 160,
    featured: false,
    specs: [
      ["Pattern", "Yellow / black chevron"],
      ["Material", "Impact foam"],
      ["Fixing", "Adhesive backing"],
      ["Use", "Columns and racking"],
    ],
    images: [
      ["road", "bc241b48"],
      ["road", "de9f81d3"],
    ],
  }),
  p({
    slug: "caution-wet-floor-sign",
    sku: "TF-RS-1002",
    name: "Caution Wet Floor Sign — Folding",
    category: "other-products",
    brand: "total-safety",
    short:
      "Folding A-frame warning sign for cleaning and spill response.",
    description:
      "A lightweight folding sign to warn of wet floors during cleaning or spill response. The A-frame folds flat for storage and the printed panels are visible from both sides. Clean and dry the sign before storage. Sample product data for demonstration purposes.",
    price: 950,
    stock: 120,
    featured: false,
    specs: [
      ["Type", "Folding A-frame"],
      ["Panels", "Double-sided"],
      ["Use", "Cleaning and spill response"],
      ["Height", "Sample — confirm dimensions"],
    ],
    images: [
      ["road", "b2b0811d"],
      ["road", "ce26be73"],
    ],
  }),
];
