import { Product, Image } from "../models/Products/Product.js";
import "../models/Index.js";
import Category from "../models/Products/Category.js";
import SubCategory from "../models/Products/SubCategory.js";
import Brand from "../models/Products/Brand.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { buildPaginationMeta, getPagination } from "../utils/paginate.js";

export const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.name) filter.name = { $regex: req.query.name, $options: "i" };
    if (req.query.featured === "true") filter.isFeatured = true;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subCategory) filter.subCategory = req.query.subCategory;
    if (req.query.brand) filter.brand = req.query.brand;

    const { page, limit, skip } = getPagination(req.query);

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .select("-__v")
        .populate("category", "name slug")
        .populate("subCategory", "name slug")
        .populate("brand", "name country")
        .populate("image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({ data: products, pagination: buildPaginationMeta({ total, page, limit }) });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export const getParticularProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.findById(id)
      .select("-__v")
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("brand", "name country")
      .populate("image")
      .lean();

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const createProduct = async (req, res) => {
  let localFilePath = null;
  try {
    if (!req.file?.path) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    localFilePath = req.file.path;

    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      abv,
      volumeMl,
      description = "",
      price,
      isActive = true,
      isFeatured = false
    } = req.body;

    if (!name || !categoryId || !subCategoryId || !brandId || !abv || !volumeMl || !price) {
      return res.status(400).json({
        success: false,
        message: "Something is missing",
      });
    }

    const normalizedName = name.trim();
    const normalizedVolume = Number(volumeMl);
    const normalizedAbv = Number(abv);
    const normalizedPrice = Number(price);

    const [category, subCategory, brand] = await Promise.all([
      Category.findById(categoryId),
      SubCategory.findById(subCategoryId),
      Brand.findById(brandId),
    ]);

    if (!category) return res.status(400).json({ success: false, message: "Invalid categoryId" });
    if (!subCategory) return res.status(400).json({ success: false, message: "Invalid subCategoryId" });
    if (!brand) return res.status(400).json({ success: false, message: "Invalid brandId" });

    const exists = await Product.findOne({
      isActive: true,
      category: category._id,
      subCategory: subCategory._id,
      brand: brand._id,
      name: normalizedName,
      volumeMl: normalizedVolume,
      abv: normalizedAbv,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    const url = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    const publicId = cloudinaryResponse?.public_id;

    if (!url || !publicId) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    const image = await Image.create({ url, publicId });

    const created = await Product.create({
      name: normalizedName,
      category: category._id,
      subCategory: subCategory._id,
      brand: brand._id,
      abv: normalizedAbv,
      volumeMl: normalizedVolume,
      description,
      price: normalizedPrice,
      image: image._id,
      isFeatured: isFeatured,
      isActive: isActive,
    });

    const product = await Product.findById(created._id).populate("image")

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  } finally {
    if (localFilePath) {
      try {
        await fs.unlinkSync(localFilePath);
      } catch { }
    }
  }
};

export const publishProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .select("-__v")
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("brand", "name country")
      .populate("image");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const featureProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .select("-__v")
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("brand", "name country")
      .populate("image");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const editProduct = async (req, res) => {
  let localFilePath = null;

  try {
    const { id } = req.params;

    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      abv,
      volumeMl,
      description = "",
      price,
      isActive,
      isFeatured,
    } = req.body;

    if (!req.file?.path) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    localFilePath = req.file.path;

    const required = [id, name, categoryId, subCategoryId, brandId, abv, volumeMl, price];
    if (required.some(v => v === undefined || v === null || v === "")) {
      return res.status(400).json({ success: false, message: "Something is missing" });
    }

    const [category, subCategory, brand, currentProduct] = await Promise.all([
      Category.findById(categoryId),
      SubCategory.findById(subCategoryId),
      Brand.findById(brandId),
      Product.findById(id),
    ]);

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (!category) return res.status(400).json({ success: false, message: "Invalid categoryId" });
    if (!subCategory) return res.status(400).json({ success: false, message: "Invalid subCategoryId" });
    if (!brand) return res.status(400).json({ success: false, message: "Invalid brandId" });

    // ✅ fetch existing Image doc to get publicId (so Cloudinary overwrites same asset)
    let existingPublicId = null;
    let existingImageDoc = null;

    if (currentProduct.image) {
      existingImageDoc = await Image.findById(currentProduct.image);
      existingPublicId = existingImageDoc?.publicId || null;
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath, existingPublicId);

    const url = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    const publicId = cloudinaryResponse?.public_id;

    if (!url || !publicId) {
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    // ✅ update product fields
    currentProduct.name = name.trim();
    currentProduct.category = category._id;
    currentProduct.subCategory = subCategory._id;
    currentProduct.brand = brand._id;
    currentProduct.abv = Number(abv);
    currentProduct.volumeMl = Number(volumeMl);
    currentProduct.description = description;
    currentProduct.price = Number(price);

    // ✅ update/create Image document and store ObjectId in product.image
    let imageDoc;
    if (existingImageDoc) {
      imageDoc = await Image.findByIdAndUpdate(
        existingImageDoc._id,
        { url, publicId },
        { new: true }
      );
    } else {
      imageDoc = await Image.create({ url, publicId });
    }
    currentProduct.image = imageDoc._id;

    const toBool = (v) => v === true || v === "true";
    if (typeof isActive !== "undefined") currentProduct.isActive = toBool(isActive);
    if (typeof isFeatured !== "undefined") currentProduct.isFeatured = toBool(isFeatured);

    await currentProduct.save();

    const product = await Product.findById(currentProduct._id)
      .populate("image");
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    if (localFilePath) {
      try { fs.unlinkSync(localFilePath); } catch { }
    }
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).json({ success: false, message: "Product doesn't exists" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully " });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}