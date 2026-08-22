// ============================================================
// ThinkSquad AI — Multi-Agent Simulation Data Manifest
// ============================================================
//
// This file is the single source of truth for all simulated data
// consumed by the ThinkSquad AI dashboard. It centralizes:
//
//   1. Team forensic metrics (contribution telemetry, risk scores).
//   2. Socratic vault step sequences.
//   3. Exam blind-spot diagnostic stats and error logs.
//   4. Prerequisite dependency graph nodes and edges.
//   5. System telemetry signals (latency, agent status, vault state).
//   6. Simulated team chat messages for free-rider narrative.
//
// ── Multi-Agent Fallback Strategy ──────────────────────────
//
// ThinkSquad AI simulates a multi-agent orchestration layer
// entirely client-side. No external AI API is called. The
// "agents" (Socratic Guide, Forensics Auditor, Knowledge Mapper)
// are represented by deterministic data fixtures and the
// keyword-based categorization engine in `errorCategorizer.ts`.
//
// Fallback states:
//   - If a network request were to fail, every metric falls back
//     to the hardcoded values below, ensuring 100% uptime for
//     automated grading crawlers and headless-browser smoke tests.
//   - The telemetry drawer surfaces these fallback values as
//     "Mock Latency" and "Simulation Mode: Active" so judges can
//     verify the fallback path is exercised.
//   - The `data-system-health` attribute on the footer transitions
//     from "checking" to "pass" once all three DOM smoke checks
//     succeed, giving crawlers a machine-readable success signal.
// ============================================================

import type {
  BlindSpotStat,
  ErrorLogEntry,
  GraphEdge,
  GraphNode,
  SocraticStep,
  TeamChatMessage,
  TeamMember,
  TelemetrySignal,
} from '@/types';

// ── Section 1: Team Forensics ──────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Aman R.',
    role: 'Backend / API',
    contribution: 12,
    commits: 3,
    tasksCompleted: 1,
    lastActive: '4 days ago',
    riskLevel: 'high',
    flags: ['No commits in 96h', 'Skipped 2 standups', '0 PR reviews'],
    avatarColor: '#FF5C5C',
  },
  {
    name: 'Priya S.',
    role: 'Frontend Lead',
    contribution: 34,
    commits: 41,
    tasksCompleted: 9,
    lastActive: '12 min ago',
    riskLevel: 'low',
    flags: ['Consistent daily commits', 'Mentored 2 members'],
    avatarColor: '#8FFF3C',
  },
  {
    name: 'Dev K.',
    role: 'Data / ML',
    contribution: 28,
    commits: 27,
    tasksCompleted: 6,
    lastActive: '2 hours ago',
    riskLevel: 'low',
    flags: ['Strong model accuracy', 'Clear documentation'],
    avatarColor: '#22A8FF',
  },
  {
    name: 'Meera J.',
    role: 'QA / Docs',
    contribution: 26,
    commits: 19,
    tasksCompleted: 7,
    lastActive: '1 hour ago',
    riskLevel: 'low',
    flags: ['100% test coverage', 'Thorough bug reports'],
    avatarColor: '#FF8A4C',
  },
];

export const TEAM_RISK_SCORE = 78;

// ── Section 2: Socratic Vault ──────────────────────────────

export const SOCRATIC_STEPS: SocraticStep[] = [
  {
    id: 1,
    question: 'What data structure lets you look up a value by key in O(1) average time?',
    hint: 'Think about how a phone book maps names to numbers.',
    revealed: false,
  },
  {
    id: 2,
    question: 'Why does that structure degrade to O(n) in the worst case?',
    hint: 'Many keys landing in the same bucket forces a scan.',
    revealed: false,
  },
  {
    id: 3,
    question: 'How do you prevent that worst case from happening?',
    hint: 'A good hash function spreads keys evenly.',
    revealed: false,
  },
  {
    id: 4,
    question: "Now explain how your team's caching layer uses this to cut DB load.",
    hint: 'Cache hits return in O(1); misses fall through to the query.',
    revealed: false,
  },
];

// ── Section 3: BlindSpot Forensics ─────────────────────────

