const express = require('express');
const {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTaskStats,
  updateTask,
} = require('../controllers/taskController');
const { validate } = require('../middlewares/validation');
const taskValidationRules = require('../validators/taskValidator');

const router = express.Router();

router.get('/stats', getTaskStats);

router
  .route('/')
  .get(taskValidationRules.query, validate, getTasks)
  .post(taskValidationRules.create, validate, createTask);

router
  .route('/:id')
  .get(taskValidationRules.id, validate, getTask)
  .put(taskValidationRules.update, validate, updateTask)
  .delete(taskValidationRules.id, validate, deleteTask);

module.exports = router;
