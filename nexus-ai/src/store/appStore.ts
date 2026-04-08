'use client';
import { create } from 'zustand';
import type { AppTab, ChatMessage, AIModel, Agent, OnboardPhase } from '@/types';
import { MODELS } from '@/data/models';

interface AppState {
  // ── Navigation ──────────────────────────────────────────────
  view: 'landing' | 'app';
  activeTab: AppTab;
  isLoggedIn: boolean;
  pendingTab: AppTab | null;

  // ── Modals ───────────────────────────────────────────────────
  loginModalOpen: boolean;
  modelModalOpen: boolean;
  modelModalId: string | null;
  modelModalTab: string;
  agentFlowOpen: boolean;
  agentLibOpen: boolean;

  // ── Toast ────────────────────────────────────────────────────
  toastMsg: string;
  toastVisible: boolean;

  // ── Chat State ───────────────────────────────────────────────
  messages: ChatMessage[];
  onboardPhase: OnboardPhase;
  obDone: boolean;
  currentModelId: string;
  userGoal: string;
  userAudience: string;
  userLevel: string;
  userBudget: string;
  suggestions: string[];
  pendingRecs: AIModel[];
  prepopPrompt: string;
  disabledCardIds: string[];

  // ── Agents ───────────────────────────────────────────────────
  myAgents: Agent[];
  activeAgentIndex: number | null;
  agentChatOpen: boolean;

  // ── Language ─────────────────────────────────────────────────
  langCode: string;
  langLabel: string;
  langMenuOpen: boolean;

  // ── Actions ───────────────────────────────────────────────────
  setView: (v: 'landing' | 'app') => void;
  setActiveTab: (t: AppTab) => void;
  switchTab: (t: AppTab) => void;
  openApp: (tab: AppTab) => void;
  goHome: () => void;

  showLoginModal: () => void;
  closeLoginModal: () => void;
  handleLogin: () => void;

  openModelModal: (id: string, tab?: string) => void;
  closeModelModal: () => void;

  showToast: (msg: string) => void;

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setOnboardPhase: (p: OnboardPhase) => void;
  setObDone: (v: boolean) => void;
  selectModel: (id: string) => void;
  setSuggestions: (chips: string[]) => void;
  setUserGoal: (v: string) => void;
  setUserAudience: (v: string) => void;
  setUserLevel: (v: string) => void;
  setUserBudget: (v: string) => void;
  setPrepopPrompt: (v: string) => void;
  disableCard: (id: string) => void;

  openAgentFlow: () => void;
  closeAgentFlow: () => void;
  openAgentLib: () => void;
  closeAgentLib: () => void;
  addAgent: (agent: Agent) => void;
  setActiveAgent: (idx: number | null) => void;
  openAgentChat: (idx: number) => void;
  closeAgentChat: () => void;

  setLang: (code: string, label: string) => void;
  toggleLangMenu: () => void;
  closeLangMenu: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'landing',
  activeTab: 'chat',
  isLoggedIn: false,
  pendingTab: null,

  loginModalOpen: false,
  modelModalOpen: false,
  modelModalId: null,
  modelModalTab: 'overview',
  agentFlowOpen: false,
  agentLibOpen: false,

  toastMsg: '',
  toastVisible: false,

  messages: [],
  onboardPhase: 'start',
  obDone: false,
  currentModelId: 'gpt5',
  userGoal: '',
  userAudience: '',
  userLevel: '',
  userBudget: '',
  suggestions: ['Show me popular models', 'What can AI do?', 'Compare models', 'Browse marketplace'],
  pendingRecs: [],
  prepopPrompt: '',
  disabledCardIds: [],

  myAgents: [
    {
      id: 'default-my-agent',
      name: 'My Agent',
      icon: '🤖',
      iconBg: '#EBF0FC',
      purpose: 'A powerful AI agent ready to help with anything.',
      tools: [],
      memory: 'short',
      model: 'GPT-5',
      detail: 'Your default AI agent. Customize it or create new ones for specific tasks.',
      createdAt: Date.now(),
    }
  ],
  activeAgentIndex: null,
  agentChatOpen: false,

  langCode: 'EN',
  langLabel: 'English',
  langMenuOpen: false,

  setView: (v) => set({ view: v }),
  setActiveTab: (t) => set({ activeTab: t }),
  switchTab: (t) => set({ activeTab: t }),

  openApp: (tab) => {
    const { isLoggedIn } = get();
    if (!isLoggedIn) {
      set({ loginModalOpen: true, pendingTab: tab });
      return;
    }
    set({ view: 'app', activeTab: tab });
  },

  goHome: () => set({ view: 'landing', obDone: false }),

  showLoginModal: () => set({ loginModalOpen: true }),
  closeLoginModal: () => set({ loginModalOpen: false }),
  handleLogin: () => {
    const { pendingTab } = get();
    set({ isLoggedIn: true, loginModalOpen: false });
    setTimeout(() => {
      const tab = pendingTab || 'chat';
      set({ view: 'app', activeTab: tab, pendingTab: null });
    }, 400);
    get().showToast('✅ Welcome to NexusAI!');
  },

  openModelModal: (id, tab = 'overview') => set({ modelModalOpen: true, modelModalId: id, modelModalTab: tab }),
  closeModelModal: () => set({ modelModalOpen: false }),

  showToast: (msg) => {
    set({ toastMsg: msg, toastVisible: true });
    setTimeout(() => set({ toastVisible: false }), 3000);
  },

  addMessage: (msg) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, newMsg] }));
  },
  clearMessages: () => set({ messages: [] }),
  setOnboardPhase: (p) => set({ onboardPhase: p }),
  setObDone: (v) => set({ obDone: v }),
  selectModel: (id) => {
    const m = MODELS.find((x) => x.id === id);
    if (!m) return;
    set({ currentModelId: id });
    get().showToast(`✦ ${m.name} selected — start typing your prompt below`);
  },
  setSuggestions: (chips) => set({ suggestions: chips }),
  setUserGoal: (v) => set({ userGoal: v }),
  setUserAudience: (v) => set({ userAudience: v }),
  setUserLevel: (v) => set({ userLevel: v }),
  setUserBudget: (v) => set({ userBudget: v }),
  setPrepopPrompt: (v) => set({ prepopPrompt: v }),
  disableCard: (id) => set((s) => ({ disabledCardIds: [...s.disabledCardIds, id] })),

  openAgentFlow: () => set({ agentFlowOpen: true }),
  closeAgentFlow: () => set({ agentFlowOpen: false }),
  openAgentLib: () => set({ agentLibOpen: true }),
  closeAgentLib: () => set({ agentLibOpen: false }),
  addAgent: (agent) => set((s) => ({ myAgents: [...s.myAgents, agent] })),
  setActiveAgent: (idx) => set({ activeAgentIndex: idx }),
  openAgentChat: (idx) => set({ activeAgentIndex: idx, agentChatOpen: true }),
  closeAgentChat: () => set({ agentChatOpen: false }),

  setLang: (code, label) => set({ langCode: code, langLabel: label, langMenuOpen: false }),
  toggleLangMenu: () => set((s) => ({ langMenuOpen: !s.langMenuOpen })),
  closeLangMenu: () => set({ langMenuOpen: false }),
}));
