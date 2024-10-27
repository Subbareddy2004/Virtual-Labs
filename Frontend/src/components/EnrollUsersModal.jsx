import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function EnrollUsersModal({ open, onClose, onSubmit }) {
  const [users, setUsers] = useState({ students: [], mentors: [], evaluators: [] });
  const [labs, setLabs] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  useEffect(() => {
    if (open) {
      fetchUsersAndLabs();
    }
  }, [open]);

  const fetchUsersAndLabs = async () => {
    try {
      const studentsResponse = await api.get('/admin/available-users?role=student');
      const mentorsResponse = await api.get('/admin/available-users?role=mentor');
      const evaluatorsResponse = await api.get('/admin/available-users?role=evaluator');
      const labsResponse = await api.get('/admin/available-labs');
      
      setUsers({
        students: studentsResponse.data,
        mentors: mentorsResponse.data,
        evaluators: evaluatorsResponse.data
      });
      setLabs(labsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ users: selectedUsers, labId: selectedLab, role: selectedRole });
    onClose();
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setSelectedUsers([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Enroll Users</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Select Role:</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="evaluator">Evaluator</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Select Users:</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {users[`${selectedRole}s`].map(user => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={user._id}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    className="mr-2"
                  />
                  <label htmlFor={user._id}>{user.name} - {user.email}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Select Lab:</label>
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a lab</option>
              {labs.map(lab => (
                <option key={lab._id} value={lab._id}>{lab.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Enroll Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollUsersModal;
