const express = require('express');
const router = express.Router();
const { createSale, getSales, getDailyReport, getMonthlyReport } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createSale)
    .get(protect, getSales);
router.get('/daily-report', protect, getDailyReport);
router.get('/monthly-report', protect, getMonthlyReport);
module.exports = router;