import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  X,
  Cpu,
  ShieldCheck,
  Lock,
  Radar,
  Network,
  FlaskConical,
  Signal,
} from 'lucide-react';
import type { TelemetrySignal } from '@/types';

interface TelemetryDrawerProps {
  open: boolean;
  onClose: () => void;
  signals: TelemetrySignal[];
}

const STATUS_CONFIG: Record<
  TelemetrySignal['status'],
  { color: string; dot: string; icon: typeof Signal }
> = {
  online: { color: 'text-lime-400', dot: 'bg-lime-400', icon: Signal },
  secured: { color: 'text-cyber-300', dot: 'bg-cyber-400', icon: Lock },
  active: { color: 'text-ember-300', dot: 'bg-ember-400', icon: FlaskConical },
  standby: { color: 'text-slate-400', dot: 'bg-slate-500', icon: Radar },
};

/**
 * TelemetryDrawer — futuristic slide-out diagnostics panel.
 *
 * Slides in from the right edge when the user clicks the "Engine Telemetry"
 * button in the dashboard header. Displays a live grid of system telemetry
 * signals (mock latency, multi-agent status, vault state, etc.) and a
 * simulated agent activity log.
 *
 * Props:
 *   - open:    whether the drawer is visible.
 *   - onClose: callback to close the drawer.
 *   - signals: array of TelemetrySignal objects from mockDatabase.ts.
 *
 * State flow: the drawer is stateless — visibility is controlled by the
 * parent Dashboard. Framer Motion handles the slide animation and the
 * backdrop fade.
 */
export function TelemetryDrawer({ open, onClose, signals }: TelemetryDrawerProps) {
  const onlineCount = signals.filter((s) => s.status === 'online' || s.status === 'active').length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label="Close telemetry drawer backdrop"
            className="fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[85vw] flex-col border-l border-white/10 bg-ink-800/95 backdrop-blur-2xl"
            aria-label="System diagnostics and engine telemetry"
            data-telemetry-drawer
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-400/20 to-cyber-600/20 ring-1 ring-cyber-400/30">
                  <Activity className="h-4 w-4 text-cyber-300" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400" />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">Engine Telemetry</h3>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {onlineCount} agents online · fallback mode
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close telemetry drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Signal grid */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                System Signals
              </div>
              <div className="space-y-2.5" data-telemetry-signals={signals.length}>
                {signals.map((signal) => {
                  const cfg = STATUS_CONFIG[signal.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={signal.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10"
                      data-signal-id={signal.id}
                      data-signal-status={signal.status}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ${cfg.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-medium text-slate-300">{signal.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${signal.status === 'online' || signal.status === 'active' ? 'animate-pulse' : ''}`} />
                          <span className={`font-mono text-xs font-semibold ${cfg.color}`}>{signal.value}</span>
                        </div>
                      </div>
                      {signal.description && (
                        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{signal.description}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Agent activity log */}
              <div className="mt-5 mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Agent Activity Log
              </div>
              <div className="space-y-2 font-mono text-[11px] text-slate-400">
                {[
                  { time: '00:00:14', msg: 'Socratic Guide → vault handshake OK', icon: ShieldCheck },
                  { time: '00:00:12', msg: 'Forensics Auditor → contribution scan complete', icon: Cpu },
                  { time: '00:00:08', msg: 'Knowledge Mapper → graph loaded (10 nodes)', icon: Network },
                  { time: '00:00:03', msg: 'Fallback engine → simulation mode active', icon: FlaskConical },
                ].map((entry) => (
                  <div key={entry.time} className="flex items-start gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                    <entry.icon className="mt-0.5 h-3 w-3 shrink-0 text-cyber-400" />
                    <span className="text-slate-600">{entry.time}</span>
                    <span className="text-slate-400">{entry.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-5 py-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>ThinkSquad AI · Engine v1.0</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
                  All systems operational
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
