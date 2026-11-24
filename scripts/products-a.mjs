// Demo product catalogue, part A. Names, model codes and prices are fictional.
const p = (o) => o;

export const productsA = [
  p({
    slug: "atlas-pro-harness-blue",
    sku: "TF-FP-1001",
    name: "Atlas Pro Full-Body Safety Harness — Blue",
    category: "fall-protection",
    brand: "blue-eagle",
    short:
      "Full-body fall-arrest harness with chest and leg adjustment for general industrial work at height.",
    description:
      "A general-purpose full-body harness for construction, maintenance and warehousing teams. Four adjustment points allow a close, comfortable fit over workwear, while the dorsal D-ring provides a central attachment point for fall-arrest systems. Supplied with a simple inspection label and storage strap. Sample product data for demonstration purposes.",
    price: 14800,
    salePrice: 12500,
    stock: 24,
    featured: true,
    specs: [
      ["Type", "Full-body fall-arrest harness"],
      ["Attachment", "Dorsal D-ring"],
      ["Adjustment", "Chest, waist and two leg points"],
      ["Conformity", "Sample data — request current certification"],
    ],
    images: [
      ["fall", "9a0e531c"],
      ["fall", "03abfef0"],
    ],
  }),
  p({
    slug: "atlas-pro-harness-green",
    sku: "TF-FP-1002",
    name: "Atlas Pro Full-Body Harness — High-Visibility Green",
    category: "fall-protection",
    brand: "blue-eagle",
    short:
      "High-visibility green harness for teams working near traffic or in low-light conditions.",
    description:
      "The Atlas Pro harness in a high-visibility green finish for site crews that need to stand out. Padded shoulder and leg sections reduce pressure during long shifts. Keep the harness clear of sharp edges and inspect webbing and stitching before every use. Sample product data for demonstration purposes.",
    price: 15200,
    stock: 16,
    featured: false,
    specs: [
      ["Type", "Full-body fall-arrest harness"],
      ["Colour", "High-visibility green"],
      ["Padding", "Shoulder and leg"],
      ["Sizes", "Universal adjustable"],
    ],
    images: [
      ["fall", "e561ebc6"],
      ["fall", "d98190c9"],
    ],
  }),
  p({
    slug: "twin-leg-shock-lanyard",
    sku: "TF-FP-2001",
    name: "Twin-Leg Shock-Absorbing Lanyard",
    category: "fall-protection",
    brand: "blue-eagle",
    short:
      "Twin-leg lanyard with integrated shock absorber for continuous attachment between anchors.",
    description:
      "A twin-leg lanyard designed to keep the worker connected while moving between anchor points. The integrated energy absorber reduces peak fall forces, and the scaffold hooks provide a positive connection. Inspect the absorber pack after any fall event and remove the unit from service. Sample product data for demonstration purposes.",
    price: 6900,
    salePrice: 5900,
    stock: 30,
    featured: true,
    specs: [
      ["Configuration", "Twin leg"],
      ["Length", "1.8 m per leg (sample)"],
      ["Connectors", "Scaffold hooks"],
      ["Absorber", "Integrated pack"],
    ],
    images: [
      ["fall", "7353f209"],
      ["fall", "8838a2d1"],
    ],
  }),
  p({
    slug: "rescue-grade-harness-orange",
    sku: "TF-FP-1003",
    name: "Rescue-Grade Harness — Orange",
    category: "fall-protection",
    brand: "honeywell",
    short:
      "Heavy-duty harness with multiple attachment points for rescue and confined-space teams.",
    description:
      "A higher-specification harness for rescue and confined-space work, with front and dorsal attachment points and reinforced leg loops. The orange webbing improves visibility during extraction. This is sample catalogue data; confirm the current standard and certification for your application before purchase.",
    price: 16500,
    stock: 12,
    featured: false,
    specs: [
      ["Type", "Rescue / confined-space harness"],
      ["Attachment", "Front and dorsal points"],
      ["Webbing", "High-visibility orange"],
      ["Use", "Rescue and retrieval (sample)"],
    ],
    images: [
      ["fall", "66b5cbd3"],
      ["fall", "e0681ee9"],
    ],
  }),
  p({
    slug: "guardian-hc1-helmet-yellow",
    sku: "TF-HP-1001",
    name: "Guardian HC-1 Industrial Safety Helmet — Yellow",
    category: "head-protection",
    brand: "jsp",
    short:
      "Classic industrial shell helmet with ratchet-fit headband and angled rain gutter.",
    description:
      "The Guardian HC-1 offers day-long comfort with a six-point suspension cradle and simple ratchet adjustment. The shell features a rain gutter and side slots for compatible accessories. Replace the helmet after a significant impact, even when damage is not visible. Sample product data for demonstration purposes.",
    price: 3200,
    salePrice: 2750,
    stock: 60,
    featured: true,
    specs: [
      ["Suspension", "Six-point cradle"],
      ["Adjustment", "Ratchet headband"],
      ["Accessory slots", "Side slots"],
      ["Shell", "High-density polyethylene (sample)"],
    ],
    images: [
      ["head", "71cb8f80"],
      ["head", "cd921684"],
    ],
  }),
  p({
    slug: "guardian-hc1-helmet-white",
    sku: "TF-HP-1002",
    name: "Guardian HC-1 Industrial Safety Helmet — White",
    category: "head-protection",
    brand: "jsp",
    short:
      "White industrial helmet for supervisors, engineers and site management.",
    description:
      "Same Guardian HC-1 platform in a white finish commonly used for supervisors and technical staff. The smooth shell is easy to clean, and the replaceable sweatband keeps the helmet serviceable. Sample product data for demonstration purposes.",
    price: 3450,
    stock: 45,
    featured: false,
    specs: [
      ["Suspension", "Six-point cradle"],
      ["Adjustment", "Ratchet headband"],
      ["Colour", "White"],
      ["Sweatband", "Replaceable"],
    ],
    images: [
      ["head", "3dc75afa"],
      ["head", "0c2febd6"],
    ],
  }),
  p({
    slug: "guardian-hv2-helmet-visor",
    sku: "TF-HP-1003",
    name: "Guardian HV-2 Helmet with Clear Face Visor",
    category: "head-protection",
    brand: "blue-eagle",
    short:
      "Integrated helmet and clear visor set for eye and face protection at height.",
    description:
      "A combined head and face protection set for tasks where overhead impact and flying debris are both present. The clear visor flips up when not required and can be replaced separately. This sample product is not arc-rated; specify the correct protection level for electrical work.",
    price: 3900,
    stock: 38,
    featured: false,
    specs: [
      ["Visor", "Clear, flip-up"],
      ["Helmet", "Vented industrial shell"],
      ["Use", "General site and workshop"],
      ["Spare visors", "Available on request"],
    ],
    images: [
      ["head", "f468c42b"],
      ["head", "197bc772"],
    ],
  }),
  p({
    slug: "forestry-bump-cap",
    sku: "TF-HP-1004",
    name: "Forestry Bump Cap — Black / Orange",
    category: "head-protection",
    brand: "jsp",
    short:
      "Low-profile bump cap for maintenance, warehousing and inspection work.",
    description:
      "A lightweight bump cap for environments where full industrial head protection is not required but head bumps remain a risk. The short brim and ventilated crown keep the wearer comfortable during indoor work. Not a substitute for an industrial safety helmet. Sample product data.",
    price: 2100,
    stock: 42,
    featured: false,
    specs: [
      ["Type", "Bump cap"],
      ["Ventilation", "Ventilated crown"],
      ["Colour", "Black with orange trim"],
      ["Application", "Light industrial and maintenance"],
    ],
    images: [["head", "dd8e014f"]],
  }),
  p({
    slug: "helmet-suspension-chin-strap-kit",
    sku: "TF-HP-2001",
    name: "Helmet Suspension & Chin Strap Kit",
    category: "head-protection",
    brand: "total-safety",
    short:
      "Replacement cradle, sweatband and chin strap to extend the life of compatible helmets.",
    description:
      "A service kit for compatible industrial helmets. Replace worn or contaminated suspension components to maintain a secure fit. Check the helmet manufacturer's instructions before fitting. Sample product data for demonstration purposes.",
    price: 1250,
    stock: 70,
    featured: false,
    specs: [
      ["Contents", "Cradle, sweatband and chin strap"],
      ["Fit", "Compatible industrial helmets"],
      ["Material", "Textile / polymer"],
      ["Instruction", "Follow helmet maker guidance"],
    ],
    images: [
      ["head", "3f24f141"],
      ["head", "157305ca"],
    ],
  }),
  p({
    slug: "clearview-pro-spectacles-clear",
    sku: "TF-EP-1001",
    name: "ClearView Pro Safety Spectacles — Clear",
    category: "eye-face-protection",
    brand: "jsp",
    short:
      "Lightweight clear-lens spectacles with wrap-around coverage and anti-scratch coating.",
    description:
      "Everyday impact protection for workshops, laboratories and site inspections. The wrap-around polycarbonate lens provides lateral coverage, and the soft nose piece keeps the frame stable. Clean with a soft cloth and replace lenses when scratched. Sample product data for demonstration purposes.",
    price: 850,
    salePrice: 690,
    stock: 120,
    featured: true,
    specs: [
      ["Lens", "Clear polycarbonate"],
      ["Coating", "Anti-scratch"],
      ["Frame", "Nylon wrap-around"],
      ["Standard", "Sample data — confirm current certification"],
    ],
    images: [
      ["eye", "3674d727"],
      ["eye", "0cd70cde"],
    ],
  }),
  p({
    slug: "clearview-pro-spectacles-smoke",
    sku: "TF-EP-1002",
    name: "ClearView Pro Safety Spectacles — Smoke Lens",
    category: "eye-face-protection",
    brand: "jsp",
    short:
      "Smoke-lens version for outdoor work and glare-heavy environments.",
    description:
      "The ClearView Pro frame with a smoke-tinted lens for outdoor daylight use. The tint reduces glare without replacing the need for correct protection against the specific hazard. Do not use tinted lenses for night work or low-light areas. Sample product data.",
    price: 950,
    stock: 90,
    featured: false,
    specs: [
      ["Lens", "Smoke tinted"],
      ["Coverage", "Wrap-around"],
      ["Coating", "Anti-scratch"],
      ["Use", "Outdoor daylight"],
    ],
    images: [
      ["eye", "22d75e6e"],
      ["eye", "55b01438"],
    ],
  }),
  p({
    slug: "sealed-gasket-safety-goggle",
    sku: "TF-EP-1003",
    name: "Sealed-Gasket Safety Goggle",
    category: "eye-face-protection",
    brand: "blue-eagle",
    short:
      "Close-fitting goggle with a soft seal for dusty and splash-prone work.",
    description:
      "A sealed goggle for environments where particles or liquid droplets can reach the eye from multiple angles. The soft PVC gasket conforms to the face, and the adjustable strap fits over a helmet or directly. Indirect ventilation reduces fogging. Sample product data.",
    price: 1250,
    stock: 75,
    featured: false,
    specs: [
      ["Seal", "Soft PVC gasket"],
      ["Ventilation", "Indirect"],
      ["Strap", "Adjustable elastic"],
      ["Lens", "Clear anti-fog (sample)"],
    ],
    images: [
      ["eye", "0de3a863"],
      ["eye", "86d6c4cb"],
    ],
  }),
  p({
    slug: "full-face-protective-visor",
    sku: "TF-EP-2001",
    name: "Full-Face Protective Visor",
    category: "eye-face-protection",
    brand: "jsp",
    short:
      "Wrap-around face shield for splash, spray and light-impact tasks.",
    description:
      "A general-purpose face shield with a wide clear window and adjustable headgear. Suitable for workshop and light chemical handling tasks where a full-face barrier is required. Confirm chemical compatibility before use. Sample product data for demonstration purposes.",
    price: 2450,
    salePrice: 1990,
    stock: 40,
    featured: true,
    specs: [
      ["Window", "Clear wrap-around"],
      ["Headgear", "Adjustable"],
      ["Use", "Splash and light impact"],
      ["Replacement visors", "Available on request"],
    ],
    images: [
      ["face", "31561ef3"],
      ["face", "c5921d4d"],
    ],
  }),
  p({
    slug: "arc-face-shield-set",
    sku: "TF-EP-2002",
    name: "Arc-Rated Face Shield Set",
    category: "eye-face-protection",
    brand: "honeywell",
    short:
      "Face shield set for welding and arc-flash environments. Confirm rating before use.",
    description:
      "A dark-tint face shield set for welding and arc-adjacent tasks. The headgear is adjustable for use over a helmet. This sample entry does not replace a formal arc-rating assessment; request the current specification sheet for your application.",
    price: 2950,
    stock: 25,
    featured: false,
    specs: [
      ["Window", "Dark tint"],
      ["Headgear", "Adjustable"],
      ["Application", "Welding / arc-adjacent (sample)"],
      ["Rating", "Request current documentation"],
    ],
    images: [
      ["face", "7e2fe21a"],
      ["face", "9073c1ae"],
    ],
  }),
  p({
    slug: "nitriguard-nitrile-gloves",
    sku: "TF-HG-1001",
    name: "NitriGuard Nitrile-Coated Gloves — Green",
    category: "hand-protection",
    brand: "safe-hand",
    short:
      "Breathable knit gloves with a nitrile palm coating for secure dry handling.",
    description:
      "A general-handling glove with a seamless knitted liner and nitrile palm coating. The coating improves grip on dry components while the open back keeps hands cooler. Not suitable for chemical immersion or heat. Sample product data for demonstration purposes.",
    price: 480,
    salePrice: 425,
    stock: 200,
    featured: true,
    specs: [
      ["Liner", "Seamless knit"],
      ["Coating", "Nitrile palm"],
      ["Sizes", "S–XL"],
      ["Use", "Dry handling and assembly"],
    ],
    images: [
      ["gloves", "46c4b2b5"],
      ["gloves", "00ea93f8"],
    ],
  }),
  p({
    slug: "redline-welding-gauntlets",
    sku: "TF-HG-2001",
    name: "RedLine Leather Welding Gauntlets",
    category: "hand-protection",
    brand: "safe-hand",
    short:
      "Long-cuff suede leather gauntlets for welding and hot-work protection.",
    description:
      "Heavy suede leather gauntlets with a long cuff to cover the forearm during welding and light hot work. The leather construction resists sparks and abrasion. Inspect for cuts and stiffness before each use. Sample product data for demonstration purposes.",
    price: 1650,
    stock: 85,
    featured: false,
    specs: [
      ["Material", "Suede leather"],
      ["Cuff", "Long gauntlet"],
      ["Use", "Welding / hot work"],
      ["Sizes", "One size (sample)"],
    ],
    images: [
      ["gloves", "6176aecc"],
      ["gloves", "aa0554f4"],
    ],
  }),
];
