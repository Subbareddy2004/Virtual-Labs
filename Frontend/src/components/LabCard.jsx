import React from 'react';
import ProgressBar from './ProgressBar';

function LabCard({ lab, onReserve, onViewAttendance, onViewGrades, onLaunch }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{lab.name}</h3>
      <p className="text-gray-600 mb-4">{lab.description}</p>
      <ProgressBar progress={lab.progress} />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onReserve}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Reserve
        </button>
        <button
          onClick={onViewAttendance}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Attendance
        </button>
        <button
          onClick={onViewGrades}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Grades
        </button>
        <button
          onClick={onLaunch}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300"
        >
          Launch Lab
        </button>
      </div>
    </div>
  );
}

export default LabCard;
