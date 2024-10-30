import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function MentorDashboard() {
  const [assignedLabs, setAssignedLabs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [studentReports, setStudentReports] = useState([]);

  useEffect(() => {
    fetchAssignedLabs();
    fetchActiveUsers();
  }, []);

  const fetchAssignedLabs = async () => {
    try {
      const response = await api.get('/mentor/assigned-labs');
      setAssignedLabs(response.data);
    } catch (error) {
      console.error('Error fetching assigned labs:', error);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await api.get('/mentor/active-users');
      setActiveUsers(response.data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const viewLabDetails = async (labId) => {
    try {
      const response = await api.get(`/mentor/lab-details/${labId}`);
      setSelectedLab(response.data);
    } catch (error) {
      console.error('Error fetching lab details:', error);
    }
  };

  const viewStudentReports = async (labId) => {
    try {
      const response = await api.get(`/mentor/student-reports/${labId}`);
      setStudentReports(response.data);
    } catch (error) {
      console.error('Error fetching student reports:', error);
    }
  };

  const downloadAttendanceReport = async (labId) => {
    try {
      const response = await api.get(`/mentor/attendance-report/${labId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_report_${labId}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading attendance report:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assigned Labs</h2>
        <ul>
          {assignedLabs.map(lab => (
            <li key={lab.id} className="mb-2">
              {lab.name}
              <button onClick={() => viewLabDetails(lab.id)} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">View Details</button>
              <button onClick={() => viewStudentReports(lab.id)} className="ml-2 bg-green-500 text-white px-2 py-1 rounded">View Reports</button>
              <button onClick={() => downloadAttendanceReport(lab.id)} className="ml-2 bg-purple-500 text-white px-2 py-1 rounded">Download Attendance</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Active Users</h2>
        <ul>
          {activeUsers.map(user => (
            <li key={user.id}>{user.name} - {user.lab}</li>
          ))}
        </ul>
      </div>

      {selectedLab && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Lab Details: {selectedLab.name}</h2>
          {/* Display lab details and student environments here */}
        </div>
      )}

      {studentReports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Student Utilization Reports</h2>
          {/* Display student reports here */}
        </div>
      )}
    </div>
  );
}

export default MentorDashboard;
