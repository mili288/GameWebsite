import mongoose from 'mongoose';

const animeGameSchema = new mongoose.Schema({
    name: String,
    image: String,
  });
  
  const Anime = mongoose.model('Anime', animeGameSchema)
  
  export { Anime };
  