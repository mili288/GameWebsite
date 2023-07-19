import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import './ChessGame.css';
import axios from 'axios';

const ChessGame = () => {
        const [game, setGame] = useState(new Chess());
        const [currentTimeout, setCurrentTimeout] = useState();

      
        function safeGameMutate(modify) {
          setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
          });
        }
      
        async function makeRandomMove() {
          const possibleMoves = game.moves();
          // exit if the game is over
         // if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
          let updatedFen = game.fen();
          const move = game.move(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
          if (move) {
            updatedFen = game.fen();
          }

          const prompt = `We are playing a chess game and im using a fen string to show you the position of the board and you have to generate a move for the black peices in a chess notation (you are the black peices). The current position is ${updatedFen}.`;
          console.log(updatedFen);
          console.log(prompt);
        
          try {
            const response = await axios.post('http://localhost:3000/users/generate-move', {
              prompt
            });
            const computerMove = response.data.message;
            console.log(computerMove);
          //  console.log(`Computer Move: ${computerMove}`);
          //  safeGameMutate((game) => {
          //    game.move(computerMove);
          //  });
            // add some trash talk
            const trashTalk = 'Your move was weak, but I will make it even worse!';
            console.log(trashTalk);
          } catch (error) {
            console.error(error);
          }
        }
      
        function onDrop(sourceSquare, targetSquare) {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({
              from: sourceSquare,
              to: targetSquare,
              promotion: "q", // always promote to a queen for example simplicity
            });
            setGame(gameCopy);
      
          // illegal move
          if (move === null) return false;
      
          // store timeout so it can be cleared on undo/reset so computer doesn't execute move
          const newTimeout = setTimeout(makeRandomMove, 200);
          setCurrentTimeout(newTimeout);
          return true;
        }
      
        return (
          <div style={{ width: '50%', height: '50%', marginLeft: '25%', marginTop: '3%' }}>
            <Chessboard
              id="PlayVsRandom"
              position={game.fen()}
              onPieceDrop={onDrop}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
        );
      }

export default ChessGame;
