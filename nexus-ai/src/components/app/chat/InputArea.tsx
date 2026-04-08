'use client';
import { useState, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import { CAP_APPS } from '@/data/capApps';
import styles from './InputArea.module.css';

const CAP_TABS = [
  { key: 'use_cases', label: 'Use cases' },
  { key: 'monitor', label: 'Monitor the situation' },
  { key: 'prototype', label: 'Create a prototype' },
  { key: 'business', label: 'Build a business plan' },
  { key: 'create', label: 'Create content' },
  { key: 'analyze', label: 'Analyze & research' },
  { key: 'learn', label: 'Learn something' },
];

// Keyword-based conversation responses (post-onboarding)
function handleConv(text: string): { text: string; recs?: string[] } {
  const t = text.toLowerCase();

  if (/price|pricing|cost|cheap|free|afford|budget/.test(t)) {
    return { text: "Here's a quick breakdown of pricing tiers:\n\n**Free tier**: Llama 3.3 70B, Mistral 7B, Gemma 3 27B — great for experimentation.\n**Budget ($0–5/M tokens)**: Gemini Flash 2.5, GPT-4o Mini, Claude Haiku 3.5 — fast and economical.\n**Mid-range ($5–15/M)**: GPT-4.1, Gemini Pro 2.5, Claude Sonnet 4.5.\n**Premium ($15+/M)**: GPT-5, Claude Opus 4.6, Gemini Ultra 2.0 — maximum intelligence.\n\nWant me to compare specific models for your budget?" };
  }

  if (/image|photo|picture|visual|dalle|midjourney|flux|stable diffusion|generate.*image|creat.*image/.test(t)) {
    return {
      text: "For image generation, here are the top models right now:",
      recs: ['gpt5', 'gemini25-pro', 'claude-sonnet'],
    };
  }

  if (/video|animate|motion|sora|runway|gen-?3/.test(t)) {
    return { text: "Video generation is handled by specialised models:\n\n**Sora (OpenAI)** — cinematic quality, up to 1 min, in OpenAI Pro plan.\n**Runway Gen-3** — great for short clips & VFX, available via API.\n**Kling 1.6** — cost-effective, strong motion quality.\n**Pika 2.1** — best for quick social-media clips.\n\nNone of these are in the chat model marketplace yet, but you can access them via their own platforms. Want me to show you the best models for describing video scripts instead?" };
  }

  if (/audio|music|speech|tts|voice|sound|eleven/.test(t)) {
    return { text: "For audio and voice generation:\n\n**ElevenLabs** — best realistic voice cloning & TTS.\n**OpenAI TTS** — fast, natural-sounding, built into GPT-5.\n**Whisper** — unbeatable for transcription/STT.\n**Suno** — AI music generation from text prompts.\n\nFor voice-in, all major frontier models now support real-time audio mode. Would you like to explore a specific audio use case?" };
  }

  if (/code|coding|program|develop|debug|engineer|script|github|devstral/.test(t)) {
    return {
      text: "For coding tasks, these models are the top performers right now:",
      recs: ['gpt5', 'claude-opus', 'devstral2'],
    };
  }

  if (/agent|automat|workflow|tool.?use|function.?call|pipeline/.test(t)) {
    return { text: "For agentic workflows and automation:\n\n**Claude Opus 4.6** — best for long multi-step tasks with Adaptive Thinking.\n**GPT-5** — excellent native tool-use and parallel function calling.\n**Gemini 2.5 Pro** — superb for code-execution agents with 1M context.\n**Mistral Large 3** — great open-source option for self-hosted agents.\n\nI can also help you configure an agent in the **Agents** tab — just tell me what you want to automate!" };
  }

  if (/compare|vs\.?|versus|difference|better|best between/.test(t)) {
    return {
      text: "Here's a quick comparison of the top frontier models:",
      recs: ['gpt5', 'claude-opus', 'gemini25-pro'],
    };
  }

  if (/popular|best model|top model|recommend|suggest|which model/.test(t)) {
    return {
      text: "Here are the most popular models on NexusAI right now:",
      recs: ['gpt5', 'claude-sonnet', 'gemini25-pro'],
    };
  }

  if (/long.*doc|document|pdf|context|large.*text|100k|million.*token/.test(t)) {
    return {
      text: "For long documents and large context windows:",
      recs: ['claude-opus', 'gemini25-pro', 'gpt5'],
    };
  }

  if (/api|integrat|sdk|developer|build.*app|connect/.test(t)) {
    return { text: "All major models offer APIs:\n\n**OpenAI** — `api.openai.com` · GPT-5, GPT-4o, o3 · starts free with $5 credit.\n**Anthropic** — `api.anthropic.com` · Claude 3.5–4.6 series · generous free tier.\n**Google AI** — `ai.google.dev` · Gemini Flash free up to 1M calls/day in free tier.\n**Mistral** — `api.mistral.ai` · European-hosted, GDPR-friendly.\n\nHead to the **Marketplace** tab to see each model's API docs and pricing, or ask me about a specific provider!" };
  }

  if (/prompt|prompt engineer|system prompt|jailbreak|instruction/.test(t)) {
    return { text: "Here are some prompt engineering essentials:\n\n**Be specific** — include format, length, audience, and examples.\n**Use roles** — \"Act as a senior UX designer\" boosts quality.\n**Chain-of-thought** — add \"Think step by step\" for complex reasoning.\n**Few-shot** — show 2–3 examples of the output you want.\n**Temperature** — lower (0.1–0.3) for factual tasks, higher (0.7–1.0) for creative.\n\nWant me to help you craft a prompt for a specific task?" };
  }

  if (/open.?source|local|self.?host|ollama|llama|mistral|llm|run.*local/.test(t)) {
    return { text: "Top open-source models you can run locally:\n\n**Llama 3.3 70B** (Meta) — best open-source overall, Apache 2.0 license.\n**Mistral 7B / Mixtral 8x22B** — efficient & powerful, Apache 2.0.\n**Gemma 3 27B** (Google) — great instruction-following, runs on consumer GPU.\n**Phi-4** (Microsoft) — surprisingly capable small model.\n\nUse **Ollama** to run them locally: `ollama run llama3.3`. Want setup help?" };
  }

  if (/write|writing|content|blog|article|copy|essay|creative/.test(t)) {
    return {
      text: "For writing and content creation, these models shine:",
      recs: ['claude-sonnet', 'gpt5', 'gemini25-pro'],
    };
  }

  if (/data|analys|spreadsheet|csv|number|statistic|research/.test(t)) {
    return {
      text: "For data analysis and research tasks:",
      recs: ['claude-opus', 'gpt5', 'gemini25-pro'],
    };
  }

  if (/skip|skip setup|no setup|just chat|browse/.test(t)) {
    return {
      text: "No worries! Here are the top models to get started with:",
      recs: ['gpt5', 'claude-sonnet', 'gemini25-pro'],
    };
  }

  // Default fallback
  return {
    text: `Great question! I'm here to help you discover the perfect AI model for your needs. You can ask me about:\n\n• **Model comparisons** — "Compare GPT-5 vs Claude"\n• **Use cases** — "Best model for coding / images / documents"\n• **Pricing** — "What's the cheapest option?"\n• **APIs** — "How do I integrate with OpenAI?"\n• **Open source** — "What can I run locally?"\n\nOr browse the **Marketplace** tab to explore all 347 models directly.`,
  };
}

export default function InputArea() {
  const {
    addMessage, currentModelId, showToast, openModelModal,
    onboardPhase, obDone, setOnboardPhase, setObDone, selectModel, switchTab,
  } = useAppStore();
  const [text, setText] = useState('');
  const [capTab, setCapTab] = useState('use_cases');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = MODELS.find((m) => m.id === currentModelId);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    const val = text.trim();
    if (!val) return;
    addMessage({ role: 'user', text: val });
    setText('');
    if (taRef.current) taRef.current.style.height = 'auto';

    const store = useAppStore.getState();
    const t = val.toLowerCase();

    // ── Greeting → kick off onboarding ──────────────────────────────
    if (!store.obDone && store.onboardPhase === 'start' && /^(hi|hey|hello|hiya|howdy|sup|greetings)[\s!.?]*$/.test(t)) {
      setTimeout(() => {
        store.addMessage({ role: 'ai', text: "Hey! 👋 Great to meet you. I'm your AI discovery guide — I'll help you find the perfect model for what you're trying to do.\n\nLet me ask you a few quick questions to personalise your recommendations. It'll take less than a minute! ✨" });
        setTimeout(() => {
          setOnboardPhase('goal');
          (store.addMessage as any)({
            role: 'ai',
            text: '🎯 First up — what do you mainly want to use AI for?',
            questionCard: {
              key: 'goal',
              eyebrow: '✦ Your setup · Step 1 of 4',
              title: 'What\'s your main goal?',
              hint: 'Pick whichever fits best — you can always change it later',
              opts: [
                { e: '💻', l: 'Build or code something', sub: 'Apps, scripts, automation' },
                { e: '✍️', l: 'Write or create content', sub: 'Blogs, copy, creative writing' },
                { e: '📊', l: 'Analyse data or research', sub: 'Insights, summaries, reports' },
                { e: '🖼️', l: 'Generate images or media', sub: 'Art, design, video, audio' },
              ],
            },
          });
        }, 700);
      }, 600);
      return;
    }

    // ── Mid-onboard: don't respond with generic reply while in flow ──
    if (!store.obDone && store.onboardPhase !== 'start' && store.onboardPhase !== 'chat') {
      setTimeout(() => {
        store.addMessage({ role: 'ai', text: "Just tap one of the options above to continue your setup — I promise it's quick! Or type **skip** if you'd rather browse freely. 😊" });
      }, 700);
      return;
    }

    // ── Post-onboarding: keyword routing ────────────────────────────
    setTimeout(() => {
      const result = handleConv(val);

      if (result.recs && result.recs.length > 0) {
        const recModels = result.recs
          .map((id) => MODELS.find((m) => m.id === id))
          .filter(Boolean) as typeof MODELS;

        // Text intro bubble
        store.addMessage({ role: 'ai', text: result.text });
        // Recs card appended shortly after
        setTimeout(() => {
          (store.addMessage as any)({
            role: 'ai',
            text: '___RECS___',
            recsCard: { recs: recModels },
          });
        }, 320);
      } else {
        store.addMessage({ role: 'ai', text: result.text });
      }
    }, 750);
  };

  const prompts = CAP_APPS[capTab] || [];

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputRow}>
        <div className={styles.inputWrap}>
          <textarea
            ref={taRef}
            id="chat-input"
            rows={1}
            placeholder="Describe your project, ask a question, or just say hi — I'm here to help…"
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className={styles.textarea}
          />
          <div className={styles.inputBar}>
            <button className={`${styles.iconBtn} ${styles.purple}`} title="Voice conversation" onClick={() => showToast('🎤 Voice input coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.orange}`} title="Voice typing" onClick={() => showToast('🎙️ Voice typing coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="14" width="20" height="7" rx="2"/>
                <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/>
                <path d="M18 10v1a6 6 0 0 1-12 0v-1"/>
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.blue}`} title="Video" onClick={() => showToast('📹 Video input coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.teal}`} title="Screen sharing" onClick={() => showToast('🖥️ Screen sharing coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.rose}`} title="Attach file" onClick={() => showToast('📎 Attach file coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <button className={`${styles.iconBtn} ${styles.green}`} title="Upload image" onClick={() => showToast('🖼️ Upload image coming soon')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <button className={styles.promptTip} title="Prompt tips" onClick={() => currentModelId ? openModelModal(currentModelId) : showToast('Select a model first')}>✦</button>
            <div className={styles.modelSel} onClick={() => currentModelId ? openModelModal(currentModelId) : {}}>
              <span>{currentModel?.name || 'GPT-5.4'}</span>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
        <button className={styles.sendBtn} onClick={send}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>

      {/* Category Prompt Panel */}
      <div className={styles.cpanel}>
        <div className={styles.cpanelTabs}>
          {CAP_TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.cpanelTab} ${capTab === t.key ? styles.cpanelTabActive : ''}`}
              onClick={() => setCapTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.cpanelPrompts}>
          {(prompts as any[]).slice(0, 6).map((p: any, i: number) => (
            <button
              key={i}
              className={styles.cpanelPrompt}
              onClick={() => { setText(p.title || p.name || ''); taRef.current?.focus(); }}
            >
              {p.title || p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
