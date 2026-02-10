import React, { useState, useEffect } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const DiceDots: React.FC<{ value: number }> = ({ value }) => {
  const dotPositions: Record<number, { position: string; style: string }[]> = {
    1: [
      { position: 'center', style: 'w-5 h-5 lg:w-6 lg:h-6' }
    ],
    2: [
      { position: 'top-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' }
    ],
    3: [
      { position: 'top-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'center', style: 'w-5 h-5 lg:w-6 lg:h-6' },
      { position: 'bottom-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' }
    ],
    4: [
      { position: 'top-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'top-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' }
    ],
    5: [
      { position: 'top-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'top-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'center', style: 'w-5 h-5 lg:w-6 lg:h-6' },
      { position: 'bottom-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' }
    ],
    6: [
      { position: 'top-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'top-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'top-1/2 left-2 -translate-y-1/2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'top-1/2 right-2 -translate-y-1/2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 left-2', style: 'w-4 h-4 lg:w-5 lg:h-5' },
      { position: 'bottom-2 right-2', style: 'w-4 h-4 lg:w-5 lg:h-5' }
    ],
  };

  return (
    <>
      {dotPositions[value]?.map((dot, i) => (
        <div
          key={i}
          className={`absolute ${dot.position} ${dot.style} rounded-full`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff, hsl(var(--primary)))',
            boxShadow: `
              0 0 12px hsl(var(--primary) / 0.8),
              inset 0 1px 3px rgba(255, 255, 255, 0.8),
              inset 0 -1px 2px rgba(0, 0, 0, 0.3)
            `,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        />
      ))}
    </>
  );
};

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, disabled }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isRolling) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRolling]);

  const handleRollClick = () => {
    if (!disabled && !isRolling) {
      setShake(true);
      setTimeout(() => setShake(false), 200);
      onRoll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dice Container with 3D effect */}
      <div className="relative">
        {/* Shadow under dice */}
        <div 
          className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-300 ${
            isRolling ? 'bg-primary/50 scale-125' : 'bg-primary/30'
          }`}
        />
        
        {/* 3D Dice */}
        <button
          onClick={handleRollClick}
          disabled={disabled || isRolling}
          className={`
            relative w-28 h-28 lg:w-32 lg:h-32
            bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950
            rounded-2xl
            border-4 border-primary/40
            shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
            transition-all duration-500
            ${shake ? 'animate-dice-roll' : ''}
            ${isRolling ? 'animate-dice-roll cursor-wait' : 'cursor-pointer'}
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-110 hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.6)]'}
            group
            preserve-3d
          `}
          style={{
            transformStyle: 'preserve-3d',
          }}
          aria-label="Roll dice"
        >
          {/* 3D depth effect - sides */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 opacity-30 -z-10" />
          
          {/* Dice face - with inner bevel */}
          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10">
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30" />
            
            {/* Dice corners */}
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary/20" />
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary/20" />
            <div className="absolute bottom-1 left-1 w-4 h-4 rounded-full bg-primary/20" />
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary/20" />
            
            {/* Dice value display */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isRolling ? 'opacity-0' : 'opacity-100'
            }`}>
              <DiceDots value={value} />
            </div>
            
            {/* Rolling animation overlay */}
            {isRolling && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/90 to-slate-950/90 rounded-xl">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white animate-pulse">?</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-white/40 to-transparent rounded-tl-xl" />
          </div>

          {/* Hover effect ring */}
          {!disabled && !isRolling && (
            <div className="absolute -inset-4 rounded-3xl border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}
          
          {/* Click animation ring */}
          {shake && (
            <div className="absolute -inset-4 rounded-3xl border-4 border-primary/40 animate-ping pointer-events-none" />
          )}
        </button>
        
        {/* Dice Value Display */}
        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isRolling ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
            <div className="relative px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">
                {value}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Roll Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleRollClick}
          disabled={disabled || isRolling}
          className={`
            relative
            px-10 py-4
            rounded-xl
            font-bold text-lg uppercase tracking-wider
            transition-all duration-300
            ${disabled || isRolling ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 active:scale-95 cursor-pointer'}
            group
          `}
        >
          {/* Button background with gradient */}
          <div className={`
            absolute inset-0 rounded-xl transition-all duration-300
            ${disabled || isRolling 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
              : 'bg-gradient-to-r from-primary via-accent to-primary group-hover:from-primary/90 group-hover:to-primary/90'
            }
          `} />
          
          {/* Button glow effect */}
          <div className={`
            absolute -inset-1 rounded-xl blur-xl opacity-0 transition-opacity duration-300
            ${!disabled && !isRolling ? 'group-hover:opacity-100 bg-primary/30' : ''}
          `} />
          
          {/* Button text */}
          <div className="relative flex items-center justify-center gap-3">
            <span className={`
              text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200
              ${isRolling ? 'animate-pulse' : ''}
            `}>
              {isRolling ? '🎲 Rolling...' : '🎲 Dice'}
            </span>
            {!isRolling && !disabled && (
              <span className="text-xl animate-bounce">👉</span>
            )}
          </div>
          
          {/* Button shine effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full
              ${!disabled && !isRolling ? 'group-hover:translate-x-full' : ''}
              transition-transform duration-1000
            `} />
          </div>
        </button>
        
        {/* Dice Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Last Roll: <span className="text-white font-bold">{value}</span></span>
          </div>
          <div className="h-4 w-px bg-gray-600" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Chance: <span className="text-white font-bold">1/6</span></span>
          </div>
        </div>
      </div>

      {/* Dice History Preview */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-500">Recent:</span>
        {[6, 4, 2, 5, 1].map((num, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
              num === value ? 'bg-primary text-white scale-125' : 'bg-white/5 text-gray-400'
            }`}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dice;