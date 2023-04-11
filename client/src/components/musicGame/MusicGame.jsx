import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router';
import './MusicGame.css';
import correctImage from '../assetsComp/correct.png';
import incorrectImage from '../assetsComp/incorrect.png';
import Modal from 'react-modal';

function MusicGame() {
  const [song, setSong] = useState({});
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameCounter, setGameCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalIncorrect, setShowModalIncorrect] = useState(false);
  const [showModalTimesup, setShowModalTimesup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getRandomSong() {
      const response = await fetch('https://randomgamesserver.onrender.com/users/music-game/random');
      const data = await response.json();
      setSong(data);
    }

    getRandomSong();
  }, []);

  useEffect(() => {
    if (gameCounter > 4) {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
    if (timeLeft === 0) {
     // alert("Time's Up! You earned 0 points.");
      setShowModalTimesup(true);
      clearInterval(timerRef.current);
      setAnswer('');
      setGameCounter(gameCounter + 1);
      getRandomSong();
    }
  }, [timeLeft]);
  

  function getRandomSong() {
    fetch('https://randomgamesserver.onrender.com/users/music-game/random')
      .then((response) => response.json())
      .then((data) => {
        setSong(data);
        setTimeLeft(60);
        setAnswer('');
      });
  }

  function handleAnswerSubmit(event) {
    event.preventDefault();
    clearInterval(timerRef.current);
    if (timeLeft === 0) {
      setShowModalTimesup(true);
      clearInterval(timerRef.current);
      setAnswer('');
    } else {
      const correct = answer.toLowerCase() === song.name.toLowerCase();
      const timeTaken = 60 - timeLeft;
      const timeFactor = Math.max(0, 1 - timeTaken / 60);
      let scoreIncrement = 0;
      if (correct) {
        scoreIncrement = 100 * timeFactor;
      //  alert(`Correct! You scored ${Math.round(scoreIncrement)} points.`);
        setShowModal(true);
        setGameCounter(gameCounter + 1);
        getRandomSong();
      } else {
      //  alert(`Incorrect.`);
      setShowModalIncorrect(true)
      }
      setScore(Math.round(score + scoreIncrement));
      setAnswer('');
    }
    if (gameCounter < 4) {
      setGameCounter(gameCounter + 1);
      getRandomSong();
    } else {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
  }

  function handlePlayAgain() {
    setGameCounter(0);
    setScore(0);
    setGameOver(false);
    setShowModalIncorrect(false)
    setShowModal(false)
    setShowModalTimesup(false)
  }

  if (gameOver) {
    return (
      <div className='music-game-container'>
        <h1>Game Over!</h1>
        <p style={{ fontWeight: 'bold' }}>Total score: {score}</p>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    );
  }

  return (
    <>
    <div className="wrapper">
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/signup')}}>Signup</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/')}}>Home</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/login')}}>Login</a>
    </div>
    <div className='music-game-container'>
      <div style={{ width: '50%', marginBottom: '5%', textAlign: 'center' }}>
      <p>Click on the blurred song to play it once you click it the timer starts,
        note that spelling mistakes and not using apostrophes will be counted as a mistake and only put the name
        of the song not the Artist. Good Luck!</p>
      </div>
      <ReactPlayer
        style={{ marginBottom: '100px' }}
        url={song.link}
        playing={false}
        onPlay={() => {
          clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
          }, 1000);
        }}
        className={answer ? '' : 'blur'}
        volume={0.1}
      />
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Time left: {timeLeft}</div>
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Score: {score}</div>
      <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Game {gameCounter + 1} / 5</div>
      <form onSubmit={handleAnswerSubmit} style={{ marginTop: '10px' }}>
        <label style={{ fontWeight: 'bold' }}>
          <input
            placeholder='Guess the song'
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <Modal isOpen={showModal} className="modal">
  <img src={correctImage} alt="Correct answer" style={{ width: '400px' }}/>
  <div>
    <p style={{ color: '#E75480', fontWeight: 'bold', marginLeft: '17.2%' }}>Correct!</p>
  </div>
  <button onClick={() => setShowModal(false)} style={{ marginLeft: '17%' }}>OK</button>
</Modal>

<Modal isOpen={showModalIncorrect} className="modal">
  <img src={incorrectImage} alt="Correct answer" style={{ width: '400px', marginLeft: '5%' }}/>
  <div>
    <p style={{ color: '#E75480', fontWeight: 'bold', marginLeft: '17%' }}>Incorrect!!</p>
  </div>
  <button onClick={() => setShowModalIncorrect(false)} style={{ marginLeft: '17%' }}>OK</button>
</Modal>

<Modal isOpen={showModalTimesup} className="modal">
  <img src={incorrectImage} alt="Correct answer" style={{ width: '400px' }}/>
  <div>
    <p style={{ color: '#E75480', fontWeight: 'bold', marginLeft: '10%' }}>Time's Up! You earned 0 points.</p>
  </div>
  <button onClick={() => setShowModalTimesup(false)} style={{ marginLeft: '17%' }}>OK</button>
</Modal>

    </div>
    </>
  );
}

export default MusicGame;