import express from 'express';
import { User } from '../models/User.js';
import { Streamer } from '../models/TwitchStreamerModel.js';
import { PixelGame } from '../models/PixelGameModel.js';
import { Anime } from '../models/AnimeGameModel.js';
import { Music } from '../models/MusicGameModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import base64 from 'base-64';

import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import authMiddleware from './users.js';

const router = express.Router();

function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}


// register route
router.post('/', async (req, res) => {
  const { name, email, username, password } = req.body;

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    return res.status(400).json({ error: 'Email address already in use' });
  }

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    return res.status(400).json({ error: 'Username already in use' });
  }

  const existingUserByNameAndEmail = await User.findOne({ name, email });
  if (existingUserByNameAndEmail) {
    return res.status(400).json({ error: 'User with this name and email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, username, password: hashedPassword });
  const token = jwt.sign({ email: email }, 'forsenbruh')
  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save user' });
    } else {
      res.json({ message: 'User created', user, token: token });
    }
  });
});

// login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isValidPassword = await validatePassword(user, password);
  const token = jwt.sign({ email: email }, 'forsenbruh')
  if (!isValidPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user, token: token });
});

//secure route
router.get('/test', authMiddleware, (req, res) => {
  res.send('secret number 10');
})


//logout route
router.post('/logout', (req, res) => {
  // Clear the user session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to logout' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});


// get user by id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});







// forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // generate password reset token
  const token = uuidv4();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // token expires in 1 hour
  await user.save();

  // send password reset email
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, click on the following link: http://localhost:5173/reset-password/${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send password reset email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Password reset email sent' });
    }
  });
});

// reset password route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});






// API endpoint to get a random streamer
router.get('/streamers/random', async (req, res) => {
  const count = await Streamer.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const streamer = await Streamer.findOne().skip(randomIndex);
  res.send(streamer);
});

// API endpoint to add a new streamer to the database
router.post('/streamers', async (req, res) => {
  const { name, image } = req.body;
  const streamer = new Streamer({ name, image });
  await streamer.save();
  res.send(streamer);
});






router.get('/pixel-game/random', async (req, res) => {
  try {
    const count = await PixelGame.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const game = await PixelGame.findOne().skip(randomIndex);
    const { name, image } = game; // destructure the game object to get the required properties
    res.status(200).json({ name, image }); // send the modified response object with the required properties
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to add a new screenshot to the database
router.post('/pixel-game', async (req, res) => {
  try {
    const { name, image } = req.body;
// Encode the image to Base64
const base64Image = image.toString('base64');
const game = new PixelGame({ name, image: base64Image });
await game.save();
res.status(201).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/pixel-game/check-answer', async (req, res) => {
  try {
    const { name } = req.body;
    const game = await PixelGame.findOne({ name });
    if (!game) {
      res.status(200).json({ correct: false });
    } else {
      res.status(200).json({ correct: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// API endpoint to get a random streamer
router.get('/guess-anime/random', async (req, res) => {
  const count = await Anime.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const streamer = await Anime.findOne().skip(randomIndex);
  res.send(streamer);
});

// API endpoint to add a new streamer to the database
router.post('/guess-anime', async (req, res) => {
  const { name, image } = req.body;
  const anime = new Anime({ name, image });
  await anime.save();
  res.send(anime);
});




router.get('/music-game/random', async (req, res) => {
  const count = await Music.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const song = await Music.findOne().skip(randomIndex);
  res.send(song);
});

router.post('/music-game', async (req, res) => {
  const { name, link, audio } = req.body;
  const music = new Music({ name, link, audio });
  await music.save();
  res.send(music);
});





export default router;
