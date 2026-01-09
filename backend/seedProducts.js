// seedProducts.js
import "dotenv/config";
import mongoose from "mongoose";

import Brand from "./src/models/Products/Brand.js";
import Category from "./src/models/Products/Category.js";
import SubCategory from "./src/models/Products/SubCategory.js";
import { Product, Image } from "./src/models/Products/Product.js";

// -----------------------------
// Helpers
// -----------------------------
const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function upsertByField(Model, field, value, data = {}) {
  await Model.updateOne(
    { [field]: value },
    { $set: { ...data, [field]: value } },
    { upsert: true }
  );
  return Model.findOne({ [field]: value });
}

// -----------------------------
// Seed data (FULL MERGE)
// -----------------------------
const IMAGE_BASE = "/brands/";

const seedData = {
  categories: [
    { name: "Spirits" },
    { name: "Wine" },
    { name: "Beer" },
    { name: "Cocktails" },
  ],

  subCategories: [
    { name: "Vodka", categoryName: "Spirits" },
    { name: "Rum", categoryName: "Spirits" },
    { name: "Dark Rum", categoryName: "Spirits" },
    { name: "Whiskey", categoryName: "Spirits" },
    { name: "Blended Scotch Whisky", categoryName: "Spirits" },
    { name: "Tequila", categoryName: "Spirits" },
    { name: "Silver Tequila", categoryName: "Spirits" },
    { name: "Gin", categoryName: "Spirits" },
    { name: "Brandy", categoryName: "Spirits" },

    { name: "Champagne", categoryName: "Wine" },
    { name: "Red Wine", categoryName: "Wine" },
    { name: "White Wine", categoryName: "Wine" },

    { name: "Lager", categoryName: "Beer" },

    { name: "Flavoured Cocktails", categoryName: "Cocktails" },
  ],

  brands: [
    { name: "Absolut", country: "Sweden" },
    { name: "Bacardi", country: "Puerto Rico" },
    { name: "Jack Daniel's", country: "United States" },
    { name: "Johnnie Walker", country: "Scotland" },
    { name: "Chivas Regal", country: "Scotland" },
    { name: "Moët & Chandon", country: "France" },
    { name: "Patrón", country: "Mexico" },
    { name: "Heineken", country: "Netherlands" },
    { name: "Bombay Sapphire", country: "United Kingdom" },
    { name: "Old Monk", country: "India" },
    { name: "Jose Cuervo", country: "Mexico" },
    { name: "Smirnoff", country: "United Kingdom" },
    { name: "Gorbatschow", country: "Germany" },
  ],

  products: [
    // ---------------- Vodka ----------------
    {
      name: "Absolut Vodka Original",
      price: 3500,
      categoryName: "Spirits",
      subCategoryName: "Vodka",
      brandName: "Absolut",
      abv: 40,
      volumeMl: 750,
      description: "Made with Swedish water and winter wheat.",
      isFeatured: true,
    },
    {
      name: "Smirnoff No.21 Vodka",
      price: 2800,
      categoryName: "Spirits",
      subCategoryName: "Vodka",
      brandName: "Smirnoff",
      abv: 40,
      volumeMl: 750,
      description: "Triple distilled premium vodka.",
      isFeatured: false,
    },
    {
      name: "Wodka Gorbatschow",
      price: 2600,
      categoryName: "Spirits",
      subCategoryName: "Vodka",
      brandName: "Gorbatschow",
      abv: 37.5,
      volumeMl: 700,
      description: "German cold-filtered vodka.",
      isFeatured: false,
    },

    // ---------------- Whiskey ----------------
    {
      name: "Jack Daniel’s Old No.7",
      price: 5200,
      categoryName: "Spirits",
      subCategoryName: "Whiskey",
      brandName: "Jack Daniel's",
      abv: 40,
      volumeMl: 750,
      description: "Tennessee sour mash whiskey.",
      isFeatured: true,
    },
    {
      name: "Johnnie Walker Black Label 12 Year",
      price: 6800,
      categoryName: "Spirits",
      subCategoryName: "Blended Scotch Whisky",
      brandName: "Johnnie Walker",
      abv: 40,
      volumeMl: 750,
      description: "12 year blended Scotch whisky.",
      isFeatured: true,
    },
    {
      name: "Chivas Regal 18 Gold Signature",
      price: 12000,
      categoryName: "Spirits",
      subCategoryName: "Blended Scotch Whisky",
      brandName: "Chivas Regal",
      abv: 40,
      volumeMl: 750,
      description: "Luxury 18 year Scotch whisky.",
      isFeatured: true,
    },

    // ---------------- Rum ----------------
    {
      name: "Bacardi 151",
      price: 7200,
      categoryName: "Spirits",
      subCategoryName: "Rum",
      brandName: "Bacardi",
      abv: 75.5,
      volumeMl: 750,
      description: "High proof Puerto Rican rum.",
      isFeatured: false,
    },
    {
      name: "Old Monk XXX Rum",
      price: 2100,
      categoryName: "Spirits",
      subCategoryName: "Dark Rum",
      brandName: "Old Monk",
      abv: 42.8,
      volumeMl: 750,
      description: "7 year old blended Indian rum.",
      isFeatured: false,
    },

    // ---------------- Gin ----------------
    {
      name: "Bombay Sapphire Gin",
      price: 5800,
      categoryName: "Spirits",
      subCategoryName: "Gin",
      brandName: "Bombay Sapphire",
      abv: 47,
      volumeMl: 750,
      description: "London dry gin with botanicals.",
      isFeatured: false,
    },

    // ---------------- Tequila ----------------
    {
      name: "Patrón Reposado",
      price: 9800,
      categoryName: "Spirits",
      subCategoryName: "Tequila",
      brandName: "Patrón",
      abv: 40,
      volumeMl: 750,
      description: "100% blue agave aged tequila.",
      isFeatured: true,
    },
    {
      name: "Jose Cuervo Silver",
      price: 4200,
      categoryName: "Spirits",
      subCategoryName: "Silver Tequila",
      brandName: "Jose Cuervo",
      abv: 38,
      volumeMl: 700,
      description: "Silver tequila from blue agave.",
      isFeatured: false,
    },

    // ---------------- Beer ----------------
    {
      name: "Heineken Lager",
      price: 450,
      categoryName: "Beer",
      subCategoryName: "Lager",
      brandName: "Heineken",
      abv: 5,
      volumeMl: 650,
      description: "Premium European lager beer.",
      isFeatured: false,
    },

    // ---------------- Wine ----------------
    {
      name: "Moët & Chandon Impérial Brut",
      price: 13500,
      categoryName: "Wine",
      subCategoryName: "Champagne",
      brandName: "Moët & Chandon",
      abv: 12,
      volumeMl: 750,
      description: "Classic French champagne.",
      isFeatured: true,
    },
    {
      name: "Prospector’s Seekers Red",
      price: 3200,
      categoryName: "Wine",
      subCategoryName: "Red Wine",
      brandName: "Moët & Chandon",
      abv: 13.5,
      volumeMl: 750,
      description: "South African red wine.",
      isFeatured: false,
    },
    {
      name: "Sauvignon Blanc",
      price: 3000,
      categoryName: "Wine",
      subCategoryName: "White Wine",
      brandName: "Moët & Chandon",
      abv: 12.5,
      volumeMl: 750,
      description: "Fresh white wine from New Zealand.",
      isFeatured: false,
    },

    // ---------------- Cocktails ----------------
    {
      name: "Classic Citrus Cocktail",
      price: 850,
      categoryName: "Cocktails",
      subCategoryName: "Flavoured Cocktails",
      brandName: "Smirnoff",
      abv: 12,
      volumeMl: 250,
      description: "Refreshing citrus cocktail.",
      isFeatured: true,
    },
    {
      name: "Tropical Berry Cocktail",
      price: 900,
      categoryName: "Cocktails",
      subCategoryName: "Flavoured Cocktails",
      brandName: "Smirnoff",
      abv: 12,
      volumeMl: 250,
      description: "Berry infused cocktail.",
      isFeatured: true,
    },
  ]

};

