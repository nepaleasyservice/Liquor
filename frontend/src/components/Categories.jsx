import { useEffect, useState } from "react";
import api from "../services/api";

// ✅ build correct img url (cloudinary or local)
function resolveImgSrc(photo, baseUrl) {
  if (!photo) return "";

  // already absolute url (cloudinary, s3, etc.)
  if (/^https?:\/\//i.test(photo)) return photo;

  // local path -> prefix with BASE_URL
  const base = (baseUrl || "").replace(/\/+$/, "");
  const path = String(photo).startsWith("/") ? photo : `/${photo}`;
  return `${base}${path}`;
}

export default function EnjoySpirits() {
  const [enjoyTips, setEnjoyTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ backend origin (example: http://localhost:5000)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEnjoyTips = async () => {
      try {
        const res = await api.get("/enjoy/get");
        console.log(res)
        setEnjoyTips(res.data || []);
      } catch (error) {
        console.error("Error fetching enjoy tips:", error);
        setEnjoyTips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnjoyTips();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <section className="py-20 bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] text-center">
          How to Enjoy Your Spirits
        </h2>

        {/* Tips Section */}
        {enjoyTips?.map((tip, i) => {
          const imgSrc = resolveImgSrc(tip?.photo, BASE_URL);

          return (
            <div
              key={tip?._id ?? i}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16
              ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
            >
              {/* Image */}
              <div className="flex-1 overflow-hidden rounded-3xl shadow-lg group">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={tip?.name ?? "tip"}
                    className="
                      w-full h-48 object-cover
                      transition-transform duration-500
                      group-hover:scale-[1.03]
                    "
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 grid place-items-center text-gray-500 bg-white/5">
                    No image
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-[#D4A056]">
                  {tip?.name}
                </h3>
                <p className="text-gray-300">{tip?.description}</p>
                <span className="inline-block w-20 h-1 bg-[#D4A056] rounded-full" />
              </div>
            </div>
          );
        })}

        {!loading && enjoyTips?.length === 0 && (
          <p className="text-center text-gray-500">No tips found.</p>
        )}
      </div>
    </section>
  );
}
