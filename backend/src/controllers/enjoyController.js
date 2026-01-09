import Enjoy, { Photo } from "../models/Enjoy.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createEnjoy = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "name and discription required" });
    }

    // ✅ Vercel: multer memoryStorage => req.file.buffer
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);

    const url = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    const publicId = cloudinaryResponse?.public_id;

    if (!url || !publicId) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    const photo = await Photo.create({ url, publicId });

    const enjoy = await Enjoy.create({
      name,
      description,
      photo: photo._id,
    });

    const enjoyData = await Enjoy.findById(enjoy._id)
      .select("-__v")
      .populate("photo");

    return res.status(201).json({ success: true, enjoyData });
  } catch (error) {
    console.error("createEnjoy error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnjoys = async (req, res) => {
  try {
    const enjoys = await Enjoy.find()
      .select("-__v") // fixed __V -> __v
      .populate("photo");

    return res.json(enjoys);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const DeleteEnjoy = async (req, res) => {
  try {
    const deletedEnjoy = await Enjoy.findByIdAndDelete(req.params.id);

    if (!deletedEnjoy) {
      return res.status(404).json({
        message: "Enjoy item not found",
        deleted: deletedEnjoy,
      });
    }

    return res.status(200).json({
      message: "Enjoy item deleted successfully",
      id: deletedEnjoy._id,
      name: deletedEnjoy.name,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editEnjoy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "something went wrong" });
    }
    if (!name || !description) {
      return res.status(400).json({ success: false, message: "name and description required" });
    }

    // ✅ Vercel: memory storage
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const currentEnjoy = await Enjoy.findById(id);
    if (!currentEnjoy) {
      return res.status(404).json({ success: false, message: "Enjoy not found" });
    }

    let existingPublicId = null;
    let existingPhotoDoc = null;

    if (currentEnjoy.photo) {
      existingPhotoDoc = await Photo.findById(currentEnjoy.photo);
      existingPublicId = existingPhotoDoc?.publicId || null;
    }

    // ✅ overwrite old image if publicId exists
    const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer, existingPublicId);

    const url = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    const publicId = cloudinaryResponse?.public_id;

    if (!url || !publicId) {
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    currentEnjoy.name = name;
    currentEnjoy.description = description;

    let photoDoc;
    if (existingPhotoDoc) {
      photoDoc = await Photo.findByIdAndUpdate(
        existingPhotoDoc._id,
        { url, publicId },
        { new: true }
      );
    } else {
      photoDoc = await Photo.create({ url, publicId });
    }

    currentEnjoy.photo = photoDoc._id;
    await currentEnjoy.save();

    const enjoy = await Enjoy.findById(currentEnjoy._id).populate("photo");

    return res.status(200).json({ success: true, enjoy });
  } catch (error) {
    console.error("editEnjoy error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
