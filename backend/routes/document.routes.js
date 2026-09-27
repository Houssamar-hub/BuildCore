'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/document.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(controller.getAll)
  .post(controller.create);

router.route('/:id')
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.remove);

module.exports = router;
