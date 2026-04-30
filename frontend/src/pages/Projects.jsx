import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import { Plus, Users } from 'lucide-react';
import './Dashboard.css';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="projects-header animate-fade-in">
        <div>
          <h1 className="gradient-text">Projects</h1>
          <p className="subtitle">Manage your team's projects and boards.</p>
        </div>
        {user.role === 'Admin' && (
          <button className="btn-primary flex-btn" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="projects-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {projects.length === 0 ? (
          <p className="no-data">No projects found.</p>
        ) : (
          projects.map(project => (
            <Link to={`/projects/${project._id}`} key={project._id} className="project-card glass-panel">
              <h3>{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-footer">
                <div className="project-members">
                  <Users size={16} />
                  <span>{project.members.length} members</span>
                </div>
                <span className="project-owner">Owner: {project.owner?.name}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="label">Project Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  className="input-field"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
