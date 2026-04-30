const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignees, dueDate } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({ title, description, project, assignees, dueDate });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const query = {};

    // Project filter (additive)
    if (req.query.project) query.project = req.query.project;

    // Members ALWAYS only see tasks assigned to them
    if (req.user.role === 'Member') {
      query.assignees = { $in: [new mongoose.Types.ObjectId(req.user.id)] };
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignees', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, assignees } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, status, assignees },
      { new: true, runValidators: true }
    ).populate('assignees', 'name email').populate('project', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
