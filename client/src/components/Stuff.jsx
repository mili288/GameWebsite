import React from 'react';
import './Stuff.css';
import Game from './Game';
import { useNavigate } from 'react-router';

function Stuff() {

  const navigate = useNavigate();

  return (
    <>
     <div className='navWrapper'>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/')}}>Home</a>
      <a href="/profile" style={{ color: 'white' }}>Profile</a>
      <a href="/login" style={{ color: 'white' }} onClick={() => {localStorage.removeItem('token'), localStorage.removeItem('userId')}}>Logout</a>
     </div>
     <div>
     <div>
      <Game />
     </div>
     </div>
    </>
  )
}

export default Stuff;