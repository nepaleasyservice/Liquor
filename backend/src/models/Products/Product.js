import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    abv: Number,
    volumeMl: Number,
    description: String,

    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },

    price: Number,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = ret.createdAt.toLocaleString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toLocaleString();
    return ret;
  },
});

ImageSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = ret.createdAt.toLocaleString();
    if (ret.updatedAt) ret.updatedAt = ret.updatedAt.toLocaleString();
    return ret;
  },
});

export const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);
export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
