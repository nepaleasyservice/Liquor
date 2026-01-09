import Brand from "../models/Products/Brand.js";

const getBrand = async (req, res) => {
    const filter = { isActive: true };
    try {
        const brands = await Brand.find(filter)
            .select("-__v -updatedAt");
        return res.status(200).json(brands);
    } catch (err) {
        return res.status(400).json({ message: "Cannot find brand", error: err });
    }
}

export { getBrand };