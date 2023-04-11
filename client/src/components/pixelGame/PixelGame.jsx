import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PixelGame.css';
import { useNavigate } from 'react-router';
import correctImage from '../assetsComp/correct.png';
import incorrectImage from '../assetsComp/incorrect.png';
import Modal from 'react-modal';

const HIGH_SCORE_KEY = 'pixel_game_high_score';

function PixelGame() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [blurRadius, setBlurRadius] = useState(50);
  const [score, setScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [game, setGame ] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [previousGameIds, setPreviousGameIds] = useState([]);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0);

  const [showModal, setShowModal] = useState(false);
  const [showModalIncorrect, setShowModalIncorrect] = useState(false);
  const [showModalTimesup, setShowModalTimesup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    const savedHighScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
    if (totalScore > savedHighScore) {
      setHighScore(totalScore);
      localStorage.setItem(HIGH_SCORE_KEY, totalScore);
    }
  }, [totalScore]);


  function fetchImage() {
    if (gamesPlayed === 5) {
      setGameOver(true);
      return;
    }
    axios.get('https://randomgamesserver.onrender.com/users/pixel-game/random')
      .then(response => {
        setImage(response.data.image);
        setGame(response.data);
        setName('');
        setScore(100);
        setBlurRadius(50);
        setGamesPlayed(gamesPlayed + 1);
      })
      .catch(error => console.error(error));
  }

  function handleImageClick() {
    const newBlurRadius = Math.max(blurRadius - 10, 0);
    setBlurRadius(newBlurRadius);
    setScore(score - 10);
  }

  function handleNext() {
    if (gamesPlayed === 5) {
      setGameOver(true);
      if (totalScore > highScore) {
        setHighScore(totalScore);
        localStorage.setItem(HIGH_SCORE_KEY, totalScore);
      }
      return;
    }
  {/*  setTotalScore(totalScore + score); // add current score to total score */}
    fetchImage();
    setGamesPlayed(gamesPlayed + 1);
  }

  function nextIncorrect() {
    if (gamesPlayed === 5) {
      setGameOver(true);
      if (totalScore > highScore) {
        setHighScore(totalScore);
        localStorage.setItem(HIGH_SCORE_KEY, totalScore);
      }
      return;
    }
    fetchImage();
    setGamesPlayed(gamesPlayed + 1);
  }
  

  function handleSubmit() {
    if (name.trim().toLowerCase() === game.name.split('/').pop().split('.')[0].toLowerCase()) {
    //  alert('Correct Answer');
      setShowModal(true);
      setTotalScore(totalScore + score); // add current score to total score
      handleNext(); 
    } else {
    //  alert(`Incorrect guess, --- Correct Answer: ${game.name}`);
      setShowModalIncorrect(true);
      nextIncorrect();
    }
  }

  function handlePlayAgain() {
    setGamesPlayed(0);
    setTotalScore(0);
    setGameOver(false);
    fetchImage();
  }

  return (
    <>
    <div className="wrapper">
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/signup')}}>Signup</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/')}}>Home</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/login')}}>Login</a>
    </div>
    <div className="pixel-game-container">
      <h1>Guess The Game</h1>
      {image && !gameOver && (
        <div>
          <div style={{ marginBottom: '10%' }}>
          <p style={{ fontWeight: 'bold' }}>Score: {score}</p>
          <p style={{ fontWeight: 'bold' }}>Total Score: {totalScore}</p>
          <p>Click on the image to reveal the picture but every time you do, you lose 10 points.</p>
          </div>
          <img
            src={image}
            alt="Blurred Image"
            style={{ filter: `blur(${blurRadius}px)`, height: '500px', maxWidth: '1000px' }}
            onClick={handleImageClick}
          />
          <div>
            <p style={{ fontWeight: 'bold' }}>What is the name of the Game?</p>
            <input type="text" value={name} onChange={event => setName(event.target.value)} />
            <button style={{ margin: '5px' }} onClick={handleSubmit}>
              Submit
            </button>
            <button onClick={nextIncorrect}>Next</button>
          </div>
        </div>
      )}
      {gameOver && (
        <div>
          <h2>Game Over!</h2>
          <p>Your total score is: {totalScore}</p>
          <p>Your high score is: {localStorage.getItem(HIGH_SCORE_KEY)}</p>
          <button className="play-again-button" onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}


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
    </div>
    </>
  );
}

export default PixelGame;
