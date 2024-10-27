import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import LabCard from '../components/LabCard';
import ReservationModal from '../components/ReservationModal';
import AttendanceReport from '../components/AttendanceReport';
import GradesReport from '../components/GradesReport';
import TicketForm from '../components/TicketForm';
import Notification from '../components/Notification';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ProgressBar from '../components/ProgressBar';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAttendanceReport, setShowAttendanceReport] = useState(false);
  const [showGradesReport, setShowGradesReport] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await api.get('/student/labs');
      setLabs(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching labs:', err);
      setError('Failed to fetch labs. Please try again.');
      if (err.response && err.response.status === 401) {
        logout();
      }
    }
  };

  const handleReserve = (lab) => {
    setSelectedLab(lab);
    setShowReservationModal(true);
  };

  const handleReservationSubmit = async (reservationData) => {
    try {
      const { labId, startDate, endDate, time, isWeekly } = reservationData;
      await api.post('/student/reserve', {
        labId,
        startDate,
        endDate,
        time,
        isWeekly
      });
      setNotification({ type: 'success', message: 'Reservation successful' });
      setShowReservationModal(false);
      fetchLabs(); // Refresh the labs data
    } catch (error) {
      console.error('Reservation error:', error);
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'An error occurred while making the reservation' 
      });
    }
  };

  const handleViewAttendance = (lab) => {
    setSelectedLab(lab);
    setShowAttendanceReport(true);
  };

  const handleViewGrades = (lab) => {
    setSelectedLab(lab);
    setShowGradesReport(true);
  };

  const handleSubmitTicket = async (ticketData) => {
    try {
      await api.post('/student/ticket', ticketData);
      setNotification({ type: 'success', message: 'Ticket submitted successfully' });
      setShowTicketForm(false);
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setNotification({ type: 'error', message: 'Failed to submit ticket' });
    }
  };

  const handleLaunchLab = async (lab) => {
    try {
      const response = await api.post(`/student/launch-lab/${lab._id}`);
      window.open(response.data.accessUrl, '_blank');
    } catch (err) {
      console.error('Error launching lab:', err);
      setNotification({ type: 'error', message: 'Failed to launch lab' });
    }
  };

  const requestAdditionalHours = async (labId) => {
    try {
      await api.post('/student/request-additional-hours', { labId });
      setNotification({ type: 'success', message: 'Additional hours requested successfully' });
    } catch (err) {
      console.error('Error requesting additional hours:', err);
      setNotification({ type: 'error', message: 'Failed to request additional hours' });
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await api.post('/auth/change-password', passwordData);
      setNotification({ type: 'success', message: 'Password changed successfully' });
      setShowChangePasswordForm(false);
    } catch (err) {
      console.error('Error changing password:', err);
      setNotification({ type: 'error', message: 'Failed to change password' });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user?.name}</h1>
        {notification && <Notification {...notification} />}
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <LabCard 
                key={lab._id} 
                lab={lab} 
                onReserve={() => handleReserve(lab)}
                onViewAttendance={() => handleViewAttendance(lab)}
                onViewGrades={() => handleViewGrades(lab)}
                onLaunch={() => handleLaunchLab(lab)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition duration-300 shadow-md"
            onClick={() => setShowTicketForm(true)}
          >
            Submit a Ticket
          </button>
          <button 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition duration-300 shadow-md"
            onClick={() => requestAdditionalHours(selectedLab?._id)}
          >
            Request Additional Hours
          </button>
          <button 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition duration-300 shadow-md"
            onClick={() => setShowChangePasswordForm(true)}
          >
            Change Password
          </button>
        </div>

        {/* Modals */}
        {showReservationModal && (
          <ReservationModal
            lab={selectedLab}
            onClose={() => setShowReservationModal(false)}
            onSubmit={handleReservationSubmit}
          />
        )}
        {showAttendanceReport && (
          <AttendanceReport
            lab={selectedLab}
            onClose={() => setShowAttendanceReport(false)}
          />
        )}
        {showGradesReport && (
          <GradesReport
            lab={selectedLab}
            onClose={() => setShowGradesReport(false)}
          />
        )}
        {showTicketForm && (
          <TicketForm
            onClose={() => setShowTicketForm(false)}
            onSubmit={handleSubmitTicket}
          />
        )}
        {showChangePasswordForm && (
          <ChangePasswordForm
            onClose={() => setShowChangePasswordForm(false)}
            onSubmit={handleChangePassword}
          />
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
