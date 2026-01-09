import { Product } from "../models/Products/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { buildPaginationMeta, getPagination } from "../utils/paginate.js";

export const getUserList = async (req, res) => {
    const filter = { role: "user" };

    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };

    const { page, limit, skip } = getPagination(req.query);
    try {
        const [total, userList] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v -refreshToken -passwordhash -tokenVersion")
        ]);

        return res.status(200).json({ data: userList, pagination: buildPaginationMeta({ total, page, limit }) });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

export const disableUser = async (req, res) => {
    const filter = { isActive: false };

    const body = req.body;

    if (!body.id) return res.status(400).json({ success: false, message: "User id is required" });

    filter._id = body.id;
    console.log(filter);

    try {
        const user = await User.findOne(filter);

        if (!user) {
            throw new Error("User not found");
        }

        user.isDisabled = !user.isDisabled;
        await user.save();

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const orderFilter = {};

        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ message: "Start and end dates are required" });

        const startDate = new Date(start);
        const endDate = new Date(end);

        const match = {
            createdAt: { $gte: startDate, $lt: endDate },
            paymentStatus: "SUCCESS",
        };

        orderFilter.createdAt = { $gte: startDate, $lt: endDate };

        const productStats = await Order.aggregate([
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    name: { $first: "$items.name" },
                    totalQty: { $sum: "$items.qty" },
                    totalRevenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
                    lineCount: { $sum: 1 },
                },

            },
            { $sort: { totalQty: -1 } },
        ]);
        const totalOrder = await Order.countDocuments(orderFilter);

        return res.status(200).json({
            totalOrder,
            productStats,
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message })
    }

}