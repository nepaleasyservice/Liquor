import { Star } from "lucide-react";

export default function About() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-white"
      style={{ color: "#222222" }}
    >
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4A056] to-[#f1d39f] mb-6">
          About LiquorStore
        </h1>
        <p className="md:text-xl max-w-3xl mx-auto leading-relaxed">
          At LiquorStore, we curate the finest spirits from around the world.
          Each bottle tells a story of craftsmanship, authenticity, and elegance
          — delivered right to your glass.
        </p>
      </section>

      {/* Story / History Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
          <img
            src="/bar.jpg"
            alt="Our Story"
            className="w-full h-96 object-cover rounded-3xl"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-[#D4A056]">
            Our Story
          </h2>
          <p>
            Founded with a passion for premium spirits, LiquorStore brings the
            world’s finest whiskies, vodkas, wines, and more to enthusiasts
            across Nepal.
          </p>
          <p>
            From rare distilleries to carefully selected labels, every bottle
            represents authenticity, quality, and luxury.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-10">
        {[
          {
            title: "Our Mission",
            desc: "Deliver premium spirits with exceptional service, ensuring every sip reflects quality and elegance.",
          },
          {
            title: "Our Vision",
            desc: "Become the leading destination for exclusive liquors, providing curated experiences to connoisseurs worldwide.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-[#D4A056] mb-4">
              {item.title}
            </h3>
            <p className="text-lg">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <h2 className="text-4xl font-extrabold text-[#D4A056] text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Shreeti Bajracharya", role: "CEO" },
            { name: "Maria", role: "Master Blender" },
            { name: "James", role: "Marketing Head" },
            { name: "Lara", role: "Customer Support" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-3xl p-6 text-center hover:shadow-lg transition-transform hover:scale-[1.02]"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A056] to-[#f1d39f] flex items-center justify-center text-black text-3xl font-bold">
                {member.name[0]}
              </div>
              <h3 className="font-semibold text-xl">
                {member.name}
              </h3>
              <p className="text-[#D4A056] font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards / Achievements Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <h2 className="text-4xl font-extrabold text-[#D4A056] text-center mb-12">
          Awards & Achievements
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Best Online Liquor Store 2024",
            "Premium Spirits Supplier",
            "Customer Choice Award",
            "Top Whisky Selection",
          ].map((award, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 px-6 py-4 rounded-2xl font-medium hover:shadow-md transition-all"
            >
              <Star className="w-5 h-5 inline-block text-[#D4A056] mr-2" />
              {award}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-20 px-6">
        <p className="text-lg mb-6">
          Explore our exclusive collection and elevate your liquor experience
          today.
        </p>
        <a
          href="/shop"
          className="inline-block bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-bold px-12 py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-lg"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
}
