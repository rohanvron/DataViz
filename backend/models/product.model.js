const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    created_at: Date,
});

module.exports = mongoose.model('Product', ProductSchema, 'shopifyProducts');
