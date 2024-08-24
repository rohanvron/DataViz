const express = require('express');
const dataController = require('../controllers/data.controller.js');

const router = express.Router();

router.get('/totalsales', dataController.getTotalSales);
router.get('/salesgrowth', dataController.getSalesGrowth);
router.get('/newcustomers', dataController.getNewCustomers);
router.get('/repeatcustomers', dataController.getRepeatCustomers);
router.get('/geographicaldistribution', dataController.getGeographicalDistribution);
router.get('/customerlifetimevalue', dataController.getCustomerLifetimeValue);

module.exports = router;
