import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextRotateProps {
  texts: string[];
  mainClassName?: string;
  staggerFrom?: 'first' | 'last';
  initial?: object;
  animate?: object;
  exit?: object;
  staggerDuration?: number;
  splitLevelClassName?: string;
  transition?: object;
  rotationInterval?: number;
}

export function TextRotate({
  texts,
  mainClassName = '',
  staggerFrom = 'last',
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  staggerDuration = 0.025,
  splitLevelClassName = '',
  transition = { type: 'spring', damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}: TextRotateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentIndex];
  const letters = currentText.split('');

  return (
    <div className={`inline-flex ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {letters.map((letter, index) => {
            const delay = staggerFrom === 'last'
              ? (letters.length - index - 1) * staggerDuration
              : index * staggerDuration;

            return (
              <motion.span
                key={`${currentIndex}-${index}`}
                className={`inline-block ${splitLevelClassName}`}
                variants={{
                  hidden: initial,
                  visible: animate,
                  exit: exit,
                }}
                transition={{
                  ...transition,
                  delay,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}