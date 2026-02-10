import React, { useEffect } from 'react';
import { Player, PLAYER_COLORS } from '../lib/gameData';
import { playWinSound } from '../lib/sounds';
import { Trophy, Home, RotateCcw, Sparkles, Star } from 'lucide-react';

interface WinnerModalProps {
  winner: Player;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onPlayAgain, onGoHome }) => {
  const color = PLAYER_COLORS[winner.colorIndex];

  useEffect(() => {
    playWinSound();
  }, []);

  // Confetti colors
  const confettiColors = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" />
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <Star
            key={i}
            className="absolute text-amber-400/50 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${12 + Math.random() * 12}px`,
            }}
          />
        ))}
      </div>
      
      {/* Modal content */}
      <div className="relative glass-card-strong p-8 lg:p-12 rounded-3xl max-w-md w-full mx-4 text-center animate-scale-in">
        {/* Glow effect behind modal */}
        <div 
          className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl -z-10"
          style={{
            background: 'radial-gradient(circle, hsl(var(--neon-amber) / 0.4), transparent 70%)'
          }}
        />
        
        {/* Sparkle decorations */}
        <Sparkles className="absolute top-4 left-4 w-6 h-6 text-amber-400 animate-pulse" />
        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-amber-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Trophy */}
        <div className="relative mb-6">
          <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-trophy-bounce">
            <Trophy className="w-12 h-12 lg:w-16 lg:h-16 text-amber-900" />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full animate-ping opacity-30 bg-amber-400" style={{ animationDuration: '2s' }} />
        </div>
        
        {/* Winner text */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-gradient-premium">
          🎉 Victory! 🎉
        </h2>
        
        <div className="flex items-center justify-center gap-3 my-6">
          <div
            className={`w-12 h-12 rounded-full ${color.bg} border-3 ${color.border} animate-winner-glow`}
          />
          <span className="text-2xl lg:text-3xl font-bold text-foreground">
            {winner.name}
          </span>
        </div>
        
        <p className="text-muted-foreground mb-8 text-lg">
          Congratulations! You've won the game! 🏆
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-bold hover:shadow-neon transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-card border border-white/20 font-bold hover:bg-white/10 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
