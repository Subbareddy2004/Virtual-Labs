import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import LabCard from '../components/LabCard';
import Notification from '../components/Notification';

function MentorDashboard() {
  const { user } = useContext(AuthContext);
  const [labs, setLabs] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await api.get('/mentor/labs');
      setLabs(res.data);
    } catch (err) {
      console.error('Error fetching labs:', err);
      setNotification({ 
        type: 'error', 
        message: `Failed to fetch labs: ${err.response?.data?.message || 'Unknown error'}` 
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, Mentor {user?.name}</h1>
        {notification && <Notification {...notification} />}
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <LabCard 
                key={lab._id} 
                lab={lab} 
                // Add mentor-specific actions here
              />
            ))}
          </div>
        </div>
        
        {/* Add other mentor-specific components here */}
      </div>
    </div>
  );
}

export default MentorDashboard;
