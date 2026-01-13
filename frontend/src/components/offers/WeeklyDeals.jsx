export default function WeeklyDeals() {
  const deals = [
    { title: "Weekly Whisky Deal", detail: "Save Rs. 500 on Johnnie Walker Red Label" },
    { title: "Beer Party Pack", detail: "6-Pack Gorkha Beer – Rs. 1,200 Only" },
    { title: "Vodka Special", detail: "Buy Absolut 1L & get 200ml free" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16 bg-white" style={{ color: "#222222" }}>
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Weekly Deals
      </h2>

      <div className="space-y-4">
        {deals.map((deal, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 hover:border-[#D4A056] duration-300 shadow-sm hover:shadow-md"
            style={{ color: "#222222" }}
          >
            <h3 className="text-xl font-semibold" style={{ color: "#222222" }}>
              {deal.title}
            </h3>
            <p className="mt-1" style={{ color: "#222222" }}>
              {deal.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
