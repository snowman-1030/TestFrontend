import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { FiX } from 'react-icons/fi';
import './EmployeeForm.css';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
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
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
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
    }
  }
`;

const EmployeeForm = ({ employee, onClose, onSuccess }) => {
  const isEditMode = !!employee;
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    status: 'active',
    subjects: []
  });

  const [newSubject, setNewSubject] = useState({ name: '', code: '', credits: '' });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        age: employee.age || '',
        class: employee.class || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        status: employee.status || 'active',
        subjects: employee.subjects || []
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        age: '',
        class: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        status: 'active',
        subjects: []
      });
    }
  }, [employee]);

  const [addEmployee, { loading: adding, error: addError }] = useMutation(ADD_EMPLOYEE, {
    onCompleted: (data) => {
      console.log('Add successful:', data);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      console.error('Add error:', err);
    }
  });

  const [updateEmployee, { loading: updating, error: updateError }] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: (data) => {
      console.log('Update successful:', data);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      console.error('Update error:', err);
    }
  });

  const loading = adding || updating;
  const error = addError || updateError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, {
          name: newSubject.name,
          code: newSubject.code,
          credits: parseInt(newSubject.credits) || 3
        }]
      }));
      setNewSubject({ name: '', code: '', credits: '' });
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean subjects array - remove __typename and ensure required fields
    const cleanedSubjects = Array.isArray(formData.subjects) 
      ? formData.subjects
          .filter(subject => subject && subject.name && subject.code)
          .map(subject => ({
            name: subject.name,
            code: subject.code,
            credits: subject.credits || undefined
          }))
      : [];

    if (isEditMode) {
      // Update mode
      const input = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim(),
        status: formData.status,
        subjects: cleanedSubjects
      };

      // Add optional fields only if they have non-empty values
      if (formData.email && formData.email.trim()) {
        input.email = formData.email.trim();
      }
      if (formData.phone && formData.phone.trim()) {
        input.phone = formData.phone.trim();
      }
      if (formData.department && formData.department.trim()) {
        input.department = formData.department.trim();
      }
      if (formData.position && formData.position.trim()) {
        input.position = formData.position.trim();
      }

      console.log('Updating employee with:', JSON.stringify({ id: employee.id, input }, null, 2));

      updateEmployee({
        variables: {
          id: employee.id,
          input
        }
      }).catch((err) => {
        console.error('Mutation error details:', err);
      });
    } else {
      // Add mode - subjects is required (can be empty array)
      const input = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim(),
        status: formData.status || 'active',
        subjects: cleanedSubjects
      };

      // Add optional fields
      if (formData.email && formData.email.trim()) {
        input.email = formData.email.trim();
      }
      if (formData.phone && formData.phone.trim()) {
        input.phone = formData.phone.trim();
      }
      if (formData.department && formData.department.trim()) {
        input.department = formData.department.trim();
      }
      if (formData.position && formData.position.trim()) {
        input.position = formData.position.trim();
      }

      console.log('Adding employee with:', JSON.stringify({ input }, null, 2));

      addEmployee({
        variables: {
          input
        }
      }).catch((err) => {
        console.error('Add mutation error details:', err);
      });
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="form-error">
            Error: {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Class *</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Subjects</h3>
            <div className="subjects-list">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="subject-item">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-code">{subject.code}</span>
                  {subject.credits && (
                    <span className="subject-credits">{subject.credits} credits</span>
                  )}
                  <button
                    type="button"
                    className="remove-subject-btn"
                    onClick={() => handleRemoveSubject(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="add-subject">
              <input
                type="text"
                placeholder="Subject name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                className="subject-input"
              />
              <input
                type="text"
                placeholder="Code"
                value={newSubject.code}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                className="subject-input"
              />
              <input
                type="number"
                placeholder="Credits"
                value={newSubject.credits}
                onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
                className="subject-input"
              />
              <button type="button" onClick={handleAddSubject} className="add-subject-btn">
                Add Subject
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Employee')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

