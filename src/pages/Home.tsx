import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Play, Users, Trophy, Sparkles, Zap, Target } from 'lucide-react';
import { playButtonSound } from '../lib/sounds';
import { PLAYER_COLORS } from '../lib/gameData';
import { useGameState } from '../hooks/useGamesState';
import Leaderboard from '../components/Leaderboard';
import ThemeToggle from '../components/ThemeToggle';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { createGame } = useGameState();
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerCountChange = (delta: number) => {
    playButtonSound();
    const newCount = Math.min(6, Math.max(2, playerCount + delta));
    setPlayerCount(newCount);
    
    if (delta > 0) {
      setPlayerNames([...playerNames, `Player ${newCount}`]);
    } else {
      setPlayerNames(playerNames.slice(0, newCount));
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = async () => {
    playButtonSound();
    setIsLoading(true);
    
    const gameId = await createGame(playerNames);
    if (gameId) {
      navigate(`/game/${gameId}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background bg-game-pattern overflow-hidden relative">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--neon-cyan) / 0.4), transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--neon-purple) / 0.4), transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, hsl(var(--neon-emerald) / 0.4), transparent 70%)', animationDelay: '2s' }}
        />
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[5%] text-4xl sm:text-5xl lg:text-6xl animate-float opacity-10 sm:opacity-20">🎲</div>
        <div className="absolute top-20 right-[10%] text-3xl animate-float-delayed opacity-20 hidden md:block">🐍</div>
        <div className="absolute bottom-40 left-[15%] text-5xl animate-float opacity-20 hidden md:block">🪜</div>
        <div className="absolute bottom-20 right-[10%] text-6xl animate-float-delayed opacity-20 hidden md:block">🏆</div>
        <Sparkles className="absolute top-1/3 left-[5%] w-8 h-8 text-primary/30 animate-pulse hidden md:block" />
        <Zap className="absolute top-1/4 right-[5%] w-8 h-8 text-accent/30 animate-pulse hidden md:block" style={{ animationDelay: '0.5s' }} />
        <Target className="absolute bottom-1/3 right-[8%] w-6 h-6 text-neon-emerald/30 animate-pulse hidden md:block" style={{ animationDelay: '1s' }} />
      </div>

      

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex justify-center pt-12 lg:pt-16 p-4 lg:p-6">
        <div className=" max-w-6xl mx-auto grid lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Left Column - Game Setup (60%) */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start justify-start">
            {/* Hero Title */}
            <div className="text-center lg:text-left mb-8 lg:mb-10 w-full">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 lg:mb-6">
                <span className="text-gradient-premium">Snake & Ladder</span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground lg:pr-3 max-w-2xl">
                Roll the dice, climb the ladders, and watch out for snakes! 
                The ultimate multiplayer experience.
              </p>
            </div>

            {/* Game Setup Card */}
             <div className="w-full max-w-xl glass-card-strong p-3 sm:p-4 lg:p-5 rounded-xl lg:rounded-2xl">
              {/* Player Count */}
              <div className="mb-4 lg:mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  Number of Players
                </label>
                  <div className="mx-auto flex items-center justify-center gap-3 lg:gap-4 glass-card rounded-xl p-4 w-[360px]">
                  <button
                    onClick={() => handlePlayerCountChange(-1)}
                    disabled={playerCount <= 2}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg glass-card border border-white/10 text-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="text-center min-w-[70px] sm:min-w-[80px]">
                    <span className="text-4xl sm:text-5xl font-black text-gradient-cyan block">{playerCount}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">players</span>
                  </div>
                  <button
                    onClick={() => handlePlayerCountChange(1)}
                    disabled={playerCount >= 6}
                    className="w-9 h-9 sm:w-12 sm:h-10 rounded-lg glass-card border border-white/10 text-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Player Names */}
              <div className="space-y-3 mb-6 lg:mb-8">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Enter Player Names
                </label>
                <div className="space-y-3 max-h-[200px] lg:max-h-[240px] overflow-y-auto pr-2">
                  {playerNames.map((name, index) => {
                    const color = PLAYER_COLORS[index];
                    return (
                      <div key={index} className="flex items-center gap-2 lg:gap-3 group">
                        <div 
                          className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${color.bg} ${color.border} border-2 flex-shrink-0 flex items-center justify-center transition-all group-focus-within:scale-110`}
                          style={{
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                          }}
                        >
                          <span className="text-white text-xs lg:text-sm font-bold">P{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder={`Player ${index + 1}`}
                          className="flex-1 px-3 py-2 rounded-xl glass-card border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-transparent"
                          maxLength={15}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                disabled={isLoading || playerNames.some(n => !n.trim())}
                className="w-full py-2 lg:py-3 rounded-lg bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-neon transition-all hover:scale-[1.02] active:scale-[0.98] group neon-border"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                    Start Game
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 lg:mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="flex items-center gap-2 glass-card px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors">
                🎲 Roll to move
              </span>
              <span className="flex items-center gap-2 glass-card px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors">
                🐍 Avoid snakes
              </span>
              <span className="flex items-center gap-2 glass-card px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors">
                🪜 Climb ladders
              </span>
              <span className="flex items-center gap-2 glass-card px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors">
                🏆 Reach 100
              </span>
            </div>
          </div>

          {/* Right Column - Leaderboard (40%) */}
          <div className="lg:col-span-2 flex flex-col mt-10 lg:mt-24">
            <div className="glass-card-strong p-3 sm:p-4 rounded-xl lg:rounded-2xl flex flex-col">
              <div className="flex items-center gap-3 mb-4 mt-20 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center neon-glow-purple">
                  <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-amber-900" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-foreground">Leaderboard</h2>
                  <p className="text-xs lg:text-sm text-muted-foreground">Top Champions</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <Leaderboard />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-3 lg:p-2 text-center">
        <p className="text-xs lg:text-sm text-muted-foreground">
          🎮 Made with ❤️ • The Ultimate Snake & Ladder Experience
        </p>
      </footer>
    </div>
  );
};

export default Home;
