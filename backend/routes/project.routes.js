'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/project.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect); // All routes require auth

router.get('/stats', controller.getStats);

router.route('/')
  .get(controller.getAll)
  .post(controller.create);

router.route('/:id')
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.remove);

module.exports = router;
