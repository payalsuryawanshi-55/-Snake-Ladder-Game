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
  className?: string; // ✅ Naya prop add kiya
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  compact = false, 
  currentSessionOnly = true,
  onReset,
  className = '' // ✅ Default value empty string
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
      <div className={`flex flex-col items-center justify-center ${
        compact ? 'py-4 md:py-3' : 'py-6 md:py-8'
      } glass-card rounded-2xl p-4 md:p-6 w-full ${className}`}> {/* ✅ className add kiya */}
        <div className="relative mb-3 md:mb-4">
          <Trophy className="w-10 h-10 md:w-12 md:h-12 text-gray-500/30" />
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 text-primary/50 animate-pulse" />
        </div>
        <p className="text-sm md:text-base font-medium text-foreground mb-1 md:mb-2">Session Leaderboard</p>
        <p className="text-xs md:text-sm text-muted-foreground text-center mb-4 md:mb-6">
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
            className="text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors w-full md:w-auto"
          >
            Add Demo Data
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl ${
      compact ? 'p-3 md:p-4' : 'p-4 md:p-6'
    } space-y-${compact ? '2' : '3'} w-full ${className}`}> {/* ✅ className add kiya */}
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground">
              Session Champions
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              {totalGames} win{totalGames !== 1 ? 's' : ''} • Since {formatTime(lastReset)}
            </p>
          </div>
        </div>
        
        {!compact && leaderboardEntries.length > 0 && (
          <button
            onClick={resetSession}
            className="text-xs md:text-sm text-gray-400 hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg hover:bg-white/5"
            title="Clear session leaderboard"
          >
            <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Leaderboard entries */}
      <div className="space-y-2 md:space-y-3">
        {leaderboardEntries.map((entry, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;
          
          return (
            <div
              key={`${entry.playerName}-${entry.latestWin}`}
              className={`
                flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all group hover:scale-[1.02]
                ${isFirst ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30' :
                  isSecond ? 'bg-gradient-to-r from-gray-400/15 to-gray-500/10 border border-gray-400/30' :
                  isThird ? 'bg-gradient-to-r from-amber-700/15 to-amber-800/10 border border-amber-700/30' :
                  'bg-white/5 border border-white/10'
                }
              `}
            >
              {/* Rank Badge */}
              <div className={`
                w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold relative flex-shrink-0
                ${isFirst ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 shadow-lg shadow-amber-500/30' :
                  isSecond ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30' :
                  isThird ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/30' :
                  'bg-gray-800 text-gray-300'
                }
              `}>
                {isFirst ? (
                  <Crown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                ) : isSecond ? (
                  <Medal className="w-3.5 h-3.5 md:w-4 md:h-4" />
                ) : (
                  <span className="text-xs md:text-sm">#{index + 1}</span>
                )}
                
                {/* Win count badge for top positions */}
                {(isFirst || isSecond || isThird) && entry.wins > 1 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary text-[8px] md:text-[9px] flex items-center justify-center text-white">
                    {entry.wins}
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm md:text-base font-semibold text-foreground truncate">
                    {entry.playerName}
                  </p>
                  {isFirst && entry.wins > 1 && (
                    <span className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {entry.wins} wins
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Last win: {formatTime(entry.latestWin)}
                  </p>
                  {entry.wins > 1 && !isFirst && (
                    <span className="text-[10px] md:text-xs text-primary">
                      • {entry.wins} wins
                    </span>
                  )}
                </div>
              </div>

              {/* Wins Count - Compact display */}
              <div className="text-right flex-shrink-0">
                <div className={`
                  px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-bold
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
        <div className="pt-3 md:pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] md:text-xs text-muted-foreground gap-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Current session only
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
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