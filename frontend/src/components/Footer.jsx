import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-200" style={{ color: "#222222" }}>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2">
          <h3 className="text-4xl font-extrabold tracking-wide">
            Liquor<span className="text-[#D4A056]">Store</span>
          </h3>
          <p className="mt-5 leading-relaxed text-sm">
            Your premium destination for authentic whisky, wine, vodka, beer &
            limited-edition spirits across Nepal.
          </p>
          <p className="mt-4 text-[#B8852E] font-medium text-sm">
            Premium • Authentic • Exclusive
          </p>

          <div className="mt-8 flex gap-4 items-center flex-wrap">
            <div className="bg-white p-2 rounded-full border border-[#D4A056] transition">
              <span className="text-[#B8852E] font-bold text-sm">⭐ Top Rated 2025</span>
            </div>
            <div className="bg-white p-2 rounded-full border border-[#D4A056] transition">
              <span className="text-[#B8852E] font-bold text-sm">🥇 Quality Certified</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056] w-fit pb-1">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/offers", label: "Offers" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((x) => (
              <li key={x.to}>
                <Link
                  to={x.to}
                  className="hover:text-[#B8852E] transition-all duration-300"
                >
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056] w-fit pb-1">
            Categories
          </h4>
          <ul className="space-y-3 text-sm">
            {["Whisky", "Wine", "Beer", "Vodka", "Rum", "Gin"].map((c, i) => (
              <li key={i}>
                <Link
                  to="/shop"
                  className="hover:text-[#B8852E] transition-all duration-300"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-[#D4A056] w-fit pb-1">
            Stay Updated
          </h4>

          <p className="text-sm mb-4">
            Subscribe for exclusive deals, festival offers & new arrivals.
          </p>

          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 bg-white focus:outline-none"
              style={{ color: "#222222" }}
            />
            <button className="px-6 py-2 bg-gradient-to-r from-[#D4A056] to-[#eac98b] text-black font-semibold transition-all">
              Join
            </button>
          </div>

          <div className="flex gap-4 mt-6">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 transition-all cursor-pointer hover:border-[#D4A056]"
              >
                <Icon className="w-5 h-5" style={{ color: "#222222" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-14 pt-6"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm mt-2">
        <span>
          © {new Date().getFullYear()} LiquorStore — Premium Spirits, Delivered
          With Care.
        </span>
        <span>Support: support@liquorstore.com | +977-980-XXXXXXX</span>
      </div>
    </footer>
  );
}
