import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import EmployeeGrid from './EmployeeGrid';
import EmployeeTile from './EmployeeTile';
import EmployeeDetail from './EmployeeDetail';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
  };

  if (selectedEmployee) {
    return (
      <div className="dashboard">
        <Header 
          user={user} 
          logout={logout} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onNavigateHome={handleBackToList}
        />
        <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onNavigateHome={handleBackToList}
          />
          <div className="main-content">
            <EmployeeDetail 
              employee={selectedEmployee} 
              onBack={handleBackToList}
              user={user}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header 
        user={user} 
        logout={logout} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onNavigateHome={handleBackToList}
      />
      <div className={`dashboard-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onNavigateHome={handleBackToList}
        />
        <main className="main-content">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              className={`toggle-btn ${viewMode === 'tile' ? 'active' : ''}`}
              onClick={() => setViewMode('tile')}
            >
              Tile View
            </button>
          </div>
          {viewMode === 'grid' ? (
            <EmployeeGrid onEmployeeClick={handleEmployeeClick} user={user} />
          ) : (
            <EmployeeTile onEmployeeClick={handleEmployeeClick} user={user} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

