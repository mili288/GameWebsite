import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      const token = response.data.token;
      const userId = response.data.user._id; // Get user ID from server response
      localStorage.setItem('token', token); // Save token to local storage
      localStorage.setItem('userId', userId); // Save user ID to local storage
      setEmail('');
      setPassword('');
      navigate('/stuff'); // Navigate to the stuff route
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
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            className="input-field"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            className="input-field"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
          <a href="/forgot-password" style={{ fontSize: '15px', cursor: 'pointer', color: 'white' }}>Forgot password?</a>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
