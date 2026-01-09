import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0A0503] text-white pt-24 pb-12 relative overflow-hidden">

      {/* Top Glow */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4A056] to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-14">

        {/* Brand & About */}
        <div className="lg:col-span-2">
          <h3 className="text-4xl font-extrabold tracking-wide">
            Liquor<span className="text-[#D4A056]">Store</span>
          </h3>
          <p className="mt-5 text-gray-400 leading-relaxed text-sm">
            Your premium destination for authentic whisky, wine, vodka, beer & limited-edition spirits across Nepal.
          </p>
          <p className="mt-4 text-[#D4A056] font-medium text-sm">
            Premium • Authentic • Exclusive
          </p>

          {/* Awards / Certification */}
          <div className="mt-8 flex gap-4 items-center">
            <div className="bg-[#1C0F08] p-2 rounded-full border border-[#D4A056]/30 hover:border-[#D4A056] transition">
              <span className="text-[#D4A056] font-bold text-sm">⭐ Top Rated 2025</span>
            </div>
            <div className="bg-[#1C0F08] p-2 rounded-full border border-[#D4A056]/30 hover:border-[#D4A056] transition">
              <span className="text-[#D4A056] font-bold text-sm">🥇 Quality Certified</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056]/50 w-fit pb-1">
            Quick Links
          </h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <Link to="/" className="hover:text-[#D4A056] hover:translate-x-1 transition-all duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#D4A056] hover:translate-x-1 transition-all duration-300">
                Products
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-[#D4A056] hover:translate-x-1 transition-all duration-300">
                Offers
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#D4A056] hover:translate-x-1 transition-all duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#D4A056] hover:translate-x-1 transition-all duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056]/50 w-fit pb-1">
            Categories
          </h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            {["Whisky", "Wine", "Beer", "Vodka", "Rum", "Gin"].map((c, i) => (
              <li key={i}>
                <Link
                  to="/shop"
                  className="hover:text-[#D4A056] cursor-pointer hover:translate-x-1 transition-all duration-300"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056]/50 w-fit pb-1">
            Stay Updated
          </h4>

          <p className="text-gray-400 text-sm mb-4">
            Subscribe for exclusive deals, festival offers & new arrivals.
          </p>

          <div className="flex rounded-xl overflow-hidden border border-[#d4a056]/30 bg-[#160c07] shadow-inner">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-[#D4A056] to-[#eac98b] text-black font-semibold hover:opacity-90 transition-all">
              Join
            </button>
          </div>

          <div className="flex gap-4 mt-6">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#D4A056]/40 hover:border-[#D4A056] transition-all cursor-pointer hover:bg-[#D4A056]/15"
              >
                <Icon className="w-5 h-5 text-gray-300 hover:text-[#D4A056] transition-all" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Divider */}
      <div className="border-t border-[#2d1a12] mt-16 pt-6"></div>

      {/* Extra Info */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm mt-4">
        <span>© {new Date().getFullYear()} LiquorStore — Premium Spirits, Delivered With Care.</span>
        <span>Support: support@liquorstore.com | +977-980-XXXXXXX</span>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4A056] to-transparent opacity-50"></div>
    </footer>
  );
}
