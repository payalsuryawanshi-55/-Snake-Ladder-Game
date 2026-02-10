// import React, { useEffect, useState } from 'react';
// import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
// import { supabase } from '../integrations/client';

// interface LeaderboardEntry {
//   id: string;
//   player_name: string;
//   wins: number;
//   games_played: number;
// }

// interface LeaderboardProps {
//   compact?: boolean;
// }

// const Leaderboard: React.FC<LeaderboardProps> = ({ compact = false }) => {
//   const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   const fetchLeaderboard = async () => {
//     setIsLoading(true);
//     const { data, error } = await supabase
//       .from('leaderboard')
//       .select('player_name, wins, games_played')
//       .order('wins', { ascending: false })
//       .limit(compact ? 3 : 4);

//     if (!error && data) {
//       setEntries(data);
//     }
//     setIsLoading(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-3">
//         <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (entries.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-3">
//         <Trophy className="w-6 h-6 text-gray-500 mb-1" />
//         <p className="text-xs text-gray-400">No wins yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1.5">
//       {entries.map((entry, index) => (
//         <div
//           key={index}
//           className={`
//             flex items-center gap-2 p-2 rounded-md text-xs
//             ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5' :
//               'bg-gray-800/20'
//             }
//           `}
//         >
//           {/* Rank Badge - Ultra Compact */}
//           <div className={`
//             w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold
//             ${index === 0 ? 'bg-yellow-500 text-gray-900' :
//               index === 1 ? 'bg-gray-400 text-gray-900' :
//               index === 2 ? 'bg-amber-600 text-white' :
//               'bg-gray-700 text-gray-300'
//             }
//           `}>
//             {index < 3 ? (
//               index === 0 ? <Crown className="w-2.5 h-2.5" /> :
//               index === 1 ? <Medal className="w-2.5 h-2.5" /> :
//               <span>#{index + 1}</span>
//             ) : (
//               <span>#{index + 1}</span>
//             )}
//           </div>

//           {/* Player Name - Truncated */}
//           <div className="flex-1 min-w-0">
//             <p className="text-xs font-medium text-white truncate max-w-[80px]">
//               {entry.player_name}
//             </p>
//           </div>

//           {/* Wins - Small */}
//           <div className="text-right">
//             <p className={`text-xs font-bold ${index === 0 ? 'text-yellow-400' : 'text-cyan-400'}`}>
//               {entry.wins}
//             </p>
//             <p className="text-[9px] text-gray-400">W</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Leaderboard;


// import React, { useEffect, useState } from 'react';
// import { Trophy, Medal, Crown, TrendingUp, RotateCcw } from 'lucide-react';

// interface LeaderboardEntry {
//   player_name: string;
//   wins: number;
//   games_played: number;
//   last_win_time: number;
// }

// interface LeaderboardProps {
//   compact?: boolean;
//   onNewWin?: (playerName: string) => void; // यह prop parent से pass होगा जब कोई जीते
// }

// const Leaderboard: React.FC<LeaderboardProps> = ({ compact = false, onNewWin }) => {
//   const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Local storage से data load करें
//   useEffect(() => {
//     loadLeaderboard();
//   }, []);

//   // Parent से new win का notification मिले तो update करें
//   useEffect(() => {
//     if (onNewWin) {
//       // यह function parent component में define होगा
//       const handleNewWin = (playerName: string) => {
//         addWin(playerName);
//       };
//       // आपको parent component में onNewWin call करना होगा जब कोई जीते
//     }
//   }, [onNewWin]);

//   const loadLeaderboard = () => {
//     setIsLoading(true);
//     try {
//       const stored = localStorage.getItem('snake_ladder_session_leaderboard');
//       if (stored) {
//         const data = JSON.parse(stored);
//         // Sort by wins (descending)
//         const sorted = data.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.wins - a.wins);
//         setEntries(sorted.slice(0, compact ? 3 : 5));
//       }
//     } catch (error) {
//       console.error('Error loading leaderboard:', error);
//     }
//     setIsLoading(false);
//   };

//   const addWin = (playerName: string) => {
//     const currentEntries = [...entries];
//     const existingIndex = currentEntries.findIndex(entry => 
//       entry.player_name.toLowerCase() === playerName.toLowerCase()
//     );

//     const now = Date.now();

