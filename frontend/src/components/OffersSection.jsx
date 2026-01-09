import { Link } from "react-router-dom";

export default function OffersSection() {
  const offerBanners = [
    {
      img: "/offer.jpg",
      discount: "20% OFF",
      title: "Premium Whisky Collection",
    },
    {
      img: "/offer.jpg",
      discount: "15% OFF",
      title: "Imported Vodka Sale",
    },
  ];

  return (
    <section className="py-20 bg-[#0B0705] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
          Latest Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerBanners.map((offer, index) => (
            <div
              key={index}
              className="
                group relative rounded-3xl overflow-hidden
                shadow-2xl border border-white/10
                hover:border-[#D4A056]
                transition-all duration-500
                cursor-pointer
                animate-slideUp
              "
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <img
                src={offer.img}
                alt={offer.title}
                className="
                  w-full h-80 object-cover rounded-3xl
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl" />

              {/* Text */}
              <div className="absolute bottom-6 left-6">
                <span className="text-[#D4A056] font-extrabold text-xl md:text-2xl drop-shadow-lg">
                  {offer.discount}
                </span>

                <h3 className="text-2xl md:text-3xl font-bold mt-2 drop-shadow-md">
                  {offer.title}
                </h3>

                <Link to="/offers">
                  <button
                    className="
                      mt-4 px-5 py-2
                      bg-white/20 border border-white/30
                      rounded-xl backdrop-blur-md
                      font-semibold
                      transition-all duration-300
                      hover:bg-[#D4A056] hover:text-black
                      active:scale-95
                    "
                  >
                    View Offer
                  </button>
                </Link>
              </div>

              {/* Glow */}
              <div
                className="
                  absolute -top-10 -right-10
                  w-32 h-32
                  bg-gradient-to-r from-[#D4A056]/50 to-transparent
                  rounded-full blur-3xl
                  opacity-60
                  group-hover:opacity-100
                  transition-all duration-500
                "
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSS animation */}
      <style>
        {`
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideUp {
            animation: slideUp 0.5s ease forwards;
            will-change: transform, opacity;
          }
        `}
      </style>
    </section>
  );
}
