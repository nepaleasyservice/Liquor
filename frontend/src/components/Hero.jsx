import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: "/hero-banner.jpg",
    title: "Premium Liquors",
    subtitle: "Delivered Fast",
    desc: "Whisky, Vodka, Wine, Rum & Beer — delivered anywhere in Nepal.",
  },
  {
    image: "/hero1.jpg",
    title: "Exclusive Collection",
    subtitle: "Handpicked For You",
    desc: "Explore the finest international & local brands at your doorstep.",
  },
  {
    image: "/hero2.jpg",
    title: "Party Ready",
    subtitle: "Anytime, Anywhere",
    desc: "Get your favorites delivered at lightning speed.",
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, [index]);

  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-white"
      style={{ color: "#222222" }}
    >
      {slides.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt="Hero Slide"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* ✅ ONLY OPACITY CHANGED HERE */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />

      <div className="relative h-full flex flex-col justify-center px-8 md:px-20">
        <div key={animateKey} className="animate-[heroFadeUp_800ms_ease-out]">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {slides[index].title} <br />
            <span className="text-[#D4A056]">{slides[index].subtitle}</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl max-w-xl md:max-w-2xl">
            {slides[index].desc}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/shop")}
              className="px-7 py-3 bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black text-lg font-semibold rounded-xl shadow-md transition hover:scale-[1.05] active:scale-[0.95]"
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate("/products")}
              className="px-7 py-3 bg-white border border-gray-200 text-lg font-semibold rounded-xl shadow-sm transition hover:scale-[1.05] active:scale-[0.95]"
              style={{ color: "#222222" }}
            >
              Browse Categories
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === index ? "bg-[#D4A056]" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes heroFadeUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </section>
  );
}
