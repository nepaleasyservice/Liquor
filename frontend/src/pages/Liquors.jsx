import LiquorHeader from "../components/liquors/LiquorHeader";
import LiquorCategories from "../components/liquors/LiquorCategories";
import PopularBrands from "../components/liquors/PopularBrands";
import TrendingLiquors from "../components/liquors/TrendingLiquors";
import HomeSections from "../components/liquors/HomeSections.jsx";

export default function Liquors() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16" style={{ color: "#222222" }}>
      <LiquorHeader />
      <LiquorCategories />
      <PopularBrands />
      <TrendingLiquors />
      {/* <HomeSections/> */}
    </div>
  );
}
