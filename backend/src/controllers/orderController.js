import Order from "../models/Order.js";
import { PAYMENTSTATUS } from "../utils/constants.js";
import User from "../models/User.js";
import { buildPaginationMeta, getPagination } from "../utils/paginate.js";

export const getOrderForAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    const { page, limit, skip } = getPagination(req.query);
    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({ orders, pagination: buildPaginationMeta({ total, page, limit }) });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const getOrderForUser = async (req, res) => {
  try {
    const filter = { user: req.user.id, paymentStatus: PAYMENTSTATUS.SUCCESS };
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    const response = orders.map((o) => ({
      ...o.toObject(),
      createdAt: o.createdAt?.toLocaleString?.() || o.createdAt,
      updatedAt: o.updatedAt?.toLocaleString?.() || o.updatedAt,
    }));

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total, paymentMethod, billing, address } = req.body;

    if (!items?.length) return res.status(400).json({ success: false, message: "Cart is empty" });

    const orderId = `ORD-${Date.now()}`;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(400).json({ success: false, message: "user not logged in." });
    }

    const order = await Order.create({
      orderId,
      user: req.user.id,
      items,
      subtotal,
      deliveryFee,
      total,

      paymentMethod,
      paymentStatus: PAYMENTSTATUS.PENDING,

      deliveryAddress: {
        fullName: billing.fullName,
        email: billing.email,
        phone: billing.phone,
        address: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode
      },
    });
    res.json({ success: true, order });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getParticularOrder = async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};