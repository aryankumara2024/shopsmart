const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: false },
    description: { type: String, required: false },
    category: { type: String, required: true },
    image: { type: String, required: false },
    badge: { type: String, required: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    colors: [{ type: String }],
    features: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
