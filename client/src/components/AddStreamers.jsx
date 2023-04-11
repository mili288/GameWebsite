import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Game() {
  const [streamer, setStreamer] = useState(null);

  async function handleAddStreamer(name, image) {
    try {
      const response = await axios.post('http://localhost:3000/users/streamers', { name, image });
      setStreamer(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!streamer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Guess the streamer game</h1>
      <p>Who is this streamer?</p>
      <img src={streamer.image} alt={streamer.name} />
      <form onSubmit={(event) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const image = event.target.elements.image.value;
        handleAddStreamer(name, image);
      }}>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Image URL:
          <input type="url" name="image" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Game;
