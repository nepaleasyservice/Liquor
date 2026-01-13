export default function OfferBanners() {
  const banners = [
    { image: "/whisky.jpg", text: "Up to 20% OFF on Premium Whisky" },
    { image: "/wine.jpg", text: "Buy 2 Get 1 FREE on Select Wines" },
    { image: "/beer.jpg", text: "Beer Combo Deals Starting at Rs. 600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16 bg-white" style={{ color: "#222222" }}>
      <div className="grid md:grid-cols-3 gap-6">
        {banners.map((item, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white"
          >
            <img
              src={item.image}
              className="w-full h-48 object-cover group-hover:scale-110 duration-300"
              alt="Offer Banner"
            />

            {/* solid white label (no opacity) */}
            <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-md">
              <h3 className="text-base font-bold" style={{ color: "#222222" }}>
                {item.text}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
