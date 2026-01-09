import { Star, Award, Users, Trophy } from "lucide-react";

export default function About() {
  return (
    <div className="relative bg-[#0B0705] text-white min-h-screen overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4A056] to-[#f1d39f] drop-shadow-lg mb-6">
          About LiquorStore
        </h1>
        <p className="text-gray-300 md:text-xl max-w-3xl mx-auto leading-relaxed">
          At LiquorStore, we curate the finest spirits from around the world. Each bottle tells a story of craftsmanship, authenticity, and elegance — delivered right to your glass.
        </p>
      </section>

      {/* Story / History Section */}
      <section className="relative max-w-6xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
          <img
            src="/bar.jpg"
            alt="Our Story"
            className="w-full h-96 object-cover rounded-3xl"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-[#D4A056]">Our Story</h2>
          <p className="text-gray-300">
            Founded with a passion for premium spirits, LiquorStore brings the world’s finest whiskies, vodkas, wines, and more to enthusiasts across Nepal. 
          </p>
          <p className="text-gray-300">
            From rare distilleries to carefully selected labels, every bottle represents authenticity, quality, and luxury.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32 grid md:grid-cols-2 gap-10">
        {[
          { title: "Our Mission", desc: "Deliver premium spirits with exceptional service, ensuring every sip reflects quality and elegance." },
          { title: "Our Vision", desc: "Become the leading destination for exclusive liquors, providing curated experiences to connoisseurs worldwide." },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#1A0E0B]/80 border border-[#D4A056]/20 rounded-3xl p-8 backdrop-blur-md hover:shadow-[0_0_40px_rgba(212,160,86,0.4)] transition-all duration-500 cursor-default"
          >
            <h3 className="text-2xl font-bold text-[#D4A056] mb-4">{item.title}</h3>
            <p className="text-gray-300 text-lg">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <h2 className="text-4xl font-extrabold text-[#D4A056] text-center mb-12">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Shreeti Bajracharya", role: "CEO" },
            { name: "Maria", role: "Master Blender" },
            { name: "James", role: "Marketing Head" },
            { name: "Lara", role: "Customer Support" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-[#0E0907]/60 border border-[#D4A056]/20 rounded-3xl p-6 text-center hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A056] to-[#f1d39f] flex items-center justify-center text-black text-3xl font-bold">
                {member.name[0]}
              </div>
              <h3 className="text-white font-semibold text-xl">{member.name}</h3>
              <p className="text-[#D4A056] font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards / Achievements Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <h2 className="text-4xl font-extrabold text-[#D4A056] text-center mb-12">Awards & Achievements</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "Best Online Liquor Store 2024",
            "Premium Spirits Supplier",
            "Customer Choice Award",
            "Top Whisky Selection",
          ].map((award, i) => (
            <div
              key={i}
              className="bg-[#0E0907]/70 border border-[#D4A056]/20 px-6 py-4 rounded-2xl text-gray-300 font-medium hover:shadow-[0_0_25px_rgba(212,160,86,0.5)] transition-all cursor-default"
            >
              <Star className="w-5 h-5 inline-block text-[#D4A056] mr-2" /> {award}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-20 px-6">
        <p className="text-gray-300 text-lg mb-6">
          Explore our exclusive collection and elevate your liquor experience today.
        </p>
        <a
          href="/shop"
          className="inline-block bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(212,160,86,0.6)] transition-all text-lg"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
}
