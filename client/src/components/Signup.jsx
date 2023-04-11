import React, { useState } from 'react';
import axios from 'axios';
import '../components/Signup.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/users', { name, email, username, password });
      alert('User created!');
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <>
    <div className="wrapper">
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/signup')}}>Signup</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/')}}>Home</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/login')}}>Login</a>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
      <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          className="input-field" // add a class to the input field
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          className="input-field" // add a class to the input field
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="username">Username:</label>
        <input
          className="input-field" // add a class to the input field
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          className="input-field" // add a class to the input field
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="submit-btn" type="submit">Create User</button> {/* add a class to the button */}
      </form>
      </div>
    </div>
    </>
  );
}

export default Signup;
