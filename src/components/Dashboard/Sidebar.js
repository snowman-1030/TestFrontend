import React from 'react';
import { FiX, FiGrid, FiLayers, FiHome, FiUsers, FiBarChart2, FiSettings } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, viewMode, setViewMode, onNavigateHome }) => {
  const handleMenuClick = (action) => {
    if (action === 'home' && onNavigateHome) {
      onNavigateHome();
      onClose();
    }
  };

  const menuItems = [
    { icon: FiHome, label: 'Home', hasSubmenu: false, action: 'home' },
    { 
      icon: FiUsers, 
      label: 'Employees', 
      hasSubmenu: true,
      submenu: ['All Employees', 'Active', 'On Leave']
    },
    { 
      icon: FiBarChart2, 
      label: 'Analytics', 
      hasSubmenu: true,
      submenu: ['Reports', 'Statistics', 'Charts']
    },
    { icon: FiSettings, label: 'Settings', hasSubmenu: false },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item-wrapper">
              <div 
                className="menu-item" 
                onClick={() => item.action && handleMenuClick(item.action)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <ul className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex} className="submenu-item">
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="view-mode-section">
            <h3>View Mode</h3>
            <div className="view-mode-buttons">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('grid');
                  onClose();
                }}
              >
                <FiGrid size={18} />
                <span>Grid</span>
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'tile' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('tile');
                  onClose();
                }}
              >
                <FiLayers size={18} />
                <span>Tile</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