//     if (existingIndex >= 0) {
//       // Update existing player
//       currentEntries[existingIndex] = {
//         ...currentEntries[existingIndex],
//         wins: currentEntries[existingIndex].wins + 1,
//         games_played: currentEntries[existingIndex].games_played + 1,
//         last_win_time: now
//       };
//     } else {
//       // Add new player
//       currentEntries.push({
//         player_name: playerName,
//         wins: 1,
//         games_played: 1,
//         last_win_time: now
//       });
//     }

//     // Sort by wins
//     const sorted = currentEntries.sort((a, b) => b.wins - a.wins);
//     const limited = sorted.slice(0, 10); // Max 10 entries

//     // Save to localStorage
//     localStorage.setItem('snake_ladder_session_leaderboard', JSON.stringify(limited));
    
//     // Update state
//     setEntries(limited.slice(0, compact ? 3 : 5));
//   };

//   const resetLeaderboard = () => {
//     if (window.confirm('Reset current session leaderboard?')) {
//       localStorage.removeItem('snake_ladder_session_leaderboard');
//       setEntries([]);
//     }
//   };

//   const clearOldEntries = () => {
//     // 24 hours से पुराने entries हटाएं
//     const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
//     const filtered = entries.filter(entry => entry.last_win_time > twentyFourHoursAgo);
    
//     if (filtered.length !== entries.length) {
//       localStorage.setItem('snake_ladder_session_leaderboard', JSON.stringify(filtered));
//       setEntries(filtered.slice(0, compact ? 3 : 5));
//     }
//   };

//   // हर बार load होने पर old entries clear करें
//   useEffect(() => {
//     clearOldEntries();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-3">
//         <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (entries.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-3">
//         <Trophy className="w-6 h-6 text-gray-500 mb-1" />
//         <p className="text-xs text-gray-400">No wins this session</p>
//         <button
//           onClick={() => {
//             // Demo data add करने के लिए (testing के लिए)
//             addWin('Player 1');
//             addWin('Player 2');
//             addWin('Player 3');
//           }}
//           className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
//         >
//           Add demo data
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-1.5">
//       {/* Reset button - only in non-compact mode */}
//       {!compact && entries.length > 0 && (
//         <div className="flex justify-end mb-1">
//           <button
//             onClick={resetLeaderboard}
//             className="text-[10px] text-gray-400 hover:text-gray-300 flex items-center gap-1"
//             title="Reset session leaderboard"
//           >
//             <RotateCcw className="w-3 h-3" />
//             Reset
//           </button>
//         </div>
//       )}

//       {entries.map((entry, index) => (
//         <div
//           key={`${entry.player_name}-${index}`}
//           className={`
//             flex items-center gap-2 p-2 rounded-md text-xs
//             ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/5' :
//               'bg-gray-800/20'
//             }
//           `}
//         >
//           {/* Rank Badge */}
//           <div className={`
//             w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold
//             ${index === 0 ? 'bg-yellow-500 text-gray-900' :
//               index === 1 ? 'bg-gray-400 text-gray-900' :
//               index === 2 ? 'bg-amber-600 text-white' :
//               'bg-gray-700 text-gray-300'
//             }
//           `}>
//             {index < 3 ? (
//               index === 0 ? <Crown className="w-2.5 h-2.5" /> :
//               index === 1 ? <Medal className="w-2.5 h-2.5" /> :
//               <span>#{index + 1}</span>
//             ) : (
//               <span>#{index + 1}</span>
//             )}
//           </div>

//           {/* Player Name */}
//           <div className="flex-1 min-w-0">
//             <p className="text-xs font-medium text-white truncate max-w-[80px]">
//               {entry.player_name}
//             </p>
//             <p className="text-[9px] text-gray-400">
//               {entry.games_played} game{entry.games_played !== 1 ? 's' : ''}
//             </p>
//           </div>

//           {/* Wins */}
//           <div className="text-right">
//             <p className={`text-xs font-bold ${index === 0 ? 'text-yellow-400' : 'text-cyan-400'}`}>
//               {entry.wins}
//             </p>
//             <p className="text-[9px] text-gray-400">W</p>
//           </div>
//         </div>
//       ))}

//       {/* Auto-reset info */}
//       {!compact && (
//         <div className="text-[8px] text-gray-500 text-center pt-1">
//           Resets after 24 hours
//         </div>
//       )}
//     </div>
//   );
// };

