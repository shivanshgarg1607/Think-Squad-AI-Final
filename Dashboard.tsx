import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Lock, Brain as BrainIcon, Network, Sparkles, Gauge } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { CollabStepGuard } from '@/components/tabs/CollabStepGuard';
import { BlindSpotForensics } from '@/components/tabs/BlindSpotForensics';
import { DependencyGraph } from '@/components/tabs/DependencyGraph';
import { SystemHealth } from '@/components/SystemHealth';
import { TelemetryDrawer } from '@/components/TelemetryDrawer';
import { TELEMETRY_SIGNALS } from '@/data/mockDatabase';
import type { TabId } from '@/types';

/**
 * Props for the Dashboard shell.
 */
interface DashboardProps {
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  demoLoaded: boolean;
  onLoadDemo: () => void;
}

const TABS: { id: TabId; label: string; icon: typeof Lock }[] = [
  { id: 'stepguard', label: 'Collab StepGuard', icon: Lock },
  { id: 'blindspot', label: 'BlindSpot Forensics', icon: BrainIcon },
  { id: 'graph', label: 'Dependency Graph', icon: Network },
];

/**
 * Dashboard — primary application shell after the landing page.
 *
 * Renders the sticky header (logo, tab switcher, demo-data loader), the
 * animated tab content area, and the SystemHealth footer. Tab switching
 * uses Framer Motion `layoutId` for a shared-element pill animation.
 *
 * Props:
 *   - activeTab:    currently selected module tab.
 *   - setActiveTab:  tab setter lifted to App so it survives view transitions.
 *   - demoLoaded:   when true, all modules animate their metrics from zero.
 *   - onLoadDemo:   triggers the fallback simulation data injection.
 */
export function Dashboard({ activeTab, setActiveTab, demoLoaded, onLoadDemo }: DashboardProps) {
  const [telemetryOpen, setTelemetryOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-ink-900" data-dashboard-shell>
      {/* Background layers */}
      <div className="absolute inset-0 dotted-grid opacity-30" />
      <div className="absolute inset-0 mesh-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 to-ink-900" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-400 to-cyber-600 shadow-glow">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                ThinkSquad<span className="text-cyber-400"> AI</span>
              </span>
            </div>

            {/* Tab switcher */}
            <nav aria-label="Module navigation" className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-label={`Switch to ${tab.label} tab`}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-400/20 to-cyber-600/20 ring-1 ring-cyber-400/40"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <tab.icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Telemetry toggle + Demo button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTelemetryOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-cyber-400/30 hover:text-white"
                aria-label="Open engine telemetry"
                data-telemetry-toggle
              >
                <Gauge className="h-4 w-4" />
                <span className="hidden sm:inline">Telemetry</span>
              </button>

              <MagneticButton
              onClick={onLoadDemo}
              disabled={demoLoaded}
              data-demo-loader
              aria-label={demoLoaded ? 'Demo data loaded' : 'Load judge demo data'}
              className={`group relative overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-all md:px-5 ${
                demoLoaded
                  ? 'border border-lime-400/30 bg-lime-400/10 text-lime-300'
                  : 'bg-gradient-to-r from-cyber-400 to-cyber-600 text-white shadow-glow'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {demoLoaded ? <Sparkles className="h-4 w-4" /> : <Zap className="h-4 w-4 fill-white" />}
                {demoLoaded ? 'Demo Data Loaded' : 'Load Judge Demo Data'}
              </span>
              {!demoLoaded && <span className="absolute inset-0 shimmer-border animate-shimmer" />}
            </MagneticButton>
            </div>
          </div>

          {/* Mobile tabs */}
          <nav aria-label="Module navigation (mobile)" className="flex items-center gap-1 overflow-x-auto px-4 pb-3 md:hidden no-scrollbar">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={`Switch to ${tab.label} tab`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    active ? 'bg-cyber-400/20 text-white ring-1 ring-cyber-400/40' : 'text-slate-400'
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>

        {/* Tab content */}
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'stepguard' && <CollabStepGuard demoLoaded={demoLoaded} />}
              {activeTab === 'blindspot' && <BlindSpotForensics demoLoaded={demoLoaded} />}
              {activeTab === 'graph' && <DependencyGraph demoLoaded={demoLoaded} />}
            </motion.div>
          </AnimatePresence>
        </main>
        <SystemHealth signals={TELEMETRY_SIGNALS} />
      </div>

      {/* Telemetry drawer */}
      <TelemetryDrawer
        open={telemetryOpen}
        onClose={() => setTelemetryOpen(false)}
        signals={TELEMETRY_SIGNALS}
      />
    </div>
  );
}
