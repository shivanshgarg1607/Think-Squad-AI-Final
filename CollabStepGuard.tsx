import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import {
  Lock,
  Unlock,
  KeyRound,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Ghost,
  GitCommit,
  ClipboardCheck,
  Clock,
  UserX,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { useCountUp } from '@/hooks/useCountUp';
import {
  TEAM_MEMBERS,
  TEAM_RISK_SCORE,
  SOCRATIC_STEPS,
} from '@/data/mockDatabase';
import type { SocraticStep, TeamMember } from '@/types';

/** Props for the CollabStepGuard module. */
interface CollabStepGuardProps {
  /** When true, metrics animate from zero via useCountUp. */
  demoLoaded: boolean;
}

/**
 * CollabStepGuard — Module 1: Socratic anti-cheat vault + Ghostbusters team forensics.
 *
 * Left panel: a locked solution card that stays blurred until the student
 * answers all guided Socratic steps in sequence. Each step accepts a
 * free-text reasoning input, offers a hint toggle, and can be manually
 * revealed (with an anti-cheat warning label).
 *
 * Right panel: an animated SVG risk gauge showing the team's free-rider
 * risk score, a pulsing slacker alert, aggregate commit/task counters,
 * and per-member contribution cards with behavioral flags.
 *
 * State:
 *   - steps:          local copy of SOCRATIC_STEPS (allows per-step reveal).
 *   - vaultUnlocked:   toggles the blur overlay on the solution card.
 *   - currentStep:    index of the active Socratic question.
 *   - stepInput:      current text in the reasoning input.
 *   - showHint:       whether the hint for the active step is visible.
 *   - answeredSteps:  Set of step IDs the student has submitted.
 */
export function CollabStepGuard({ demoLoaded }: CollabStepGuardProps) {
  const [steps, setSteps] = useState<SocraticStep[]>(SOCRATIC_STEPS);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepInput, setStepInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [answeredSteps, setAnsweredSteps] = useState<Set<number>>(new Set());

  const riskValue = useCountUp(TEAM_RISK_SCORE, demoLoaded);
  const totalCommits = useCountUp(90, demoLoaded);
  const totalTasks = useCountUp(23, demoLoaded);

  const activeStep = steps[currentStep];

  const handleSubmitStep = () => {
    if (!stepInput.trim() || !activeStep) return;
    setAnsweredSteps((prev) => new Set(prev).add(activeStep.id));
    setStepInput('');
    setShowHint(false);
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 400);
    }
  };

  const revealStep = (id: number) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, revealed: true } : s)));
  };

  return (
    <div className="space-y-6" role="region" aria-label="Collab StepGuard module">
      {/* Section header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-cyber-400" />
          <h2 className="font-display text-2xl font-bold text-white">Collab StepGuard</h2>
          <span className="rounded-full border border-cyber-400/30 bg-cyber-400/10 px-2.5 py-0.5 text-xs font-medium text-cyber-300">
            Socratic + Ghostbusters
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Lock the full solution behind guided questions. Detect free-riders before they sink the team.
        </p>
      </div>

        <section aria-label="Socratic vault and team forensics" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Socratic Vault */}
        <Tilt
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          glareEnable
          glareColor="rgba(34,168,255,0.18)"
          glarePosition="all"
          scale={1.01}
          className="h-full"
        >
          <GlassCard className="h-full p-6" hover={false}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-cyber-400" />
                <h3 className="font-display text-lg font-semibold text-white">The Socratic Vault</h3>
              </div>
              <button
                onClick={() => setVaultUnlocked((v) => !v)}
                aria-label={vaultUnlocked ? 'Lock the solution vault' : 'Reveal the solution vault'}
                aria-pressed={vaultUnlocked}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  vaultUnlocked
                    ? 'border-lime-400/40 bg-lime-400/10 text-lime-300'
                    : 'border-cyber-400/30 bg-cyber-400/10 text-cyber-300'
                }`}
              >
                {vaultUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {vaultUnlocked ? 'Solution Revealed' : 'Vault Locked'}
              </button>
            </div>

            {/* Locked solution card */}
            <div className="relative mb-5 overflow-hidden rounded-xl border border-white/10 bg-ink-800/60 p-5">
              <div className={`transition-all duration-500 ${vaultUnlocked ? 'blur-none' : 'blur-md'}`}>
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-lime-400" />
                  <span className="text-sm font-semibold text-white">Full Solution</span>
                </div>
                <p className="font-mono text-sm leading-relaxed text-slate-300">
                  {`function cacheLookup(key) {
  // O(1) hit path
  if (cache.has(key)) return cache.get(key);
  // miss → fall through to DB
  const val = await db.query(key);
  cache.set(key, val);
  return val;
}`}
                </p>
              </div>
              {!vaultUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-800/40">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-ring rounded-full bg-cyber-400/30" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyber-400/50 bg-ink-900/80">
                      <Lock className="h-6 w-6 text-cyber-400" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Answer all steps to unlock
                  </span>
                </div>
              )}
            </div>

            {/* Step progress */}
            <div className="mb-4 flex items-center gap-1.5">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    answeredSteps.has(s.id)
                      ? 'bg-lime-400'
                      : i === currentStep
                      ? 'bg-cyber-400'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            {/* Step input simulator */}
            <AnimatePresence mode="wait">
              {activeStep && (
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyber-400/20 text-xs font-bold text-cyber-300">
                      {currentStep + 1}
                    </span>
                    <p className="text-sm text-slate-200">{activeStep.question}</p>
                  </div>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 rounded-lg border border-ember-400/20 bg-ember-400/5 px-3 py-2"
                      >
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />
                        <span className="text-xs text-ember-300">{activeStep.hint}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2">
                    <input
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitStep()}
                      placeholder="Type your reasoning..."
                      aria-label="Socratic reasoning input"
                      className="flex-1 rounded-lg border border-white/10 bg-ink-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyber-400/50"
                    />
                    <button
                      onClick={() => setShowHint((h) => !h)}
                      className="rounded-lg border border-ember-400/30 bg-ember-400/10 px-3 py-2 text-ember-300 transition-colors hover:bg-ember-400/20"
                      title="Toggle hint"
                      aria-label={showHint ? 'Hide hint' : 'Show hint'}
                      aria-pressed={showHint}
                    >
                      {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={handleSubmitStep}
                      disabled={!stepInput.trim()}
                      aria-label="Submit reasoning answer"
                      className="rounded-lg bg-cyber-400/20 px-3 py-2 text-sm font-medium text-cyber-300 transition-colors hover:bg-cyber-400/30 disabled:opacity-40"
                    >
                      Submit
                    </button>
                  </div>

                  <button
                    onClick={() => revealStep(activeStep.id)}
                    className="text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
                    aria-label="Reveal this step without answering"
                  >
                    Reveal this step (breaks the Socratic chain)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {answeredSteps.size === steps.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-lg border border-lime-400/30 bg-lime-400/10 px-3 py-2"
              >
                <CheckCircle2 className="h-4 w-4 text-lime-400" />
                <span className="text-xs font-medium text-lime-300">
                  All steps answered — vault unlocked. You learned by reasoning, not copying.
                </span>
              </motion.div>
            )}
          </GlassCard>
        </Tilt>

        {/* RIGHT: Ghostbusters Team Forensics */}
        <Tilt
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          glareEnable
          glareColor="rgba(255,92,92,0.15)"
          glarePosition="all"
          scale={1.01}
          className="h-full"
        >
          <GlassCard className="h-full p-6" hover={false}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ghost className="h-5 w-5 text-danger-400" />
                <h3 className="font-display text-lg font-semibold text-white">Ghostbusters Team Forensics</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                4 members
              </span>
            </div>

            {/* Risk gauge + alert */}
            <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <RiskGauge value={riskValue} active={demoLoaded} size={170} />

              <div className="flex-1 space-y-3">
                {/* Slacker alert */}
                <motion.div
                  initial={demoLoaded ? { opacity: 0, scale: 0.9 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 rounded-lg border border-danger-400/40 bg-danger-400/10 px-3 py-2"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse text-danger-400" />
                  <div>
                    <span className="text-sm font-semibold text-danger-300">Slacker Alert: Aman R.</span>
                    <p className="text-xs text-slate-400">12% contribution · last active 4 days ago</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-xs text-slate-400">Total Commits</div>
                    <div className="font-display text-lg font-bold text-white">
                      {demoLoaded ? Math.round(totalCommits) : '—'}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <div className="text-xs text-slate-400">Tasks Done</div>
                    <div className="font-display text-lg font-bold text-white">
                      {demoLoaded ? Math.round(totalTasks) : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Member contribution cards */}
            <div className="space-y-2.5">
              {TEAM_MEMBERS.map((m, i) => (
                <MemberCard key={m.name} member={m} demoLoaded={demoLoaded} delay={i * 0.1} />
              ))}
            </div>
          </GlassCard>
        </Tilt>
      </section>
    </div>
  );
}

/**
 * MemberCard — renders one team member's contribution telemetry row.
 *
 * Shows avatar, name, role, animated contribution bar, commit/task counts,
 * last-active time, and behavioral flags. Risk level controls the card's
 * border and bar color (red / orange / green).
 */
function MemberCard({ member, demoLoaded, delay }: { member: TeamMember; demoLoaded: boolean; delay: number }) {
  const contribution = useCountUp(member.contribution, demoLoaded);
  const commits = useCountUp(member.commits, demoLoaded);
  const tasks = useCountUp(member.tasksCompleted, demoLoaded);

  const riskColor =
    member.riskLevel === 'high'
      ? 'border-danger-400/40 bg-danger-400/5'
      : member.riskLevel === 'medium'
      ? 'border-ember-400/30 bg-ember-400/5'
      : 'border-lime-400/20 bg-lime-400/5';

  const barColor =
    member.riskLevel === 'high' ? 'bg-danger-400' : member.riskLevel === 'medium' ? 'bg-ember-400' : 'bg-lime-400';

  return (
    <motion.div
      initial={demoLoaded ? { opacity: 0, x: 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`rounded-xl border ${riskColor} p-3`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: member.avatarColor }}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{member.name}</div>
            <div className="text-xs text-slate-400">{member.role}</div>
          </div>
        </div>
        {member.riskLevel === 'high' && (
          <span className="flex items-center gap-1 rounded-full bg-danger-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-danger-300">
            <UserX className="h-3 w-3" /> Free-Rider
          </span>
        )}
      </div>

      {/* Contribution bar */}
      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-400">Contribution</span>
          <span className="font-mono font-medium text-white">{demoLoaded ? `${Math.round(contribution)}%` : '—'}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: demoLoaded ? `${member.contribution}%` : 0 }}
            transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <GitCommit className="h-3 w-3" /> {demoLoaded ? Math.round(commits) : '—'} commits
        </span>
        <span className="flex items-center gap-1">
          <ClipboardCheck className="h-3 w-3" /> {demoLoaded ? Math.round(tasks) : '—'} tasks
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {member.lastActive}
        </span>
      </div>

      {/* Flags */}
      {demoLoaded && member.flags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {member.flags.map((flag, idx) => (
            <span
              key={idx}
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                member.riskLevel === 'high'
                  ? 'bg-danger-400/10 text-danger-300'
                  : 'bg-lime-400/10 text-lime-300'
              }`}
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
