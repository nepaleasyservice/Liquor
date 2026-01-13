import { useEffect, useState } from "react";
import api from "../services/api";

function resolveImgSrc(photo, baseUrl) {
  if (!photo) return "";
  if (/^https?:\/\//i.test(photo)) return photo;

  const base = (baseUrl || "").replace(/\/+$/, "");
  const path = String(photo).startsWith("/") ? photo : `/${photo}`;
  return `${base}${path}`;
}

function normalizeToArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.enjoyTips)) return data.enjoyTips;
  if (Array.isArray(data?.tips)) return data.tips;
  return [];
}

export default function EnjoySpirits() {
  const [enjoyTips, setEnjoyTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isMounted = true;

    const fetchEnjoyTips = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await api.get("/enjoy/get");
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
    return (
      <div className="bg-white" style={{ color: "#222222" }}>
        <div className="text-center py-20">Loading...</div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white" style={{ color: "#222222" }}>
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] text-center">
          How to Enjoy Your Spirits
        </h2>

        {errorMsg ? (
          <p className="text-center text-red-600 font-medium">{errorMsg}</p>
        ) : null}

        {Array.isArray(enjoyTips) &&
          enjoyTips.map((tip, i) => {
            const imgSrc = resolveImgSrc(tip?.photo?.url, BASE_URL);

            return (
              <div
                key={tip?._id ?? i}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  i % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 overflow-hidden rounded-3xl shadow-sm border border-gray-200 bg-white">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={tip?.name ?? "tip"}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-[1.02]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 grid place-items-center bg-white">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-[#D4A056]">
                    {tip?.name}
                  </h3>
                  <p>{tip?.description}</p>
                  <span className="inline-block w-20 h-1 bg-[#D4A056] rounded-full" />
                </div>
              </div>
            );
          })}

        {!errorMsg && (!Array.isArray(enjoyTips) || enjoyTips.length === 0) ? (
          <p className="text-center">No tips found.</p>
        ) : null}
      </div>
    </section>
  );
}
