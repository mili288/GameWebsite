import mongoose from 'mongoose';

const musicGameSchema = new mongoose.Schema({
    name: String,
    link: String,
  });
  
  const Music = mongoose.model('Music', musicGameSchema)
  
  export { Music };
  