// // Parent component से call करने के लिए export function
// export const addWinToLeaderboard = (playerName: string) => {
//   try {
//     const stored = localStorage.getItem('snake_ladder_session_leaderboard');
//     let entries: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    
//     const existingIndex = entries.findIndex(entry => 
//       entry.player_name.toLowerCase() === playerName.toLowerCase()
//     );

//     const now = Date.now();

//     if (existingIndex >= 0) {
//       entries[existingIndex] = {
//         ...entries[existingIndex],
//         wins: entries[existingIndex].wins + 1,
//         games_played: entries[existingIndex].games_played + 1,
//         last_win_time: now
//       };
//     } else {
//       entries.push({
//         player_name: playerName,
//         wins: 1,
//         games_played: 1,
//         last_win_time: now
//       });
//     }

//     // Sort और limit
//     entries = entries.sort((a, b) => b.wins - a.wins).slice(0, 10);
//     localStorage.setItem('snake_ladder_session_leaderboard', JSON.stringify(entries));
    
//     return true;
//   } catch (error) {
//     console.error('Error adding win:', error);
//     return false;
//   }
// };

// // Game reset करते समय call करें
// export const resetSessionLeaderboard = () => {
//   localStorage.removeItem('snake_ladder_session_leaderboard');
// };

// export default Leaderboard;




import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, RotateCcw, Sparkles, Clock } from 'lucide-react';

interface SessionWin {
  playerName: string;
  winTime: number;
  position: number;
  gameId?: string;
}

