"use client";

import type { RadarRing } from "../types/";

interface RadarRingProps {
  ring: RadarRing;
  centerX: number;
  centerY: number;
  zoom: number;
}

export function RadarRingComponent({
  ring,
  centerX,
  centerY,
  zoom,
}: RadarRingProps) {
  const scaledRadius = ring.radius * zoom;

  // Only show labels for rings that are reasonably sized and visible
  const shouldShowLabel = scaledRadius > 50 && scaledRadius < 300;
  const fontSize = Math.max(11, Math.min(14, 12 * zoom));

  // Adjust opacity based on distance from center for better visual hierarchy
  const baseOpacity = 0.4;
  const distanceFactor = Math.max(0.2, Math.min(1, 1 - scaledRadius / 800));
  const opacity = baseOpacity * distanceFactor;

  return (
    <g>
      <circle
        cx={centerX}
        cy={centerY}
        r={scaledRadius}
        fill="none"
        stroke={ring.color}
        strokeWidth="1.5"
        strokeDasharray="6,3"
        opacity={opacity}
      />
      {shouldShowLabel && (
        <text
          x={centerX}
          y={centerY - scaledRadius - 20}
          textAnchor="middle"
          className="font-medium fill-emerald-400"
          style={{
            fontSize: `${fontSize}px`,
            textShadow:
              "0 0 4px rgba(16, 185, 129, 0.6), 0 1px 2px rgba(0,0,0,0.8)",
            opacity: opacity * 1.5, // Make labels slightly more visible than rings
          }}
        >
          {ring.label}
        </text>
      )}
    </g>
  );
}
