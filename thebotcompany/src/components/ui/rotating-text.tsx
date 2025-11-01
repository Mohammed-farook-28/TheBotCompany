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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-white text-6xl font-bold">
        {baseText}
      </span>
      <span className="ml-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 90 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-6xl font-bold inline-block"
            style={{ color: highlightColor }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
