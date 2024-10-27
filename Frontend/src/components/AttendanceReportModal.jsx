import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function AttendanceReportModal({ lab, onClose }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/mentor/attendance/${lab._id}`);
      setAttendance(res.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get(`/mentor/attendance/${lab._id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${lab.name}_attendance.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading attendance report:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Attendance Report - {lab.name}</h2>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>{record.studentName}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.duration} minutes</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleDownload}
          className="mb-4 px-4 py-2 bg-secondary text-white rounded"
        >
          Download Report
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default AttendanceReportModal;
