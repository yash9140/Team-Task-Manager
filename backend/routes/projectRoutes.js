const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, addMember } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router.route('/:id')
  .get(protect, getProject);

router.route('/:id/members')
  .post(protect, authorize('Admin'), addMember);

module.exports = router;
