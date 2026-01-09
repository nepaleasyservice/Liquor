// src/data/products.js
import api from "../services/api.js"

export const products = [
  {
    id: 1001,
    name: "Johnnie Walker Black Label",
    price: 6500,
    image: "/whisky-1.jpeg",
    category: "Whisky",
    country: "Scotland",
    description: "A smooth, smoky blend aged for 12 years with rich depth and character."
  },
  {
    id: 1002,
    name: "Absolute Vodka",
    price: 2800,
    image: "/vodka-1.jpg",
    category: "Vodka",
    country: "Sweden",
    description: "Premium Swedish vodka known for its clarity and smooth taste."
  },
  {
    id: 1003,
    name: "Old Durbar Black Chimney",
    price: 2450,
    image: "/whisky-2.jpg",
    category: "Whisky",
    country: "Nepal",
    description: "Nepal’s signature whisky with bold smoky notes and a smooth finish."
  },
  {
    id: 1004,
    name: "Carlo Rossi Red Wine",
    price: 1500,
    image: "/wine-1.jpg",
    category: "Wine",
    country: "USA",
    description: "A delightful red wine offering fruity richness and balanced acidity."
  }
];


export const getProductList = async () => {
  const products = await api.get("/products/list");
  return products.data;
}

export const getFeaturedProducts = async () => {
  const featuredProducts = await api.get("/products/list", { params: { featured: true } });
  return featuredProducts.data.data;
}