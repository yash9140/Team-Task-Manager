import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import { Plus, UserPlus, Trash2, Pencil, X } from 'lucide-react';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // task being edited

  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignees: [] });
  const [newMemberId, setNewMemberId] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberError, setMemberError] = useState('');


  useEffect(() => {
    fetchProject();
    fetchTasks();
    if (user.role === 'Admin') fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?project=${id}`);
      // Members only see tasks assigned to them
      if (user.role === 'Member') {
        setTasks(res.data.filter(t => t.assignees.some(a => a._id === user._id)));
      } else {
        setTasks(res.data);
      }
    } catch (error) { console.error(error); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (error) { console.error(error); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', assignees: [] });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${editingTask._id}`, editingTask);
      setEditingTask(null);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    try {
      // Find user by email first
      const lookup = await api.get(`/auth/users/email/${encodeURIComponent(memberEmail)}`);
      const userId = lookup.data._id;
      await api.post(`/projects/${id}/members`, { userId });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProject();
    } catch (error) {
      setMemberError(error.response?.data?.message || 'User not found');
    }
  };


  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${memberId}`);
      fetchProject();
    } catch (error) { console.error(error); }
  };

  // Members can only update status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  if (!project) return <div className="page-wrapper container"><p>Loading project...</p></div>;

  const columns = ['Todo', 'InProgress', 'Done'];

  return (
    <div className="page-wrapper container">
      {/* Header */}
      <div className="project-header animate-fade-in">
        <div>
          <h1 className="gradient-text">{project.name}</h1>
          <p className="subtitle">{project.description}</p>
        </div>
        {user.role === 'Admin' && (
          <div className="header-actions">
            <button className="btn-outline flex-btn" onClick={() => setShowMemberModal(true)}>
              <UserPlus size={18} /> Add Member
            </button>
            <button className="btn-primary flex-btn" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} /> New Task
            </button>
          </div>
        )}
      </div>

      {/* Members Section (Admin only) */}
      {user.role === 'Admin' && (
        <div className="members-section glass-panel animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <h3>Team Members</h3>
          <div className="members-list">
            {project.members.length === 0 ? (
              <p className="no-data-sm">No members yet.</p>
            ) : (
              project.members.map(m => (
                <div key={m._id} className="member-chip">
                  <span>{m.name}</span>
                  <span className="member-email">{m.email}</span>
                  <button 
                    className="remove-member-btn" 
                    onClick={() => handleRemoveMember(m._id)} 
                    title="Remove member"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="kanban-board animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {columns.map(status => (
          <div key={status} className="kanban-col glass-panel">
            <div className="col-header">
              <h3 className="col-title">{status === 'InProgress' ? 'In Progress' : status}</h3>
              <span className="col-count">{tasks.filter(t => t.status === status).length}</span>
            </div>
            <div className="col-tasks">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="kanban-card">
                  <div className="kanban-card-header">
                    <h4>{task.title}</h4>
                    {/* Admin gets edit + delete; Member gets nothing here */}
                    {user.role === 'Admin' && (
                      <div className="card-actions">
                        <button 
                          className="icon-btn" 
                          onClick={() => setEditingTask({ ...task, assignees: task.assignees.map(a => a._id) })}
                          title="Edit task"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          className="icon-btn danger" 
                          onClick={() => handleDeleteTask(task._id)}
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  {task.assignees?.length > 0 && (
                    <div className="assignees-row">
                      {task.assignees.map(a => (
                        <span key={a._id} className="assignee-tag">{a.name}</span>
                      ))}
                    </div>
                  )}
                  {task.dueDate && (
                    <div className={`due-date ${new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'overdue' : ''}`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {/* Both admin and member can update status */}
                  <div className="task-actions">
                    <select
                      className="status-select"
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="col-empty">No tasks here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal (Admin only) */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="label">Title</label>
                <input type="text" className="input-field" value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" rows={3} value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Due Date</label>
                <input type="date" className="input-field" value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Assign To</label>
                <div className="checkbox-list">
                  {project.members.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No members in project yet. Add members first.</p>
                  ) : project.members.map(m => (
                    <label key={m._id} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={m._id}
                        checked={newTask.assignees.includes(m._id)}
                        onChange={(e) => {
                          const id = e.target.value;
                          setNewTask(prev => ({
                            ...prev,
                            assignees: e.target.checked
                              ? [...prev.assignees, id]
                              : prev.assignees.filter(a => a !== id)
                          }));
                        }}
                      />
                      <span>{m.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.email}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal (Admin only) */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Edit Task</h2>
            <form onSubmit={handleEditTask}>
              <div className="form-group">
                <label className="label">Title</label>
                <input type="text" className="input-field" value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" rows={3} value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Due Date</label>
                <input type="date" className="input-field"
                  value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Status</label>
                <select className="input-field" value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                  <option value="Todo">Todo</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Assign To</label>
                <div className="checkbox-list">
                  {project.members.map(m => (
                    <label key={m._id} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={m._id}
                        checked={editingTask.assignees.includes(m._id)}
                        onChange={(e) => {
                          const id = e.target.value;
                          setEditingTask(prev => ({
                            ...prev,
                            assignees: e.target.checked
                              ? [...prev.assignees, id]
                              : prev.assignees.filter(a => a !== id)
                          }));
                        }}
                      />
                      <span>{m.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.email}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="label">Member Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="member@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
                {memberError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '6px' }}>{memberError}</p>}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => { setShowMemberModal(false); setMemberError(''); }}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetail;
