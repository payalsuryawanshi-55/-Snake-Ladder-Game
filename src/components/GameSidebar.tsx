// import React from 'react';
// import { Home, RotateCcw, Trophy, Volume2, VolumeX, ArrowDown, ArrowUp } from 'lucide-react';
// import Dice from './Dice';
// import { PLAYER_COLORS, Player } from '../lib/gameData';
// import { playButtonSound } from '../lib/sounds';

// interface GameSidebarProps {
//   players: Player[];
//   currentTurn: number;
//   winnerIndex: number | null;
//   diceValue: number;
//   isRolling: boolean;
//   isMoving: boolean;
//   message: string;
//   onRollDice: () => void;
//   onGoHome: () => void;
//   onResetGame: () => void;
//   soundEnabled?: boolean;
//   onToggleSound?: () => void;
// }

// const GameSidebar: React.FC<GameSidebarProps> = ({
//   players,
//   currentTurn,
//   winnerIndex,
//   diceValue,
//   isRolling,
//   isMoving,
//   message,
//   onRollDice,
//   onGoHome,
//   onResetGame,
//   soundEnabled = true,
//   onToggleSound,
// }) => {
//   const currentPlayer = players[currentTurn];
  
//   // Detect message type for styling
//   const isSnakeMessage = message.toLowerCase().includes('snake');
//   const isLadderMessage = message.toLowerCase().includes('ladder');

//   // Glow colors for each player
//   const glowStyles: Record<number, string> = {
//     0: '0 0 15px rgba(239, 68, 68, 0.5)',
//     1: '0 0 15px rgba(59, 130, 246, 0.5)',
//     2: '0 0 15px rgba(34, 197, 94, 0.5)',
//     3: '0 0 15px rgba(234, 179, 8, 0.5)',
//     4: '0 0 15px rgba(168, 85, 247, 0.5)',
//     5: '0 0 15px rgba(236, 72, 153, 0.5)',
//   };

//   return (
//     <div className="h-full flex flex-col glass-card-strong p-4 lg:p-6 gap-4 lg:gap-5 lg:w-50 xl:w-96">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl lg:text-2xl font-bold text-gradient-premium">
//             Snake & Ladder
//           </h1>
//           <p className="text-xs lg:text-sm text-muted-foreground">Premium Edition</p>
//         </div>
//         <div className="flex gap-2">
//           {onToggleSound && (
//             <button
//               onClick={onToggleSound}
//               className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
//               aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
//             >
//               {soundEnabled ? (
//                 <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
//               ) : (
//                 <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
//               )}
//             </button>
//           )}
//           <button
//             onClick={() => {
//               playButtonSound();
//               onGoHome();
//             }}
//             className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
//             aria-label="Go home"
//           >
//             <Home className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
//           </button>
          
//           <button
//             onClick={() => {
//               playButtonSound();
//               onResetGame();
//             }}
//             className="p-2 rounded-lg glass-card hover:bg-white/10 transition-colors"
//             aria-label="Reset game"
//           >
//             <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
//           </button>
//         </div>
//       </div>

//       {/* Current Turn Indicator */}
//       {winnerIndex === null && currentPlayer && (
//         <div 
//           className="glass-card p-3 lg:p-4 rounded-xl border border-primary/30"
//           style={{ boxShadow: glowStyles[currentPlayer.colorIndex] }}
//         >
//           <p className="text-xs text-muted-foreground mb-1">Current Turn</p>
//           <div className="flex items-center gap-3">
//             <div 
//               className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full ${PLAYER_COLORS[currentPlayer.colorIndex].bg} border-2 ${PLAYER_COLORS[currentPlayer.colorIndex].border} animate-pulse`}
//             />
//             <div>
//               <p className="font-bold text-foreground">{currentPlayer.name}</p>
//               <p className="text-xs text-muted-foreground">Position: <span className="text-primary">{currentPlayer.position}</span></p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Dice Section */}
//       <div className="flex flex-col items-center py-4 lg:py-6">
//         <Dice
//           value={diceValue}
//           isRolling={isRolling}
//           onRoll={onRollDice}
//           disabled={isMoving || winnerIndex !== null}
//         />
//       </div>

