// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath, publicId = null) => {
//     try {
//         if (!localFilePath) return null
//         const options = {
//             resource_type: "image",
//             overwrite: true,
//         };

//         if (publicId) {
//             options.public_id = publicId;
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, options);
//         return response
//     } catch (error) {
//         if (localFilePath && fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return null;
//     }
// }

// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (buffer, publicId = null) =>
  new Promise((resolve, reject) => {
    if (!buffer) return resolve(null);

    const options = { resource_type: "image", overwrite: true };
    if (publicId) options.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    stream.end(buffer);
  });
