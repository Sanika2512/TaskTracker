const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [600, 'Description cannot exceed 600 characters'],
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority'],
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      required: [true, 'Please select a status'],
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Work', 'Personal', 'Urgent', 'Health', 'Learning', 'Other'],
      default: 'Other',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
      validate: {
        validator(value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: 'Due date must be today or in the future',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, priority: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
