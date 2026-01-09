import Category from "../models/Products/Category.js";
import SubCategory from "../models/Products/SubCategory.js";

const getCategory = async (req, res) => {
    const filter = { isActive: true };
    try {
        const response = await Category.find()
            .select("-__v");
        res.status(200).json(response);
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

export const getSubCategory = async (req, res) => {
    const filter = { isActive: true }
    try {
        const categoryId = req.query.categoryId;
        if (categoryId) filter.category = await Category.findById(categoryId);
        const response = await SubCategory.find(filter)
            .select("-__v, -isActive")
            .populate("category", "name slug");
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

export default getCategory;