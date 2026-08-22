import { motion } from 'framer-motion';
import { Zap, Lock, Brain, Network, ShieldCheck, ChevronRight } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { MagneticButton } from '@/components/ui/MagneticButton';

/** Props for the LandingPage component. */
interface LandingPageProps {
  onLaunch: () => void;
}

const FLOATERS = [
  { size: 120, top: '12%', left: '8%', color: 'rgba(34,168,255,0.5)', shape: 'cube', anim: 'float' },
  { size: 90, top: '22%', left: '82%', color: 'rgba(143,255,60,0.45)', shape: 'tri', anim: 'float-slow' },
  { size: 70, top: '68%', left: '14%', color: 'rgba(255,106,26,0.4)', shape: 'ring', anim: 'float-slow' },
  { size: 110, top: '72%', left: '76%', color: 'rgba(120,150,255,0.4)', shape: 'cube', anim: 'float' },
  { size: 50, top: '45%', left: '48%', color: 'rgba(34,168,255,0.3)', shape: 'tri', anim: 'float-slow' },
  { size: 60, top: '8%', left: '55%', color: 'rgba(143,255,60,0.3)', shape: 'ring', anim: 'float' },
];

function FloatingShape({ f, mx, my }: { f: typeof FLOATERS[0]; mx: number; my: number }) {
  const dx = (mx - 0.5) * 40;
  const dy = (my - 0.5) * 40;

  let shape;
  if (f.shape === 'cube') {
    shape = (
      <div
        className="animate-spin-slow"
        style={{
          width: f.size,
          height: f.size,
          border: `2px solid ${f.color}`,
          borderRadius: '14px',
          transformStyle: 'preserve-3d',
          transform: 'perspective(400px) rotateX(18deg) rotateY(24deg)',
          boxShadow: `0 0 30px ${f.color}, inset 0 0 20px ${f.color}`,
        }}
      />
    );
  } else if (f.shape === 'tri') {
    shape = (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${f.size / 2}px solid transparent`,
          borderRight: `${f.size / 2}px solid transparent`,
          borderBottom: `${f.size}px solid ${f.color}`,
          filter: `drop-shadow(0 0 16px ${f.color})`,
          opacity: 0.7,
        }}
      />
    );
  } else {
    shape = (
      <div
        style={{
          width: f.size,
          height: f.size,
          border: `2px solid ${f.color}`,
          borderRadius: '999px',
          boxShadow: `0 0 24px ${f.color}, inset 0 0 16px ${f.color}`,
        }}
      />
    );
  }

  return (
    <div
      className={`absolute pointer-events-none animate-${f.anim}`}
      style={{ top: f.top, left: f.left, transform: `translate(${dx}px, ${dy}px)`, transition: 'transform 0.4s ease-out' }}
    >
      {shape}
    </div>
  );
}

/**
 * LandingPage — cinematic full-screen hero with mouse-reactive mesh,
 * floating 3D geometric shapes, and the CTA that launches the dashboard.
 *
 * Props:
 *   - onLaunch: callback fired when the user clicks "Launch ThinkSquad OS".
 *
 * State flow: this component is stateless; all interactivity is delegated
 * to the parent App via `onLaunch`. Mouse position is tracked via the
 * `useMousePosition` hook to drive the reactive radial gradient and the
 * parallax offset of the floating shapes.
 */
export function LandingPage({ onLaunch }: LandingPageProps) {
  const { x: mx, y: my } = useMousePosition();
  const meshX = mx * 100;
  const meshY = my * 100;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink-900" role="banner">
      {/* Dotted technical grid */}
      <div className="absolute inset-0 dotted-grid opacity-60" />

      {/* Mouse-reactive radial gradient mesh */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${meshX}% ${meshY}%, rgba(34,168,255,0.22), transparent 45%), radial-gradient(500px circle at ${100 - meshX}% ${100 - meshY}%, rgba(143,255,60,0.14), transparent 45%)`,
        }}
      />
      <div className="absolute inset-0 mesh-bg opacity-70" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900" />

      {/* Floating shapes */}
      {FLOATERS.map((f, i) => (
        <FloatingShape key={i} f={f} mx={mx} my={my} />
      ))}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
          </span>
          <span className="text-xs font-medium tracking-wide text-slate-300">
            Campus &amp; Exam Intelligence OS
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-400 to-cyber-600 shadow-glow">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">
            ThinkSquad<span className="text-cyber-400"> AI</span>
          </span>
        </motion.div>

        {/* Hero headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl text-center font-display text-5xl font-bold leading-[1.05] tracking-tight text-white text-balance md:text-7xl"
        >
          The <span className="gradient-text">Anti-Cheat Socratic</span>
          <br />
          &amp; Team Intelligence Engine
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-2xl text-center text-lg text-slate-400 text-balance md:text-xl"
        >
          Eradicating free-riders in group projects, fixing exam blind spots, and
          mapping prerequisite knowledge.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10"
        >
          <MagneticButton
            onClick={onLaunch}
            aria-label="Launch ThinkSquad OS dashboard"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyber-400 to-cyber-600 px-8 py-4 text-base font-semibold text-white shadow-glow"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="h-5 w-5 fill-white" />
              Launch ThinkSquad OS
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 shimmer-border animate-shimmer" />
          </MagneticButton>
        </motion.div>

        {/* Feature pills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          aria-label="Platform features"
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            { icon: Lock, label: 'Socratic Vault', desc: 'Anti-cheat step hints', color: 'text-cyber-300' },
            { icon: ShieldCheck, label: 'Ghostbusters', desc: 'Free-rider forensics', color: 'text-lime-400' },
            { icon: Network, label: 'Dependency Graph', desc: 'Prerequisite mapping', color: 'text-ember-400' },
          ].map((feat) => (
            <div key={feat.label} className="glass glass-hover flex items-center gap-3 rounded-xl px-4 py-3">
              <feat.icon className={`h-5 w-5 ${feat.color}`} />
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{feat.label}</div>
                <div className="text-xs text-slate-400">{feat.desc}</div>
              </div>
            </div>
          ))}
        </motion.section>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-slate-500"
      >
        No API keys required · Self-contained demo
      </motion.div>
    </div>
  );
}
