import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function EvaluatorDashboard() {
  const [assignedLabs, setAssignedLabs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [studentReports, setStudentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedLabs();
    fetchActiveUsers();
  }, []);

  const fetchAssignedLabs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/evaluator/assigned-labs');
      setAssignedLabs(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching assigned labs:', error);
      setError('Failed to fetch assigned labs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const response = await api.get('/evaluator/active-users');
      setActiveUsers(response.data);
    } catch (error) {
      console.error('Error fetching active users:', error);
    }
  };

  const viewLabDetails = async (labId) => {
    try {
      const response = await api.get(`/evaluator/lab-details/${labId}`);
      setSelectedLab(response.data);
    } catch (error) {
      console.error('Error fetching lab details:', error);
    }
  };

  const gradeStudent = async (studentId, labId, grade, type) => {
    try {
      await api.post('/evaluator/grade', { studentId, labId, grade, type });
      // Refresh student reports after grading
      viewStudentReports(labId);
    } catch (error) {
      console.error('Error grading student:', error);
    }
  };

  const viewStudentReports = async (labId) => {
    try {
      const response = await api.get(`/evaluator/student-reports/${labId}`);
      setStudentReports(response.data);
    } catch (error) {
      console.error('Error fetching student reports:', error);
    }
  };

  const downloadAttendanceReport = async (labId) => {
    try {
      const response = await api.get(`/evaluator/attendance-report/${labId}`, { responseType: 'blob' });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Evaluator Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assigned Labs</h2>
        {assignedLabs.length === 0 ? (
          <p>No labs assigned yet.</p>
        ) : (
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
        )}
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
          <h2 className="text-xl font-semibold mb-2">Student Reports</h2>
          {studentReports.map(report => (
            <div key={report.id} className="mb-4">
              <h3>{report.studentName}</h3>
              <p>Project Grade: {report.projectGrade}</p>
              <p>Lab Session Grade: {report.labSessionGrade}</p>
              <button onClick={() => gradeStudent(report.studentId, report.labId, prompt('Enter project grade'), 'project')} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">Grade Project</button>
              <button onClick={() => gradeStudent(report.studentId, report.labId, prompt('Enter lab session grade'), 'labSession')} className="bg-green-500 text-white px-2 py-1 rounded">Grade Lab Session</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvaluatorDashboard;
