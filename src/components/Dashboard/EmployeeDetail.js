import React from 'react';
import { FiArrowLeft, FiMail, FiPhone, FiBriefcase, FiUsers } from 'react-icons/fi';
import './EmployeeDetail.css';

const EmployeeDetail = ({ employee, onBack, user }) => {
  if (!employee) return null;

  const presentCount = employee.attendance?.filter(
    (a) => a.status === 'present'
  ).length || 0;
  const totalAttendance = employee.attendance?.length || 0;
  const attendanceRate =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  return (
    <div className="employee-detail-container">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <FiArrowLeft size={20} />
          <span>Back to List</span>
        </button>
      </div>
      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-avatar-section">
            <div className="detail-avatar">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div className="detail-title">
              <h1>{employee.name}</h1>
              <span className={`detail-status ${employee.status}`}>
                {employee.status}
              </span>
            </div>
          </div>

          <div className="detail-sections">
            <div className="detail-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">
                    <FiUsers size={24} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Age</span>
                    <span className="info-value">{employee.age} years</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <FiBriefcase size={24} />
                  </div>
                  <div className="info-content">
                    <span className="info-label">Class</span>
                    <span className="info-value">{employee.class}</span>
                  </div>
                </div>
                {employee.email && (
                  <div className="info-card">
                    <div className="info-icon">
                      <FiMail size={24} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{employee.email}</span>
                    </div>
                  </div>
                )}
                {employee.phone && (
                  <div className="info-card">
                    <div className="info-icon">
                      <FiPhone size={24} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{employee.phone}</span>
                    </div>
                  </div>
                )}
                {employee.department && (
                  <div className="info-card">
                    <div className="info-icon">
                      <FiBriefcase size={24} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Department</span>
                      <span className="info-value">{employee.department}</span>
                    </div>
                  </div>
                )}
                {employee.position && (
                  <div className="info-card">
                    <div className="info-icon">
                      <FiBriefcase size={24} />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Position</span>
                      <span className="info-value">{employee.position}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h2 className="section-title">Subjects ({employee.subjects?.length || 0})</h2>
              <div className="subjects-grid">
                {employee.subjects?.map((subject, index) => (
                  <div key={index} className="subject-card">
                    <div className="subject-name">{subject.name}</div>
                    <div className="subject-details">
                      <span className="subject-code">{subject.code}</span>
                      {subject.credits && (
                        <span className="subject-credits">{subject.credits} credits</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h2 className="section-title">Attendance</h2>
              <div className="attendance-summary">
                <div className="attendance-stat">
                  <div className="stat-value">{attendanceRate}%</div>
                  <div className="stat-label">Attendance Rate</div>
                </div>
                <div className="attendance-stat">
                  <div className="stat-value">{presentCount}</div>
                  <div className="stat-label">Present Days</div>
                </div>
                <div className="attendance-stat">
                  <div className="stat-value">{totalAttendance}</div>
                  <div className="stat-label">Total Records</div>
                </div>
              </div>
              <div className="attendance-list">
                {employee.attendance?.length > 0 ? (
                  employee.attendance.map((record, index) => (
                    <div key={index} className="attendance-record">
                      <div className="attendance-date">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className={`attendance-status ${record.status}`}>
                        {record.status}
                      </div>
                      {record.notes && (
                        <div className="attendance-notes">{record.notes}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-attendance">No attendance records</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

