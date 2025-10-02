'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SparklesProps {
  children: React.ReactNode;
  className?: string;
  density?: number;
  speed?: 'slow' | 'medium' | 'fast';
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const sizeMap = {
  sm: { min: 1, max: 3 },
  md: { min: 2, max: 4 },
  lg: { min: 3, max: 6 },
};

const speedMap = {
  slow: { min: 2000, max: 4000 },
  medium: { min: 1000, max: 2000 },
  fast: { min: 500, max: 1000 },
};

export function Sparkles({
  children,
  className,
  density = 10,
  speed = 'medium',
  color = 'rgb(251, 146, 60)', // orange-400
  size = 'md',
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const newSparkles: Sparkle[] = [];
    const sizeConfig = sizeMap[size];
    const speedConfig = speedMap[speed];

    for (let i = 0; i < density; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeConfig.max - sizeConfig.min) + sizeConfig.min,
        duration:
          Math.random() * (speedConfig.max - speedConfig.min) + speedConfig.min,
        delay: Math.random() * 2000,
      });
    }

    setSparkles(newSparkles);
  }, [density, speed, size]);

  return (
    <div className={cn('relative inline-block', className)}>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="pointer-events-none absolute animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            animation: `sparkle ${sparkle.duration}ms ease-in-out infinite`,
            animationDelay: `${sparkle.delay}ms`,
            boxShadow: `0 0 ${sparkle.size * 2}px ${color}`,
          }}
        />
      ))}
      {children}
      <style jsx>{`
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
