import React from 'react'
import Signup from './components/Signup';
import Home from './components/Home';
import Login from './components/Login';
import Error from './components/Error';
import Stuff from './components/Stuff';
import Profile from './components/Profile';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import { ForgotPassword, ResetPassword } from './components/ForgotPassword';
import PixelGame from './components/pixelGame/PixelGame';
import WeebTest from './components/weebTest/WeebTest';
import MusicGame from './components/musicGame/MusicGame';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/>}>
          <Route element={<Stuff/>} path="/stuff" />
          <Route element={<Profile/>} path="/profile" />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/pixel-game" element={<PixelGame />} />
        <Route path="/weeb-test" element={<WeebTest />} />
        <Route path="/music-game" element={<MusicGame />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
    </>
  )
}

export default App