const { body, param, query } = require('express-validator');

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Progress', 'Completed'];
const categories = ['Work', 'Personal', 'Urgent', 'Health', 'Learning', 'Other'];

const dueDateRule = body('dueDate')
  .notEmpty().withMessage('Due date is required')
  .isISO8601().withMessage('Invalid date format')
  .custom((value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }).withMessage('Due date must be today or in the future');

const optionalDueDateRule = body('dueDate')
  .optional()
  .isISO8601().withMessage('Invalid date format')
  .custom((value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }).withMessage('Due date must be today or in the future');

const taskValidationRules = {
  query: [
    query('status').optional().isIn(statuses).withMessage('Invalid status'),
    query('priority').optional().isIn(priorities).withMessage('Invalid priority'),
    query('category').optional().isIn(categories).withMessage('Invalid category'),
    query('due').optional().isIn(['overdue', 'today', 'week']).withMessage('Invalid due date filter'),
    query('sort').optional().isIn(['newest', 'oldest', 'dueDate', 'priority']).withMessage('Invalid sort option'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 600 }).withMessage('Description must be between 10 and 600 characters'),
    body('priority')
      .notEmpty().withMessage('Priority is required')
      .isIn(priorities).withMessage('Invalid priority'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(statuses).withMessage('Invalid status'),
    dueDateRule,
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(categories).withMessage('Invalid category'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 600 }).withMessage('Description must be between 10 and 600 characters'),
    body('priority').optional().isIn(priorities).withMessage('Invalid priority'),
    body('status').optional().isIn(statuses).withMessage('Invalid status'),
    body('completed').optional().isBoolean().withMessage('Completed must be true or false'),
    optionalDueDateRule,
    body('category').optional().isIn(categories).withMessage('Invalid category'),
  ],
  id: [
    param('id').isMongoId().withMessage('Invalid task ID'),
  ],
};

module.exports = taskValidationRules;
