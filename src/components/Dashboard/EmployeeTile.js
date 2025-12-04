import React, { useState, useEffect, useRef } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { FiEdit, FiFlag, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import EmployeeForm from './EmployeeForm';
import './EmployeeTile.css';

const GET_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int) {
    employees(page: $page, pageSize: $pageSize) {
      employees {
        id
        name
        age
        class
        email
        phone
        department
        position
        status
        subjects {
          name
          code
          credits
        }
        attendance {
          date
          status
        }
      }
      totalCount
      page
      pageSize
      totalPages
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

const EmployeeTile = ({ onEmployeeClick, user }) => {
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [addingEmployee, setAddingEmployee] = useState(false);
  const menuRef = useRef(null);
  const pageSize = 12;

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: { page, pageSize },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
      setOpenMenuId(null);
    },
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee({ variables: { id } });
    }
  };

  const handleEdit = (employee, e) => {
    e.stopPropagation();
    setEditingEmployee(employee);
    setOpenMenuId(null);
  };

  const handleMenuToggle = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingEmployee(null);
    setAddingEmployee(false);
  };

  const handleAddNew = () => {
    setAddingEmployee(true);
  };

  if (loading) return <div className="loading">Loading employees...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const { employees, totalPages } = data.employees;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="employee-tile-container">
      {editingEmployee && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSuccess={handleEditSuccess}
        />
      )}
      {addingEmployee && (
        <EmployeeForm
          employee={null}
          onClose={() => setAddingEmployee(false)}
          onSuccess={handleEditSuccess}
        />
      )}
      <div className="tile-header">
        <h2>Employee Tile View</h2>
        <div className="header-actions">
          {isAdmin && (
            <button className="add-employee-btn" onClick={handleAddNew}>
              + Add New Employee
            </button>
          )}
          <div className="pagination-info">
            Page {page} of {totalPages} ({data.employees.totalCount} total)
          </div>
        </div>
      </div>
      <div className="tiles-grid">
        {employees.map((employee) => {
          const presentCount = employee.attendance?.filter(
            (a) => a.status === 'present'
          ).length || 0;
          const totalAttendance = employee.attendance?.length || 0;
          const attendanceRate =
            totalAttendance > 0
              ? Math.round((presentCount / totalAttendance) * 100)
              : 0;

          return (
            <div
              key={employee.id}
              className="employee-tile"
              onClick={() => onEmployeeClick(employee)}
            >
              <div className="tile-header-section">
                <div className="tile-avatar">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="tile-actions" ref={menuRef}>
                  <button
                    className="menu-btn"
                    onClick={(e) => handleMenuToggle(employee.id, e)}
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {openMenuId === employee.id && (
                    <div className="action-menu">
                      {isAdmin && (
                        <>
                          <button
                            className="action-item"
                            onClick={(e) => handleEdit(employee, e)}
                          >
                            <FiEdit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="action-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Flag functionality can be added here
                              setOpenMenuId(null);
                            }}
                          >
                            <FiFlag size={16} />
                            <span>Flag</span>
                          </button>
                          <button
                            className="action-item delete"
                            onClick={(e) => handleDelete(employee.id, e)}
                          >
                            <FiTrash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="tile-content">
                <h3 className="tile-name">{employee.name}</h3>
                <div className="tile-info">
                  <div className="info-item">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{employee.age}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Class:</span>
                    <span className="info-value">{employee.class}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Department:</span>
                    <span className="info-value">
                      {employee.department || 'N/A'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Position:</span>
                    <span className="info-value">
                      {employee.position || 'N/A'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Subjects:</span>
                    <span className="info-value">
                      {employee.subjects?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="tile-footer">
                  <div className="attendance-rate">
                    <span className="rate-label">Attendance:</span>
                    <span className={`rate-value ${attendanceRate >= 80 ? 'good' : attendanceRate >= 60 ? 'medium' : 'poor'}`}>
                      {attendanceRate}%
                    </span>
                  </div>
                  <span className={`status-badge ${employee.status}`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeTile;

