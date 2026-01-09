export default function OfferBanners() {
  const banners = [
    { image: "/whisky.jpg", text: "Up to 20% OFF on Premium Whisky" },
    { image: "/wine.jpg", text: "Buy 2 Get 1 FREE on Select Wines" },
    { image: "/beer.jpg", text: "Beer Combo Deals Starting at Rs. 600" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <div className="grid md:grid-cols-3 gap-6">
        {banners.map((item, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-xl shadow-lg"
          >
            <img
              src={item.image}
              className="w-full h-48 object-cover group-hover:scale-110 duration-300"
              alt="Offer Banner"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 duration-300" />
            <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
              {item.text}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
