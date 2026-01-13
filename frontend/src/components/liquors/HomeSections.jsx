import LiquorCategories from "./LiquorCategories";
import PopularBrands from "./PopularBrands";
import TrendingLiquors from "./TrendingLiquors";

export default function HomeSections() {
  return (
    <div className="bg-white" style={{ color: "#222222" }}>
      <LiquorCategories />
      <PopularBrands />
      <TrendingLiquors />
    </div>
  );
}
