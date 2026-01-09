import mongoose from "mongoose";

import { generateUniqueSlug } from "../../middleware/generateSlug.js";

const SubCategory = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


SubCategory.pre("save", async function () {
    if (!this.isModified("name")) return;
    this.slug = await generateUniqueSlug(
        mongoose.model("SubCategory"),
        this.name
    );
});

SubCategory.set("toJSON", {
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

export default mongoose.model("SubCategory", SubCategory);