// ── AI Model ─────────────────────────────────────────────────────────
export interface AIModel {
  id: string;
  icon: string;           // emoji/icon character
  emoji?: string;         // alias for icon
  bg?: string;
  name: string;
  lab: string;
  labId?: string;
  org?: string;
  desc?: string;
  tagline?: string;       // short tagline (falls back to desc)
  tags: string[];
  badge?: 'hot' | 'new' | 'open' | '';
  badgeClass?: string;
  rating: number;
  reviews?: number;
  price: string;
  contextWindow?: string;
  types?: string[];
  price_start?: number;
  capabilities?: string[];
  guide?: string[];
}

// ── AI Lab ───────────────────────────────────────────────────────────
export interface AILab {
  id: string;
  name: string;
  icon?: string;
  emoji: string;
  color?: string;
  modelCount: number;
}

// ── Research Paper ───────────────────────────────────────────────────
export interface ResearchStat {
  v?: string;
  l?: string;
  value?: string;
  label?: string;
  icon?: string;
}

export interface ResearchPaper {
  id: string;
  date: string;
  org?: string;
  lab: string;
  category: string;
  tagLabel?: string;
  tagColor?: string;
  tagBg?: string;
  accentColor?: string;
  title: string;
  summary?: string;
  abstract: string;
  stats?: ResearchStat[];
  findings?: string[];
  models?: string[];
  authors?: string;
  published?: string;
  arxiv?: string;
  impact?: string;
  discussPrompt?: string;
}

// ── Model Variation ──────────────────────────────────────────────────
export interface ModelVariation {
  label: string;
  ctx: string;
  input: string;
  output: string;
  desc: string;
}

// ── Cap App ──────────────────────────────────────────────────────────
export interface CapApp {
  emoji: string;
  label: string;
  query: string;
  bg?: string;
  previewGradient?: string;
  previewHTML?: string;
}

// ── Agent ────────────────────────────────────────────────────────────
export interface Agent {
  id: string;
  name: string;
  icon?: string;
  emoji?: string;
  iconBg?: string;
  purpose?: string;
  systemPrompt?: string;
  tools: string[];
  memory?: string;
  model: string;
  detail?: string;
  createdAt?: number;
  desc?: string;
}

// ── Chat Message ─────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  recs?: AIModel[];
  stepCard?: { q: string; opts: string[] };
  isTyping?: boolean;
  timestamp: number;
}

// ── App Tab ──────────────────────────────────────────────────────────
export type AppTab = 'chat' | 'marketplace' | 'agents' | 'research';

// ── Onboard Phase ────────────────────────────────────────────────────
export type OnboardPhase = 'start' | 'goal' | 'audience' | 'level' | 'budget' | 'chat';

// ── Suggested Question ────────────────────────────────────────────────
export interface SuggestedQuestion {
  icon: string;
  text: string;
}
