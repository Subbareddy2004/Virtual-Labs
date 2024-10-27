import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ReservationForm from '../components/ReservationForm';
import TicketForm from '../components/TicketForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

function StudentDashboard() {
  const [assignedLabs, setAssignedLabs] = useState([]);
  const [grades, setGrades] = useState([]);
  const [reports, setReports] = useState({ attendance: [], usage: [] });
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedLabs();
    fetchGrades();
    fetchReports();
  }, []);

  const fetchAssignedLabs = async () => {
    try {
      const response = await api.get('/student/assigned-labs');
      setAssignedLabs(response.data);
    } catch (error) {
      console.error('Error fetching assigned labs:', error);
      setError('Failed to fetch assigned labs');
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await api.get('/student/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('Failed to fetch grades');
    }
  };

  const fetchReports = async () => {
    try {
      const response = await api.get('/student/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports');
    }
  };

  const handleReservation = async (reservationData) => {
    try {
      await api.post('/student/reservations', reservationData);
      fetchAssignedLabs(); // Refresh the assigned labs
      setShowReservationForm(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error making reservation:', error);
      setError('Failed to make reservation. Please try again.');
    }
  };

  const handleTicketSubmit = async (ticketData) => {
    try {
      await api.post('/student/tickets', ticketData);
      setShowTicketForm(false);
      // Optionally, you can fetch updated data or show a success message
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError('Failed to submit ticket. Please try again.');
    }
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      await api.post('/auth/change-password', passwordData);
      setShowChangePasswordForm(false);
      // Optionally, you can show a success message
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Assigned Labs</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Lab ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedLabs.map((lab) => (
              <tr key={lab._id}>
                <td className="border border-gray-300 p-2">{lab._id}</td>
                <td className="border border-gray-300 p-2">{lab.name}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => setShowReservationForm(true)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Reserve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Grades</h2>
        {/* Display grades here */}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Attendance Report</h2>
        <ul>
          {reports.attendance.map((record, index) => (
            <li key={index}>{record.date}: {record.status}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Usage Report</h2>
        <ul>
          {reports.usage.map((record, index) => (
            <li key={index}>{record.lab}: {record.hours} hours</li>
          ))}
        </ul>
      </section>

      <div className="flex space-x-4">
        <button
          onClick={() => setShowReservationForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Reserve Slot
        </button>
        <button
          onClick={() => setShowTicketForm(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Submit Ticket
        </button>
        <button
          onClick={() => setShowChangePasswordForm(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </div>

      {showReservationForm && (
        <ReservationForm
          onSubmit={handleReservation}
          onClose={() => setShowReservationForm(false)}
        />
      )}

      {showTicketForm && (
        <TicketForm
          onSubmit={handleTicketSubmit}
          onClose={() => setShowTicketForm(false)}
        />
      )}

      {showChangePasswordForm && (
        <ChangePasswordForm
          onSubmit={handlePasswordChange}
          onClose={() => setShowChangePasswordForm(false)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;
