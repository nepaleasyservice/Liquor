import Offer from "../models/Offer";

// admin gets offer
export const getOffers = async (req, res) => {
    let filter = {}
    try {
        if (req.user.role === "admin") {
            filter.isActive = false;
        }
        if (req.query.isTopDiscount) filter.isTopDiscount = req.query.isTopDiscount;
        if (req.query.isWeeklyDeals) filter.isWeeklyDeals = req.query.isWeeklyDeals;
        if (req.query.isFestivalSpecial) filter.isFestivalSpecial = req.query.isFestivalSpecial;
        filter.isActive = true;

        const offers = Offer.find(filter);
        if (!offers) return res.status(200).json({ success: true, message: "No offers are found" });

        return res.status(200).json({ success: true, offers });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

export const handleFlags = async (req, res) => {
    let { isTopDiscount, isWeeklyDeals, isFestivalSpecial } = null;
    try {
        if (req.query.isTopDiscount) isTopDiscount = Boolean(req.query.isTopDiscount);
        if (req.query.isWeeklyDeals) isWeeklyDeals = Boolean(req.query.isWeeklyDeals);
        if (req.query.isFestivalSpecial) isFestivalSpecial = Boolean(req.query.isFestivalSpecial);
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
}