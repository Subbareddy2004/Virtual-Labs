import React from 'react';

function LabList({ labs }) {
  if (!labs || labs.length === 0) {
    return <p>No labs assigned yet.</p>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Assigned Labs</h2>
      <ul className="space-y-2">
        {labs.map(lab => (
          <li key={lab._id} className="bg-white p-4 rounded-lg shadow">
            <span className="font-semibold">{lab.name}</span>
            <span className="ml-2">- Progress: {lab.progress || 0}%</span>
            <button 
              onClick={() => window.open(lab.launchUrl, '_blank')}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-300"
              disabled={lab.hoursExceeded}
            >
              Launch Lab
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabList;
