import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

function Game() {
  const [streamer, setStreamer] = useState({});
  const [guess, setGuess] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [usedStreamers, setUsedStreamers] = useState([]);

  useEffect(() => {
    fetchRandomStreamer();
  }, []);

  const fetchRandomStreamer = async () => {
    try {
      setIsLoading(true);
      let streamer = null;
      while (!streamer || usedStreamers.some((s) => s._id === streamer._id)) {
        const response = await axios.get('https://randomgamesserver.onrender.com/users/streamers/random');
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
    <div className="game-container">
      <h1>Guess the Streamer!</h1>
      <img className="streamer-image" src={streamer.image} alt={streamer.name} />
      <form onSubmit={handleSubmit}>
        <input className="guess-input" type="text" value={guess} onChange={handleGuess} />
        <button className="guess-button" type="submit">Guess</button>
      </form>
      {answer && <p className="answer">{answer}</p>}
      <p className="score">Right Answers: {score}/20</p>
      <button className="guess-button" onClick={handleNext} disabled={isLoading}>{isLoading ? 'Loading...' : 'Next'}</button>
    </div>
    </>
  );
}

export default Game;
