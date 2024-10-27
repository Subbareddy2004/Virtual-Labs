import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function LabList() {
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await api.get('/admin/labs');
      setLabs(res.data);
    } catch (err) {
      console.error('Error fetching labs:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Lab List</h2>
      <ul>
        {labs.map((lab) => (
          <li key={lab._id}>
            {lab.name} (Min: {lab.minSlots}, Max: {lab.maxSlots})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabList;
