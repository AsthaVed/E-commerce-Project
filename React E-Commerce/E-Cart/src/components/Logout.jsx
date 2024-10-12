import React from 'react';
import '../assets/Logout.css'; 
import { useNavigate } from 'react-router-dom';

const Logout = ({ setLoggedIn }) => {
  const handleLogout = () => {
    setLoggedIn(false); // Set logged-in state to false
    console.log('User logged out');
  };

  return (
    <div className="logout-container">
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
