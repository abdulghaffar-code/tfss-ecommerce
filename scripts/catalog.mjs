// Shared demo catalogue metadata used by the asset pipeline and the database seed.
// All product names, model numbers and prices are fictional sample data.

export const SITE = {
  name: "Total Fire & Safety Solution",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const folders = {
  fall: "Fall Protection - Total Fire & Safety Solution",
  eye: "Eye Protection - Total Fire & Safety Solution",
  face: "Face Protection - Total Fire & Safety Solution",
  foot: "Footwear - Total Fire & Safety Solution",
  head: "Head Protection - Total Fire & Safety Solution",
  ppe: "Protective Clothing - Total Fire & Safety Solution",
  road: "Road Safety - Total Fire & Safety Solution",
  gloves: "Safety Gloves - Total Fire & Safety Solution",
  ear: "Ear Protection - Total Fire & Safety Solution",
};

export const categories = [
  {
    slug: "fall-protection",
    name: "Fall Protection & Safety Harnesses",
    description:
      "Full-body harnesses, lanyards and anchoring equipment for work at height.",
    sortOrder: 1,
    imageSlug: "atlas-pro-harness-blue",
  },
  {
    slug: "fire-fighting",
    name: "Fire Fighting Equipment",
    description:
      "Extinguishers, hoses, nozzles and fire-safety accessories for commercial and industrial sites.",
    sortOrder: 2,
    imageSlug: null,
  },
  {
    slug: "personal-protective-equipment",
    name: "Personal Protective Equipment",
    description:
      "High-visibility clothing, hearing protection and everyday site PPE.",
    sortOrder: 3,
    imageSlug: "hivis-reflective-vest-lime",
  },
  {
    slug: "head-protection",
    name: "Head Protection",
    description:
      "Industrial safety helmets, bump caps, visors and suspension accessories.",
    sortOrder: 4,
    imageSlug: "guardian-hc1-helmet-yellow",
  },
  {
    slug: "eye-face-protection",
    name: "Eye and Face Protection",
    description:
      "Safety spectacles, sealed goggles and full-face shields for impact and splash hazards.",
    sortOrder: 5,
    imageSlug: "clearview-pro-spectacles-clear",
  },
  {
    slug: "hand-protection",
    name: "Hand Protection",
    description:
      "Nitrile, leather, PVC and knit gloves for handling, welding and general work.",
    sortOrder: 6,
    imageSlug: "nitriguard-nitrile-gloves",
  },
  {
    slug: "respiratory-protection",
    name: "Respiratory Protection",
    description:
      "Half-face respirators and escape hoods for dust, vapour and smoke exposure.",
    sortOrder: 7,
    imageSlug: "pureair-half-face-respirator",
  },
  {
    slug: "safety-footwear",
    name: "Safety Footwear",
    description:
      "Steel-toe shoes and mid-cut safety boots for industrial and construction environments.",
    sortOrder: 8,
    imageSlug: "treadmax-steel-toe-shoe",
  },
  {
    slug: "welding-equipment",
    name: "Welding Equipment",
    description:
      "Welding PPE, screens and workshop equipment. Contact us for current availability.",
    sortOrder: 9,
    imageSlug: null,
  },
  {
    slug: "hardware-tools",
    name: "Hardware & Tools",
    description:
      "Engineering hardware, hand tools and workshop consumables sourced to order.",
    sortOrder: 10,
    imageSlug: null,
  },
  {
    slug: "hydraulic-equipment",
    name: "Hydraulic Equipment",
    description:
      "Hydraulic hoses, couplings and workshop equipment for industrial applications.",
    sortOrder: 11,
    imageSlug: null,
  },
  {
    slug: "electrical-equipment",
    name: "Electrical Equipment",
    description:
      "Electrical safety and industrial electrical supplies. Enquire for specifications.",
    sortOrder: 12,
    imageSlug: null,
  },
  {
    slug: "industrial-supplies",
    name: "Industrial Supplies",
    description:
      "General order supplies for workshops, plants, janitorial and maintenance teams.",
    sortOrder: 13,
    imageSlug: null,
  },
  {
    slug: "other-products",
    name: "Other Products",
    description:
      "Road, traffic and workplace safety products, from cones to convex mirrors.",
    sortOrder: 14,
    imageSlug: "traffic-cone-750mm",
  },
];

export const brands = [
  { slug: "honeywell", name: "Honeywell", logo: "0007324_honeywell_345.png" },
  { slug: "jsp", name: "JSP", logo: "jsp-1.png" },
  { slug: "blue-eagle", name: "Blue Eagle", logo: "blue-eagle.png" },
  { slug: "naffco", name: "NAFFCO", logo: "0008097_naffco_345.png" },
  { slug: "safe-hand", name: "Safe Hand", logo: "transparent_Untitled-1.png" },
  { slug: "top-glove", name: "Top Glove", logo: "0006768_top-glove_345.png" },
  { slug: "rangers", name: "Rangers Safety System", logo: "rangers.png" },
  { slug: "burly", name: "Burly", logo: "transparent_Untitled-2.png" },
  { slug: "citex", name: "CITEX", logo: "Untitled-2.png" },
  { slug: "total-safety", name: "Total Safety", logo: null },
];

export const banners = [
  {
    title: "Engineered for the Unforgiving",
    subtitle:
      "Fall-protection systems built for height, heat and hard hours on site.",
    imageUrl: "/hero/slider-01.webp",
    href: "/category/fall-protection",
    ctaLabel: "Explore fall protection",
    sortOrder: 1,
  },
  {
    title: "Be Seen. Stay Safe.",
    subtitle:
      "High-visibility workwear that keeps crews visible in low light and heavy traffic.",
    imageUrl: "/hero/slider-02.webp",
    href: "/category/personal-protective-equipment",
    ctaLabel: "Shop high-visibility",
    sortOrder: 2,
  },
  {
    title: "Built to Take the Load",
    subtitle:
      "Safety footwear with the structure and grip industrial floors demand.",
    imageUrl: "/hero/slider-03.webp",
    href: "/category/safety-footwear",
    ctaLabel: "View safety footwear",
    sortOrder: 3,
  },
  {
    title: "Grip. Precision. Control.",
    subtitle:
      "Hand protection for handling, welding, chemical and general workshop duty.",
    imageUrl: "/hero/slider-04.webp",
    href: "/category/hand-protection",
    ctaLabel: "Explore hand protection",
    sortOrder: 4,
  },
  {
    title: "Head-First Protection",
    subtitle:
      "Industrial helmets and face protection engineered around the wearer.",
    imageUrl: "/hero/slider-05.webp",
    href: "/category/head-protection",
    ctaLabel: "Shop head protection",
    sortOrder: 5,
  },
  {
    title: "Control the Site",
    subtitle:
      "Traffic and workplace safety equipment that makes hazards impossible to miss.",
    imageUrl: "/hero/slider-06.webp",
    href: "/category/other-products",
    ctaLabel: "View site safety",
    sortOrder: 6,
  },
];

export const company = {
  name: "Total Fire & Safety Solution",
  tagline: "Protect • Prevent • Perform",
  phone: "+92-21-32434289",
  phoneAlt: "+92-21-32419200",
  email: "info@totalfirensafety.com",
  address:
    "Shop # 1-B, Adnan Center, Ground Floor, Nicol Road, Karachi, Pakistan",
  safelinkAddress: "Shop # 5-A, 1st Floor, Adnan Center, Nicol Road, Karachi",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7240.704507217973!2d67.00064!3d24.851816!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1795502756818!5m2!1sen!2sus",
  logoUrl: "/brand/logo.png",
  ownerImageUrl: "/company/owner.webp",
};
