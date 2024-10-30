import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center text-gray-800 p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold mb-6 text-center text-blue-600">Welcome to iLab</h1>
        <p className="text-xl mb-8 text-center text-indigo-700">Your gateway to interactive and immersive learning experiences</p>
        
        <div className="flex justify-center mb-12">
          <Link to="/login" className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full mr-4 hover:bg-blue-600 transition duration-300">Login</Link>
          <Link to="/register" className="bg-transparent border-2 border-blue-500 text-blue-500 font-semibold py-2 px-6 rounded-full hover:bg-blue-500 hover:text-white transition duration-300">Register</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard
            icon={<BeakerIcon />}
            title="Virtual Labs"
            description="Access state-of-the-art lab equipment from anywhere, anytime."
          />
          <FeatureCard
            icon={<UsersIcon />}
            title="Collaborative Learning"
            description="Work with peers and mentors in real-time on exciting projects."
          />
          <FeatureCard
            icon={<ChartIcon />}
            title="Progress Tracking"
            description="Monitor your learning journey with detailed analytics and feedback."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 hover:bg-opacity-70 transition duration-300 shadow-lg">
      <div className="text-4xl mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-indigo-700">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function BeakerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 inline-block">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 inline-block">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 inline-block">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export default Home;