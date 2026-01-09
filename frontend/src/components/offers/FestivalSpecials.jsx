export default function FestivalSpecials() {
  const festivals = [
    { name: "Dashain Mega Offer", desc: "Flat 10% OFF on all Whisky", img: "/gin.jpg" },
    { name: "Tihar Celebration Pack", desc: "Gift Combo starting at Rs. 2,999", img: "/brandy.jpg" },
    { name: "New Year Deals", desc: "Massive discounts on premium liquor", img: "/rum.jpg" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Festival Specials
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {festivals.map((item, i) => (
          <div
            key={i}
            className="
              rounded-xl 
              overflow-hidden 
              shadow-lg
              border 
              border-transparent 
              bg-[#1a1a1a]
              transition-all 
              duration-300 
              hover:scale-105 
              hover:border-[#D4A056] 
              hover:shadow-[0_0_15px_#D4A056]
            "
          >
            <img src={item.img} className="w-full h-48 object-cover" />

            <div className="p-5">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-300 mt-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
