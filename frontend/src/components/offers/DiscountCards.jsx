export default function DiscountCards() {
  const offers = [
    { name: "Jack Daniel’s No.7", off: "15% OFF", img: "/wine.jpg" },
    { name: "Chivas Regal 12 YO", off: "18% OFF", img: "/tequila.jpeg" },
    { name: "Absolut Vodka", off: "12% OFF", img: "/vodka.jpg" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Top Discounts
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {offers.map((item, i) => (
          <div
            key={i}
            className="
              bg-[#1a1a1a] 
              rounded-xl 
              shadow-lg 
              p-5 
              border 
              border-transparent
              transition-all 
              duration-300 
              hover:scale-105 
              hover:border-[#D4A056]
              hover:shadow-[0_0_15px_#D4A056]
            "
          >
            <img
              src={item.img}
              className="w-full h-52 rounded-lg object-cover mb-4"
            />

            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-[#D4A056] font-bold text-lg mt-1">
              {item.off}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
