import { useEffect, useRef, useState } from 'react';

/**
 * useMousePosition — returns normalized (0..1) pointer position relative to
 * the viewport. Powers the cursor-reactive radial-gradient mesh and the
 * parallax offset of floating shapes on the landing page.
 *
 * Uses a rAF-throttled mousemove listener to avoid excessive re-renders.
 * @returns `{ x, y }` each in the range 0..1.
 */
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setPos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
        rafRef.current = null;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return pos;
}
