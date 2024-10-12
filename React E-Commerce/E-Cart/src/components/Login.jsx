import React, { useState } from 'react';
import '../assets/Login.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('0');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', { email, password, role })
    .then(response => {
      console.log("response", response);
      if (response.data.authenticated) {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        console.log("localStorageSetItem", localStorage.getItem('username')); // Log the username after setting
        console.log("localStorageSetItem", localStorage.getItem('role'));
        setLoggedIn(true);
        navigate('/');
      } 
    })
    .catch(error => {
      if (error.response && error.response.data) {
        console.log("3", error.response.data.message);
        alert(error.response.data.message);
      } else {
        alert('There was an error during the login process!');
      }
      // console.error('There was an error during the login process!', error);
      // setError('There was an error during the login process!');
    });

    // try {
    //   setLoggedIn(true);
    //   navigate('/'); // Navigate to home page after login
    // } catch (error) {
    //   console.error('Login failed:', error);
    // }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="0">User</option>
            <option value="1">Admin</option>
            <option value="2">Co-Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
