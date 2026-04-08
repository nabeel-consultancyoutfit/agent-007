'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import styles from './HeroSearchCard.module.css';

// ── 8 inline questions (matching original HS_INLINE_QS) ──────────────────────
const HS_QUESTIONS = [
  {
    k: 'task',
    q: 'What do you want to do?',
    hint: "Pick whichever feels closest — there's no wrong answer 😊",
    opts: [
      { e: '✍️', l: 'Write something',          sub: 'Emails, posts, stories, reports' },
      { e: '🎨', l: 'Make pictures or art',      sub: 'Images, logos, designs, photos' },
      { e: '💻', l: 'Build something',           sub: 'Websites, apps, tools, scripts' },
      { e: '📊', l: 'Make sense of info',        sub: 'Files, numbers, documents, data' },
      { e: '⚡', l: 'Save time on boring tasks', sub: 'Things that repeat every day' },
      { e: '💬', l: 'Get help or answers',       sub: 'Questions, ideas, brainstorming' },
    ],
  },
  {
    k: 'role',
    q: 'What best describes you?',
    hint: 'Just pick the one that feels most like you',
    opts: [
      { e: '🎓', l: 'Still learning',           sub: 'Student or new to this field' },
      { e: '💼', l: 'I work in an office',      sub: 'Business, meetings, spreadsheets' },
      { e: '🎨', l: 'I make things',            sub: 'Art, design, writing, content' },
      { e: '📣', l: 'I run or sell things',     sub: 'Shop, brand, marketing, clients' },
      { e: '💻', l: 'I build with computers',   sub: 'Code, websites, tech stuff' },
      { e: '🏠', l: 'Just for myself',          sub: 'Personal projects and hobbies' },
    ],
  },
  {
    k: 'context',
    q: 'Where will you use this?',
    hint: 'This helps me recommend the right thing',
    opts: [
      { e: '🏢', l: 'At work',                  sub: 'My job or business' },
      { e: '🎓', l: 'For school or study',      sub: 'Learning, homework, research' },
      { e: '📱', l: 'Online or social media',   sub: 'Posts, videos, followers' },
      { e: '🛒', l: 'For a product or shop',    sub: 'Something to sell or describe' },
      { e: '🌀', l: 'Just exploring',           sub: "Seeing what's out there" },
    ],
  },
  {
    k: 'tone',
    q: 'How should it sound when it talks to you?',
    hint: "Think of the vibe you'd want from a helper",
    opts: [
      { e: '😊', l: 'Warm and friendly',   sub: 'Like chatting with a mate' },
      { e: '👔', l: 'Clean and proper',    sub: 'Like a polished business email' },
      { e: '📖', l: 'Clear and easy',      sub: 'Simple words, step-by-step' },
      { e: '🚀', l: 'Bold and exciting',   sub: 'Energetic, confident, punchy' },
    ],
  },
  {
    k: 'format',
    q: 'What should the answer look like?',
    hint: 'How do you want to receive the result?',
    opts: [
      { e: '📝', l: 'A full piece of writing', sub: 'Ready to copy and use' },
      { e: '📋', l: 'A simple list',           sub: 'Clear bullet points or steps' },
      { e: '📊', l: 'A short summary',         sub: 'Just the key points' },
      { e: '💡', l: 'A few different ideas',   sub: 'Options to pick from' },
      { e: '🗣️', l: 'Explained in plain words',sub: 'Like a friend explaining it' },
    ],
  },
  {
    k: 'audience',
    q: 'Who will see or use this?',
    hint: "Who's it for?",
    opts: [
      { e: '🙋', l: 'Just me',               sub: 'My personal notes or use' },
      { e: '👥', l: 'My team or coworkers',  sub: 'People I work with' },
      { e: '👤', l: 'Customers or clients',  sub: 'People who buy from me' },
      { e: '🌍', l: 'Anyone and everyone',   sub: 'The general public' },
    ],
  },
  {
    k: 'depth',
    q: 'How much detail do you want?',
    hint: 'This shapes how thorough the answer is',
    opts: [
      { e: '⚡', l: 'Short and sweet',   sub: 'Quick, no extra info' },
      { e: '📏', l: 'Full and detailed', sub: 'Cover everything properly' },
      { e: '🎯', l: 'One clear answer',  sub: 'Just tell me the best option' },
      { e: '🧩', l: 'Bite-sized pieces', sub: 'Break it into small chunks' },
    ],
  },
  {
    k: 'experience',
    q: 'Have you used AI tools before?',
    hint: "Totally fine if you haven't — that's what I'm here for!",
    opts: [
      { e: '👋', l: "Never tried it",         sub: 'Complete beginner' },
      { e: '🙂', l: 'A little bit',           sub: 'Played around with ChatGPT etc.' },
      { e: '🧠', l: 'I use it regularly',     sub: 'Comfortable with AI already' },
      { e: '🔧', l: 'I build things with it', sub: 'Connecting it to apps and code' },
    ],
  },
];

