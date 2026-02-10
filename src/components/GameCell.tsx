import React from 'react';
import { SNAKES, LADDERS } from '../lib/gameData';
import PlayerToken from './PlayerToken';
import { Player } from '../lib/gameData';
interface GameCellProps {
  number: number;
  players: Player[];
  currentTurn: number;
}

const GameCell: React.FC<GameCellProps> = ({ number, players, currentTurn }) => {
  const isSnakeHead = SNAKES[number] !== undefined;
  const isLadderBottom = LADDERS[number] !== undefined;
  
  const playersOnCell = players.filter(p => p.position === number);
  
  const getCellColor = () => {
    const row = Math.floor((number - 1) / 10);
    const col = (number - 1) % 10;
    const isEven = (row + col) % 2 === 0;
    return isEven ? 'bg-cell-light' : 'bg-cell-dark';
  };

  const isSpecialCell = number === 100 || number === 1;
  const isWinCell = number === 100;
  const isStartCell = number === 1;

  return (
    <div
      className={`
        relative w-full aspect-square
        ${getCellColor()}
        border border-white/5
        flex items-center justify-center
        text-[8px] sm:text-[10px] md:text-xs font-semibold
        transition-all duration-300
        cell-hover-glow
        group
        ${isWinCell ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/50 border-amber-400/50' : ''}
        ${isStartCell ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/50 border-emerald-400/50' : ''}
      `}
    >
      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-sm" />
      
      {/* Cell number */}
      <span className={`
        absolute top-0.5 left-1 text-cell-number/60 font-medium z-10
        ${isSpecialCell ? 'text-white/80' : ''}
      `}>
        {number}
      </span>
      
      {/* Snake/Ladder indicators with glow */}
      {isSnakeHead && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg md:text-xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' }}>🐍</span>
        </div>
      )}
      {isLadderBottom && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg md:text-xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' }}>🪜</span>
        </div>
      )}
      
      {/* Win/Start cell icons */}
      {isWinCell && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg md:text-xl animate-pulse" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))' }}>🏆</span>
        </div>
      )}
      {isStartCell && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg md:text-xl" style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))' }}>🚀</span>
        </div>
      )}
      
      {/* Player tokens */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        {playersOnCell.map((player, index) => (
          <PlayerToken
            key={player.colorIndex}
            colorIndex={player.colorIndex}
            isCurrentTurn={players[currentTurn]?.colorIndex === player.colorIndex}
            offsetIndex={index}
            totalTokens={playersOnCell.length}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCell;
