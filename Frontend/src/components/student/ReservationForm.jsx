import React, { useState } from 'react';

function ReservationForm({ onReserve }) {
  const [labId, setLabId] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('day');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReserve({ labId, date, duration });
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Reserve Lab Slot</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for lab selection, date, and duration */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Reserve
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