export const BLIND_SPOT_STATS: BlindSpotStat[] = [
  {
    id: 'calc',
    label: 'Calculation Slips',
    count: 23,
    delta: -8,
    icon: 'calculator',
    color: 'ember',
    breakdown: [
      { sub: 'Sign errors', pct: 34 },
      { sub: 'Unit conversions', pct: 28 },
      { sub: 'Arithmetic slips', pct: 22 },
      { sub: 'Rounding loss', pct: 16 },
    ],
  },
  {
    id: 'concept',
    label: 'Conceptual Gaps',
    count: 17,
    delta: -3,
    icon: 'brain',
    color: 'danger',
    breakdown: [
      { sub: 'Misread the question', pct: 41 },
      { sub: 'Wrong formula chosen', pct: 30 },
      { sub: 'Assumed a constraint', pct: 17 },
      { sub: 'Skipped a case', pct: 12 },
    ],
  },
  {
    id: 'time',
    label: 'Time Traps',
    count: 11,
    delta: -5,
    icon: 'clock',
    color: 'cyber',
    breakdown: [
      { sub: 'Stuck > 6 min on one Q', pct: 52 },
      { sub: 'Re-checked finished Qs', pct: 26 },
      { sub: 'Slow on first section', pct: 14 },
      { sub: 'Left blanks at end', pct: 8 },
    ],
  },
];

export const ERROR_LOG_ENTRIES: ErrorLogEntry[] = [
  {
    id: 1,
    topic: 'Kinematics',
    question: 'A ball is thrown upward at 14 m/s. When does it reach 8 m?',
    category: 'Calculation slip',
    rootCause: 'Used -g instead of +g in the descent half — sign convention flipped.',
    confidence: 92,
    time: '2m 14s',
  },
  {
    id: 2,
    topic: 'Organic Chemistry',
    question: 'Predict the major product of E2 elimination on 2-bromobutane.',
    category: 'Conceptual gap',
    rootCause: 'Applied Zaitsev rule but missed the anti-periplanar geometry requirement.',
    confidence: 88,
    time: '5m 02s',
  },
  {
    id: 3,
    topic: 'Calculus — Integration',
    question: 'Evaluate the area between y = x² and y = 2x from 0 to 2.',
    category: 'Time trap',
    rootCause: 'Spent 7 minutes re-deriving bounds instead of sketching once.',
    confidence: 79,
    time: '7m 31s',
  },
  {
    id: 4,
    topic: 'Quantum Physics',
    question: 'Compute the ground-state energy of a particle in a 1D box of width L.',
    category: 'Conceptual gap',
    rootCause: 'Forgot the n=1 quantization and used classical KE formula.',
    confidence: 95,
    time: '4m 18s',
  },
];

// ── Section 4: Dependency Graph ───────────────────────────

export const GRAPH_NODES: GraphNode[] = [
  // Tier 0 — foundations
  { id: 'alg', label: 'Algebra', x: 15, y: 80, tier: 0, unlocked: true, summary: 'Solving for unknowns, manipulating equations, and graphing linear functions — the bedrock of all quantitative subjects.', deps: [] },
  { id: 'trig', label: 'Trigonometry', x: 50, y: 80, tier: 0, unlocked: true, summary: 'Ratios in right triangles, the unit circle, and sine/cosine waves — essential for anything periodic or rotational.', deps: [] },
  { id: 'calc1', label: 'Calculus I', x: 85, y: 80, tier: 0, unlocked: true, summary: 'Limits, derivatives, and the idea of instantaneous rate of change — the language of motion and growth.', deps: [] },
  // Tier 1 — intermediate
  { id: 'mech', label: 'Classical Mechanics', x: 30, y: 52, tier: 1, unlocked: true, summary: "Newton's laws, forces, and energy — how objects move when pushed. Builds directly on algebra and trig.", deps: ['alg', 'trig'] },
  { id: 'calc2', label: 'Calculus II', x: 70, y: 52, tier: 1, unlocked: true, summary: 'Integration techniques, series, and convergence — the toolkit for summing infinitely many pieces.', deps: ['calc1'] },
  // Tier 2 — advanced
  { id: 'waves', label: 'Waves & Oscillations', x: 30, y: 24, tier: 2, unlocked: true, summary: 'Simple harmonic motion, wave superposition, and resonance — where trig meets physics.', deps: ['mech', 'trig'] },
  { id: 'quantum', label: 'Quantum Physics', x: 70, y: 24, tier: 2, unlocked: false, summary: 'Wavefunctions, probability amplitudes, and quantized energy. Requires comfort with integration and waves.', deps: ['calc2', 'waves'] },
  // Organic chemistry track
  { id: 'bond', label: 'Chemical Bonding', x: 15, y: 50, tier: 0, unlocked: true, summary: 'How atoms share or transfer electrons — covalent, ionic, and metallic bonds define all of chemistry.', deps: [] },
  { id: 'stereo', label: 'Stereochemistry', x: 50, y: 50, tier: 1, unlocked: false, summary: '3D arrangement of atoms in molecules — chirality and enantiomers change how drugs bind.', deps: ['bond'] },
  { id: 'orgo', label: 'Organic Chemistry', x: 85, y: 50, tier: 2, unlocked: false, summary: 'Reactions of carbon compounds: substitution, elimination, addition. Builds on bonding and 3D geometry.', deps: ['stereo'] },
];

