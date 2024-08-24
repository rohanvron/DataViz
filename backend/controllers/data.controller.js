const Order = require('../models/order.model.js');
const Customer = require('../models/customer.model.js');

exports.getTotalSales = async (req, res) => {
    try {
        const { interval = 'daily' } = req.query;
        let groupBy = {};

        switch (interval) {
            case 'monthly':
                groupBy = {
                    year: { $year: { $toDate: "$created_at" } },
                    month: { $month: { $toDate: "$created_at" } }
                };
                break;
            case 'quarterly':
                groupBy = {
                    year: { $year: { $toDate: "$created_at" } },
                    quarter: { $ceil: { $divide: [{ $month: { $toDate: "$created_at" } }, 3] } }
                };
                break;
            case 'yearly':
                groupBy = {
                    year: { $year: { $toDate: "$created_at" } }
                };
                break;
            default:
                groupBy = {
                    year: { $year: { $toDate: "$created_at" } },
                    month: { $month: { $toDate: "$created_at" } },
                    day: { $dayOfMonth: { $toDate: "$created_at" } }
                };
        }

        const sales = await Order.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: "$total_price_set.shop_money.amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
        res.json(sales);
    } catch (error) {
        console.error('Error in getTotalSales:', error);
        res.status(500).json({ 
            message: 'Error fetching total sales data', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getSalesGrowth = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$created_at" } },
                        month: { $month: { $toDate: "$created_at" } }
                    },
                    totalSales: { $sum: "$total_price_set.shop_money.amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const growthRates = sales.map((sale, index) => {
            if (index === 0) return { ...sale, growthRate: 0 };
            const previousSale = sales[index - 1].totalSales;
            const growthRate = ((sale.totalSales - previousSale) / previousSale) * 100;
            return { ...sale, growthRate };
        });

        res.json(growthRates);
    } catch (error) {
        console.error('Error in getSalesGrowth:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getNewCustomers = async (req, res) => {
    try {
        const newCustomers = await Customer.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$created_at" }},
                        month: { $month: { $toDate: "$created_at" }}
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        res.json(newCustomers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRepeatCustomers = async (req, res) => {
    try {
        const { interval = 'daily' } = req.query;
        let groupBy = {
            year: { $year: { $toDate: "$firstOrder" } },
            month: { $month: { $toDate: "$firstOrder" } },
            day: { $dayOfMonth: { $toDate: "$firstOrder" } }
        };

        if (interval === 'monthly') {
            delete groupBy.day;
        } else if (interval === 'yearly') {
            delete groupBy.month;
            delete groupBy.day;
        }

        const repeatCustomers = await Order.aggregate([
            {
                $group: {
                    _id: "$customer",
                    orderCount: { $sum: 1 },
                    firstOrder: { $min: "$created_at" }
                }
            },
            {
                $match: { orderCount: { $gt: 1 } }
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
        res.json(repeatCustomers);
    } catch (error) {
        console.error('Error in getRepeatCustomers:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getGeographicalDistribution = async (req, res) => {
    try {
        const distribution = await Customer.aggregate([
            {
                $group: {
                    _id: "$default_address.city",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.json(distribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomerLifetimeValue = async (req, res) => {
    try {
        const lifetimeValue = await Order.aggregate([
            {
                $group: {
                    _id: "$customer",
                    totalSpent: { $sum: "$total_price_set.shop_money.amount" },
                    firstPurchase: { $min: "$created_at" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$firstPurchase"}},
                        month: { $month: { $toDate: "$firstPurchase"}}
                    },
                    averageLTV: { $avg: "$totalSpent" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        res.json(lifetimeValue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
