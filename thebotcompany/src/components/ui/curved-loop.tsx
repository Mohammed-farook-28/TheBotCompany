"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CurvedLoopProps {
  marqueeText: string;
  speed?: number;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
  className?: string;
}

export default function CurvedLoop({
  marqueeText,
  speed = 2,
  curveAmount = 500,
  direction = 'right',
  interactive = true,
  className,
}: CurvedLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
      
      const intensity = Math.min(distance / maxDistance, 1);
      const curve = curveAmount * intensity;
      
      container.style.setProperty('--curve-amount', `${curve}px`);
    };

    const handleMouseLeave = () => {
      if (!interactive) return;
      container.style.setProperty('--curve-amount', '0px');
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, curveAmount]);

  const animationDuration = 20 / speed;
  const animationDirection = direction === 'left' ? 'reverse' : 'normal';

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-20 overflow-hidden',
        'hover:cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--curve-amount': '0px',
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 flex items-center"
        style={{
          animation: `curved-marquee ${animationDuration}s linear infinite ${animationDirection}`,
          animationPlayState: isHovered && interactive ? 'paused' : 'running',
        }}
      >
        <div
          className="whitespace-nowrap text-6xl font-bold text-white"
          style={{
            transform: 'translateX(var(--curve-amount))',
            transition: interactive ? 'transform 0.3s ease-out' : 'none',
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="inline-block mr-8">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes curved-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