// ── Build personalised prompt from answers ────────────────────────────────────
function buildPrompt(answers: Record<string, string>, typed: string): string {
  const roleMap: Record<string, string> = {
    'Still learning': 'a student',
    'I work in an office': 'a business professional',
    'I make things': 'a creative professional',
    'I run or sell things': 'a marketer or business owner',
    'I build with computers': 'a software developer',
    'Just for myself': 'an individual',
  };
  const toneMap: Record<string, string> = {
    'Warm and friendly': 'friendly and conversational',
    'Clean and proper': 'professional and formal',
    'Clear and easy': 'clear and educational with simple explanations',
    'Bold and exciting': 'bold, persuasive, and action-oriented',
  };
  const formatMap: Record<string, string> = {
    'A full piece of writing': 'a ready-to-use written piece',
    'A simple list': 'a numbered list or bullet points',
    'A short summary': 'a concise summary with key points only',
    'A few different ideas': 'a set of creative ideas and options',
    'Explained in plain words': 'a simple plain-language explanation',
  };

  const task = typed || answers.task || 'explore AI';
  const role = roleMap[answers.role] || 'a helpful user';
  const tone = toneMap[answers.tone] || 'clear and helpful';
  const fmt = formatMap[answers.format] || 'a clear, structured response';
  const audience = answers.audience || 'myself';
  const depth = answers.depth === 'Short and sweet' ? 'Keep it brief and concise.' :
    answers.depth === 'Full and detailed' ? 'Be thorough and include all relevant details.' :
    answers.depth === 'One clear answer' ? 'Give me the single best answer only.' : '';
  const isBegin = answers.experience === 'Never tried it' || answers.experience === 'A little bit';

  return `You are a helpful AI assistant speaking to ${role}. Help me with: ${task}.\n\nThis is for: ${audience}. Tone: ${tone}.\n\nPlease format your response as ${fmt}. Start with a concise overview, then walk through practical steps I can act on immediately.${depth ? ' ' + depth : ''}${isBegin ? ' Avoid jargon and explain any technical terms clearly.' : ''}`;
}

type Phase = 'idle' | 'welcome' | 'questions' | 'building';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onLaunch: (prepopPrompt?: string) => void;
  onToast: (msg: string) => void;
}

