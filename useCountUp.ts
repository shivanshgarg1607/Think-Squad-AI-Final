import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — animates a number from 0 to `value` when `active` becomes true.
 *
 * Uses requestAnimationFrame with an ease-out cubic curve. When `active`
 * is false the display resets to 0 so the animation can replay from scratch.
 *
 * @param value    - target number to count up to.
 * @param active   - when true the animation runs; when false it resets.
 * @param duration - ms for the full count (default 1400).
 * @returns current animated display value.
 */
export function useCountUp(value: number, active: boolean, duration = 1400) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, active, duration]);

  return display;
}
