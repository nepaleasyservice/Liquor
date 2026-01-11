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

// ✅ safely extract array from any common API shape
function normalizeToArray(data) {
  // case: backend returns array directly
  if (Array.isArray(data)) return data;

  // case: backend returns { data: [...] }
  if (Array.isArray(data?.data)) return data.data;

  // case: backend returns { enjoyTips: [...] } (sometimes happens)
  if (Array.isArray(data?.enjoyTips)) return data.enjoyTips;

  // case: backend returns { tips: [...] }
  if (Array.isArray(data?.tips)) return data.tips;

  // otherwise: not an array
  return [];
}

export default function EnjoySpirits() {
  const [enjoyTips, setEnjoyTips] = useState([]); // should always be array
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ⚠️ backend origin (example: http://localhost:5000)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isMounted = true;

    const fetchEnjoyTips = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await api.get("/enjoy/get");

        // ✅ normalize so .map never crashes
        const tips = normalizeToArray(res?.data);

        if (isMounted) setEnjoyTips(tips);
      } catch (error) {
        console.error("Error fetching enjoy tips:", error);
        if (isMounted) {
          setEnjoyTips([]);
          setErrorMsg("Failed to load tips. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEnjoyTips();

    return () => {
      isMounted = false;
    };
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

        {/* Error message */}
        {errorMsg && (
          <p className="text-center text-red-400 font-medium">{errorMsg}</p>
        )}

        {/* Tips Section */}
        {Array.isArray(enjoyTips) &&
          enjoyTips.map((tip, i) => {
            const imgSrc = resolveImgSrc(tip?.photo?.url, BASE_URL);

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

        {/* Empty state */}
        {!errorMsg && (!Array.isArray(enjoyTips) || enjoyTips.length === 0) && (
          <p className="text-center text-gray-500">No tips found.</p>
        )}
      </div>
    </section>
  );
}
