import mongoose from "mongoose";
import { config } from "dotenv";

import { ProductModel } from "../models/ProductModel.js";
import { UserModel } from "../models/UserModel.js";

config();

const products = [
  // =========================
  // ELECTRONICS
  // =========================

  {
    title: "MacBook Air M1",
    price: 42000,
    category: "ELECTRONICS",
    description: "Apple MacBook Air with M1 chip, 8GB RAM and 256GB SSD. Excellent laptop for programming, college projects and daily use.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "Dell Inspiron Laptop",
    price: 30000,
    category: "ELECTRONICS",
    description:
      "Dell Inspiron laptop with Intel processor, 8GB RAM and 512GB SSD. Suitable for programming, college work and general use.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "HP Pavilion Laptop",
    price: 35000,
    category: "ELECTRONICS",
    description:
      "HP Pavilion laptop with 8GB RAM and 512GB SSD. Good performance for programming, development, browsing and student projects.",
    condition: "LIKE_NEW",
    isNegotiable: false,
  },

  {
    title: "iPhone 13",
    price: 32000,
    category: "ELECTRONICS",
    description:
      "Apple iPhone 13 with excellent camera, strong battery performance and smooth processor. Carefully used and well maintained.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Samsung Galaxy S22",
    price: 28000,
    category: "ELECTRONICS",
    description: "Samsung Galaxy S22 smartphone with AMOLED display, powerful processor and excellent camera. Good condition.",
    condition: "GOOD",
    isNegotiable: true,
  },

  // =========================
  // CYCLES
  // =========================

  {
    title: "Bitwin Mountain Cycle",
    price: 4200,
    category: "CYCLES",
    description: "Mountain bicycle suitable for college commuting, campus travel and weekend rides. Strong frame with comfortable seating.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "Hercules Gear Cycle",
    price: 5500,
    category: "CYCLES",
    description:
      "Hercules geared bicycle suitable for students and daily campus commuting. Smooth gears and comfortable riding experience.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Firefox Road Bike",
    price: 7000,
    category: "CYCLES",
    description:
      "Firefox road bicycle with lightweight frame and smooth tires. Suitable for college commuting, fitness rides and long distance cycling.",
    condition: "LIKE_NEW",
    isNegotiable: false,
  },

  {
    title: "Urban Trail Bicycle",
    price: 3500,
    category: "CYCLES",
    description: "Urban bicycle designed for daily college transportation and city rides. Comfortable seat and durable frame.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Hero Sprint Cycle",
    price: 4500,
    category: "CYCLES",
    description: "Hero Sprint bicycle suitable for students, campus transportation and everyday commuting. Reliable and easy to maintain.",
    condition: "FAIR",
    isNegotiable: true,
  },

  // =========================
  // BOOKS
  // =========================

  {
    title: "Data Structures in C++",
    price: 450,
    category: "BOOKS",
    description:
      "Data structures and algorithms book covering arrays, linked lists, stacks, queues, trees, graphs and sorting techniques in C++.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Java Programming Book",
    price: 500,
    category: "BOOKS",
    description:
      "Java programming textbook covering object oriented programming, classes, inheritance, interfaces, exceptions and collections.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "Database Management Systems",
    price: 400,
    category: "BOOKS",
    description: "Database management systems book covering SQL, normalization, transactions, concurrency control and database design.",
    condition: "GOOD",
    isNegotiable: false,
  },

  {
    title: "Python Programming Guide",
    price: 550,
    category: "BOOKS",
    description:
      "Python programming guide covering Python syntax, functions, object oriented programming, modules and practical programming examples.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "Operating Systems Book",
    price: 350,
    category: "BOOKS",
    description: "Operating systems textbook covering processes, threads, memory management, scheduling, synchronization and file systems.",
    condition: "FAIR",
    isNegotiable: true,
  },

  // =========================
  // FURNITURE
  // =========================

  {
    title: "Wooden Study Table",
    price: 2500,
    category: "FURNITURE",
    description: "Wooden study table suitable for students and home study. Spacious surface for laptop, books and study materials.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Ergonomic Office Chair",
    price: 3500,
    category: "FURNITURE",
    description:
      "Ergonomic office chair with comfortable back support and adjustable height. Suitable for studying and working long hours.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "College Study Chair",
    price: 1500,
    category: "FURNITURE",
    description:
      "Comfortable study chair suitable for college students. Compact design and suitable for bedrooms, hostels and study rooms.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Wooden Bookshelf",
    price: 1800,
    category: "FURNITURE",
    description: "Compact wooden bookshelf with multiple storage sections for textbooks, notebooks and other study materials.",
    condition: "FAIR",
    isNegotiable: true,
  },

  {
    title: "Computer Study Desk",
    price: 3000,
    category: "FURNITURE",
    description:
      "Computer desk suitable for laptop and desktop setup. Spacious table surface for monitor, keyboard, books and study accessories.",
    condition: "GOOD",
    isNegotiable: false,
  },

  // =========================
  // FASHION
  // =========================

  {
    title: "Men's Casual Hoodie",
    price: 700,
    category: "FASHION",
    description: "Comfortable casual hoodie suitable for college students and everyday wear. Soft fabric with a relaxed fit.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "College Backpack",
    price: 900,
    category: "FASHION",
    description:
      "Spacious college backpack with laptop compartment and multiple storage sections. Suitable for books, laptop and daily college use.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Running Shoes",
    price: 1200,
    category: "FASHION",
    description: "Lightweight running shoes suitable for jogging, walking, college commuting and everyday outdoor activities.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Denim Jacket",
    price: 1000,
    category: "FASHION",
    description: "Classic denim jacket suitable for casual college wear. Comfortable fit and suitable for everyday use.",
    condition: "LIKE_NEW",
    isNegotiable: false,
  },

  {
    title: "Sports Track Pants",
    price: 600,
    category: "FASHION",
    description: "Comfortable sports track pants suitable for running, gym workouts, college activities and casual everyday wear.",
    condition: "GOOD",
    isNegotiable: true,
  },

  // =========================
  // OTHERS
  // =========================

  {
    title: "Scientific Calculator",
    price: 600,
    category: "OTHERS",
    description: "Scientific calculator suitable for engineering mathematics, statistics, electronics and other college subjects.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },

  {
    title: "Engineering Drawing Kit",
    price: 450,
    category: "OTHERS",
    description:
      "Engineering drawing kit containing essential instruments for technical drawing, engineering graphics and college practical work.",
    condition: "GOOD",
    isNegotiable: true,
  },

  {
    title: "Notebook Bundle",
    price: 250,
    category: "OTHERS",
    description: "Bundle of unused notebooks suitable for college notes, assignments, laboratory records and daily study.",
    condition: "NEW",
    isNegotiable: false,
  },

  {
    title: "Highlighter Set",
    price: 150,
    category: "OTHERS",
    description:
      "Set of colorful highlighters suitable for studying, making notes, revision and highlighting important textbook information.",
    condition: "NEW",
    isNegotiable: false,
  },

  {
    title: "Exam Stationery Kit",
    price: 300,
    category: "OTHERS",
    description: "Complete stationery kit containing pens, pencils, eraser, ruler and other useful supplies for college examinations.",
    condition: "LIKE_NEW",
    isNegotiable: true,
  },
];

const createImageUrls = (title) => {
  const encodedTitle = encodeURIComponent(title);

  return [
    `https://placehold.co/600x400/png?text=${encodedTitle}+1`,
    `https://placehold.co/600x400/png?text=${encodedTitle}+2`,
    `https://placehold.co/600x400/png?text=${encodedTitle}+3`,
  ];
};

const seedProducts = async () => {
  try {
    const mongoUri = process.env.DB_URL;

    if (!mongoUri) {
      throw new Error("MongoDB connection string not found. Check your .env file.");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");

    // Get an existing user from the database.
    // This avoids manually entering an ObjectId.
    const owner = await UserModel.findOne().select("_id");

    if (!owner) {
      throw new Error("No users found. Register at least one user before running the seed.");
    }

    console.log(`Using owner: ${owner._id}`);

    const titles = products.map((product) => product.title);

    // Remove only our test products.
    // Existing real products will NOT be touched.
    await ProductModel.deleteMany({
      title: { $in: titles },
    });

    const productsToInsert = products.map((product) => ({
      ...product,
      owner: owner._id,
      productImages: createImageUrls(product.title),
      status: "AVAILABLE",
      isActive: true,
      views: 0,
    }));

    const insertedProducts = await ProductModel.insertMany(productsToInsert);

    console.log(`Successfully inserted ${insertedProducts.length} products.`);

    console.log("\nProducts by category:");

    const categoryCounts = {};

    insertedProducts.forEach((product) => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });

    console.table(categoryCounts);

    console.log("\nSeed completed successfully.");
  } catch (error) {
    console.error("\nSeed failed:");
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedProducts();
