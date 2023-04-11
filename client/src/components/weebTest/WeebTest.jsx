import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function WeebTest() {
  const [streamer, setStreamer] = useState({});
  const [guess, setGuess] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usedStreamers, setUsedStreamers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRandomStreamer();
  }, []);

  const fetchRandomStreamer = async () => {
    try {
      setIsLoading(true);
      let streamer = null;
      while (!streamer || usedStreamers.some((s) => s._id === streamer._id)) {
        const response = await axios.get('http://localhost:3000/users/guess-anime/random');
        streamer = response.data;
      }
      if (usedStreamers.length === 20) {
        setAnswer(`Game over! Your score is ${score}/20`);
        setIsLoading(true);
      } else {
        setUsedStreamers((prev) => [...prev, streamer]);
        setStreamer(streamer);
        setAnswer('');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuess = (event) => {
    setGuess(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (guess.toLowerCase() === streamer.name.toLowerCase()) {
      setAnswer('Correct!');
      setScore(score + 1);
    } else {
      setAnswer('Wrong!');
    }
    setGuess('');
  };

  const handleNext = async () => {
    await fetchRandomStreamer();
  };

  return (
    <>
    <div className="wrapper">
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/signup')}}>Signup</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/')}}>Home</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/login')}}>Login</a>
    </div>
    <div className="game-container">
      <h1>Guess the Anime!</h1>
      <img className="streamer-image" src={streamer.image} alt={streamer.name} />
      <form onSubmit={handleSubmit}>
        <input className="guess-input" type="text" value={guess} onChange={handleGuess} />
        <button className="guess-button" type="submit">Guess</button>
      </form>
      {answer && <p className="answer">{answer}</p>}
      <p className="score">Score: {score}/20</p>
      <button className="guess-button" onClick={handleNext} disabled={isLoading}>{isLoading ? 'Loading...' : 'Next'}</button>
    </div>
    </>
  );
}

export default WeebTest;
