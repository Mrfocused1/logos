import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Check, Loader2, SendHorizontal, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "./Button";

const DRAG_CONSTRAINTS = { left: 0, right: 310 };
const DRAG_THRESHOLD = 0.75;

const BUTTON_STATES = {
  initial: { width: "24rem" },
  completed: { width: "8rem" },
};

const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
};

type StatusIconProps = {
  status: string;
};

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<StatusIconProps["status"], JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    []
  );

  if (!iconMap[status]) return null;

  return (
    <motion.div
      key={crypto.randomUUID()}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  );
};

const useButtonStatus = (resolveTo: "success" | "error") => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = useCallback(() => {
    setStatus("loading");
    setTimeout(() => {
      setStatus(resolveTo);
    }, 2000);
  }, [resolveTo]);

  return { status, handleSubmit };
};

interface SlideButtonProps extends Omit<ButtonProps, 'size'> {
  onSlideComplete?: () => void;
}

const SlideButton = forwardRef<HTMLButtonElement, SlideButtonProps>(
  ({ className, onSlideComplete, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [keyboardProgress, setKeyboardProgress] = useState(0);
    const dragHandleRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { status, handleSubmit } = useButtonStatus("success");

    const dragX = useMotionValue(0);
    const springX = useSpring(dragX, ANIMATION_CONFIG.spring);
    const dragProgress = useTransform(
      dragX,
      [0, DRAG_CONSTRAINTS.right],
      [0, 1]
    );

    const handleDragStart = useCallback(() => {
      if (completed) return;
      setIsDragging(true);
    }, [completed]);

    const handleDragEnd = () => {
      if (completed) return;
      setIsDragging(false);

      const progress = dragProgress.get();
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true);
        handleSubmit();
        onSlideComplete?.();
      } else {
        dragX.set(0);
      }
    };

    // Click/Touch handler for track interaction
    const handleTrackInteraction = useCallback((clientX: number) => {
      if (completed || isDragging) return;

      const trackElement = containerRef.current;
      if (!trackElement) return;

      const rect = trackElement.getBoundingClientRect();
      const clickX = clientX - rect.left;

      // Calculate position relative to drag constraints
      const relativeX = Math.max(0, Math.min(clickX - 28, DRAG_CONSTRAINTS.right));

      dragX.set(relativeX);

      // Check if position would complete the action
      const progress = relativeX / DRAG_CONSTRAINTS.right;
      if (progress >= DRAG_THRESHOLD) {
        setCompleted(true);
        handleSubmit();
        onSlideComplete?.();
      }
    }, [completed, isDragging, dragX, handleSubmit, onSlideComplete]);

    const handleTrackClick = useCallback((event: React.MouseEvent) => {
      handleTrackInteraction(event.clientX);
    }, [handleTrackInteraction]);

    const handleTrackTouch = useCallback((event: React.TouchEvent) => {
      if (event.touches.length === 1) {
        handleTrackInteraction(event.touches[0].clientX);
      }
    }, [handleTrackInteraction]);

    const handleDrag = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (completed) return;
      const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right));
      dragX.set(newX);
    };

    const adjustedWidth = useTransform(dragX, (x) => x + 10);

    // Keyboard navigation handlers
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (completed) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          setKeyboardProgress(prev => {
            const newProgress = Math.min(prev + 10, 100);
            const newX = (newProgress / 100) * DRAG_CONSTRAINTS.right;
            dragX.set(newX);

            if (newProgress >= 75) {
              setCompleted(true);
              handleSubmit();
              onSlideComplete?.();
            }
            return newProgress;
          });
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          setKeyboardProgress(prev => {
            const newProgress = Math.max(prev - 10, 0);
            const newX = (newProgress / 100) * DRAG_CONSTRAINTS.right;
            dragX.set(newX);
            return newProgress;
          });
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          setCompleted(true);
          handleSubmit();
          onSlideComplete?.();
          break;

        case 'Home':
          event.preventDefault();
          setKeyboardProgress(0);
          dragX.set(0);
          break;

        case 'End':
          event.preventDefault();
          setKeyboardProgress(100);
          dragX.set(DRAG_CONSTRAINTS.right);
          setCompleted(true);
          handleSubmit();
          onSlideComplete?.();
          break;
      }
    }, [completed, dragX, handleSubmit, onSlideComplete]);

    const adjustedWidthKeyboard = useTransform(dragX, (x) => Math.max(x + 10, 10));

    return (
      <motion.div
        ref={containerRef}
        animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
        transition={ANIMATION_CONFIG.spring}
        className="relative flex h-14 items-center justify-center rounded-full bg-black shadow-lg focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-transparent cursor-pointer overflow-hidden select-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleTrackClick}
        onTouchStart={handleTrackTouch}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((dragProgress.get() || 0) * 100)}
        aria-label="Slide to complete payment - Click anywhere on track to jump, use arrow keys to move, Enter or Space to complete instantly"
      >
        {!completed && (
          <motion.div
            style={{
              width: adjustedWidth,
            }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"
          />
        )}

        {!completed && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white z-5 select-none">
            <span className="hidden sm:inline select-none">Slide to Pay → (or use arrow keys)</span>
            <span className="sm:hidden select-none">Slide to Pay →</span>
          </span>
        )}

        <AnimatePresence key={crypto.randomUUID()}>
          {!completed && (
            <motion.div
              ref={dragHandleRef}
              drag="x"
              dragConstraints={DRAG_CONSTRAINTS}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              style={{ x: dragX }}
              className="absolute left-2 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing select-none"
              whileDrag={{ scale: 1.1 }}
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                {...props}
                size="sm"
                className={cn(
                  "rounded-full h-12 w-12 glass text-white hover:text-white border border-white/30 backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300 pointer-events-none",
                  isDragging && "scale-110",
                  className
                )}
              >
                <SendHorizontal className="size-5 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence key={crypto.randomUUID()}>
          {completed && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                ref={ref}
                disabled={status === "loading"}
                {...props}
                className={cn(
                  "size-full rounded-full transition-all duration-300 bg-green-500 hover:bg-green-600 text-white",
                  className
                )}
              >
                <AnimatePresence key={crypto.randomUUID()} mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

SlideButton.displayName = "SlideButton";

export { SlideButton };