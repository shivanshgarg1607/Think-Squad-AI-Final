import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Calculator,
  Clock,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  ChevronRight,
  Zap,
  Target,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCountUp } from '@/hooks/useCountUp';
import { BLIND_SPOT_STATS, ERROR_LOG_ENTRIES } from '@/data/mockDatabase';
import { categorizeError, generateRootCause } from '@/utils/errorCategorizer';
import type { BlindSpotStat, ErrorLogEntry } from '@/types';

/** Props for the BlindSpotForensics module. */
interface BlindSpotForensicsProps {
  /** When true, metrics animate from zero via useCountUp. */
  demoLoaded: boolean;
}

const ICONS = { calculator: Calculator, brain: Brain, clock: Clock };
const COLOR_MAP = {
  ember: { text: 'text-ember-400', bg: 'bg-ember-400/10', border: 'border-ember-400/30', bar: 'bg-ember-400', glow: 'shadow-glow' },
  danger: { text: 'text-danger-400', bg: 'bg-danger-400/10', border: 'border-danger-400/30', bar: 'bg-danger-400', glow: 'shadow-glow-danger' },
  cyber: { text: 'text-cyber-300', bg: 'bg-cyber-400/10', border: 'border-cyber-400/30', bar: 'bg-cyber-400', glow: 'shadow-glow' },
  lime: { text: 'text-lime-400', bg: 'bg-lime-400/10', border: 'border-lime-400/30', bar: 'bg-lime-400', glow: 'shadow-glow-lime' },
};


/**
 * BlindSpotForensics — Module 2: diagnostic exam error analytics.
 *
 * Displays three stat cards (Calculation Slips, Conceptual Gaps, Time Traps)
 * with animated count-ups, trend deltas, and sub-category breakdown bars.
 *
 * Includes an interactive "Log Error" simulator: the student describes a
 * mistake in plain language, the fallback categorization engine in
 * `src/utils/errorCategorizer.ts` classifies the root cause, generates a
 * confidence-scored explanation, and prepends the entry to the live log.
 *
 * State:
 *   - log:         array of ErrorLogEntry, initialized from mock data.
 *   - errorInput:  free-text description in the log simulator.
 *   - topicInput:  optional subject label for the new entry.
 *   - justLogged:  last categorized entry, shown in the result panel.
 */
