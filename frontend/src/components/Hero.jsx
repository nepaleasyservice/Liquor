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

  // ✅ for text transition trigger
  const [animateKey, setAnimateKey] = useState(0);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ bump key on slide change to replay text animation
  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, [index]);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* IMAGE SLIDER (crossfade using stacked images) */}
      {slides.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt="Hero Slide"
          className={`absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-20">
        {/* Text animation (replayed via key) */}
        <div
          key={animateKey}
          className="
            animate-[heroFadeUp_800ms_ease-out]
          "
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl">
            {slides[index].title} <br />
            <span className="text-[#D4A056]">{slides[index].subtitle}</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl md:max-w-2xl">
            {slides[index].desc}
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/shop")}
              className="
                px-7 py-3 bg-[#D4A056] hover:bg-[#e3b568]
                text-black text-lg font-semibold rounded-xl shadow-lg
                transition
                hover:scale-[1.05]
                active:scale-[0.95]
              "
              style={{
                boxShadow: "0 8px 20px rgba(212,160,86,0.35)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(212,160,86,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(212,160,86,0.35)")
              }
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate("/products")}
              className="
                px-7 py-3 bg-white/10 backdrop-blur-sm
                border border-white/30 text-white
                text-lg font-semibold rounded-xl shadow-lg
                transition
                hover:scale-[1.05]
                active:scale-[0.95]
                hover:bg-white/20
              "
            >
              Browse Categories
            </button>
          </div>
        </div>

        {/* DOT INDICATORS */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                i === index ? "bg-[#D4A056]" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Local keyframes for text animation */}
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
