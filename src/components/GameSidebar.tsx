import React from 'react';
import { Home, RotateCcw, Volume2, VolumeX, User } from 'lucide-react';
import Dice from './Dice';
import { PLAYER_COLORS} from '../lib/gameData';
import type { Player } from '../lib/gameData';
import { playButtonSound } from '../lib/sounds';

interface GameSidebarProps {
  players: Player[];
  currentTurn: number;
  winnerIndex: number | null;
  diceValue: number;
  isRolling: boolean;
  isMoving: boolean;
  message: string;
  onRollDice: () => void;
  onGoHome: () => void;
  onResetGame: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  diceHistory?: number[];
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  players,
  currentTurn,
  winnerIndex,
  diceValue,
  isRolling,
  isMoving,
  message,
  onRollDice,
  onGoHome,
  onResetGame,
  soundEnabled = true,
  onToggleSound,
  diceHistory = [],
}) => {
  const currentPlayer = players[currentTurn];
  
  // Get recent dice history (last 5 rolls)
  const recentRolls = diceHistory.slice(-5).reverse();

  return (
    <div className="h-full flex flex-col bg-gray-900/95 border-l border-gray-700/50">
      {/* Top Navbar - Fixed outside card */}
      <div className="flex-shrink-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700/50 p-3">
        <div className="flex items-center justify-between">
          {/* Left: Game Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/30 to-blue-700/20">
              <span className="text-xl">🎲</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Snake & Ladder</h1>
              <p className="text-xs text-gray-400">Premium Edition</p>
            </div>
          </div>

          {/* Right: Control Buttons */}
          <div className="flex items-center gap-1">
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <button
              onClick={() => {
                playButtonSound();
                onGoHome();
              }}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Go home"
            >
              <Home className="w-4 h-4 text-blue-400" />
            </button>
            
            <button
              onClick={() => {
                playButtonSound();
                onResetGame();
              }}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Reset game"
            >
              <RotateCcw className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current Turn Card - Small & Clean */}
        {winnerIndex === null && currentPlayer && (
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Current Turn</p>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full ${PLAYER_COLORS[currentPlayer.colorIndex].bg} border-2 ${PLAYER_COLORS[currentPlayer.colorIndex].border}`}
                style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
              />
              <div className="flex-1">
                <p className="font-bold text-white">{currentPlayer.name}</p>
                <p className="text-sm text-gray-400">
                  Position: <span className="text-blue-400">
                    {currentPlayer.position === 0 ? 'Start' : currentPlayer.position}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Winner Card */}
        {winnerIndex !== null && (
          <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 rounded-xl p-3 border border-amber-700/30">
            <p className="text-xs text-amber-400 mb-2">🏆 Game Finished</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${PLAYER_COLORS[winnerIndex].bg} border-2 ${PLAYER_COLORS[winnerIndex].border}`} />
              <div>
                <p className="font-bold text-amber-300">{players[winnerIndex].name}</p>
                <p className="text-sm text-amber-400/70">Winner!</p>
              </div>
            </div>
          </div>
        )}

        {/* Dice Section - Compact */}
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
          {/* Dice in center */}
          <div className="flex justify-center mb-3">
            <Dice
              value={diceValue}
              isRolling={isRolling}
              onRoll={onRollDice}
              disabled={isMoving || winnerIndex !== null}
            />
          </div>

          {/* Dice Stats in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            {/* Last Roll */}
            <div className="bg-gray-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Last Roll</p>
              <p className="text-2xl font-bold text-blue-400">{diceValue}</p>
              <p className="text-xs text-gray-500 mt-1">Chance: {diceValue}/6</p>
            </div>

            {/* Recent Rolls */}
            <div className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2 text-center">Recent</p>
              <div className="flex gap-1 justify-center">
                {recentRolls.length > 0 ? (
                  recentRolls.map((roll, idx) => (
                    <div 
                      key={idx} 
                      className="w-6 h-6 rounded bg-blue-900/40 flex items-center justify-center text-sm font-bold text-blue-300"
                    >
                      {roll}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center">No rolls</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Message - Only when exists */}
        {message && (
          <div className={`
            rounded-xl p-3 text-center text-sm font-medium border
            ${message.toLowerCase().includes('snake') ? 'bg-red-900/20 border-red-700/30 text-red-300' : ''}
            ${message.toLowerCase().includes('ladder') ? 'bg-green-900/20 border-green-700/30 text-green-300' : ''}
            ${message.toLowerCase().includes('wins') ? 'bg-amber-900/20 border-amber-700/30 text-amber-300' : ''}
            ${!message.toLowerCase().includes('snake') && !message.toLowerCase().includes('ladder') && !message.toLowerCase().includes('wins') 
              ? 'bg-gray-800/50 border-gray-700/30 text-gray-300' : ''}
          `}>
            <div className="flex items-center justify-center gap-2">
              {message.toLowerCase().includes('snake') && <span>🐍</span>}
              {message.toLowerCase().includes('ladder') && <span>🪜</span>}
              {message.toLowerCase().includes('wins') && <span>🏆</span>}
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Players List - Compact */}
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Players ({players.length})</h3>
            </div>
            <div className="text-xs text-gray-400 px-2 py-1 rounded bg-gray-900/50">
              Turn {currentTurn + 1}/{players.length}
            </div>
          </div>
          
          <div className="space-y-2">
            {players.map((player, index) => {
              const color = PLAYER_COLORS[player.colorIndex];
              const isCurrentTurn = index === currentTurn && winnerIndex === null;
              const isWinner = index === winnerIndex;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isCurrentTurn ? 'bg-blue-900/20' : 
                    isWinner ? 'bg-amber-900/20' : 
                    'hover:bg-gray-700/30'
                  }`}
                >
                  {/* Player Avatar */}
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full ${color.bg} border ${color.border} flex items-center justify-center`}
                      style={isCurrentTurn ? { boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' } : {}}
                    >
                      {isWinner && <span className="text-sm">🏆</span>}
                    </div>
                    {isCurrentTurn && !isWinner && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isWinner ? 'text-amber-400' : 
                      isCurrentTurn ? 'text-blue-400' : 
                      'text-gray-300'
                    }`}>
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pos: <span className="text-gray-400">{player.position === 0 ? 'Start' : player.position}</span>
                    </p>
                  </div>

                  {/* Position Badge */}
                  <div className={`
                    px-2 py-1 rounded text-xs font-bold min-w-[40px] text-center
                    ${player.position === 100 ? 'bg-amber-900/40 text-amber-300' : 
                      isCurrentTurn ? 'bg-blue-900/40 text-blue-300' :
                      'bg-gray-900/60 text-gray-400'}
                  `}>
                    {player.position === 0 ? '🚀' : player.position}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;