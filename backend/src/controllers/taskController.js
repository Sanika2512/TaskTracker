const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getDueDateFilter = (due) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (due === 'overdue') {
    return { dueDate: { $lt: start }, status: { $ne: 'Completed' } };
  }

  if (due === 'today') {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { dueDate: { $gte: start, $lt: end } };
  }

  if (due === 'week') {
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { dueDate: { $gte: start, $lte: end } };
  }

  return {};
};

const priorityPipeline = (filter, skip, pageSize) => [
  { $match: filter },
  {
    $addFields: {
      priorityRank: {
        $switch: {
          branches: [
            { case: { $eq: ['$priority', 'High'] }, then: 1 },
            { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
            { case: { $eq: ['$priority', 'Low'] }, then: 3 },
          ],
          default: 4,
        },
      },
    },
  },
  { $sort: { priorityRank: 1, dueDate: 1 } },
  { $skip: skip },
  { $limit: pageSize },
  { $project: { priorityRank: 0 } },
];

const getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    category,
    search,
    due,
    sort = 'newest',
    page = 1,
    limit = 50,
  } = req.query;

  const filter = {
    ...getDueDateFilter(due),
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNumber - 1) * pageSize;
  const total = await Task.countDocuments(filter);

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    dueDate: { dueDate: 1 },
  };

  const tasks = sort === 'priority'
    ? await Task.aggregate(priorityPipeline(filter, skip, pageSize))
    : await Task.find(filter)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(pageSize);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize) || 1,
    data: tasks,
  });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (payload.completed === true) {
    payload.status = 'Completed';
  }

  if (payload.status === 'Completed') {
    payload.completed = true;
  }

  if (payload.status && payload.status !== 'Completed') {
    payload.completed = false;
  }

  const task = await Task.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});

const getTaskStats = asyncHandler(async (req, res) => {
  const [stats] = await Task.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      highPriority: 0,
    },
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
