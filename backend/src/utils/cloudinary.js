import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, publicId = null) => {
    try {
        if (!localFilePath) return null
        const options = {
            resource_type: "image",
            overwrite: true,
        };

        if (publicId) {
            options.public_id = publicId;
        }

        const response = await cloudinary.uploader.upload(localFilePath, options);
        return response
    } catch (error) {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };