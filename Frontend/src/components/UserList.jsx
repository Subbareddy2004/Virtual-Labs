import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function UserList({ onEditUser, onDeleteUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center mb-2">
            <span>{user.name} ({user.role})</span>
            <div>
              <button onClick={() => onEditUser(user)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                Edit
              </button>
              <button onClick={() => onDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
