import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">iLab</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="font-semibold">{user.name}</span>
              <Link to={`/${user.role}`} className="hover:text-secondary transition duration-300">Dashboard</Link>
              <button onClick={logout} className="hover:text-secondary transition duration-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary transition duration-300">Login</Link>
              <Link to="/register" className="hover:text-secondary transition duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
