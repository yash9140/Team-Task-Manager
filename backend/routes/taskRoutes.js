const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

// Admin only: full edit or delete a task
router.route('/:id')
  .put(protect, authorize('Admin'), updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

// Both Admin and Member can update status
router.route('/:id/status')
  .put(protect, updateTaskStatus);

module.exports = router;
