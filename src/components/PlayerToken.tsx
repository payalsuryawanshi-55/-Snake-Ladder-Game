import React from 'react';
import { PLAYER_COLORS } from '../lib/gameData';

interface PlayerTokenProps {
  colorIndex: number;
  isCurrentTurn: boolean;
  offsetIndex?: number;
  totalTokens?: number;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ 
  colorIndex, 
  isCurrentTurn, 
  offsetIndex = 0,
  totalTokens = 1
}) => {
  const color = PLAYER_COLORS[colorIndex];
  
  // Calculate offset for multiple tokens on same cell
  const getOffset = () => {
    if (totalTokens === 1) return { x: 0, y: 0 };
    const offsets = [
      { x: -5, y: -5 },
      { x: 5, y: -5 },
      { x: -5, y: 5 },
      { x: 5, y: 5 },
      { x: 0, y: -7 },
      { x: 0, y: 7 },
    ];
    return offsets[offsetIndex] || { x: 0, y: 0 };
  };

  const offset = getOffset();

  // Neon glow colors based on player color
  const glowColors: Record<number, string> = {
    0: '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)', // red
    1: '0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)', // blue
    2: '0 0 15px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.4)', // green
    3: '0 0 15px rgba(234, 179, 8, 0.8), 0 0 30px rgba(234, 179, 8, 0.4)', // yellow
    4: '0 0 15px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.4)', // purple
    5: '0 0 15px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.4)', // pink
  };

  return (
    <div
      className={`
        absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full
        ${color.bg} ${color.border} border-2
        transition-all duration-500 ease-out
        ${isCurrentTurn ? 'animate-pulse scale-110' : ''}
      `}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        boxShadow: isCurrentTurn 
          ? glowColors[colorIndex] || glowColors[0]
          : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
      }}
    >
      {/* Inner highlight */}
      <div className="absolute inset-1 rounded-full bg-white/30" />
      
      {/* Current turn indicator ring */}
      {isCurrentTurn && (
        <div 
          className="absolute -inset-1 rounded-full border-2 border-white/50 animate-ping"
          style={{ animationDuration: '1.5s' }}
        />
      )}
    </div>
  );
};

export default PlayerToken;