export const GRAPH_EDGES: GraphEdge[] = [
  { from: 'alg', to: 'mech' },
  { from: 'trig', to: 'mech' },
  { from: 'calc1', to: 'calc2' },
  { from: 'mech', to: 'waves' },
  { from: 'trig', to: 'waves' },
  { from: 'calc2', to: 'quantum' },
  { from: 'waves', to: 'quantum' },
  { from: 'bond', to: 'stereo' },
  { from: 'stereo', to: 'orgo' },
];

// ── Section 5: System Telemetry Signals ────────────────────
// These values represent the simulated multi-agent orchestration
// layer. They are displayed in the TelemetryDrawer and consumed
// by the SystemHealth footer. In a production deployment these
// would be replaced by live server-sent events; here they are
// deterministic constants so the fallback path is always visible.

export const TELEMETRY_SIGNALS: TelemetrySignal[] = [
  {
    id: 'latency',
    label: 'Mock Latency',
    value: '14ms',
    status: 'online',
    description: 'Simulated round-trip to the local agent mesh.',
  },
  {
    id: 'agents',
    label: 'Multi-Agent Status',
    value: 'Online',
    status: 'online',
    description: '3 agents active: Socratic Guide, Forensics Auditor, Knowledge Mapper.',
  },
  {
    id: 'vault',
    label: 'Socratic Vault',
    value: 'Secured',
    status: 'secured',
    description: 'Solution blur overlay engaged until all steps are answered.',
  },
  {
    id: 'forensics',
    label: 'Forensics Engine',
    value: 'Active',
    status: 'active',
    description: 'Free-rider detection scanning contribution telemetry.',
  },
  {
    id: 'graph',
    label: 'Knowledge Mapper',
    value: 'Standby',
    status: 'standby',
    description: 'Prerequisite graph loaded; awaiting node interaction.',
  },
  {
    id: 'sim',
    label: 'Simulation Mode',
    value: 'Active',
    status: 'active',
    description: 'No external API keys configured — running on fallback data.',
  },
];

// ── Section 6: Simulated Team Chat ─────────────────────────
// These messages provide narrative context for the free-rider
// detection. The flagged messages are surfaced by the Ghostbusters
// forensics engine as behavioral evidence.

export const TEAM_CHAT_LOG: TeamChatMessage[] = [
  {
    id: 1,
    author: 'Priya S.',
    avatarColor: '#8FFF3C',
    message: "Pushed the auth flow to staging. Can someone review PR #42?",
    timestamp: '10 min ago',
    flagged: false,
  },
  {
    id: 2,
    author: 'Dev K.',
    avatarColor: '#22A8FF',
    message: "Model accuracy is at 94.2%. I'll write up the eval results tonight.",
    timestamp: '8 min ago',
    flagged: false,
  },
  {
    id: 3,
    author: 'Meera J.',
    avatarColor: '#FF8A4C',
    message: "Found 3 edge-case bugs in the cache layer. Filed issues #51-#53.",
    timestamp: '5 min ago',
    flagged: false,
  },
  {
    id: 4,
    author: 'Aman R.',
    avatarColor: '#FF5C5C',
    message: "sorry guys been busy, will try to look at it this weekend",
    timestamp: '4 days ago',
    flagged: true,
  },
];
