import { mongoose } from "mongoose";

const featuredProducts = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: Number, required: true },
})