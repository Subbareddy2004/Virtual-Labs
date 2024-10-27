import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/admin/users/${editingUser._id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} className="mb-2 p-2 border rounded">
            {editingUser && editingUser._id === user._id ? (
              <div>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="border rounded p-1 mr-2"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="border rounded p-1 mr-2"
                />
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="border rounded p-1 mr-2"
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="evaluator">Evaluator</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
                <button onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{user.name} - {user.email} ({user.role})</span>
                <div>
                  <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