// -----------------------------
// Seeder
// -----------------------------
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const categoryMap = new Map();
  for (const c of seedData.categories) {
    const doc = await upsertByField(Category, "name", c.name, {
      slug: slugify(c.name),
      isActive: true,
    });
    categoryMap.set(c.name, doc);
  }

  const subCategoryMap = new Map();
  for (const sc of seedData.subCategories) {
    const cat = categoryMap.get(sc.categoryName);
    const slug = slugify(sc.name);
    await SubCategory.updateOne(
      { slug },
      { $set: { name: sc.name, slug, category: cat._id, isActive: true } },
      { upsert: true }
    );
    subCategoryMap.set(sc.name, await SubCategory.findOne({ slug }));
  }

  const brandMap = new Map();
  for (const b of seedData.brands) {
    const doc = await upsertByField(Brand, "name", b.name, {
      country: b.country,
      isActive: true,
    });
    brandMap.set(b.name, doc);
  }

  for (const p of seedData.products) {
    let imageId;
    if (p.image) {
      const img = await Image.findOneAndUpdate(
        { publicId: p.image.publicId },
        p.image,
        { upsert: true, new: true }
      );
      imageId = img._id;
    }

    await Product.findOneAndUpdate(
      { name: p.name },
      {
        $set: {
          name: p.name,
          category: categoryMap.get(p.categoryName)._id,
          subCategory: subCategoryMap.get(p.subCategoryName)._id,
          brand: brandMap.get(p.brandName)._id,
          abv: p.abv ?? null,
          volumeMl: p.volumeMl ?? null,
          description: p.description ?? "",
          image: imageId,
          isFeatured: !!p.isFeatured,
          isActive: true,
        },
      },
      { upsert: true }
    );
  }

  console.log("✅ Database seeded successfully");
  await mongoose.disconnect();
}

