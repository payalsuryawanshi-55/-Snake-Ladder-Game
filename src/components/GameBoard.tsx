import React from 'react';
import GameCell from './GameCell';
import RealisticSnake from './RealisticSnake';
import RealisticLadder from './RealisticLadder';
import { getCellNumber, Player, SNAKES, LADDERS } from '../lib/gameData';

interface GameBoardProps {
  players: Player[];
  currentTurn: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentTurn }) => {
  const getCellCoords = (cellNum: number) => {
    const row = Math.floor((cellNum - 1) / 10);
    const col = row % 2 === 0 ? (cellNum - 1) % 10 : 9 - ((cellNum - 1) % 10);
    
    const cellSize = 8.4;
    const xOffset = 6;
    const yOffset = 6;
    
    const x = col * cellSize + xOffset + (cellSize / 2);
    const y = (9 - row) * cellSize + yOffset + (cellSize / 2);
    return { x, y };
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-1 sm:p-2 md:p-4">
      <div className="relative w-full max-w-[min(100%,100vh-200px)] aspect-square">
        <div className="relative w-full h-full rounded-xl bg-gray-800 border border-gray-700/50 shadow-xl overflow-hidden">
          {/* Grid */}
          <div className="grid grid-cols-10 grid-rows-10 w-full h-full gap-0.5 p-0.5 sm:p-1">
            {Array.from({ length: 10 }, (_, row) =>
              Array.from({ length: 10 }, (_, col) => {
                const cellNumber = getCellNumber(row, col);
                return (
                  <GameCell
                    key={cellNumber}
                    number={cellNumber}
                    players={players}
                    currentTurn={currentTurn}
                  />
                );
              })
            )}
          </div>
          
          {/* SVG overlay */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ladders */}
            {Object.entries(LADDERS).map(([start, end]) => {
              const startNum = parseInt(start);
              const startCoords = getCellCoords(startNum);
              const endCoords = getCellCoords(end);
              
              return (
                <RealisticLadder
                  key={`ladder-${start}`}
                  id={`ladder-${start}`}
                  x1={startCoords.x}
                  y1={startCoords.y}
                  x2={endCoords.x}
                  y2={endCoords.y}
                  size={0.1}
                />
              );
            })}
            
            {/* Snakes */}
            {Object.entries(SNAKES).map(([start, end]) => {
              const startNum = parseInt(start);
              const startCoords = getCellCoords(startNum);
              const endCoords = getCellCoords(end);
              
              return (
                <RealisticSnake
                  key={`snake-${start}`}
                  id={`snake-${start}`}
                  x1={startCoords.x}
                  y1={startCoords.y}
                  x2={endCoords.x}
                  y2={endCoords.y}
                  size={0.25}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;