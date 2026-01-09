import Enjoy, { Photo } from "../models/Enjoy.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const createEnjoy = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ success: false, message: "name and discription required" });
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }
  try {
    const localFilePath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    if (!cloudinaryResponse) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed"
      });
    }

    const url = cloudinaryResponse?.secure_url || cloudinaryResponse?.url;
    const publicId = cloudinaryResponse?.public_id;

    if (!url || !publicId) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    fs.unlinkSync(localFilePath);

    const photo = await Photo.create({ url, publicId });

    const enjoy = await new Enjoy({
      name: req.body.name,
      description: req.body.description,
      photo: photo._id,
    });

    await enjoy.save();

    const enjoyData = await Enjoy.find(enjoy._id)
      .select("-__v")
      .populate("photo")

    return res.status(201).json({ success: true, enjoyData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnjoys = async (req, res) => {
  try {
    const enjoys = await Enjoy.find()
      .select("-__V")
      .populate("photo");
    res.json(enjoys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const DeleteEnjoy = async (req, res) => {
  try {
    console.log(req);
    const deletedEnjoy = await Enjoy.findByIdAndDelete(req.params.id);
    if (!deletedEnjoy) {
      return res.status(404).json({ message: "Enjoy item not found", "deleted": deletedEnjoy });
    }
    res.status(200).json({
      message: "Enjoy item deleted successfully",
      id: deletedEnjoy._id,
      name: deletedEnjoy.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const editEnjoy = async (req, res) => {
  let localFilePath = null;

  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "something went wrong" });
    if (!name || !description) return res.status(400).json({ success: false, message: "name and description required" });
    if (!req.file?.path) return res.status(400).json({ success: false, message: "Image file is required" });

    localFilePath = req.file.path;

    const currentEnjoy = await Enjoy.findById(id);
    if (!currentEnjoy) return res.status(404).json({ success: false, message: "Enjoy not found" });

    let existingPublicId = null;
    let existingPhotoDoc = null;

    if (currentEnjoy.photo) {
      existingPhotoDoc = await Photo.findById(currentEnjoy.photo);
      existingPublicId = existingPhotoDoc?.publicId || null;
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath, existingPublicId);

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
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (localFilePath) {
      try { fs.unlinkSync(localFilePath); } catch { }
    }
  }
};
