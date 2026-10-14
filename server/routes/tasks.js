import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all task routes
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message,
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { text, priority, category } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task text is required',
      });
    }

    const validPriorities = ['High', 'Medium', 'Low'];
    const validCategories = ['General', 'Work', 'Personal'];

    const taskPriority = validPriorities.includes(priority) ? priority : 'Medium';
    const taskCategory = validCategories.includes(category) ? category : 'General';

    const newTask = await Task.create({
      text: text.trim(),
      priority: taskPriority,
      category: taskCategory,
      completed: false,
      user: req.user._id,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message,
    });
  }
});

// @route   DELETE /api/tasks
// @desc    Clear all tasks for the logged-in user
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id });
    return res.json({
      success: true,
      message: 'All user tasks cleared successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear tasks',
      error: error.message,
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a specific task (text, completed, priority, category)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, priority, category } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify task belongs to authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You do not own this task',
      });
    }

    // Update fields if provided
    if (typeof completed === 'boolean') {
      task.completed = completed;
    }
    if (text !== undefined && text.trim()) {
      task.text = text.trim();
    }
    if (priority && ['High', 'Medium', 'Low'].includes(priority)) {
      task.priority = priority;
    }
    if (category && ['General', 'Work', 'Personal'].includes(category)) {
      task.category = category;
    }

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message,
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a specific task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Verify task belongs to authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You do not own this task',
      });
    }

    await task.deleteOne();

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message,
    });
  }
});

export default router;
