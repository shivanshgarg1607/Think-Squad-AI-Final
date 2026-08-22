import { motion } from 'framer-motion';

/** Props for the RiskGauge component. */
interface RiskGaugeProps {
  /** Risk value 0–100. */
  value: number;
  /** When true, animates the arc from empty to `value`. */
  active: boolean;
  /** Pixel diameter of the gauge (default 200). */
  size?: number;
}

/**
 * RiskGauge — circular SVG gauge with animated arc + center percentage.
 *
 * The arc color shifts from lime (low risk) to ember (medium) to danger-red
 * (high) based on the `value` threshold. The arc animation is driven by
 * Framer Motion's `strokeDashoffset` transition and the center number fades
 * in after a 0.4s delay.
 */
export function RiskGauge({ value, active, size = 200 }: RiskGaugeProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = active ? c - (value / 100) * c : c;

  const hue = value >= 70 ? '#FF5C5C' : value >= 40 ? '#FF8A4C' : '#8FFF3C';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Free-rider risk score: ${active ? Math.round(value) + ' percent' : 'not loaded'}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hue} stopOpacity="0.4" />
            <stop offset="100%" stopColor={hue} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#riskGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${hue}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display text-4xl font-bold"
          style={{ color: hue }}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ delay: 0.4 }}
        >
          {active ? `${Math.round(value)}%` : '—'}
        </motion.span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
          Free-Rider Risk
        </span>
      </div>
    </div>
  );
}
