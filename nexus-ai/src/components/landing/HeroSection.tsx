'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { SQ_DATA } from '@/data/capApps';
import HeroSearchCard from './HeroSearchCard';
import styles from './HeroSection.module.css';

const ACTION_BTNS = [
  { icon: '🎨', label: 'Create image',    query: 'Create an image for me' },
  { icon: '🎵', label: 'Generate Audio',  query: 'Generate audio for me' },
  { icon: '🎬', label: 'Create video',    query: 'Create a video for me' },
  { icon: '📊', label: 'Create slides',   query: 'Create a presentation or slides for me' },
  { icon: '📈', label: 'Create Infographs', query: 'Create an infographic for me' },
  { icon: '❓', label: 'Create quiz',     query: 'Create a quiz for me' },
  { icon: '🗂️', label: 'Create Flashcards', query: 'Create flashcards for me' },
  { icon: '🧠', label: 'Create Mind map', query: 'Create a mind map for me' },
  { icon: '📉', label: 'Analyze Data',    query: 'Help me analyze data' },
  { icon: '✍️', label: 'Write content',   query: 'Help me write content' },
  { icon: '💻', label: 'Generate code',   query: 'Help me with code generation and debugging' },
  { icon: '📄', label: 'Analyze docs',    query: 'Help me analyse documents and extract key information' },
];

const SQ_TABS = [
  { key: 'recruiting', label: 'Recruiting' },
  { key: 'prototype', label: 'Create a prototype' },
  { key: 'business', label: 'Build a business' },
  { key: 'learn', label: 'Help me learn' },
  { key: 'research', label: 'Research' },
];

export default function HeroSection() {
  const { openApp, showToast } = useAppStore();
  const [sqTab, setSqTab] = useState('recruiting');
  const [inputVal, setInputVal] = useState('');

  const launchWithQuery = (prepopPrompt?: string) => {
    const { setPrepopPrompt } = useAppStore.getState();
    if (prepopPrompt) setPrepopPrompt(prepopPrompt);
    const val = inputVal.trim();
    openApp('chat');
    if (val && !prepopPrompt) {
      setTimeout(() => {
        useAppStore.getState().addMessage({ role: 'user', text: val });
      }, 300);
    }
  };

  const quickLaunch = (q: string) => {
    openApp('chat');
    setTimeout(() => {
      useAppStore.getState().addMessage({ role: 'user', text: q });
    }, 300);
  };

  const fillInput = (text: string) => {
    setInputVal(text);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroEyebrow}>
        <span className={styles.liveDot}></span>
        347 models live · Updated daily
      </div>

      <h1 className={styles.heroTitle}>
        Find your perfect <span className={styles.accent}>AI model</span><br />
        with guided discovery
      </h1>

      <p className={styles.heroSub}>
        You don&apos;t need to know anything about AI to get started. Just click the box below — we&apos;ll do the rest together. ✨
      </p>

      <HeroSearchCard
        value={inputVal}
        onChange={setInputVal}
        onLaunch={launchWithQuery}
        onToast={showToast}
      />

      {/* Suggested questions panel */}
      <div className={styles.sqPanel}>
        <div className={styles.sqTabs}>
          {SQ_TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.sqTab} ${sqTab === t.key ? styles.active : ''}`}
              onClick={() => setSqTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.sqBody}>
          <div className={styles.sqList}>
            {(SQ_DATA[sqTab] || []).map((q, i) => (
              <button key={i} className={styles.sqItem} onClick={() => fillInput(q.text)}>
                <span className={styles.sqIcon}>{q.icon}</span>
                <span className={styles.sqText}>{q.text}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sqFooter}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Click any suggestion to fill the search box, then press <strong>Let&apos;s go</strong>
        </div>
      </div>

      {/* Action grid */}
      <div className={styles.actionGrid}>
        {ACTION_BTNS.map((b) => (
          <button key={b.label} className={styles.actionBtn} onClick={() => quickLaunch(b.query)}>
            <span className={styles.actionIcon}>{b.icon}</span>
            <span className={styles.actionLabel}>{b.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
