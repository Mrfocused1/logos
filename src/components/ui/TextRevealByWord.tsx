import { FC, ReactNode, useRef, useEffect, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "../../utils/cn";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.6", "end 0.1"]
  });
  const words = text.split(" ");

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor animation progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.95) {
        setAnimationComplete(true);
      } else {
        setAnimationComplete(false);
      }
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Apply scroll behavior based on animation state
  useEffect(() => {
    if (isMobile) {
      const container = targetRef.current;
      if (container && !animationComplete) {
        container.style.scrollSnapType = 'y mandatory';
        container.style.scrollSnapAlign = 'start';
      } else if (container) {
        container.style.scrollSnapType = '';
        container.style.scrollSnapAlign = '';
      }
    }
  }, [isMobile, animationComplete]);

  return (
    <div
      ref={targetRef}
      className={cn(
        "relative z-0 h-[80vh] md:h-[120vh]",
        isMobile && !animationComplete ? "md:snap-start md:snap-mandatory" : "",
        className
      )}
      style={{
        scrollSnapType: isMobile && !animationComplete ? 'y mandatory' : 'none',
      }}
    >
      <div
        className={cn(
          "sticky mx-auto flex max-w-7xl items-center bg-transparent px-4 lg:px-8 py-0",
          isMobile
            ? "top-[10vh] h-[80vh] snap-start"
            : "top-[50px] h-[50%]"
        )}
      >
        <p
          className={
            "flex flex-wrap p-5 text-2xl font-bold text-gray-300 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30 text-gray-400"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export { TextRevealByWord };