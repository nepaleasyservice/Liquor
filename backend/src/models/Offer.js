export { mongoose } from 'mongoose';

export const Offer = new mongoose.Schema({
    title: { type: String, required: true },
    discount: { type: Number, required: true },
});