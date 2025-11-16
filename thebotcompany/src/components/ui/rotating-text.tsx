"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
  baseText?: string;
  highlightColor?: string;
}

export default function RotatingText({
  words,
  interval = 2000,
  className,
  baseText = "Let's build your next",
  highlightColor = "#00baff"
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordContainerRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  // Find the longest word to set a fixed width
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  // Extract font size from className if provided, otherwise use responsive defaults
  const getFontSizeClass = () => {
    if (className?.includes('text-3xl')) return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
    if (className?.includes('text-4xl')) return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
    if (className?.includes('text-5xl')) return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl';
    return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'; // Default responsive
  };

  const fontSizeClass = getFontSizeClass();

  return (
    <div className={cn("flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start whitespace-nowrap overflow-visible w-full", className)}>
      <span className={`text-white ${fontSizeClass} font-bold font-heading pixel-font whitespace-nowrap overflow-visible text-center sm:text-left`}>
        {baseText}
      </span>
      <span 
        ref={wordContainerRef}
        className="mt-2 sm:mt-0 sm:ml-4 inline-block relative overflow-visible"
        style={{ 
          width: `${longestWord.length * 0.8}em`, // Fixed width based on longest word
          minWidth: `${longestWord.length * 0.8}em`,
          textAlign: 'center'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 90 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`${fontSizeClass} font-bold inline-block font-heading pixel-font whitespace-nowrap absolute left-0 top-0 z-10`}
            style={{ color: highlightColor }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
        {/* Hidden span to maintain container height and width */}
        <span className={`${fontSizeClass} font-bold font-heading pixel-font opacity-0 whitespace-nowrap pointer-events-none`}>
          {longestWord}
        </span>
      </span>
    </div>
  );
}
