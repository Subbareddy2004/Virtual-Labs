import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function ReservationForm({ onClose, onSubmit }) {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await api.get('/student/assigned-labs');
      setLabs(response.data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':');
    const reservationDateTime = new Date(date);
    reservationDateTime.setHours(parseInt(hours), parseInt(minutes));

    onSubmit({
      labId: selectedLab,
      startDate: reservationDateTime.toISOString(),
      time: time
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Make a Reservation</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Select Lab:</label>
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a lab</option>
              {labs.map((lab) => (
                <option key={lab._id} value={lab._id}>{lab.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationForm;
