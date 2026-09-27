'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/stats', controller.getStats);
router.get('/overview', controller.getOverview);
router.get('/charts', controller.getCharts);

module.exports = router;
