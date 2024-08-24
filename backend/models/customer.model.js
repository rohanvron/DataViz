const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    email: String,
    created_at: Date,
    default_address: {
        city: String,
        country: String,
    },
    orders_count: Number,
});

module.exports = mongoose.model('Customer', CustomerSchema, 'shopifyCustomers');
