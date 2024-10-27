import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import CreateUserModal from '../components/CreateUserModal';
import CreateLabModal from '../components/CreateLabModal';
import EnrollUsersModal from '../components/EnrollUsersModal';
import CreateExerciseModal from '../components/CreateExerciseModal';
import UserList from '../components/UserList';
import LabList from '../components/LabList';
import ReportDownloader from '../components/ReportDownloader';

ChartJS.register(...registerables);

function AdminDashboard() {
  const [stats, setStats] = useState({
    userLabData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    labUsageData: { labels: [], datasets: [{ label: 'Lab Usage', data: [], backgroundColor: '' }] }
  });
  const [labUsage, setLabUsage] = useState([]);
  const [currentSessions, setCurrentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateLabModal, setShowCreateLabModal] = useState(false);
  const [showEnrollUsersModal, setShowEnrollUsersModal] = useState(false);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDashboardData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, labUsageRes, currentSessionsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/lab-usage'),
        api.get('/admin/current-sessions')
      ]);
      
      const processedStats = processStatsData(statsRes.data, labUsageRes.data);
      setStats(processedStats);
      setLabUsage(labUsageRes.data);
      setCurrentSessions(currentSessionsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const processStatsData = (statsData, labUsageData) => {
    return {
      userLabData: {
        labels: ['Users', 'Labs'],
        datasets: [{
          data: [statsData.userCount || 0, statsData.labCount || 0],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        }]
      },
      labUsageData: {
        labels: labUsageData?.map(lab => lab.name) || [],
        datasets: [{
          label: 'Lab Usage',
          data: labUsageData?.map(lab => lab.usageCount) || [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      }
    };
  };

  const handleCreateUser = async (userData) => {
    try {
      await api.post('/admin/users', userData);
      fetchData();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleCreateLab = async (labData) => {
    try {
      await api.post('/admin/labs', labData);
      fetchData();
    } catch (err) {
      console.error('Error creating lab:', err);
    }
  };

  const handleEnrollUsers = async (enrollmentData) => {
    try {
      await api.post('/admin/enroll', enrollmentData);
      fetchDashboardData(); // Refresh the dashboard data
      setShowEnrollModal(false);
    } catch (error) {
      console.error('Error enrolling users:', error);
      // Show an error message to the user
    }
  };

  const handleCreateExercise = async (exerciseData) => {
    try {
      await api.post('/admin/exercises', exerciseData);
      fetchData();
    } catch (err) {
      console.error('Error creating exercise:', err);
    }
  };

  const handleEditUser = async (user) => {
    // Implement user editing logic here
    console.log('Editing user:', user);
    // You might want to open a modal for editing or navigate to an edit page
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchData(); // Refresh the data after deletion
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Total Users and Labs</h2>
              <div style={{ height: '200px' }}>
                {stats.userLabData.labels.length > 0 && <Pie data={stats.userLabData} options={chartOptions} />}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Lab Usage</h2>
              <div style={{ height: '200px' }}>
                {stats.labUsageData.labels.length > 0 && <Bar data={stats.labUsageData} options={chartOptions} />}
              </div>
            </div>
          </div>

          {/* Current Day Sessions */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Current Day Sessions</h2>
            {currentSessions.length > 0 ? (
              <ul className="list-disc pl-5">
                {currentSessions.map((session) => (
                  <li key={session._id} className="text-gray-600">
                    {session.lab?.name}: {session.students?.length || 0} students
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No active sessions today.</p>
            )}
          </div>

          {/* User and Lab Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <UserList onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <LabList />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setShowCreateUserModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Create User
            </button>
            <button onClick={() => setShowCreateLabModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Create Lab
            </button>
            <button onClick={() => setShowEnrollUsersModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Enroll Users
            </button>
            <button onClick={() => setShowCreateExerciseModal(true)} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Create Exercise
            </button>
          </div>

          {/* Report Downloads */}
          <div className="bg-white p-4 rounded-lg shadow">
            <ReportDownloader />
          </div>

          {/* Modals */}
          <CreateUserModal
            open={showCreateUserModal}
            onClose={() => setShowCreateUserModal(false)}
            onSubmit={handleCreateUser}
          />
          <CreateLabModal
            open={showCreateLabModal}
            onClose={() => setShowCreateLabModal(false)}
            onSubmit={handleCreateLab}
          />
          <EnrollUsersModal
            open={showEnrollUsersModal}
            onClose={() => setShowEnrollUsersModal(false)}
            onSubmit={handleEnrollUsers}
          />
          <CreateExerciseModal
            open={showCreateExerciseModal}
            onClose={() => setShowCreateExerciseModal(false)}
            onSubmit={handleCreateExercise}
          />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
