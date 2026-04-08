import type { AIModel } from '@/types';

export const MODELS: AIModel[] = [
  // ── OpenAI ──────────────────────────────────────────────────────────
  { id: 'gpt5',       icon: '🧠', bg: '#EEF2FD', name: 'GPT-5',        lab: 'OpenAI',    org: 'OpenAI',           desc: 'OpenAI flagship. Native agent use, advanced reasoning, 2M context.', tags: ['Flagship','Agents','Multimodal','Reasoning'], badge: 'hot',  badgeClass: 'badge-hot',  rating: 4.9, reviews: 4210, price: '$7.50/1M tk', types: ['language','vision','code'],            price_start: 7.5  },
  { id: 'gpt52',      icon: '🧠', bg: '#EEF2FD', name: 'GPT-5.2',      lab: 'OpenAI',    org: 'OpenAI',           desc: 'Mid-tier GPT-5 variant with improved instruction-following and multimodal support.', tags: ['Multimodal','Balanced','Instruction'], badge: 'new',  badgeClass: 'badge-new',  rating: 4.8, reviews: 2180, price: '$4/1M tk',    types: ['language','vision','code'],            price_start: 4    },
  { id: 'gpt5-turbo', icon: '⚡', bg: '#EEF2FD', name: 'GPT-5 Turbo',  lab: 'OpenAI',    org: 'OpenAI',           desc: 'Fast, cost-effective GPT-5 for high-volume deployments.', tags: ['Fast','Cost-Effective','High-Volume'], badge: 'hot',  badgeClass: 'badge-hot',  rating: 4.8, reviews: 3560, price: '$2.50/1M tk', types: ['language','vision','code'],            price_start: 2.5  },
  { id: 'gpt45',      icon: '🔮', bg: '#EEF2FD', name: 'GPT-4.5',      lab: 'OpenAI',    org: 'OpenAI',           desc: 'Bridging model with improved creativity and long-form generation.', tags: ['Creative','Long-form','Language'], badge: '',     badgeClass: '',           rating: 4.7, reviews: 1980, price: '$3/1M tk',    types: ['language','vision'],                   price_start: 3    },
  { id: 'gpt41',      icon: '💡', bg: '#EEF2FD', name: 'GPT-4.1',      lab: 'OpenAI',    org: 'OpenAI',           desc: 'Optimized for coding and instruction-following with 128K context.', tags: ['Code','Instructions','128K'], badge: '',     badgeClass: '',           rating: 4.7, reviews: 2310, price: '$2/1M tk',    types: ['language','code'],                     price_start: 2    },
  { id: 'gpt4o',      icon: '🌟', bg: '#EEF2FD', name: 'GPT-4o',       lab: 'OpenAI',    org: 'OpenAI',           desc: 'Multimodal flagship combining text, vision, and audio in one unified model.', tags: ['Multimodal','Vision','Audio','Coding'], badge: '',  badgeClass: '',           rating: 4.7, reviews: 5120, price: '$2.50/1M tk', types: ['language','vision','code'],            price_start: 2.5  },
  { id: 'o3',         icon: '🧩', bg: '#EEF2FD', name: 'o3',           lab: 'OpenAI',    org: 'OpenAI',           desc: 'Advanced reasoning model with chain-of-thought for complex tasks.', tags: ['Reasoning','Math','Science','Logic'], badge: 'hot',  badgeClass: 'badge-hot',  rating: 4.8, reviews: 1640, price: '$15/1M tk',   types: ['language','code'],                     price_start: 15   },
  { id: 'o4-mini',    icon: '⭐', bg: '#EEF2FD', name: 'o4-mini',      lab: 'OpenAI',    org: 'OpenAI',           desc: 'Latest compact reasoning model — best value for advanced chain-of-thought.', tags: ['Reasoning','Compact','Best Value'], badge: 'new',  badgeClass: 'badge-new',  rating: 4.7, reviews: 890,  price: '$1.10/1M tk', types: ['language','code'],                     price_start: 1.1  },

  // ── Anthropic ────────────────────────────────────────────────────────
  { id: 'claude-opus',    icon: '👑', bg: '#E2F5EF', name: 'Claude Opus 4.6',    lab: 'Anthropic', org: 'Anthropic', desc: 'Most intelligent Claude. Adaptive Thinking, 1M token context (beta), 128K max output, Extended Thinking.', tags: ['Agents','Coding','Extended Thinking','Agent Use'], badge: 'hot',  badgeClass: 'badge-hot',  rating: 4.9, reviews: 2240, price: '$5/1M tk',    types: ['language','code'], price_start: 5   },
  { id: 'claude-sonnet',  icon: '⚡', bg: '#E2F5EF', name: 'Claude Sonnet 4.6',  lab: 'Anthropic', org: 'Anthropic', desc: 'Best speed/intelligence balance. Adaptive Thinking, 1M context (beta), 64K max output.', tags: ['Balanced','Fast','Code','Extended Thinking'], badge: 'new',  badgeClass: 'badge-new',  rating: 4.8, reviews: 3180, price: '$3/1M tk',    types: ['language','code'], price_start: 3   },
  { id: 'claude-haiku',   icon: '🚀', bg: '#E2F5EF', name: 'Claude Haiku 4.5',   lab: 'Anthropic', org: 'Anthropic', desc: 'Fastest near-frontier model. Extended Thinking, 200K context, lowest cost at $1/$5 MTok.', tags: ['Fastest','Low Cost','Real-time'], badge: '',     badgeClass: '',           rating: 4.6, reviews: 1870, price: '$1/1M tk',    types: ['language','code'], price_start: 1   },

  // ── Google DeepMind ──────────────────────────────────────────────────
  { id: 'gemini31-pro',   icon: '🔬', bg: '#FDF5E0', name: 'Gemini 3.1 Pro',     lab: 'Google',    org: 'Google DeepMind', desc: 'Deep reasoning with up to 5M context and Thought Signatures. Best for long-context analysis.', tags: ['Deep Reasoning','5M Context','Thought Signatures'], badge: 'new', badgeClass: 'badge-new', rating: 4.7, reviews: 1450, price: '$2/1M tk',    types: ['language','vision'], price_start: 2    },
  { id: 'gemini25-pro',   icon: '💎', bg: '#FDF5E0', name: 'Gemini 2.5 Pro',     lab: 'Google',    org: 'Google DeepMind', desc: 'State-of-the-art reasoning with 1M context. SOTA on math, science, and coding benchmarks.', tags: ['SOTA','Reasoning','1M Context'], badge: 'hot', badgeClass: 'badge-hot', rating: 4.8, reviews: 2340, price: '$1.25/1M tk', types: ['language','vision','code'], price_start: 1.25 },
  { id: 'gemini3-flash',  icon: '⚡', bg: '#FDF5E0', name: 'Gemini 3 Flash',     lab: 'Google',    org: 'Google DeepMind', desc: 'High-volume chat and coding with sub-second latency and 1M context.', tags: ['Fast','1M Context','Chat','Coding'], badge: 'hot', badgeClass: 'badge-hot', rating: 4.5, reviews: 1890, price: '$0.50/1M tk', types: ['language','vision'], price_start: 0.5  },
  { id: 'gemini31-flash-lite', icon: '💡', bg: '#FDF5E0', name: 'Gemini 3.1 Flash-Lite', lab: 'Google', org: 'Google DeepMind', desc: 'Low-cost agents, translation, and classification at massive scale.', tags: ['Budget','Agents','Translation'], badge: '', badgeClass: '', rating: 4.4, reviews: 1560, price: '$0.10/1M tk', types: ['language','vision'], price_start: 0.1  },

  // ── Meta ─────────────────────────────────────────────────────────────
  { id: 'llama4-maverick', icon: '🦙', bg: '#EEEDFE', name: 'Llama 4 Maverick',  lab: 'Meta', org: 'Meta', desc: '400B MoE architecture with multimodal understanding. Top open-source for multilingual agentic systems.', tags: ['Open Source','400B MoE','Multimodal','Agentic'], badge: 'hot', badgeClass: 'badge-hot', rating: 4.6, reviews: 2950, price: 'Free (self-host)', types: ['language','vision','code','open'], price_start: 0 },
  { id: 'llama4-scout',    icon: '🌟', bg: '#EEEDFE', name: 'Llama 4 Scout',     lab: 'Meta', org: 'Meta', desc: 'Efficient MoE with 128K context for long-context tasks, retrieval, and summarization.', tags: ['Open Source','Fast','Long Context','Summarization'], badge: 'open', badgeClass: 'badge-open', rating: 4.5, reviews: 1760, price: 'Free (self-host)', types: ['language','vision','open'], price_start: 0 },
  { id: 'llama33-70b',     icon: '🦙', bg: '#EEEDFE', name: 'Llama 3.3 70B',     lab: 'Meta', org: 'Meta', desc: 'High-quality 70B model with instruction-tuning for coding and chat.', tags: ['Open Source','70B','Coding','Chat'], badge: '', badgeClass: '', rating: 4.5, reviews: 2180, price: 'Free (self-host)', types: ['language','code','open'], price_start: 0 },

  // ── DeepSeek ─────────────────────────────────────────────────────────
  { id: 'deepseek-r1',    icon: '🔬', bg: '#EAF3DE', name: 'DeepSeek-R1',       lab: 'DeepSeek', org: 'DeepSeek', desc: 'Formal theorem proving in Lean 4. Best for academic math proofs with open weights.', tags: ['Reasoning','Math','Open Source','Academic'], badge: 'open', badgeClass: 'badge-open', rating: 4.6, reviews: 1340, price: '$0.14/1M tk', types: ['language','code','open'], price_start: 0.14 },
  { id: 'deepseek-v3',    icon: '💻', bg: '#EAF3DE', name: 'DeepSeek-V3',       lab: 'DeepSeek', org: 'DeepSeek', desc: '1T param MoE, 40% less memory, 1.8× faster inference. Best budget general model.', tags: ['Open Source','Low Cost','Language','Efficient'], badge: 'open', badgeClass: 'badge-open', rating: 4.5, reviews: 2310, price: '~$0.07/1M tk', types: ['language','code','open'], price_start: 0.07 },

  // ── Alibaba (Qwen) ────────────────────────────────────────────────────
  { id: 'qwen3-max',      icon: '🀄', bg: '#FFF0E8', name: 'Qwen3-Max',          lab: 'Alibaba', org: 'Alibaba (Qwen)', desc: '1T param MoE supporting 119 languages. Beats GPT-4o on benchmarks. APAC scale.', tags: ['Multilingual','MoE','APAC','Scale'], badge: 'new', badgeClass: 'badge-new', rating: 4.6, reviews: 1120, price: '$0.40/1M tk', types: ['language','code'], price_start: 0.4 },
  { id: 'qwen3',          icon: '🀄', bg: '#FFF0E8', name: 'Qwen3',              lab: 'Alibaba', org: 'Alibaba (Qwen)', desc: 'Dense 235B model with thinking mode and strong multilingual reasoning.', tags: ['Dense','Multilingual','Thinking Mode'], badge: 'new', badgeClass: 'badge-new', rating: 4.5, reviews: 870, price: '$0.60/1M tk', types: ['language','code'], price_start: 0.6 },

  // ── xAI ─────────────────────────────────────────────────────────────
  { id: 'grok4-fast',     icon: '𝕏', bg: '#F0F0F0', name: 'Grok-4-1 Fast',      lab: 'xAI', org: 'xAI', desc: 'Real-time X data analysis with massive context. Best for current events and social analytics.', tags: ['Real-time','2000K Context','Social Analytics'], badge: 'new', badgeClass: 'badge-new', rating: 4.5, reviews: 980, price: '$0.20/1M tk', types: ['language'], price_start: 0.2 },

  // ── Mistral ──────────────────────────────────────────────────────────
  { id: 'devstral2',      icon: '🌀', bg: '#F8F7FB', name: 'Devstral 2',         lab: 'Mistral', org: 'Mistral AI', desc: 'Software engineering agents with 256K context. Best open model for developer workflows.', tags: ['Code','Agents','256K Context'], badge: '', badgeClass: '', rating: 4.5, reviews: 890, price: '$0.40/1M tk', types: ['code','language'], price_start: 0.4 },

  // ── NVIDIA ───────────────────────────────────────────────────────────
  { id: 'nemotron-253b',  icon: '🟢', bg: '#F0FFF8', name: 'Nemotron Ultra 253B', lab: 'NVIDIA', org: 'NVIDIA', desc: 'Enterprise reasoning & RAG. 131K context. State-of-the-art on reasoning benchmarks.', tags: ['Enterprise','Reasoning','RAG'], badge: '', badgeClass: '', rating: 4.4, reviews: 560, price: '$0.60/1M tk', types: ['language','code'], price_start: 0.6 },

  // ── Moonshot ─────────────────────────────────────────────────────────
  { id: 'kimi-k2',        icon: '🌙', bg: '#F5F0FE', name: 'kimi-k2.5',          lab: 'Moonshot', org: 'Moonshot AI', desc: 'Multi-agent RAG, visual coding. 262K context. Top long-context recall at 1M tokens.', tags: ['Multi-agent','RAG','Visual Coding'], badge: '', badgeClass: '', rating: 4.6, reviews: 780, price: '$0.60/1M tk', types: ['language','vision','code'], price_start: 0.6 },

  // ── IBM ──────────────────────────────────────────────────────────────
  { id: 'granite-code',   icon: '⌨️', bg: '#EEF4FB', name: 'Granite Code',       lab: 'IBM', org: 'IBM', desc: 'Code model trained on 116 programming languages with enterprise compliance.', tags: ['Code','116 Languages','Compliance'], badge: 'open', badgeClass: 'badge-open', rating: 4.2, reviews: 420, price: 'Free (open)', types: ['code','open'], price_start: 0 },

  // ── Falcon ───────────────────────────────────────────────────────────
  { id: 'falcon-40b',     icon: '🦅', bg: '#F0FFF4', name: 'Falcon 40B',         lab: 'TII', org: 'Technology Innovation Institute', desc: 'Proven open 40B model for research and production deployment.', tags: ['Open Source','40B','Research'], badge: 'open', badgeClass: 'badge-open', rating: 4.2, reviews: 780, price: 'Free (self-host)', types: ['language','open'], price_start: 0 },

  // ── HuggingFace ───────────────────────────────────────────────────────
  { id: 'zephyr',         icon: '🤗', bg: '#FFF7E8', name: 'H4-Zephyr',           lab: 'HuggingFace', org: 'HuggingFace', desc: 'Fine-tuned Mistral model for helpfulness without RLHF. Top for open chat.', tags: ['Open Source','Chat','Fine-Tuned'], badge: 'open', badgeClass: 'badge-open', rating: 4.2, reviews: 980, price: 'Free (open)', types: ['language','open'], price_start: 0 },

  // ── MiniMax ───────────────────────────────────────────────────────────
  { id: 'minimax-m25',    icon: '🟡', bg: '#FFFDE8', name: 'MiniMax-M2.5',        lab: 'MiniMax', org: 'MiniMax', desc: 'Advanced Chinese multimodal model with agent orchestration capabilities.', tags: ['Chinese','Multimodal','Agents'], badge: 'new', badgeClass: 'badge-new', rating: 4.3, reviews: 280, price: '$0.40/1M tk', types: ['language','vision'], price_start: 0.4 },
];

