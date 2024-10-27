import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function LabList() {
  const [labs, setLabs] = useState([]);
  const [editingLab, setEditingLab] = useState(null);
  const [newLabName, setNewLabName] = useState('');

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await api.get('/admin/labs');
      setLabs(response.data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const handleEdit = (lab) => {
    setEditingLab(lab);
    setNewLabName(lab.name);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/admin/labs/${editingLab._id}`, { name: newLabName });
      setEditingLab(null);
      fetchLabs();
    } catch (error) {
      console.error('Error updating lab:', error);
    }
  };

  const handleDelete = async (labId) => {
    if (window.confirm('Are you sure you want to delete this lab?')) {
      try {
        await api.delete(`/admin/labs/${labId}`);
        fetchLabs();
      } catch (error) {
        console.error('Error deleting lab:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lab List</h2>
      <ul>
        {labs.map(lab => (
          <li key={lab._id} className="mb-2 p-2 border rounded">
            {editingLab && editingLab._id === lab._id ? (
              <div>
                <input
                  type="text"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  className="border rounded p-1 mr-2"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
                <button onClick={() => setEditingLab(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{lab.name}</span>
                <div>
                  <button onClick={() => handleEdit(lab)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(lab._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabList;
