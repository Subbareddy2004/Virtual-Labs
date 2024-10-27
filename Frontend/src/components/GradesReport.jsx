import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function GradesReport({ lab, onClose }) {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await api.get(`/student/grades/${lab._id}`);
      setGrades(res.data);
    } catch (err) {
      console.error('Error fetching grades:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Grades Report: {lab.name}</h2>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="text-left">Assignment</th>
              <th className="text-left">Score</th>
              <th className="text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade._id}>
                <td>{grade.assignment}</td>
                <td>{grade.score}</td>
                <td>{grade.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default GradesReport;
