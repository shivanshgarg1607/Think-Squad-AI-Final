import type { ReactNode } from 'react';

/** Props for the GlassCard component. */
interface GlassCardProps {
  /** Card content. */
  children: ReactNode;
  /** Optional extra Tailwind classes. */
  className?: string;
  /** Enable the magnetic hover lift effect (default true). */
  hover?: boolean;
}

/**
 * GlassCard — glassmorphism container with backdrop blur + subtle border.
 *
 * A thin presentational wrapper that applies the `.glass` utility class
 * (backdrop-blur, semi-transparent surface, 1px border) and an optional
 * `.glass-hover` lift. Used by every module tab as the base surface.
 */
export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl ${hover ? 'glass-hover' : ''} ${className}`}
      role="region"
    >
      {children}
    </div>
  );
}
