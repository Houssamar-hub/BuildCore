'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/search.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', controller.search);

module.exports = router;
