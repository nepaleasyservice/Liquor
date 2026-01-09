import mongoose from "mongoose";
import { PAYMENTSTATUS, PAYMENTMETHOD } from "../utils/constants.js";
import User from "./User.js"
import { Product } from "./Products/Product.js";

const orderItem = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String },
    },
    { _id: false }
);

const order = new mongoose.Schema(
    {
        orderId: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        items: { type: [orderItem], required: true },
        subtotal: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        total: { type: Number, required: true },

        paymentMethod: { type: String, enum: Object.values(PAYMENTMETHOD), required: true },
        paymentStatus: { type: String, enum: Object.values(PAYMENTSTATUS), default: PAYMENTSTATUS.PENDING },

        khalti: {
            pidx: { type: String },
            status: { type: String },
            transaction_id: { type: String },
            amountPaisa: { type: Number },
            raw: { type: Object },
        },

        deliveryAddress: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
            city: String,
            province: String,
            postalCode: String,
        },
    },
    { timestamps: true }
);
order.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = ret.createdAt.toLocaleString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toLocaleString();
    return ret;
  },
});
export default mongoose.model("Order", order);