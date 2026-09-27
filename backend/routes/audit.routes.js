'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/audit.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', restrictTo('admin', 'directeur'), controller.getAll);
router.get('/:id', restrictTo('admin', 'directeur'), controller.getOne);

module.exports = router;
