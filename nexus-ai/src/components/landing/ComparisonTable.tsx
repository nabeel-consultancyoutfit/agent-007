'use client';
import { useAppStore } from '@/store/appStore';
import styles from './ComparisonTable.module.css';

const COMPARISON_DATA = [
  { name: 'GPT-5.4', lab: '🧠 OpenAI', context: '256K', input: '$2.50', output: '$10.00', multimodal: true, speed: '⚡⚡⚡', bestFor: 'General, Agents' },
  { name: 'Claude Opus 4.6', lab: '⚡ Anthropic', context: '1M', input: '$15.00', output: '$75.00', multimodal: true, speed: '⚡⚡', bestFor: 'Coding, Research' },
  { name: 'Claude Sonnet 4.6', lab: '⚡ Anthropic', context: '200K', input: '$3.00', output: '$15.00', multimodal: true, speed: '⚡⚡⚡', bestFor: 'Balanced, Fast' },
  { name: 'Gemini 3.1 Pro', lab: '🔬 Google', context: '5M', input: '$3.50', output: '$10.50', multimodal: true, speed: '⚡⚡', bestFor: 'Long context, Vision' },
  { name: 'Grok-4-1 Fast', lab: '𝕏 xAI', context: '2M', input: '$5.00', output: '$15.00', multimodal: false, speed: '⚡⚡⚡⚡', bestFor: 'Real-time, Speed' },
  { name: 'DeepSeek V3.2', lab: '💻 DeepSeek', context: '128K', input: '$0.27', output: '$1.10', multimodal: false, speed: '⚡⚡', bestFor: 'Cost-efficient, Code' },
  { name: 'Llama 4 Maverick', lab: '🦙 Meta', context: '128K', input: 'Free*', output: 'Free*', multimodal: true, speed: '⚡⚡', bestFor: 'Open source, Privacy' },
  { name: 'Qwen3-Max', lab: '🀄 Alibaba', context: '128K', input: '$1.10', output: '$4.40', multimodal: false, speed: '⚡⚡⚡', bestFor: 'Multilingual, Code' },
];

const LABS = [
  { emoji: '🧠', name: 'OpenAI', sub: '3 models · GPT-5.4, Sora 2' },
  { emoji: '⚡', name: 'Anthropic', sub: '3 models · Opus, Sonnet, Haiku' },
  { emoji: '🔬', name: 'Google DeepMind', sub: '5 models · Gemini 3.1, Veo 3' },
  { emoji: '𝕏', name: 'xAI (Grok)', sub: '2 models · Grok-4-1, Grok-Imagine' },
  { emoji: '💻', name: 'DeepSeek', sub: '3 models · V3, V3.2, R1' },
  { emoji: '🦙', name: 'Meta (Llama)', sub: '2 models · Maverick, Scout' },
  { emoji: '🀄', name: 'Alibaba (Qwen)', sub: '2 models · Qwen3-Max, Coder' },
  { emoji: '🌀', name: 'Mistral', sub: '2 models · Devstral 2, Medium 3.1' },
  { emoji: '🟢', name: 'NVIDIA NIM', sub: '4 models · Nemotron Ultra, Nano' },
  { emoji: '🔷', name: 'GLM (Zhipu)', sub: '3 models · GLM-5, 4.7, 4.6V' },
  { emoji: '🌙', name: 'Moonshot (Kimi)', sub: '2 models · k2.5, k2-Thinking' },
];

const BUILDER_CARDS = [
  { emoji: '🧭', title: 'Guided Discovery Chat', desc: "I'll greet you, ask about your goals, and have a genuine conversation before recommending models. No overwhelming lists.", tab: 'chat' as const },
  { emoji: '📐', title: 'Prompt Engineering Guide', desc: 'Every model includes tailored prompt templates, principles, and examples so you get the best output from day one.', tab: 'marketplace' as const },
  { emoji: '🤖', title: 'Agent Builder', desc: 'Step-by-step agent creation guides for every model — system prompts, tool configuration, memory setup, deployment.', tab: 'agents' as const },
  { emoji: '💰', title: 'Flexible Pricing', desc: 'Free tiers, pay-per-use, subscriptions, and enterprise plans. Transparent pricing with no hidden fees.', tab: 'marketplace' as const },
  { emoji: '⭐', title: 'User Reviews & Ratings', desc: 'Verified reviews from real builders, benchmark scores, and detailed I/O specs to help you choose confidently.', tab: 'marketplace' as const },
  { emoji: '🔬', title: 'Research Feed', desc: 'Daily curated AI research, model releases, and breakthroughs from top labs — stay ahead of the curve.', tab: 'research' as const },
];

