import React from 'react'
import './Home.css';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();
  return (
    <>
    <div className="wrapper">
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/signup')}}>Signup</a>
     <a href="javascript:void(0)" style={{ color: 'white' }} onClick={() => {navigate('/login')}}>Login</a>
    </div>
    <div className='gamesWrapper'>
      <div className='games'>
      <h2>Games</h2>
      </div>
    </div>
    <div className='actualGames'>
      <div style={{ cursor: 'pointer' }}>
      <a href="javascript:void(0)" style={{ color: 'white', marginLeft: '0px' }} onClick={() => {navigate('/stuff')}}>Guess The Streamer</a>

      <div class="article-card" onClick={() => {navigate('/stuff')}}>
    <div class="content">
    </div>
    <img src="https://pbs.twimg.com/profile_images/1596499963860512768/hpd7imKG_400x400.jpg" alt="article-cover" />
  </div>
      </div>

      <div className='streamer'>
      <a href="javascript:void(0)" style={{ color: 'white'}} onClick={() => {navigate('/pixel-game')}}>Guess The Blurred Game</a>

      <div class="article-card" style={{ marginLeft: '50px', cursor: 'pointer' }} onClick={() => {navigate('/pixel-game')}}>
    <div class="content">
    </div>
    <img src="https://m.media-amazon.com/images/I/61vimNr+9UL.png" alt="article-cover" />
  </div>
      </div>

    <div className='streamer'>
      <a href="javascript:void(0)" style={{ color: 'white'}} onClick={() => {navigate('/weeb-test')}}>Guess The Anime</a>
      <div class="article-card" style={{ marginLeft: '50px', cursor: 'pointer'}} onClick={() => {navigate('/weeb-test')}}>
    <div class="content">
    </div>
    <img src="https://i0.wp.com/metagalaxia.com.br/wp-content/uploads/2022/12/Makima-Chainsaw-Man.webp?fit=1200%2C675&ssl=1" />
  </div>
  </div>

<div className='streamer'>
<a href="javascript:void(0)" style={{ color: 'white'}} onClick={() => {navigate('/weeb-test')}}>Guess The Song</a>
  <div class="article-card" style={{ marginLeft: '50px', cursor: 'pointer'}} onClick={() => {navigate('/music-game')}}>
    <div class="content">
    </div>
    <img src="https://m.media-amazon.com/images/I/61B9wpidCfL.png" />
  </div>
  </div>
  </div>

  <div className="wrapper" style={{ marginTop: '39vh' }}>
     <p>Website Created by Mili :), you might encounter some bugs but i couldn't be bothered to fix them xD. Have Fun xqcL </p>
    </div>
    </>
  )
}

export default Home