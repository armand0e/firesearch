'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGridPatternProps {
  className?: string;
  strokeWidth?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  color?: string;
}

export function AnimatedGridPattern({
  className,
  strokeWidth = 1,
  numSquares = 50,
  maxOpacity = 0.3,
  duration = 4,
  color,
}: AnimatedGridPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const squares: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      fadeDirection: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize squares
    for (let i = 0; i < numSquares; i++) {
      squares.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 40 + 20,
        opacity: Math.random() * maxOpacity,
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      squares.forEach((square) => {
        // Update opacity
        square.opacity += (square.fadeDirection * maxOpacity) / (duration * 60);
        
        if (square.opacity >= maxOpacity) {
          square.fadeDirection = -1;
        } else if (square.opacity <= 0) {
          square.fadeDirection = 1;
        }

        // Draw square with theme-aware color
        const themeColor = color || getComputedStyle(canvas).getPropertyValue('--color-primary-rgb').trim() || '251, 146, 60';
        ctx.strokeStyle = `rgba(${themeColor}, ${square.opacity})`;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(square.x, square.y, square.size, square.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [strokeWidth, numSquares, maxOpacity, duration, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
    />
  );
}
