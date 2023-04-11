import mongoose from 'mongoose';

const streamerSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Streamer = mongoose.model('Streamer', streamerSchema)

export { Streamer };