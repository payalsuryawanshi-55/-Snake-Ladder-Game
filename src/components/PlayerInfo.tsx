import React from 'react';
import { PLAYER_COLORS } from '../lib/gameData';
import type { Player } from '../lib/gameData';
import { Crown } from 'lucide-react';

interface PlayerInfoProps {
  players: Player[];
  currentTurn: number;
  winnerIndex: number | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, currentTurn, winnerIndex }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full max-w-lg mx-auto">
      {players.map((player, index) => {
        const color = PLAYER_COLORS[player.colorIndex];
        const isCurrentTurn = index === currentTurn && winnerIndex === null;
        const isWinner = index === winnerIndex;
        
        return (
          <div
            key={index}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-card border-2 transition-all duration-300
              ${isCurrentTurn ? `${color.border} shadow-lg ${color.glow}` : 'border-border'}
              ${isWinner ? 'animate-winner-glow' : ''}
            `}
          >
            <div className={`w-4 h-4 rounded-full ${color.bg}`} />
            <span className="text-sm font-medium text-foreground truncate max-w-[80px]">
              {player.name}
            </span>
            {isWinner && <Crown className="w-4 h-4 text-amber-400" />}
            <span className="text-xs text-muted-foreground">
              {player.position === 0 ? 'Start' : player.position}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerInfo;
