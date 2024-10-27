import React, { useState } from 'react';

function TicketForm({ onClose, onSubmit }) {
  const [issue, setIssue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ issue });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Submit a Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="issue">Describe the issue:</label>
            <textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              required
            ></textarea>
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
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketForm;
