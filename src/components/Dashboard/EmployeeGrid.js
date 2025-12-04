import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import EmployeeForm from './EmployeeForm';
import './EmployeeGrid.css';

const GET_EMPLOYEES = gql`
  query GetEmployees($page: Int, $pageSize: Int, $sort: SortInput) {
    employees(page: $page, pageSize: $pageSize, sort: $sort) {
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
        createdAt
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

const EmployeeGrid = ({ onEmployeeClick, user }) => {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [addingEmployee, setAddingEmployee] = useState(false);
  const pageSize = 10;

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page,
      pageSize,
      sort: {
        field: sortField,
        order: sortOrder,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };

  const handleEdit = (employee, e) => {
    e.stopPropagation();
    setEditingEmployee(employee);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee({ variables: { id } });
    }
  };

  const handleEditSuccess = () => {
    refetch();
    setEditingEmployee(null);
    setAddingEmployee(false);
  };

  const handleAddNew = () => {
    setAddingEmployee(true);
  };

  const isAdmin = user?.role === 'admin';

  if (loading) return <div className="loading">Loading employees...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const { employees, totalPages } = data.employees;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'class', label: 'Class' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position' },
    { key: 'subjects', label: 'Subjects Count' },
    { key: 'attendance', label: 'Attendance Count' },
    { key: 'status', label: 'Status' },
  ];

  if (isAdmin) {
    columns.push({ key: 'actions', label: 'Actions' });
  }

  return (
    <div className="employee-grid-container">
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
      <div className="grid-header">
        <h2>Employee Grid View</h2>
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
      <div className="table-wrapper">
        <table className="employee-grid">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'actions' && handleSort(col.key)}
                  className={col.key !== 'actions' ? 'sortable' : ''}
                >
                  {col.label}
                  {col.key !== 'actions' && sortField === col.key && (
                    <span className="sort-indicator">
                      {sortOrder === 'ASC' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                onClick={() => onEmployeeClick(employee)}
                className="clickable-row"
              >
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.class}</td>
                <td>{employee.email || 'N/A'}</td>
                <td>{employee.phone || 'N/A'}</td>
                <td>{employee.department || 'N/A'}</td>
                <td>{employee.position || 'N/A'}</td>
                <td>{employee.subjects?.length || 0}</td>
                <td>{employee.attendance?.length || 0}</td>
                <td>
                  <span className={`status-badge ${employee.status}`}>
                    {employee.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEdit(employee, e)}
                      title="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => handleDelete(employee.id, e)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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

export default EmployeeGrid;

