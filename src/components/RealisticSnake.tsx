import React from 'react';

interface RealisticSnakeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  size?: number;
}

const RealisticSnake: React.FC<RealisticSnakeProps> = ({ 
  x1, y1, x2, y2, id, size = 0.25
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  const perpX = -dy / length;
  const perpY = dx / length;
  const waveAmplitude = length * 0.1;
  
  const cp1x = x1 + dx * 0.25 + perpX * waveAmplitude;
  const cp1y = y1 + dy * 0.25 + perpY * waveAmplitude;
  const cp2x = x1 + dx * 0.5 - perpX * waveAmplitude * 0.8;
  const cp2y = y1 + dy * 0.5 - perpY * waveAmplitude * 0.8;
  const cp3x = x1 + dx * 0.75 + perpX * waveAmplitude * 0.6;
  const cp3y = y1 + dy * 0.75 + perpY * waveAmplitude * 0.6;
  
  const headAngle = Math.atan2(y1 - cp1y, x1 - cp1x) * (180 / Math.PI);
  
  const bodyWidth = Math.max(1.5, size * 6);

  const snakePath = `M ${x1} ${y1} 
    C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1 + dx * 0.5} ${y1 + dy * 0.5}
    S ${cp3x} ${cp3y}, ${x2} ${y2}`;

  return (
    <g className="snake-group" id={`snake-${id}`}>
      <defs>
        {/* Simple snake gradient */}
        <linearGradient id={`snakeGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>

      {/* Simple snake body */}
      <path
        d={snakePath}
        fill="none"
        stroke={`url(#snakeGradient-${id})`}
        strokeWidth={bodyWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Simple snake head */}
      <g transform={`translate(${x1}, ${y1}) rotate(${headAngle})`}>
        <ellipse
          cx="0"
          cy="0"
          rx={bodyWidth * 0.8}
          ry={bodyWidth * 0.6}
          fill="#dc2626"
        />
        
        {/* Simple eyes */}
        <circle cx={bodyWidth * 0.3} cy={-bodyWidth * 0.2} r={bodyWidth * 0.15} fill="#1a1a1a" />
        <circle cx={bodyWidth * 0.3} cy={bodyWidth * 0.2} r={bodyWidth * 0.15} fill="#1a1a1a" />
        
        {/* Simple tongue */}
        <line
          x1={bodyWidth * 0.5}
          y1="0"
          x2={bodyWidth * 0.9}
          y2={-bodyWidth * 0.15}
          stroke="#fca5a5"
          strokeWidth={bodyWidth * 0.1}
          strokeLinecap="round"
        />
        <line
          x1={bodyWidth * 0.5}
          y1="0"
          x2={bodyWidth * 0.9}
          y2={bodyWidth * 0.15}
          stroke="#fca5a5"
          strokeWidth={bodyWidth * 0.1}
          strokeLinecap="round"
        />
      </g>
      
      {/* Simple tail */}
      <path
        d={`M ${x2} ${y2} 
            Q ${x2 - dx * 0.1 + perpX * waveAmplitude * 0.3} ${y2 - dy * 0.1 + perpY * waveAmplitude * 0.3}, 
              ${x2 - dx * 0.2} ${y2 - dy * 0.2}`}
        stroke="#7f1d1d"
        strokeWidth={bodyWidth * 0.6}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

export default RealisticSnake;