const TRENDING = [
  {
    badge: '🆕 Just Released', badgeClass: 'teal', lab: 'Anthropic',
    title: 'Claude Opus 4.6 & Sonnet 4.6',
    desc: 'Adaptive Thinking and 1M token context (beta) mark a major leap in agent capability. Now the most intelligent Claude for coding and agentic tasks.',
    query: 'Tell me about Claude Opus 4.6',
  },
  {
    badge: '🔥 Hot', badgeClass: 'amber', lab: 'Google DeepMind',
    title: 'Gemini 3.1 Pro — Thought Signatures',
    desc: 'Thought Signatures bring new transparency to deep reasoning. 5M context window makes it the go-to for ultra-long document analysis.',
    query: 'Tell me about Gemini 3.1 Pro',
  },
  {
    badge: '🤖 Agent Use', badgeClass: 'blue', lab: 'OpenAI',
    title: 'GPT-5.4 — Native agent use',
    desc: 'GPT-5.4 introduces native agent use, letting it operate browsers, apps, and files autonomously with improved reasoning efficiency.',
    query: 'Tell me about GPT-5.4',
  },
  {
    badge: '⚡ Real-Time', badgeClass: 'rose', lab: 'xAI',
    title: 'Grok-4-1 Fast — 4-Agent Architecture',
    desc: "Grok's 4-agent architecture with real-time X (Twitter) data access and 2M context makes it unique for real-time analysis tasks.",
    query: 'Tell me about Grok-4-1',
  },
];

export default function ComparisonTable() {
  const { openApp, addMessage } = useAppStore();

  const goChat = (query: string) => {
    openApp('chat');
    setTimeout(() => {
      useAppStore.getState().addMessage({ role: 'user', text: query });
    }, 300);
  };

  return (
    <>
      {/* Built for every builder */}
      <section className={styles.section}>
        <div className={styles.secHd}><h2>Built for every builder</h2></div>
        <div className={styles.builderGrid}>
          {BUILDER_CARDS.map((c) => (
            <div key={c.title} className={styles.builderCard} onClick={() => openApp(c.tab)}>
              <div className={styles.builderEmoji}>{c.emoji}</div>
              <h4 className={styles.builderTitle}>{c.title}</h4>
              <p className={styles.builderDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by AI Lab */}
      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.secHd}>
          <h2>Browse by AI Lab</h2>
          <span className={styles.secLink} onClick={() => openApp('marketplace')}>See all labs →</span>
        </div>
        <div className={styles.labsGrid}>
          {LABS.map((l) => (
            <div key={l.name} className={styles.labCard} onClick={() => openApp('marketplace')}>
              <div className={styles.labEmoji}>{l.emoji}</div>
              <div className={styles.labName}>{l.name}</div>
              <div className={styles.labSub}>{l.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Model Comparison */}
      <section className={styles.section}>
        <div className={styles.secHd}>
          <h2>Flagship Model Comparison</h2>
          <span className={styles.secLink} onClick={() => openApp('marketplace')}>Compare all →</span>
        </div>
        <p className={styles.tableLead}>Side-by-side view of the leading models across all major labs. Input/Output prices per 1M tokens.</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Model</th>
                <th style={{ textAlign: 'left' }}>Lab</th>
                <th style={{ textAlign: 'center' }}>Context</th>
                <th style={{ textAlign: 'center' }}>Input $/1M</th>
                <th style={{ textAlign: 'center' }}>Output $/1M</th>
                <th style={{ textAlign: 'center' }}>Multimodal</th>
                <th style={{ textAlign: 'center' }}>Speed</th>
                <th style={{ textAlign: 'left' }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, i) => (
                <tr key={row.name} className={i % 2 === 1 ? styles.altRow : ''}>
                  <td className={styles.modelCell}>{row.name}</td>
                  <td>{row.lab}</td>
                  <td style={{ textAlign: 'center' }}>{row.context}</td>
                  <td style={{ textAlign: 'center' }}>{row.input}</td>
                  <td style={{ textAlign: 'center' }}>{row.output}</td>
                  <td style={{ textAlign: 'center' }}>{row.multimodal ? '✅' : '—'}</td>
                  <td style={{ textAlign: 'center' }}>{row.speed}</td>
                  <td className={styles.bestFor}>{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>* Prices shown are approximate. Free self-hosted models exclude infrastructure costs. Beta pricing may change.</p>
      </section>

      {/* Trending This Week */}
      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.secHd}>
          <h2>🔥 Trending This Week</h2>
          <span className={styles.secLink} onClick={() => openApp('research')}>View research feed →</span>
        </div>
        <div className={styles.trendGrid}>
          {TRENDING.map((t) => (
            <div key={t.title} className={styles.trendCard} onClick={() => goChat(t.query)}>
              <div className={styles.trendTop}>
                <span className={`${styles.trendBadge} ${styles[`badge_${t.badgeClass}`]}`}>{t.badge}</span>
                <span className={styles.trendLab}>{t.lab}</span>
              </div>
              <h4 className={styles.trendTitle}>{t.title}</h4>
              <p className={styles.trendDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <div className={styles.footerLogoMark}>
              <svg viewBox="0 0 14 14"><path d="M7 1 L13 7 L7 13 L1 7 Z" fill="white"/></svg>
            </div>
            NexusAI
          </div>
          <p className={styles.footerSub}>The AI model discovery platform for every builder.</p>
          <p className={styles.footerCopy}>© 2026 NexusAI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
