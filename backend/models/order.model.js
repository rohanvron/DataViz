const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    total_price_set: {
        shop_money: {
            amount: Number,
            currency_code: String
        }
    },
    created_at: Date,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
});

module.exports = mongoose.model('Order', OrderSchema, 'shopifyOrders');
