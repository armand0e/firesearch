'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MeteorEffectProps {
  number?: number;
  className?: string;
}

export function MeteorEffect({ number = 20, className }: MeteorEffectProps) {
  const meteors = new Array(number).fill(true);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {meteors.map((_, idx) => (
        <span
          key={idx}
          className={cn(
            'pointer-events-none absolute left-1/2 top-0 h-[2px] w-[2px] rotate-[215deg] animate-meteor rounded-full bg-gradient-to-r from-orange-400 dark:from-yellow-400 to-transparent shadow-[0_0_0_1px_#ffffff10]',
            'before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-orange-400 dark:before:from-yellow-400 before:to-transparent before:content-[""]'
          )}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}