export function BlindSpotForensics({ demoLoaded }: BlindSpotForensicsProps) {
  const [log, setLog] = useState<ErrorLogEntry[]>(ERROR_LOG_ENTRIES);
  const [errorInput, setErrorInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [justLogged, setJustLogged] = useState<ErrorLogEntry | null>(null);

  const totalErrors = useCountUp(
    BLIND_SPOT_STATS.reduce((sum, s) => sum + s.count, 0),
    demoLoaded
  );

  const handleLogError = () => {
    if (!errorInput.trim()) return;
    const category = categorizeError(errorInput);
    const entry: ErrorLogEntry = {
      id: Date.now(),
      topic: topicInput.trim() || 'General',
      question: errorInput.trim(),
      category,
      rootCause: generateRootCause(errorInput, category),
      confidence: 75 + Math.floor(Math.random() * 22),
      time: 'just now',
    };
    setLog((prev) => [entry, ...prev]);
    setJustLogged(entry);
    setErrorInput('');
    setTopicInput('');
  };

  return (
    <div className="space-y-6" role="region" aria-label="BlindSpot Forensics module">
      {/* Section header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-danger-400" />
          <h2 className="font-display text-2xl font-bold text-white">BlindSpot Forensics</h2>
          <span className="rounded-full border border-danger-400/30 bg-danger-400/10 px-2.5 py-0.5 text-xs font-medium text-danger-300">
            Error Engine
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Break down every exam mistake by root cause — calculation slips, conceptual gaps, and time traps.
        </p>
      </div>

      {/* Summary strip */}
      <GlassCard hover={false} className="flex flex-wrap items-center gap-6 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-400/10">
            <Target className="h-6 w-6 text-danger-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Total Errors Logged</div>
            <div className="font-display text-2xl font-bold text-white">
              {demoLoaded ? Math.round(totalErrors) : '—'}
            </div>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-lime-400" />
          <span className="text-sm text-slate-300">
            <span className="font-semibold text-lime-400">-16 errors</span> vs last exam cycle
          </span>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-ember-400" />
          <span className="text-sm text-slate-300">
            Accuracy up <span className="font-semibold text-ember-400">+12%</span>
          </span>
        </div>
      </GlassCard>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {BLIND_SPOT_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} demoLoaded={demoLoaded} delay={i * 0.12} />
        ))}
      </div>

      {/* Log Error simulator + Error log */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Log simulator */}
        <GlassCard hover={false} className="lg:col-span-2 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-cyber-400" />
            <h3 className="font-display text-lg font-semibold text-white">Log Error Simulator</h3>
          </div>
          <p className="mb-4 text-sm text-slate-400">
            Describe a mistake you made. The engine instantly categorizes the root cause.
          </p>

          <div className="space-y-3">
            <input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Topic (e.g. Thermodynamics)"
              aria-label="Error topic input"
              className="w-full rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyber-400/50"
            />
            <textarea
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              placeholder="What went wrong? (e.g. 'I flipped the sign on the second term and got a negative velocity')"
              rows={4}
              aria-label="Error description input"
              className="w-full resize-none rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyber-400/50"
            />
            <button
              onClick={handleLogError}
              disabled={!errorInput.trim()}
              aria-label="Categorize root cause of the error"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-400 to-cyber-600 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:from-cyber-300 hover:to-cyber-500 disabled:opacity-40 disabled:shadow-none"
            >
              <Zap className="h-4 w-4 fill-white" />
              Categorize Root Cause
            </button>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {justLogged && (
              <motion.div
                key={justLogged.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4"
              >
                <div className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Root Cause Analysis</span>
                    <span className="font-mono text-xs text-slate-400">{justLogged.confidence}% confidence</span>
                  </div>
                  <div
                    className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      justLogged.category === 'Calculation slip'
                        ? 'bg-ember-400/10 text-ember-400'
                        : justLogged.category === 'Conceptual gap'
                        ? 'bg-danger-400/10 text-danger-400'
                        : 'bg-cyber-400/10 text-cyber-300'
                    }`}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {justLogged.category}
                  </div>
                  <p className="text-sm text-slate-200">{justLogged.rootCause}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Error log */}
        <GlassCard hover={false} className="lg:col-span-3 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-400" />
              <h3 className="font-display text-lg font-semibold text-white">Error Log</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
              {log.length} entries
            </span>
          </div>

          <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {log.map((entry) => (
                <ErrorLogRow key={entry.id} entry={entry} />
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/**
 * StatCard — renders one error-category diagnostic card.
 *
 * Shows the category icon, animated count, trend delta, and sub-category
 * breakdown bars. Color scheme is derived from `stat.color` via COLOR_MAP.
 */
function StatCard({ stat, demoLoaded, delay }: { stat: BlindSpotStat; demoLoaded: boolean; delay: number }) {
  const Icon = ICONS[stat.icon];
  const colors = COLOR_MAP[stat.color];
  const count = useCountUp(stat.count, demoLoaded);

  return (
    <motion.div
      initial={demoLoaded ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <GlassCard hover={false} className={`p-5 ${colors.glow}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg}`}>
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${stat.delta < 0 ? 'text-lime-400' : 'text-danger-400'}`}>
            {stat.delta < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {stat.delta}
          </div>
        </div>

        <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">{stat.label}</div>
        <div className={`font-display text-3xl font-bold ${colors.text}`}>
          {demoLoaded ? Math.round(count) : '—'}
        </div>

        {/* Breakdown bars */}
        <div className="mt-4 space-y-2">
          {stat.breakdown.map((b) => (
            <div key={b.sub}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">{b.sub}</span>
                <span className="font-mono text-slate-300">{demoLoaded ? `${b.pct}%` : '—'}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className={`h-full rounded-full ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: demoLoaded ? `${b.pct}%` : 0 }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * ErrorLogRow — one expandable row in the error log list.
 *
 * Collapsed state shows category badge, topic, question, and time.
 * Expanded state reveals the AI-generated root cause and confidence score.
 */
function ErrorLogRow({ entry }: { entry: ErrorLogEntry }) {
  const [expanded, setExpanded] = useState(false);

  const catColor =
    entry.category === 'Calculation slip'
      ? 'text-ember-400 bg-ember-400/10'
      : entry.category === 'Conceptual gap'
      ? 'text-danger-400 bg-danger-400/10'
      : 'text-cyber-300 bg-cyber-400/10';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
    >
      <button onClick={() => setExpanded((e) => !e)} className="flex w-full items-start justify-between gap-3 text-left" aria-label={`Expand error log entry: ${entry.topic}`} aria-expanded={expanded}>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catColor}`}>
              {entry.category}
            </span>
            <span className="text-xs text-slate-500">{entry.topic}</span>
          </div>
          <p className="text-sm text-slate-200">{entry.question}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{entry.time}</span>
          <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-ink-800/50 px-3 py-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyber-400" />
              <div>
                <div className="text-xs font-semibold text-cyber-300">Root Cause</div>
                <p className="text-xs text-slate-300">{entry.rootCause}</p>
                <div className="mt-1.5 font-mono text-[10px] text-slate-500">
                  AI confidence: {entry.confidence}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
