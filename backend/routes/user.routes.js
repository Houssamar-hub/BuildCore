'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect); // All routes require auth

router.route('/')
  .get(controller.getAll)
  .post(restrictTo('admin', 'directeur'), controller.create);

router.route('/:id')
  .get(controller.getOne)
  .patch(controller.update)
  .delete(restrictTo('admin', 'directeur'), controller.remove);

module.exports = router;
