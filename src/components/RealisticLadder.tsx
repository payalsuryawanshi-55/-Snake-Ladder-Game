import React from 'react';

interface RealisticLadderProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  size?: number;
}

const RealisticLadder: React.FC<RealisticLadderProps> = ({ 
  x1, y1, x2, y2, id, size = 0.15
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  // Simple dimensions
  const ladderWidth = Math.max(2, size * 15);
  const railThickness = Math.max(0.6, size * 5);
  const rungThickness = Math.max(0.4, size * 3);
  
  // Calculate perpendicular offset for rails
  const perpX = -Math.sin(angle) * ladderWidth / 2;
  const perpY = Math.cos(angle) * ladderWidth / 2;
  
  // Simple rail positions - no inner/outer complexity
  const leftRailStart = { x: x1 + perpX, y: y1 + perpY };
  const leftRailEnd = { x: x2 + perpX, y: y2 + perpY };
  const rightRailStart = { x: x1 - perpX, y: y1 - perpY };
  const rightRailEnd = { x: x2 - perpX, y: y2 - perpY };
  
  // Simple rungs calculation
  const numRungs = Math.max(3, Math.floor(length / 8));
  const rungs = [];
  
  for (let i = 1; i < numRungs; i++) {
    const t = i / numRungs;
    const rungLeft = {
      x: leftRailStart.x + (leftRailEnd.x - leftRailStart.x) * t,
      y: leftRailStart.y + (leftRailEnd.y - leftRailStart.y) * t
    };
    const rungRight = {
      x: rightRailStart.x + (rightRailEnd.x - rightRailStart.x) * t,
      y: rightRailStart.y + (rightRailEnd.y - rightRailStart.y) * t
    };
    rungs.push({ left: rungLeft, right: rungRight });
  }

  return (
    <g className="ladder-group" id={`ladder-${id}`}>
      <defs>
        {/* Simple gradient for ladder */}
        <linearGradient id={`ladderGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        
        {/* Simple rung gradient */}
        <linearGradient id={`rungGradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Left rail - simple and clean */}
      <line
        x1={leftRailStart.x}
        y1={leftRailStart.y}
        x2={leftRailEnd.x}
        y2={leftRailEnd.y}
        stroke={`url(#ladderGradient-${id})`}
        strokeWidth={railThickness}
        strokeLinecap="round"
      />
      
      {/* Right rail - simple and clean */}
      <line
        x1={rightRailStart.x}
        y1={rightRailStart.y}
        x2={rightRailEnd.x}
        y2={rightRailEnd.y}
        stroke={`url(#ladderGradient-${id})`}
        strokeWidth={railThickness}
        strokeLinecap="round"
      />
      
      {/* Simple rungs */}
      {rungs.map((rung, index) => (
        <line
          key={index}
          x1={rung.left.x}
          y1={rung.left.y}
          x2={rung.right.x}
          y2={rung.right.y}
          stroke={`url(#rungGradient-${id})`}
          strokeWidth={rungThickness}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export default RealisticLadder;