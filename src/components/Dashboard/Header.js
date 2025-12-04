import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import './Header.css';

const Header = ({ user, logout, onMenuClick, sidebarOpen, onNavigateHome }) => {
  const handleMenuClick = (e, action) => {
    e.preventDefault();
    if (action === 'dashboard' && onNavigateHome) {
      onNavigateHome();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle sidebar">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className="header-title">Employee Management</h1>
      </div>
      <nav className="horizontal-menu">
        <a 
          href="#dashboard" 
          className="menu-item" 
          onClick={(e) => handleMenuClick(e, 'dashboard')}
        >
          Dashboard
        </a>
        <a 
          href="#employees" 
          className="menu-item"
          onClick={(e) => handleMenuClick(e, 'dashboard')}
        >
          Employees
        </a>
        <a href="#reports" className="menu-item">Reports</a>
        <a href="#settings" className="menu-item">Settings</a>
      </nav>
      <div className="header-right">
        <div className="user-info">
          <FiUser size={18} />
          <span className="username">{user?.username}</span>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