seed().catch(console.error);


// import mongoose from "mongoose";
// import dotenv from "dotenv";

// import Brand from "./src/models/Products/Brand.js";
// import Category from "./src/models/Products/Category.js";
// import SubCategory from "./src/models/Products/SubCategory.js";

// dotenv.config();

// const subCategories = [
//   { name: "Vodka", categoryName: "Spirits" },
//   { name: "Rum", categoryName: "Spirits" },
//   { name: "Dark Rum", categoryName: "Spirits" },
//   { name: "Whiskey", categoryName: "Spirits" },
//   { name: "Blended Scotch Whisky", categoryName: "Spirits" },
//   { name: "Tequila", categoryName: "Spirits" },
//   { name: "Silver Tequila", categoryName: "Spirits" },
//   { name: "Gin", categoryName: "Spirits" },
//   { name: "Brandy", categoryName: "Spirits" },

//   { name: "Champagne", categoryName: "Wine" },
//   { name: "Red Wine", categoryName: "Wine" },
//   { name: "White Wine", categoryName: "Wine" },

//   { name: "Lager", categoryName: "Beer" },

//   { name: "Flavoured Cocktails", categoryName: "Cocktails" },
// ];

// const brands = [
//   { name: "Absolut", country: "Sweden" },
//   { name: "Bacardi", country: "Puerto Rico" },
//   { name: "Jack Daniel's", country: "United States" },
//   { name: "Johnnie Walker", country: "Scotland" },
//   { name: "Chivas Regal", country: "Scotland" },
//   { name: "Moët & Chandon", country: "France" },
//   { name: "Patrón", country: "Mexico" },
//   { name: "Heineken", country: "Netherlands" },
//   { name: "Bombay Sapphire", country: "United Kingdom" },
//   { name: "Old Monk", country: "India" },
//   { name: "Jose Cuervo", country: "Mexico" },
//   { name: "Smirnoff", country: "United Kingdom" },
//   { name: "Gorbatschow", country: "Germany" },
// ];

// function slugify(text) {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/&/g, "and")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// }

// async function generateUniqueSlug(baseSlug) {
//   let slug = baseSlug;
//   let counter = 1;

//   while (await SubCategory.exists({ slug })) {
//     slug = `${baseSlug}-${counter}`;
//     counter++;
//   }

//   return slug;
// }

// async function connectDB() {
//   const uri = process.env.MONGO_URI;

//   if (!uri) {
//     throw new Error("❌ MONGO_URI not found in environment variables");
//   }

//   await mongoose.connect(uri);
//   console.log("✅ MongoDB connected");
// }

// async function getCategoryMap() {
//   const categories = await Category.find({ isActive: true });

//   const map = new Map();
//   categories.forEach((c) => map.set(c.name, c._id));

//   return map;
// }

// async function seedSubCategories(categoryMap) {
//   let inserted = 0;

//   for (const sc of subCategories) {
//     const categoryId = categoryMap.get(sc.categoryName);

//     if (!categoryId) {
//       console.warn(`⚠️ Category not found: ${sc.categoryName}`);
//       continue;
//     }

//     const exists = await SubCategory.findOne({
//       name: sc.name,
//       category: categoryId,
//     });

//     if (exists) continue;

//     const baseSlug = slugify(sc.name);
//     const uniqueSlug = await generateUniqueSlug(baseSlug);

//     const subCategory = new SubCategory({
//       name: sc.name,
//       slug: uniqueSlug, // ✅ FIX: slug supplied manually
//       category: categoryId,
//       isActive: true,
//     });

//     await subCategory.save();
//     inserted++;
//   }

//   console.log(`✅ SubCategories inserted: ${inserted}`);
// }

// async function seedBrands() {
//   const ops = brands.map((b) => ({
//     updateOne: {
//       filter: { name: b.name },
//       update: {
//         $set: {
//           name: b.name,
//           country: b.country,
//           isActive: true,
//         },
//       },
//       upsert: true,
//     },
//   }));

//   const res = await Brand.bulkWrite(ops, { ordered: false });

//   console.log(
//     `✅ Brands upserted → new: ${res.upsertedCount}, modified: ${res.modifiedCount}`
//   );
// }

// async function runSeed() {
//   try {
//     await connectDB();

//     const categoryMap = await getCategoryMap();
//     await seedSubCategories(categoryMap);
//     await seedBrands();

//     console.log("🎉 Seeding completed successfully");
//   } catch (err) {
//     console.error("❌ Seeding failed:", err);
//     process.exit(1);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// runSeed();