export default function HeroSearchCard({ value, onChange, onLaunch, onToast }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { setUserGoal, setUserAudience, setUserBudget, setUserLevel } = useAppStore();

  // ── Start countdown when welcome phase begins ─────────────────────────────
  useEffect(() => {
    if (phase !== 'welcome') return;
    setProgress(0);
    const TOTAL = 6000, INTERVAL = 80;
    let elapsed = 0;
    countdownRef.current = setInterval(() => {
      elapsed += INTERVAL;
      setProgress(Math.min(100, (elapsed / TOTAL) * 100));
      if (elapsed >= TOTAL) {
        clearInterval(countdownRef.current!);
        if (phase === 'welcome') startQuestions();
      }
    }, INTERVAL);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Close card when clicking outside ────────────────────────────────────────
  useEffect(() => {
    if (phase === 'idle') return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    setTimeout(() => document.addEventListener('click', handler), 80);
    return () => document.removeEventListener('click', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleClose = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase('idle');
    setStep(0);
    setAnswers({});
    setProgress(0);
  };

  const handleFocus = () => {
    if (phase === 'idle') setPhase('welcome');
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    if (phase === 'idle') setPhase('welcome');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (phase === 'idle' || phase === 'welcome') {
        if (value.trim()) finish();
        else startQuestions();
      }
    }
  };

  const startQuestions = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase('questions');
    setStep(0);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  }, []);

  const pickOpt = (key: string, val: string) => {
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    const nextStep = step + 1;
    if (nextStep >= HS_QUESTIONS.length) {
      finish(newAnswers);
    } else {
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 180);
    }
  };

  const skipStep = () => {
    const nextStep = step + 1;
    if (nextStep >= HS_QUESTIONS.length) {
      finish(answers);
    } else {
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 180);
    }
  };

  const finish = (finalAnswers: Record<string, string> = answers) => {
    setPhase('building');
    // Store user intent in app state
    const taskAns = finalAnswers.task || value;
    setUserGoal(taskAns);
    setUserAudience(finalAnswers.audience || '');
    setUserLevel(finalAnswers.experience || '');
    setUserBudget('');
    const prompt = buildPrompt(finalAnswers, value);
    setTimeout(() => {
      onLaunch(prompt);
    }, 1400);
  };

  const isExpanded = phase !== 'idle';
  const q = HS_QUESTIONS[step];

  return (
    <div
      ref={rootRef}
      className={`${styles.card} ${isExpanded ? styles.focused : ''} ${phase === 'questions' ? styles.questionMode : ''}`}
    >
      {/* ── Always-visible input row (hidden during question/building phases) ── */}
      {phase !== 'questions' && phase !== 'building' && (
        <div className={styles.topRow}>
          <textarea
            ref={taRef}
            className={styles.input}
            placeholder="Click here and type anything — or just say hi! 🙋"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            rows={1}
            autoComplete="off"
          />
          <div className={styles.avatarIcons}>
            <div className={styles.avatarIcon} style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }} title="AI Assistant">
              <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className={styles.avatarIcon} style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }} title="Assistant">
              <svg viewBox="0 0 24 24" fill="white" width="13" height="13">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── Welcome phase ── */}
      {phase === 'welcome' && (
        <div className={styles.welcomePhase}>
          <div className={styles.wpHead}>
            <div className={styles.wpAvatar}>
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className={styles.wpText}>
              <div className={styles.wpTitle}>Hey! 👋 I&apos;m your AI discovery guide.</div>
              <div className={styles.wpSub}>
                I&apos;ll ask you 8 quick questions — no tech knowledge needed — then build you a personalised AI prompt and
                recommend the perfect models for your goal.
              </div>
            </div>
          </div>
          <div className={styles.wpActions}>
            <button className={styles.wpStartBtn} onClick={() => startQuestions()}>
              Start now →
            </button>
            <button className={styles.wpSkipBtn} onClick={() => { if (countdownRef.current) clearInterval(countdownRef.current); onLaunch(); }}>
              Skip intro
            </button>
          </div>
          {/* Countdown progress bar */}
          <div className={styles.countdown}>
            <div className={styles.countdownFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.countdownLabel}>Auto-starting questions in a moment…</div>
        </div>
      )}

      {/* ── Questions phase ── */}
      {phase === 'questions' && (
        <div className={styles.questionsPhase}>
          <div className={styles.qpHeader}>
            <div className={styles.qpEyebrow}>✦ Quick setup</div>
            <button className={styles.qpClose} onClick={handleClose} title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className={`${styles.qpBody} ${animating ? styles.qpFade : ''}`}>
            <div className={styles.qpTitle}>{q.q}</div>
            {q.hint && <div className={styles.qpHint}>{q.hint}</div>}
            <div className={styles.qpOpts}>
              {q.opts.map((o) => (
                <button key={o.l} className={styles.qpOpt} onClick={() => pickOpt(q.k, o.l)}>
                  <span className={styles.qpOptEm}>{o.e}</span>
                  <span>
                    <span className={styles.qpOptLabel}>{o.l}</span>
                    <span className={styles.qpOptSub}>{o.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.qpFooter}>
            <div className={styles.qpDots}>
              {HS_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.qpDot} ${i === step ? styles.qpDotActive : i < step ? styles.qpDotDone : ''}`}
                />
              ))}
            </div>
            <button className={styles.qpSkip} onClick={skipStep}>Skip this →</button>
          </div>
        </div>
      )}

      {/* ── Building phase ── */}
      {phase === 'building' && (
        <div className={styles.buildingPhase}>
          <div className={styles.buildSpinner}>
            <div className={styles.buildDot} />
            <div className={styles.buildDot} />
            <div className={styles.buildDot} />
          </div>
          <div className={styles.buildTitle}>✨ Building your personalised AI prompt…</div>
          <div className={styles.buildSub}>Taking you to the Chat Hub in a moment</div>
        </div>
      )}

      {/* ── Bottom bar (idle/welcome phases) ── */}
      {(phase === 'idle' || phase === 'welcome') && (
        <div className={styles.bottomBar}>
          <button className={styles.ibox} title="Voice input" onClick={() => onToast('🎤 Voice input coming soon')}
            style={{ '--ic': '#7C3AED', '--ic-lt': '#F3EEFF', '--ic-border': 'rgba(124,58,237,0.25)' } as React.CSSProperties}>
            <div className={styles.iboxInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
          </button>
          <button className={styles.ibox} title="Attach file" onClick={() => onToast('📎 Attach file coming soon')}
            style={{ '--ic': '#D97706', '--ic-lt': '#FFFBEB', '--ic-border': 'rgba(217,119,6,0.25)' } as React.CSSProperties}>
            <div className={styles.iboxInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </div>
          </button>
          <button className={styles.ibox} title="Upload image" onClick={() => onToast('🖼️ Upload image coming soon')}
            style={{ '--ic': '#2563EB', '--ic-lt': '#EFF6FF', '--ic-border': 'rgba(37,99,235,0.25)' } as React.CSSProperties}>
            <div className={styles.iboxInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          </button>
          <button className={styles.ibox} title="Video input" onClick={() => onToast('📹 Video input coming soon')}
            style={{ '--ic': '#DC2626', '--ic-lt': '#FEF2F2', '--ic-border': 'rgba(220,38,38,0.22)' } as React.CSSProperties}>
            <div className={styles.iboxInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
          </button>
          <button className={styles.ibox} title="Share screen" onClick={() => onToast('🖥️ Screen sharing coming soon')}
            style={{ '--ic': '#059669', '--ic-lt': '#ECFDF5', '--ic-border': 'rgba(5,150,105,0.25)' } as React.CSSProperties}>
            <div className={styles.iboxInner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <polyline points="8 21 12 17 16 21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
          </button>
          <div className={styles.barSep} />
          <button className={styles.agentChip} onClick={() => onToast('🤖 Agent mode coming soon')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <polyline points="8 21 12 17 16 21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Agent
            <span className={styles.plus}>+</span>
          </button>
          <div style={{ flex: 1 }} />
          <button className={styles.goBtn} onClick={() => phase === 'idle' && value.trim() ? onLaunch() : startQuestions()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Let&apos;s go
          </button>
        </div>
      )}
    </div>
  );
}
