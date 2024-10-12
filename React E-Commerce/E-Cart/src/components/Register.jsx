import React, { useState } from 'react';
import '../assets/Register.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here (e.g., API call to register user)
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);

    // API call to register user
    axios.post('http://localhost:5000/register', {
      name,
      email,
      password,
      role: 0
    })
    .then(response => {
      console.log(response.data);
      alert(response.data.message);
      setLoggedIn(false);
      navigate('/login');
    })
    .catch(error => {
      console.log("ffd")
      console.log("1", error.response);
      console.log("2", error.response.data);
      if (error.response && error.response.data) {
        console.log("3", error.response.data.message);
        alert(error.response.data.message);
      } else {
        alert('There was an error registering the user!');
      }
    });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
