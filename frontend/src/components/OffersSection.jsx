import { Link } from "react-router-dom";

export default function OffersSection() {
  const offerBanners = [
    { img: "/offer.jpg", discount: "20% OFF", title: "Premium Whisky Collection" },
    { img: "/offer.jpg", discount: "15% OFF", title: "Imported Vodka Sale" },
  ];

  return (
    <section className="py-20 bg-white" style={{ color: "#222222" }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
          Latest Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerBanners.map((offer, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden shadow-md border border-gray-200 transition-all duration-500 cursor-pointer animate-slideUp hover:border-[#D4A056]"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <img
                src={offer.img}
                alt={offer.title}
                className="w-full h-80 object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
              />

              {/* No opacity: solid gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent rounded-3xl" />

              <div className="absolute bottom-6 left-6">
                <span className="text-[#B8852E] font-extrabold text-xl md:text-2xl">
                  {offer.discount}
                </span>

                <h3 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: "#222222" }}>
                  {offer.title}
                </h3>

                <Link to="/offers">
                  <button
                    className="mt-4 px-5 py-2 bg-white border border-gray-200 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#D4A056] hover:to-[#f1d39f] hover:text-black active:scale-95"
                    style={{ color: "#222222" }}
                  >
                    View Offer
                  </button>
                </Link>
              </div>

              {/* No opacity: remove glow */}
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
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
