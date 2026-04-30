const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('owner', 'name').populate('members', 'name email');
    } else {
      projects = await Project.find({
        $or: [{ owner: req.user.id }, { members: req.user.id }]
      }).populate('owner', 'name').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.members.includes(req.body.userId)) {
      project.members.push(req.body.userId);
      await project.save();
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
