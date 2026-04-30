import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, Code2 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">

        {/* Left: Logo + User Info */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <Code2 size={28} className="logo-icon" />
            <span className="gradient-text">TeamTask</span>
          </Link>
          <div className="nav-divider" />
          <div className="user-info-left">
            <span className="user-name">{user.name}</span>
            <span className={`badge ${user.role === 'Admin' ? 'badge-progress' : 'badge-todo'}`}>{user.role}</span>
          </div>
        </div>

        {/* Right: Nav links + Logout */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="nav-link">
            <FolderKanban size={18} />
            <span>Projects</span>
          </Link>
          <div className="nav-divider" />
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </nav>
  );

};

export default Navbar;
