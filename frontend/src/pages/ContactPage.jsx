import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-[#0F0A07] text-white pt-20 pb-16">

      {/* HEADER */}
      <section className="text-center max-w-3xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-[#D4A056]">Get In Touch</h1>
        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
          We're here to help with your orders, product queries, delivery information 
          or partnership opportunities. Reach out to us anytime.
        </p>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-2 gap-12">

        {/* CONTACT INFO CARD */}
        <div className="bg-[#1A120D] rounded-2xl p-8 shadow-xl border border-[#2E1D12]">
          <h2 className="text-3xl font-semibold text-[#D4A056] mb-6">
            Contact Information
          </h2>

          <div className="space-y-6 text-gray-300">
            
            <div className="flex items-start gap-4">
              <Phone className="text-[#D4A056] w-7 h-7" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+977 9800000000</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-[#D4A056] w-7 h-7" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>support@liquorstore.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-[#D4A056] w-7 h-7" />
              <div>
                <p className="font-semibold text-white">Address</p>
                <p>Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-[#D4A056] w-7 h-7" />
              <div>
                <p className="font-semibold text-white">Business Hours</p>
                <p>Sun–Fri: 9:00 AM – 10:00 PM</p>
                <p>Saturday: 10:00 AM – 8:00 PM</p>
              </div>
            </div>

          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="bg-[#1A120D] rounded-2xl p-8 shadow-xl border border-[#2E1D12]">
          <h2 className="text-3xl font-semibold text-[#D4A056] mb-6">
            Send Us a Message
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-300">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-[#0E0907] border border-[#3B2519] 
                text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A056]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-[#0E0907] border border-[#3B2519] 
                text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A056]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-[#0E0907] border border-[#3B2519] 
                text-white placeholder-gray-400 focus:outline-none focus:border-[#D4A056]"
                placeholder="Write your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4A056] text-black py-3 rounded-lg font-semibold text-lg 
              hover:bg-[#e6b56b] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="max-w-7xl mx-auto mt-20 px-6">
        <h2 className="text-3xl font-bold text-[#D4A056] mb-4">Find Us</h2>
        <div className="rounded-2xl overflow-hidden border border-[#2E1D12] shadow-xl">
          <iframe
            title="Map Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.251805893202!2d85.3198201!3d27.7078756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a36f3e4d1%3A0x2dfc9b391d4bdf6b!2sKathmandu!5e0!3m2!1sen!2snp!4v1700000000000"
            className="w-full h-96"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  );
}
