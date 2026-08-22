import { motion, type HTMLMotionProps } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/** Props for MagneticButton, extending Framer Motion's button props. */
interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  /** Button content. */
  children: ReactNode;
  /** How strongly the button offsets toward the cursor (0–1, default 0.4). */
  strength?: number;
}

/**
 * MagneticButton — button that subtly pulls toward the cursor on hover.
 *
 * Uses a ref + inline transform on mousemove (not Framer Motion state) for
 * zero-rerender performance. The spring transition is applied via Framer
 * Motion's `motion.button` so the button snaps back smoothly on mouse leave.
 */
export function MagneticButton({
  children,
  strength = 0.4,
  className = '',
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className={`relative cursor-pointer transition-transform duration-200 ease-out ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
