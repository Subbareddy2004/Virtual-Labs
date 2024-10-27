import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function StudentUtilizationModal({ lab, onClose }) {
  const [utilization, setUtilization] = useState([]);

  useEffect(() => {
    fetchUtilization();
  }, []);

  const fetchUtilization = async () => {
    try {
      const res = await api.get(`/mentor/utilization/${lab._id}`);
      setUtilization(res.data);
    } catch (err) {
      console.error('Error fetching utilization:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Student Utilization - {lab.name}</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Total Hours</th>
              <th>Last Access</th>
            </tr>
          </thead>
          <tbody>
            {utilization.map((record) => (
              <tr key={record._id}>
                <td>{record.studentName}</td>
                <td>{record.totalHours}</td>
                <td>{new Date(record.lastAccess).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default StudentUtilizationModal;
