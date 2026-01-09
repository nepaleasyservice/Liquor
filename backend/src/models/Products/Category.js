import mongoose from "mongoose";
import { generateUniqueSlug } from "../../middleware/generateSlug.js";

const Category = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

Category.pre("save", async function () {
    if (!this.isModified("name")) return;
    this.slug = await generateUniqueSlug(mongoose.model("Category"), this.name);
});

Category.set("toJSON", {
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

export default mongoose.model("Category", Category);