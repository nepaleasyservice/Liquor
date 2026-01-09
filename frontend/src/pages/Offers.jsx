import OffersHeader from "../components/offers/OffersHeader";
import OfferBanners from "../components/offers/OfferBanners";
import DiscountCards from "../components/offers/DiscountCards";
import WeeklyDeals from "../components/offers/WeeklyDeals";
import FestivalSpecials from "../components/offers/FestivalSpecials";

export default function Offers() {
  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen pt-24 pb-16">
      <OffersHeader />
      <OfferBanners />
      <DiscountCards />
      <WeeklyDeals />
      <FestivalSpecials />
    </div>
  );
}
