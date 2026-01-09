import { useNavigate } from "react-router-dom";
import {
  Wine,
  Beer,
  Martini,
  GlassWater,
  CupSoda,
  Crown,
} from "lucide-react";

/* Liquor Categories Component */
function LiquorCategories() {
  const navigate = useNavigate();

  const categories = [
    { name: "Whisky", image: "/whisky.jpg" },
    { name: "Wine", image: "/wine.jpg" },
    { name: "Beer", image: "/beer.jpg" },
    { name: "Vodka", image: "/vodka.jpg" },
    { name: "Rum", image: "/rum.jpg" },
    { name: "Gin", image: "/gin.jpg" },
    { name: "Tequila", image: "/tequila.jpeg" },
    { name: "Brandy", image: "/brandy.jpg" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Browse by Category
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate(`/shop?category=${cat.name}`)}
            className="relative group rounded-xl overflow-hidden shadow-lg hover:scale-105 duration-300 cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-56 object-cover group-hover:opacity-80 duration-300"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 duration-300" />

            <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg">
              {cat.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   Popular Brands Component
================================ */
function PopularBrands() {
  const brands = [
    { name: "Johnnie Walker", icon: Crown, img: "/brands/johnie.jpg" },
    { name: "Jack Daniel's", icon: Beer, img: "/brands/jack.jpg" },
    { name: "Moët & Chandon", icon: Wine, img: "/brands/moet.jpg" },
    { name: "Absolut Vodka", icon: GlassWater, img: "/brands/abolut.jpg" },
    { name: "Bacardi", icon: CupSoda, img: "/brands/bacardi.jpg" },
    { name: "Patrón Tequila", icon: Martini, img: "/brands/patron.jpg" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Popular Brands
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {brands.map((brand, index) => {
          const Icon = brand.icon;

          return (
            <div
              key={index}
              className="
                relative group rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-300
                bg-black/20 
                border border-[#d4a056]/20
                hover:border-[#d4a056]/60
              "
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${brand.img})` }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3 h-48">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#d4a056]/80 shadow-md">
                  <Icon className="text-white w-7 h-7" />
                </div>

                <p className="text-lg font-semibold text-white tracking-wide">
                  {brand.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ===============================
   Trending Liquors Component
================================ */
function TrendingLiquors() {
  const products = [
    { name: "Jack Daniel's Old No.7", price: "Rs. 5,800", image: "/rum.jpg" },
    { name: "Chivas Regal 12YO", price: "Rs. 6,500", image: "/whisky.jpg" },
    { name: "Absolut Vodka", price: "Rs. 3,000", image: "/vodka.jpg" },
    { name: "Gorkha Beer", price: "Rs. 350", image: "/brandy.jpg" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Trending Liquors
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((item, i) => (
          <div
            key={i}
            className="
              bg-[#151515]
              rounded-xl
              p-4
              cursor-pointer
              border border-transparent
              transition-all duration-300
              hover:border-[#D4A056]/70
              hover:bg-[#1c1c1c]
              hover:-translate-y-1
            "
          >
            <img
              src={item.image}
              loading="lazy"
              className="w-full h-52 object-cover rounded-lg"
              alt={item.name}
            />

            <h3 className="text-xl font-semibold text-white mt-4">
              {item.name}
            </h3>

            <p className="text-[#D4A056] font-bold mt-2">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===============================
   MAIN EXPORT
================================ */
export default function HomeSections() {
  return (
    <>
      <LiquorCategories />
      <PopularBrands />
      <TrendingLiquors />
    </>
  );
}
