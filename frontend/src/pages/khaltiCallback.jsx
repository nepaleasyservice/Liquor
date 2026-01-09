import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { KHALTIPAYMENTURLS } from "../api/constants";
import api from "../services/api";

export default function KhaltiCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const pidx = params.get("pidx");

    if (!pidx) {
      navigate("/payment", { replace: true });
      return;
    }

    const verify = async () => {
      try {
        // Axios response
        const res = await api.post(KHALTIPAYMENTURLS.KHALTILOOKUP, { pidx });
        const json = res?.data;

        // Your backend likely returns: { success: true/false, data: {...}, message? }
        if (!json?.success) {
          console.error("Khalti lookup failed:", json);
          navigate("/payment", { replace: true });
          return;
        }

        const lookupStatus = json?.data?.status;
        console.log("Khalti status:", lookupStatus);

        if (lookupStatus === "Completed") {
          clearCart();

          // Go to payment success page
          navigate("/payment-success", {
            replace: true,
            state: {
              pidx,
              status: lookupStatus,
              // optional if your backend sends them:
              orderId: json?.data?.purchase_order_id || json?.data?.order_id || null,
              amount: json?.data?.total_amount || null,
            },
          });
        } else {
          navigate("/payment", { replace: true });
        }
      } catch (e) {
        console.error("Khalti verify error:", e);
        navigate("/payment", { replace: true });
      }
    };

    verify();
  }, [params, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-[#0B0705] pt-32 px-6 text-white">
      <h1 className="text-3xl font-bold">Verifying Khalti payment…</h1>
      <p className="text-gray-400 mt-3">Please don’t close this page.</p>
    </div>
  );
}
