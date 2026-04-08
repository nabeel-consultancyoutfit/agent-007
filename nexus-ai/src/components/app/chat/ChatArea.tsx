'use client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import styles from './ChatArea.module.css';

const GREETING_CHIPS = [
  "Find me the best model for coding",
  "What's the cheapest GPT-4 alternative?",
  "Which model handles images best?",
  "Compare Claude vs GPT-5",
  "Best model for long documents",
  "Which AI can generate videos?",
];

interface ModelRec {
  id: string;
  icon: string;
  bg?: string;
  name: string;
  lab: string;
  tags: string[];
  price: string;
}

export default function ChatArea() {
  const {
    messages, addMessage, obDone, prepopPrompt, setPrepopPrompt,
    disabledCardIds, disableCard, setObDone, setOnboardPhase,
    onboardPhase, setUserGoal, setUserAudience, setUserLevel,
    selectModel, openModelModal, switchTab,
  } = useAppStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When arriving from hero onboarding: inject the prepop prompt card
  useEffect(() => {
    if (prepopPrompt && messages.length === 0) {
      setObDone(true);
      setOnboardPhase('chat');
      addMessage({ role: 'ai', text: '✨ **Generating your personalised AI prompt** based on your answers…' });
      setTimeout(() => {
        const id = Math.random().toString(36).slice(2);
        (useAppStore.getState().addMessage as any)({
          role: 'ai', text: '___PREPOP___',
          prepopCard: { prompt: prepopPrompt },
        });
        setPrepopPrompt('');
      }, 1200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepopPrompt]);

  const handleChip = (text: string) => { addMessage({ role: 'user', text }); };

  const handleOnboardPick = (msgId: string, key: string, val: string) => {
    disableCard(msgId);
    if (key === 'goal')     setUserGoal(val);
    if (key === 'audience') setUserAudience(val);
    if (key === 'level')    setUserLevel(val);
    addMessage({ role: 'user', text: val });

    setTimeout(() => {
      const store = useAppStore.getState();
      const ph = store.onboardPhase;

      if (ph === 'goal') {
        setOnboardPhase('audience');
        (store.addMessage as any)({ role: 'ai', text: '👥 Who is this for?',
          questionCard: { key: 'audience', eyebrow: '✦ Your setup · Step 2 of 4',
            title: 'Who will use this?', hint: "Helps me tailor the model recommendations",
            opts: [
              { e: '🙋', l: 'Just me', sub: 'Personal projects or use' },
              { e: '👥', l: 'My team or coworkers', sub: 'People I work with' },
              { e: '👤', l: 'Customers or clients', sub: 'People who buy from me' },
              { e: '🌍', l: 'Anyone and everyone', sub: 'The general public' },
            ],
          },
        });
      } else if (ph === 'audience') {
        setOnboardPhase('level');
        (store.addMessage as any)({ role: 'ai', text: "🧠 How comfortable are you with AI?",
          questionCard: { key: 'level', eyebrow: '✦ Your setup · Step 3 of 4',
            title: 'What\'s your experience with AI tools?',
            hint: "Totally fine if you're new — that's what I'm here for!",
            opts: [
              { e: '👋', l: "Never tried AI", sub: 'Complete beginner' },
              { e: '🙂', l: 'A little bit', sub: 'Played around with ChatGPT etc.' },
              { e: '🧠', l: 'I use it regularly', sub: 'Comfortable with AI tools' },
              { e: '🔧', l: 'I build with AI', sub: 'Connecting it to apps or code' },
            ],
          },
        });
      } else if (ph === 'level') {
        setOnboardPhase('budget');
        (store.addMessage as any)({ role: 'ai', text: "💰 What's your budget?",
          questionCard: { key: 'budget', eyebrow: '✦ Your setup · Step 4 of 4',
            title: "What's your budget for AI tools?",
            hint: 'Free options exist — just helps me pick the right models',
            opts: [
              { e: '🆓', l: 'Free only', sub: 'Open-source self-hosted models' },
              { e: '💵', l: 'Low cost', sub: 'Under $20/month' },
              { e: '💰', l: 'Flexible', sub: 'Best quality is what matters' },
              { e: '🏢', l: 'Enterprise', sub: 'Team or company budget' },
            ],
          },
        });
      } else if (ph === 'budget') {
        setOnboardPhase('chat');
        setObDone(true);
        const recs = getRecs(store.userGoal);
        (store.addMessage as any)({ role: 'ai', text: '___SUMMARY___',
          summaryCard: { goal: store.userGoal || '—', audience: store.userAudience || '—',
            level: store.userLevel || '—', budget: val, recs },
        });
      }
    }, 650);
  };

  const handlePrepopRun = (prompt: string, msgId: string) => {
    disableCard(msgId);
    addMessage({ role: 'user', text: prompt });
    setTimeout(() => {
      addMessage({ role: 'ai', text: "I'm processing your prompt now. In a full deployment I'd stream results from your selected AI model. Feel free to browse the Marketplace to pick the best model for your goal, or ask me anything below." });
    }, 900);
  };

  const showGreeting = messages.length === 0;

  return (
    <div className={styles.chatArea}>
      {showGreeting && (
        <div className={styles.greetCard}>
          <div className={styles.greetAvatar}>✨</div>
          <h3>Hey there! I&apos;m your AI discovery guide.</h3>
          <p>
            Tell me what you&apos;re trying to build or accomplish and I&apos;ll help you find the perfect AI model.
            Or just say <strong>hi</strong> to start the guided setup. 👋
          </p>
          <div className={styles.gchips}>
            {GREETING_CHIPS.map((c) => (
              <button key={c} className={styles.gchip} onClick={() => handleChip(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => {
        const m = msg as any;

        // Prepop card
        if (m.prepopCard) {
          const disabled = disabledCardIds.includes(msg.id);
          return (
            <div key={msg.id} className={`${styles.msg} ${styles.ai}`}>
              <div className={styles.msgAv}>✦</div>
              <div>
                <div className={styles.bubble}>
                  Here&apos;s a personalised prompt crafted from your answers. You can <strong>run it as-is</strong> or delete it and type your own. 👇
                </div>
                <div className={`${styles.prepopCard} ${disabled ? styles.prepopDisabled : ''}`}>
                  <div className={styles.ppcEyebrow}>✦ Your AI Prompt</div>
                  <div className={styles.ppcText}>{m.prepopCard.prompt}</div>
                  <div className={styles.ppcBtns}>
                    <button className={`${styles.ppcBtn} ${styles.ppcRun}`} disabled={disabled}
                      onClick={() => handlePrepopRun(m.prepopCard.prompt, msg.id)}>▶ Run prompt</button>
                    <button className={`${styles.ppcBtn} ${styles.ppcDel}`} disabled={disabled}
                      onClick={() => { disableCard(msg.id); addMessage({ role: 'ai', text: "No problem! The prompt has been removed. Type anything below — I'm here to help." }); }}>
                      ✕ Delete
                    </button>
                  </div>
                </div>
                <div className={styles.msgMeta}>NexusAI Hub · prompt ready</div>
              </div>
            </div>
          );
        }

        // Summary card
        if (m.summaryCard) {
          const { goal, audience, level, budget, recs } = m.summaryCard;
          return (
            <div key={msg.id} className={`${styles.msg} ${styles.ai}`}>
              <div className={styles.msgAv}>✦</div>
              <div>
                <div className={styles.bubble}>
                  🎉 <strong>You&apos;re all set!</strong> Based on what you told me:
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryCell}><strong>Goal</strong><span>{goal}</span></div>
                    <div className={styles.summaryCell}><strong>Audience</strong><span>{audience}</span></div>
                    <div className={styles.summaryCell}><strong>Experience</strong><span>{level}</span></div>
                    <div className={styles.summaryCell}><strong>Budget</strong><span>{budget}</span></div>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontWeight: 600, fontSize: '0.87rem' }}>
                    ✨ Top model recommendations for you:
                  </div>
                  <div className={styles.recsList}>
                    {recs.filter(Boolean).map((rec: ModelRec) => (
                      <div key={rec.id} className={styles.recCard}>
                        <div className={styles.recIcon} style={{ background: rec.bg }}>{rec.icon}</div>
                        <div className={styles.recInfo}>
                          <div className={styles.recName}>{rec.name}</div>
                          <div className={styles.recMeta}>{rec.tags[0]} · {rec.price}</div>
                        </div>
                        <div className={styles.recBtns}>
                          <button className={styles.recViewBtn} onClick={() => openModelModal(rec.id)}>👁 Details</button>
                          <button className={styles.recGoBtn} onClick={() => { selectModel(rec.id); switchTab('chat'); }}>Proceed →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.msgMeta}>NexusAI Hub · profile complete</div>
              </div>
            </div>
          );
        }

        // Question card
        if (m.questionCard) {
          const disabled = disabledCardIds.includes(msg.id);
          const qc = m.questionCard;
          return (
            <div key={msg.id} className={`${styles.msg} ${styles.ai}`}>
              <div className={styles.msgAv}>✦</div>
              <div>
                <div className={styles.bubble}>{msg.text}</div>
                <div className={`${styles.hubQCard} ${disabled ? styles.hubQDisabled : ''}`}>
                  <div className={styles.hubQEyebrow}>{qc.eyebrow}</div>
                  <div className={styles.hubQTitle}>{qc.title}</div>
                  {qc.hint && <div className={styles.hubQHint}>{qc.hint}</div>}
                  <div className={styles.hubQOpts}>
                    {qc.opts.map((o: { e: string; l: string; sub: string }) => (
                      <button key={o.l} className={styles.hubQOpt} disabled={disabled}
                        onClick={() => handleOnboardPick(msg.id, qc.key, o.l)}>
                        <span className={styles.hubQOptEm}>{o.e}</span>
                        <span>
                          <span className={styles.hubQOptLabel}>{o.l}</span>
                          <span className={styles.hubQOptSub}>{o.sub}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.msgMeta}>NexusAI Hub · guided setup</div>
              </div>
            </div>
          );
        }

        // Recs-only card (from keyword replies in InputArea)
        if (m.recsCard) {
          return (
            <div key={msg.id} className={`${styles.msg} ${styles.ai}`}>
              <div className={styles.msgAv}>✦</div>
              <div>
                <div className={styles.recsList}>
                  {m.recsCard.recs.filter(Boolean).map((rec: ModelRec) => (
                    <div key={rec.id} className={styles.recCard}>
                      <div className={styles.recIcon} style={{ background: rec.bg }}>{rec.icon}</div>
                      <div className={styles.recInfo}>
                        <div className={styles.recName}>{rec.name}</div>
                        <div className={styles.recMeta}>{rec.tags?.[0]} · {rec.price}</div>
                      </div>
                      <div className={styles.recBtns}>
                        <button className={styles.recViewBtn} onClick={() => openModelModal(rec.id)}>👁 Details</button>
                        <button className={styles.recGoBtn} onClick={() => { selectModel(rec.id); switchTab('chat'); }}>Proceed →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // Skip sentinel messages
        if (msg.text === '___PREPOP___' || msg.text === '___SUMMARY___' || msg.text === '___RECS___') return null;

        // Regular text message
        const fmt = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        return (
          <div key={msg.id} className={`${styles.msg} ${msg.role === 'user' ? styles.user : styles.ai}`}>
            <div className={styles.msgAv}>{msg.role === 'user' ? 'U' : '✦'}</div>
            <div className={styles.bubble} dangerouslySetInnerHTML={{ __html: fmt }} />
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}

function getRecs(goal: string): ModelRec[] {
  const g = (goal || '').toLowerCase();
  let ids: string[];
  if (g.includes('image'))       ids = ['gpt5', 'gemini25-pro', 'claude-sonnet'];
  else if (g.includes('build') || g.includes('code')) ids = ['gpt5', 'claude-opus', 'devstral2'];
  else if (g.includes('automat') || g.includes('save time')) ids = ['gpt5', 'claude-sonnet', 'gemini31-pro'];
  else if (g.includes('analys') || g.includes('data')) ids = ['claude-opus', 'gpt5', 'gemini31-pro'];
  else if (g.includes('write') || g.includes('content')) ids = ['claude-sonnet', 'gpt5', 'gemini25-pro'];
  else ids = ['gpt5', 'claude-sonnet', 'gemini25-pro'];
  return ids.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean) as ModelRec[];
}
