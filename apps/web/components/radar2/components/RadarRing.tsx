import React from 'react';
import { TimeRing } from '../types';

interface RadarRingProps {
  ring: TimeRing;
}

const RadarRing: React.FC<RadarRingProps> = ({ ring }) => {
  return (
    <g>
      <circle
        cx={0}
        cy={0}
        r={ring.radius}
        fill="none"
        stroke={ring.color}
        strokeWidth={2}
        strokeOpacity={0.6}
        strokeDasharray="5,5"
      />
      <text
        x={ring.radius * 0.7}
        y={-ring.radius * 0.7}
        fill={ring.color}
        fontSize="14"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {ring.label}
      </text>
    </g>
  );
};

export default RadarRing;
