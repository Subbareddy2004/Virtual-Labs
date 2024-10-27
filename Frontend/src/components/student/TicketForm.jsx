import React, { useState } from 'react';

function TicketForm({ onSubmit }) {
  const [issue, setIssue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ issue });
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Submit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Describe the technical issue"
          className="w-full p-2 border rounded"
        ></textarea>
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded mt-2">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default TicketForm;
