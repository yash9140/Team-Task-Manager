import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/api';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ todo: 0, inProgress: 0, done: 0, overdue: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        // Admin sees all tasks; backend already filters for Members
        const allTasks = res.data;
        setTasks(allTasks);

        const now = new Date();
        const counts = { todo: 0, inProgress: 0, done: 0, overdue: 0 };
        allTasks.forEach(task => {
          if (task.status === 'Todo') counts.todo++;
          if (task.status === 'InProgress') counts.inProgress++;
          if (task.status === 'Done') counts.done++;
          if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') counts.overdue++;
        });
        setStats(counts);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="page-wrapper container">
      <div className="dashboard-header animate-fade-in">
        <div>
          <h1 className="gradient-text">Welcome, {user.name}</h1>
          <p className="subtitle">
            {user.role === 'Admin'
              ? 'Full project overview — all tasks across all projects.'
              : 'Here are the tasks assigned to you.'}
          </p>
        </div>
        <span className={`badge ${user.role === 'Admin' ? 'badge-progress' : 'badge-todo'}`} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
          {user.role}
        </span>
      </div>

      <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.1)' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.todo}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: 'var(--warning)', background: 'rgba(245,158,11,0.1)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.done}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      <div className="tasks-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="section-title">{user.role === 'Admin' ? 'All Tasks' : 'My Tasks'}</h2>
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="no-data">No tasks found.</p>
          ) : (
            tasks.map(task => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
              return (
                <div key={task._id} className="task-item glass-panel">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {isOverdue && <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}>Overdue</span>}
                      <span className={`badge badge-${task.status === 'InProgress' ? 'progress' : task.status === 'Done' ? 'done' : 'todo'}`}>
                        {task.status === 'InProgress' ? 'In Progress' : task.status}
                      </span>
                    </div>
                  </div>
                  <div className="task-meta">
                    <span>Project: {task.project?.name}</span>
                    {task.assignees?.length > 0 && (
                      <span>Assigned to: {task.assignees.map(a => a.name).join(', ')}</span>
                    )}
                    {task.dueDate && <span className={isOverdue ? 'overdue-text' : ''}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
