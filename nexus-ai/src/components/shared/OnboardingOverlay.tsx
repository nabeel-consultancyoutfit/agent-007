'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import styles from './OnboardingOverlay.module.css';

const OB_QUESTIONS = [
  {
    k: 'goal',
    heading: 'What do you want to do with AI?',
    opts: [
      { e: '✍️', l: 'Write content',      sub: 'Emails, posts, stories' },
      { e: '🎨', l: 'Create images',      sub: 'Art, photos, designs' },
      { e: '💻', l: 'Build something',    sub: 'Websites, apps, scripts' },
      { e: '📊', l: 'Analyse data',       sub: 'Files, numbers, documents' },
      { e: '⚡', l: 'Automate tasks',     sub: 'Save time every day' },
      { e: '💬', l: 'Get help & answers', sub: 'Questions, brainstorming' },
    ]
  },
  {
    k: 'role',
    heading: 'What best describes you?',
    opts: [
      { e: '🎓', l: 'Student / learner',  sub: 'New to this' },
      { e: '💼', l: 'Office professional', sub: 'Business, meetings' },
      { e: '🎨', l: 'Creative',           sub: 'Art, design, writing' },
      { e: '📣', l: 'Marketer / seller',  sub: 'Brand, clients' },
      { e: '💻', l: 'Developer',          sub: 'Code, websites, tech' },
      { e: '🔬', l: 'Researcher',         sub: 'Science, academia' },
    ]
  },
  {
    k: 'budget',
    heading: 'What\'s your budget?',
    opts: [
      { e: '🆓', l: 'Free only',     sub: 'Open-source models' },
      { e: '💵', l: 'Low cost',      sub: 'Under $20/month' },
      { e: '💰', l: 'Flexible',      sub: 'Best quality matters' },
      { e: '🏢', l: 'Enterprise',    sub: 'Team / company budget' },
    ]
  },
];

type OBScreen = 'welcome' | 'questions' | 'done';

export default function OnboardingOverlay() {
  const [screen, setScreen] = useState<OBScreen>('welcome');
  const [qIdx, setQIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const { setView, setObDone, setUserGoal, setUserAudience, setUserBudget, openApp } = useAppStore();

  // Check localStorage to not re-show if already completed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem('nexusai_ob_done');
      if (done) setVisible(false);
    }
  }, []);

  if (!visible) return null;

  const currentQ = OB_QUESTIONS[qIdx];

  const handleStart = () => setScreen('questions');

  const handleOpt = (val: string) => {
    const k = currentQ.k;
    if (k === 'goal') setUserGoal(val);
    if (k === 'role') setUserAudience(val);
    if (k === 'budget') setUserBudget(val);

    if (qIdx < OB_QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setScreen('done');
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== 'undefined') localStorage.setItem('nexusai_ob_done', '1');
      }, 1800);
    }
  };

  const handleSkip = () => {
    if (qIdx < OB_QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
    } else {
      setScreen('done');
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== 'undefined') localStorage.setItem('nexusai_ob_done', '1');
      }, 1800);
    }
  };

  return (
    <div className={styles.overlay}>
      {/* Welcome screen */}
      {screen === 'welcome' && (
        <div className={styles.welcomeScreen}>
          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className={styles.welcomeTitle}>Welcome to NexusAI 👋</div>
          <div className={styles.welcomeSub}>
            Think of this as your personal guide to the world of AI.<br /><br />
            You don&apos;t need to be a tech expert — we&apos;ll walk you through everything, one simple step at a time,
            and help you find exactly what you need.<br /><br />
            <strong>Ready? It only takes a minute. 🚀</strong>
          </div>
          <button className={styles.startBtn} onClick={handleStart}>Let&apos;s get started →</button>
        </div>
      )}

      {/* Question screen */}
      {screen === 'questions' && (
        <div className={styles.qScreen}>
          <div className={styles.qInner}>
            <div className={styles.qLabel}>Quick question {qIdx + 1} of {OB_QUESTIONS.length}</div>
            <div className={styles.qHeading}>{currentQ.heading}</div>
            <div className={styles.optList}>
              {currentQ.opts.map((o) => (
                <button key={o.l} className={styles.opt} onClick={() => handleOpt(o.l)}>
                  <span className={styles.optEmoji}>{o.e}</span>
                  <div>
                    <div className={styles.optLabel}>{o.l}</div>
                    <div className={styles.optSub}>{o.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className={styles.qFooter}>
              <div className={styles.dots}>
                {OB_QUESTIONS.map((_, i) => (
                  <div key={i} className={`${styles.dot} ${i === qIdx ? styles.dotActive : i < qIdx ? styles.dotDone : ''}`} />
                ))}
              </div>
              <button className={styles.skipBtn} onClick={handleSkip}>Skip this →</button>
            </div>
          </div>
        </div>
      )}

      {/* Done screen */}
      {screen === 'done' && (
        <div className={styles.doneScreen}>
          <div className={styles.doneIcon}>🎉</div>
          <div className={styles.doneTitle}>You&apos;re all set!</div>
          <div className={styles.doneSub}>Taking you to your personalised hub…</div>
        </div>
      )}
    </div>
  );
}
