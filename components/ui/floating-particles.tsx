'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FloatingParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
}

export function FloatingParticles({
  className,
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color,
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < quantity; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * (ease / 50),
          vy: (Math.random() - 0.5) * (ease / 50),
          size: Math.random() * 2 + 1,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;

        // Apply staticity
        particle.vx += (Math.random() - 0.5) * (staticity / 1000);
        particle.vy += (Math.random() - 0.5) * (staticity / 1000);

        // Draw particle with theme-aware color
        const themeColor = color || getComputedStyle(canvas).getPropertyValue('--color-primary-rgb').trim() || '251, 146, 60';
        ctx.fillStyle = `rgba(${themeColor}, 0.5)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [quantity, staticity, ease, refresh, color]);

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
