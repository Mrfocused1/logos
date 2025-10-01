import React from "react";
import { cn } from "../../utils/cn";

export interface TypewriterEffectProps {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  cursorClassName,
}) => {
  return (
    <div className={cn("text-3xl sm:text-4xl lg:text-5xl font-bold text-center", className)}>
      {words.map((word, index) => (
        <span key={index} className={cn("mr-2", word.className)}>
          {word.text}
        </span>
      ))}
    </div>
  );
};