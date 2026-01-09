import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
    },
    { timestamps: true }
);

const enjoySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
    },
    flag: { type: Boolean, default: false },
});
export const Photo = mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);
export default mongoose.model("Enjoy", enjoySchema);