interface LeaderboardProps {
  compact?: boolean;
  currentSessionOnly?: boolean;
  onReset?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  compact = false, 
  currentSessionOnly = true,
  onReset 
}) => {
  const [sessionWins, setSessionWins] = useState<SessionWin[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [lastReset, setLastReset] = useState<number>(Date.now());

  // Load session wins
  useEffect(() => {
    loadSessionWins();
  }, []);

  // Listen for new wins
  useEffect(() => {
    const handleWinAdded = () => {
      loadSessionWins();
    };
    
    window.addEventListener('sessionWinAdded', handleWinAdded);
    return () => window.removeEventListener('sessionWinAdded', handleWinAdded);
  }, []);

  const loadSessionWins = () => {
    try {
      const stored = sessionStorage.getItem('snake_ladder_current_session_wins');
      if (stored) {
        const wins = JSON.parse(stored);
        setSessionWins(wins);
        setTotalGames(wins.length);
      } else {
        setSessionWins([]);
        setTotalGames(0);
      }
    } catch (error) {
      console.error('Error loading session wins:', error);
      setSessionWins([]);
      setTotalGames(0);
    }
  };

  const resetSession = () => {
    if (window.confirm('Clear all wins from current session?')) {
      sessionStorage.removeItem('snake_ladder_current_session_wins');
      setSessionWins([]);
      setTotalGames(0);
      setLastReset(Date.now());
      if (onReset) onReset();
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('sessionLeaderboardReset'));
    }
  };

  // Group wins by player and count wins
  const winsByPlayer = sessionWins.reduce((acc, win) => {
    if (!acc[win.playerName]) {
      acc[win.playerName] = { 
        wins: 0, 
        playerName: win.playerName, 
        latestWin: win.winTime,
        firstWin: win.winTime
      };
    }
    acc[win.playerName].wins += 1;
    if (win.winTime > acc[win.playerName].latestWin) {
      acc[win.playerName].latestWin = win.winTime;
    }
    if (win.winTime < acc[win.playerName].firstWin) {
      acc[win.playerName].firstWin = win.winTime;
    }
    return acc;
  }, {} as Record<string, { 
    wins: number; 
    playerName: string; 
    latestWin: number;
    firstWin: number;
  }>);

  const leaderboardEntries = Object.values(winsByPlayer)
    .sort((a, b) => {
      // First sort by wins
      if (b.wins !== a.wins) return b.wins - a.wins;
      // If wins equal, sort by latest win (most recent first)
      return b.latestWin - a.latestWin;
    })
    .slice(0, compact ? 3 : 5);

  // Format time
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // Empty state
  if (leaderboardEntries.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center ${compact ? 'py-4' : 'py-8'} glass-card rounded-2xl p-4`}>
        <div className="relative mb-3">
          <Trophy className="w-10 h-10 text-gray-500/30" />
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary/50 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Session Leaderboard</p>
        <p className="text-xs text-muted-foreground text-center mb-4">
          Win a game to appear here
        </p>
        
        {!compact && (
          <button
            onClick={() => {
              // Add demo data for testing
              const demoWins: SessionWin[] = [
                { playerName: 'Player 1', winTime: Date.now() - 3600000, position: 100 },
                { playerName: 'Player 2', winTime: Date.now() - 1800000, position: 100 },
                { playerName: 'Player 3', winTime: Date.now() - 300000, position: 100 },
              ];
              sessionStorage.setItem('snake_ladder_current_session_wins', JSON.stringify(demoWins));
              loadSessionWins();
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            Add Demo Data
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl ${compact ? 'p-3' : 'p-4'} space-y-${compact ? '2' : '3'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Session Champions
            </h3>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalGames} win{totalGames !== 1 ? 's' : ''} • Since {formatTime(lastReset)}
            </p>
          </div>
        </div>
        
        {!compact && leaderboardEntries.length > 0 && (
          <button
            onClick={resetSession}
            className="text-xs text-gray-400 hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5"
            title="Clear session leaderboard"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Leaderboard entries */}
      <div className="space-y-2">
        {leaderboardEntries.map((entry, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;
          
          return (
            <div
              key={`${entry.playerName}-${entry.latestWin}`}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all group hover:scale-[1.02]
                ${isFirst ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30' :
                  isSecond ? 'bg-gradient-to-r from-gray-400/15 to-gray-500/10 border border-gray-400/30' :
                  isThird ? 'bg-gradient-to-r from-amber-700/15 to-amber-800/10 border border-amber-700/30' :
                  'bg-white/5 border border-white/10'
                }
              `}
            >
              {/* Rank Badge */}
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold relative
                ${isFirst ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 shadow-lg shadow-amber-500/30' :
                  isSecond ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30' :
                  isThird ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/30' :
                  'bg-gray-800 text-gray-300'
                }
              `}>
                {isFirst ? (
                  <Crown className="w-3.5 h-3.5" />
                ) : isSecond ? (
                  <Medal className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-xs">#{index + 1}</span>
                )}
                
                {/* Win count badge for top positions */}
                {(isFirst || isSecond || isThird) && entry.wins > 1 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[8px] flex items-center justify-center text-white">
                    {entry.wins}
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {entry.playerName}
                  </p>
                  {isFirst && entry.wins > 1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {entry.wins} wins
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-muted-foreground">
                    Last win: {formatTime(entry.latestWin)}
                  </p>
                  {entry.wins > 1 && !isFirst && (
                    <span className="text-[10px] text-primary">
                      • {entry.wins} wins
                    </span>
                  )}
                </div>
              </div>

              {/* Wins Count - Compact display */}
              <div className="text-right">
                <div className={`
                  px-2 py-1 rounded-lg text-xs font-bold
                  ${isFirst ? 'bg-amber-500/20 text-amber-400' :
                    isSecond ? 'bg-gray-400/20 text-gray-300' :
                    isThird ? 'bg-amber-700/20 text-amber-600' :
                    'bg-primary/20 text-primary'
                  }
                `}>
                  {entry.wins} W
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      {!compact && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Current session only
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Resets on new game
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to add win - called from Game component
export const addSessionWin = (playerName: string, position: number = 100) => {
  try {
    const stored = sessionStorage.getItem('snake_ladder_current_session_wins');
    const existingWins: SessionWin[] = stored ? JSON.parse(stored) : [];
    
    const newWin: SessionWin = {
      playerName: playerName.trim(),
      winTime: Date.now(),
      position,
      gameId: `game_${Date.now()}`
    };
    
    const updatedWins = [...existingWins, newWin];
    sessionStorage.setItem('snake_ladder_current_session_wins', JSON.stringify(updatedWins));
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('sessionWinAdded', { 
      detail: { playerName, wins: updatedWins.length } 
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding session win:', error);
    return false;
  }
};

// Function to reset session leaderboard - called from Game reset
export const resetSessionLeaderboard = () => {
  sessionStorage.removeItem('snake_ladder_current_session_wins');
  window.dispatchEvent(new CustomEvent('sessionLeaderboardReset'));
};

export default Leaderboard;