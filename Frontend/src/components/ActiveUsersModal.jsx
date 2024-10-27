import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function ActiveUsersModal({ lab, onClose, onViewStudentLab }) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const res = await api.get(`/mentor/active-users/${lab._id}`);
      setActiveUsers(res.data);
    } catch (err) {
      console.error('Error fetching active users:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Active Users - {lab.name}</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Start Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{new Date(user.startTime).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => onViewStudentLab(lab, user._id)}
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition duration-300"
                  >
                    View Lab
                  </button>
                </td>
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

export default ActiveUsersModal;