export const MODEL_VARS: Record<string, Array<{ label: string; ctx: string; input: string; output: string; desc: string }>> = {
  'gpt5': [
    { label: 'GPT-5 Standard',  ctx: '2M tokens',  input: '$7.50/1M', output: '$30/1M',  desc: 'Full capability, 2M context window, multi-agent framework support.' },
    { label: 'GPT-5 Turbo',     ctx: '1M tokens',  input: '$2.50/1M', output: '$10/1M',  desc: 'Optimized for speed and volume. Great for production workloads.' },
  ],
  'claude-opus': [
    { label: 'Claude Opus 4.6 Standard', ctx: '200K tokens', input: '$5/1M', output: '$25/1M', desc: 'Full Opus capability with 200K context. Best for agents and long tasks.' },
    { label: 'Claude Opus 4.6 Beta',     ctx: '1M tokens',   input: '$5/1M', output: '$25/1M', desc: '1M token beta. Extended Thinking mode available.' },
  ],
  'claude-sonnet': [
    { label: 'Claude Sonnet 4.6',  ctx: '200K tokens', input: '$3/1M',  output: '$15/1M', desc: 'Balanced performance. Great for coding, writing, and agents at scale.' },
    { label: 'Claude Sonnet Beta', ctx: '1M tokens',   input: '$3/1M',  output: '$15/1M', desc: '1M token beta. Adaptive Thinking enabled.' },
  ],
  'gemini25-pro': [
    { label: 'Gemini 2.5 Pro Standard', ctx: '1M tokens', input: '$1.25/1M', output: '$5/1M', desc: 'Full 1M context. Best for reasoning and multimodal tasks.' },
    { label: 'Gemini 2.5 Pro ≤200K',    ctx: '200K tokens', input: '$1.25/1M', output: '$5/1M', desc: 'Optimized throughput for documents under 200K tokens.' },
  ],
};
