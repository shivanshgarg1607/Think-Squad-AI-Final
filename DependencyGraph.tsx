import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  Clock,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GRAPH_NODES, GRAPH_EDGES } from '@/data/mockDatabase';
import type { GraphNode } from '@/types';

/** Props for the DependencyGraph module. */
interface DependencyGraphProps {
  /** When true, nodes animate in and the learning-path strip appears. */
  demoLoaded: boolean;
}

const TIER_LABELS = ['Foundations', 'Intermediate', 'Advanced'];
const TIER_COLORS = ['lime', 'cyber', 'ember'];

/**
 * DependencyGraph — Module 3: prerequisite knowledge mapping engine.
 *
 * Renders a tiered SVG flowchart (Foundations → Intermediate → Advanced)
 * with clickable nodes. Clicking a node selects it, reveals its 30-second
 * summary in the side panel, and unlocks it if all prerequisites are met.
 *
 * State:
 *   - selectedNode: the currently highlighted node (drives the summary panel).
 *   - unlocked:     Set of node IDs that have been unlocked by the user.
 *
 * Unlock logic: a node is clickable only when `node.deps` is a subset of
 * `unlocked`. The progress bar tracks unlocked / total nodes.
 */
export function DependencyGraph({ demoLoaded }: DependencyGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(
    new Set(GRAPH_NODES.filter((n) => n.unlocked).map((n) => n.id))
  );

  const canUnlock = (node: GraphNode) =>
    node.deps.every((dep) => unlocked.has(dep));

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    if (canUnlock(node) && !unlocked.has(node.id)) {
      setUnlocked((prev) => new Set(prev).add(node.id));
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Dependency Graph module">
      {/* Section header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-ember-400" />
          <h2 className="font-display text-2xl font-bold text-white">Dependency Graph</h2>
          <span className="rounded-full border border-ember-400/30 bg-ember-400/10 px-2.5 py-0.5 text-xs font-medium text-ember-300">
            Prerequisite Mapping
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Visualize prerequisite chains before you hit a learning wall. Click a node to unlock it and read a 30-second summary.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {TIER_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                TIER_COLORS[i] === 'lime'
                  ? 'bg-lime-400'
                  : TIER_COLORS[i] === 'cyber'
                  ? 'bg-cyber-400'
                  : 'bg-ember-400'
              }`}
            />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Unlock className="h-3.5 w-3.5 text-lime-400" />
          <span className="text-xs text-slate-400">Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Locked (click to unlock)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Graph canvas */}
        <GlassCard hover={false} className="lg:col-span-2 p-4 md:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Knowledge Flowchart</span>
          </div>

          {/* SVG flowchart */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/5 bg-ink-800/40">
            {/* Tier guide lines */}
            {[0, 1, 2].map((tier) => (
              <div
                key={tier}
                className="absolute left-0 right-0 border-t border-dashed border-white/5"
                style={{ top: `${tier === 0 ? 80 : tier === 1 ? 50 : 24}%` }}
              >
                <span className="absolute left-2 -top-2.5 bg-ink-800/80 px-1.5 text-[10px] uppercase tracking-wide text-slate-500">
                  {TIER_LABELS[tier]}
                </span>
              </div>
            ))}

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 75" preserveAspectRatio="none">
              {/* Edges */}
              {GRAPH_EDGES.map((edge, i) => {
                const from = GRAPH_NODES.find((n) => n.id === edge.from)!;
                const to = GRAPH_NODES.find((n) => n.id === edge.to)!;
                const bothUnlocked = unlocked.has(from.id) && unlocked.has(to.id);
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y * 0.75}
                    x2={to.x}
                    y2={to.y * 0.75}
                    stroke={bothUnlocked ? 'rgba(143,255,60,0.4)' : 'rgba(120,140,180,0.2)'}
                    strokeWidth="0.3"
                    strokeDasharray={bothUnlocked ? '0' : '1 1'}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {GRAPH_NODES.map((node) => {
              const isUnlocked = unlocked.has(node.id);
              const canClick = canUnlock(node);
              const tierColor =
                node.tier === 0 ? 'lime' : node.tier === 1 ? 'cyber' : 'ember';
              const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
                lime: { bg: 'bg-lime-400/15', border: 'border-lime-400/50', text: 'text-lime-300', glow: 'shadow-glow-lime' },
                cyber: { bg: 'bg-cyber-400/15', border: 'border-cyber-400/50', text: 'text-cyber-300', glow: 'shadow-glow' },
                ember: { bg: 'bg-ember-400/15', border: 'border-ember-400/50', text: 'text-ember-300', glow: 'shadow-glow' },
              };
              const c = colorMap[tierColor];
              const isSelected = selectedNode?.id === node.id;

              return (
                <motion.button
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  initial={demoLoaded ? { opacity: 0, scale: 0.5 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${node.label} — ${isUnlocked ? 'unlocked' : canClick ? 'click to unlock' : 'locked, prerequisites required'}`}
                  aria-pressed={isSelected}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isUnlocked
                      ? `${c.bg} ${c.border} ${c.text} ${c.glow} ${isSelected ? 'ring-2 ring-white/40' : ''}`
                      : `border-white/10 bg-ink-700/60 text-slate-500 ${canClick ? 'cursor-pointer hover:border-white/30' : 'cursor-not-allowed opacity-60'}`
                  }`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {isUnlocked ? (
                    <Unlock className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span className="hidden whitespace-nowrap sm:inline">{node.label}</span>
                  <span className="whitespace-nowrap sm:hidden">{node.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {unlocked.size} / {GRAPH_NODES.length} concepts unlocked
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-lime-400 to-cyber-400"
                initial={{ width: 0 }}
                animate={{ width: `${(unlocked.size / GRAPH_NODES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Concept summary panel */}
        <GlassCard hover={false} className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-ember-400" />
            <h3 className="font-display text-lg font-semibold text-white">30-Second Summary</h3>
          </div>

          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                {/* Node header */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      selectedNode.tier === 0
                        ? 'bg-lime-400/15 text-lime-300'
                        : selectedNode.tier === 1
                        ? 'bg-cyber-400/15 text-cyber-300'
                        : 'bg-ember-400/15 text-ember-300'
                    }`}
                  >
                    {unlocked.has(selectedNode.id) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold text-white">{selectedNode.label}</div>
                    <div className="text-xs text-slate-400">{TIER_LABELS[selectedNode.tier]}</div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4 rounded-xl border border-white/10 bg-ink-800/50 p-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-ember-400" />
                    <span className="text-xs font-medium text-ember-300">30-Second Concept</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{selectedNode.summary}</p>
                </div>

                {/* Prerequisites */}
                {selectedNode.deps.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Prerequisites
                    </div>
                    <div className="space-y-1.5">
                      {selectedNode.deps.map((depId) => {
                        const dep = GRAPH_NODES.find((n) => n.id === depId)!;
                        const depUnlocked = unlocked.has(depId);
                        return (
                          <div
                            key={depId}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                              depUnlocked
                                ? 'border-lime-400/20 bg-lime-400/5 text-lime-300'
                                : 'border-white/10 bg-white/[0.02] text-slate-500'
                            }`}
                          >
                            {depUnlocked ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Lock className="h-3.5 w-3.5" />
                            )}
                            {dep.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unlock status */}
                {!unlocked.has(selectedNode.id) && (
                  <div
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      canUnlock(selectedNode)
                        ? 'border border-lime-400/30 bg-lime-400/10 text-lime-300'
                        : 'border border-danger-400/30 bg-danger-400/10 text-danger-300'
                    }`}
                  >
                    {canUnlock(selectedNode) ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Prerequisites met — unlocked!
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        Complete prerequisites first
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[200px] flex-col items-center justify-center text-center"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Network className="h-7 w-7 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">
                  Click any node in the graph to reveal its 30-second concept summary.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* Learning path suggestion */}
      {demoLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard hover={false} className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-cyber-400" />
              <span className="text-sm font-semibold text-white">Recommended Learning Path</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {GRAPH_NODES.filter((n) => n.unlocked).map((n, i, arr) => (
                <div key={n.id} className="flex items-center gap-2">
                  <span className="rounded-lg border border-lime-400/20 bg-lime-400/5 px-2.5 py-1 text-xs font-medium text-lime-300">
                    {n.label}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-500" />}
                </div>
              ))}
              {GRAPH_NODES.filter((n) => !n.unlocked && n.deps.every((d) => unlocked.has(d))).map((n) => (
                <div key={n.id} className="flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  <span className="rounded-lg border border-ember-400/30 bg-ember-400/10 px-2.5 py-1 text-xs font-medium text-ember-300">
                    {n.label} (next)
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