//       {/* Status Message */}
//       {message && (
//         <div className={`
//           glass-card p-3 rounded-xl text-center text-sm font-medium
//           ${isSnakeMessage ? 'border border-red-500/50 bg-red-500/10 text-red-400' : ''}
//           ${isLadderMessage ? 'border border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : ''}
//           ${!isSnakeMessage && !isLadderMessage ? 'border border-primary/30 text-foreground' : ''}
//           animate-scale-in
//         `}>
//           <div className="flex items-center justify-center gap-2">
//             {isSnakeMessage && <span>🐍</span>}
//             {isLadderMessage && <span>🪜</span>}
//             {message}
//           </div>
//         </div>
//       )}

//       {/* Players List */}
//       <div className="flex-1 min-h-0 overflow-hidden">
//         <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
//           <Trophy className="w-4 h-4" /> Players
//         </h3>
//         <div className="space-y-2 max-h-[180px] lg:max-h-[240px] overflow-y-auto pr-1">
//           {players.map((player, index) => {
//             const color = PLAYER_COLORS[player.colorIndex];
//             const isCurrentTurn = index === currentTurn && winnerIndex === null;
//             const isWinner = index === winnerIndex;
            
//             return (
//               <div
//                 key={index}
//                 className={`
//                   flex items-center gap-3 p-3 rounded-xl transition-all duration-300
//                   ${isCurrentTurn ? 'glass-card-strong border border-primary/50 scale-[1.02]' : 'glass-card border border-transparent'}
//                   ${isWinner ? 'border-amber-400/50 bg-amber-400/10' : ''}
//                 `}
//                 style={{
//                   boxShadow: isCurrentTurn ? glowStyles[player.colorIndex] : undefined
//                 }}
//               >
//                 {/* Avatar */}
//                 <div className="relative">
//                   <div
//                     className={`w-9 h-9 rounded-full ${color.bg} border-2 ${color.border} flex items-center justify-center`}
//                     style={{
//                       boxShadow: isCurrentTurn ? glowStyles[player.colorIndex] : '0 2px 8px rgba(0,0,0,0.2)'
//                     }}
//                   >
//                     {isWinner && <Trophy className="w-4 h-4 text-amber-300" />}
//                   </div>
//                   {isCurrentTurn && !isWinner && (
//                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <p className={`font-semibold truncate ${isWinner ? 'text-amber-400' : 'text-foreground'}`}>
//                     {player.name}
//                     {isWinner && <span className="ml-2">🏆</span>}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Position: <span className="text-primary font-medium">{player.position === 0 ? 'Start' : player.position}</span>
//                   </p>
//                 </div>

//                 {/* Position badge */}
//                 <div className={`
//                   px-2 py-1 rounded-lg text-xs font-bold
//                   ${player.position === 100 ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/20 text-primary'}
//                 `}>
//                   {player.position === 0 ? '🚀' : player.position}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="glass-card p-3 rounded-xl">
//         <h4 className="text-xs font-semibold text-muted-foreground mb-2">Legend</h4>
//         <div className="grid grid-cols-2 gap-2 text-xs">
//           <div className="flex items-center gap-2">
//             <span className="text-red-400">🐍</span>
//             <div className="flex items-center gap-1 text-muted-foreground">
//               <ArrowDown className="w-3 h-3 text-red-400" />
//               <span>Snake Down</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-emerald-400">🪜</span>
//             <div className="flex items-center gap-1 text-muted-foreground">
//               <ArrowUp className="w-3 h-3 text-emerald-400" />
//               <span>Ladder Up</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameSidebar;




import React from 'react';
import { Home, RotateCcw, Volume2, VolumeX, User } from 'lucide-react';
import Dice from './Dice';
import { PLAYER_COLORS, Player } from '../lib/gameData';
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