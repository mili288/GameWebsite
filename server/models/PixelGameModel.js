import mongoose from 'mongoose';

const pixelGameSchema = new mongoose.Schema({
    name: String,
    image: String,
  });
  
  const PixelGame = mongoose.model('PixelGame', pixelGameSchema)
  
  export { PixelGame };
  