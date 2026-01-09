import mongoose from "mongoose";

const Brand = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    country: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

Brand.set("toJSON", {
    transform: (doc, ret) => {
        if (ret.createdAt) {
            ret.createdAt = ret.createdAt.toLocaleString();
        }
        if (ret.updatedAt) {
            ret.updatedAt = ret.updatedAt.toLocaleString();
        }
        return ret;
    }
});

export default mongoose.model("Brand", Brand);