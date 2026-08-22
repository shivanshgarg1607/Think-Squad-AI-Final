// ============================================================
// ThinkSquad AI — Core Type Definitions
// Centralized type contracts for all data models across modules.
// ============================================================

// ---------- Shared primitives ----------

/** Risk classification used across team forensics and dependency nodes. */
export type RiskLevel = 'low' | 'medium' | 'high';

/** Color ramp identifiers mapped to Tailwind custom colors. */
export type ColorRamp = 'ember' | 'danger' | 'cyber' | 'lime';

// ---------- Module 1: Collab StepGuard ----------

/** A single Socratic step in the guided reasoning vault. */
export interface SocraticStep {
  id: number;
  question: string;
  hint: string;
  revealed: boolean;
}

/** Telemetry for one team member used in Ghostbusters forensics. */
export interface TeamMember {
  name: string;
  role: string;
  /** Contribution percentage 0–100. */
  contribution: number;
  commits: number;
  tasksCompleted: number;
  /** Human-readable relative time, e.g. "4 days ago". */
  lastActive: string;
  riskLevel: RiskLevel;
  /** Behavioral flags surfaced by the forensics engine. */
  flags: string[];
  /** Hex color used for the avatar background. */
  avatarColor: string;
}

/** Aggregate team risk score (0–100). */
export interface AuditScore {
  teamRisk: number;
  totalCommits: number;
  totalTasks: number;
}

// ---------- Module 2: BlindSpot Forensics ----------

/** Icon key for a blind-spot stat card. */
export type BlindSpotIcon = 'calculator' | 'brain' | 'clock';

/** Root-cause category assigned by the error categorization engine. */
export type ErrorCategory = 'Calculation slip' | 'Conceptual gap' | 'Time trap';

/** A sub-category breakdown entry within a blind-spot stat card. */
export interface BreakdownEntry {
  sub: string;
  /** Percentage 0–100. */
  pct: number;
}

/** Aggregate diagnostic stat for one error category. */
export interface BlindSpotStat {
  id: string;
  label: string;
  count: number;
  /** Delta vs. previous exam cycle (negative = improvement). */
  delta: number;
  icon: BlindSpotIcon;
  color: ColorRamp;
  breakdown: BreakdownEntry[];
}

/** A single logged exam error with AI-generated root cause. */
export interface ErrorLogEntry {
  id: number;
  topic: string;
  question: string;
  category: ErrorCategory;
  rootCause: string;
  /** AI confidence 0–100. */
  confidence: number;
  /** Human-readable time label. */
  time: string;
}

// ---------- Module 3: Dependency Graph ----------

/** Knowledge tier: 0 = foundation, 1 = intermediate, 2 = advanced. */
export type KnowledgeTier = 0 | 1 | 2;

/** A node in the prerequisite dependency graph. */
export interface GraphNode {
  id: string;
  label: string;
  /** Horizontal position as percentage 0–100. */
  x: number;
  /** Vertical position as percentage 0–100. */
  y: number;
  tier: KnowledgeTier;
  unlocked: boolean;
  /** 30-second concept summary shown on node click. */
  summary: string;
  /** IDs of prerequisite nodes. */
  deps: string[];
}

/** A directed edge between two graph nodes. */
export interface GraphEdge {
  from: string;
  to: string;
}

// ---------- Module 4: System Telemetry ----------

/** A single telemetry signal displayed in the diagnostics drawer. */
export interface TelemetrySignal {
  /** Stable key used for React lists. */
  id: string;
  /** Human-readable label, e.g. "Mock Latency". */
  label: string;
  /** Current value with unit, e.g. "14ms". */
  value: string;
  /** Status indicator color. */
  status: 'online' | 'secured' | 'active' | 'standby';
  /** Optional secondary description. */
  description?: string;
}

/** A simulated team chat message for the free-rider forensics narrative. */
export interface TeamChatMessage {
  id: number;
  author: string;
  /** Hex avatar color matching the team member. */
  avatarColor: string;
  message: string;
  /** Human-readable relative timestamp. */
  timestamp: string;
  /** Whether this message is a flagged free-rider signal. */
  flagged: boolean;
}

// ---------- App-level types ----------

/** The three core module tabs. */
export type TabId = 'stepguard' | 'blindspot' | 'graph';

/** Top-level view state: cinematic landing or dashboard. */
export type AppView = 'landing' | 'dashboard';
