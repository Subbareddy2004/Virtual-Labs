import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function GradingModal({ lab, onClose }) {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/evaluator/students/${lab._id}`);
      setStudents(res.data);
      const initialGrades = {};
      res.data.forEach(student => {
        initialGrades[student._id] = { project: student.projectGrade || '', lab: student.labGrade || '' };
      });
      setGrades(initialGrades);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleGradeChange = (studentId, type, value) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [studentId]: { ...prevGrades[studentId], [type]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/evaluator/grade/${lab._id}`, { grades });
      onClose();
    } catch (err) {
      console.error('Error submitting grades:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4">Grade Students - {lab.name}</h2>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Project Grade</th>
              <th>Lab Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grades[student._id]?.project}
                    onChange={(e) => handleGradeChange(student._id, 'project', e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grades[student._id]?.lab}
                    onChange={(e) => handleGradeChange(student._id, 'lab', e.target.value)}
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded mr-2"
          >
            Submit Grades
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default GradingModal;
