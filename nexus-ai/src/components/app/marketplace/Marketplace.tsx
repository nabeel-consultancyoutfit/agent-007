'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import { AI_LABS } from '@/data/labs';
import styles from './Marketplace.module.css';

const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'language', label: 'Language' },
  { key: 'vision', label: 'Vision' },
  { key: 'code', label: 'Code' },
  { key: 'image', label: 'Image Gen' },
  { key: 'audio', label: 'Audio' },
  { key: 'open', label: 'Open Source' },
];

export default function Marketplace() {
  const { openModelModal, openApp, showToast } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLab, setActiveLab] = useState('');

  const filtered = MODELS.filter((m) => {
    const matchSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.lab.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter =
      activeFilter === 'all' ||
      m.tags.some((t) => t.toLowerCase().includes(activeFilter));
    const matchLab = activeLab === '' || m.labId === activeLab || m.lab === activeLab;
    return matchSearch && matchFilter && matchLab;
  });

  return (
    <div className={styles.marketplaceView}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Model Marketplace</span>
        <div className={styles.searchWrap}>
          <div className={styles.searchInner}>
            <div className={styles.searchIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search models, capabilities…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.mktIconBtn} title="Voice search" onClick={() => showToast('🎤 Voice search coming soon')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </button>
        </div>
        <div className={styles.filters}>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filter} ${activeFilter === f.key ? styles.filterOn : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Labs bar */}
      <div className={styles.labsBar}>
        <span className={styles.labsLbl}>🏛 AI Labs</span>
        <div className={styles.labPills}>
          <button
            className={`${styles.labPill} ${activeLab === '' ? styles.labPillOn : ''}`}
            onClick={() => setActiveLab('')}
          >
            All Labs
          </button>
          {AI_LABS.slice(0, 10).map((lab) => (
            <button
              key={lab.id}
              className={`${styles.labPill} ${activeLab === lab.id ? styles.labPillOn : ''}`}
              onClick={() => setActiveLab(activeLab === lab.id ? '' : lab.id)}
            >
              <span>{lab.emoji}</span>
              {lab.name}
              <span className={styles.labPillCount}>{lab.modelCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Sidebar filters */}
        <div className={styles.sidebar}>
          <div className={styles.helpCard} onClick={() => openApp('chat')}>
            <div className={styles.helpTitle}>✦ Need help choosing?</div>
            <div className={styles.helpSub}>Chat with our AI guide for a personalised recommendation in 60 seconds.</div>
          </div>

          <div className={styles.filterSec}>
            <div className={styles.filterTitle}>Provider</div>
            {['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere'].map((p) => (
              <label key={p} className={styles.check}>
                <input type="checkbox" defaultChecked={['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral'].includes(p)} /> {p}
              </label>
            ))}
          </div>

          <div className={styles.filterSec}>
            <div className={styles.filterTitle}>Pricing Model</div>
            {['Pay-per-use', 'Subscription', 'Free tier', 'Enterprise'].map((p) => (
              <label key={p} className={styles.check}>
                <input type="checkbox" defaultChecked={['Pay-per-use', 'Subscription'].includes(p)} /> {p}
              </label>
            ))}
          </div>

          <div className={styles.filterSec}>
            <div className={styles.filterTitle}>Max Price /1M tokens</div>
            <input type="range" className={styles.priceRange} min="0" max="100" defaultValue="100" />
            <div className={styles.rangeLabel}>Up to $100</div>
          </div>

          <div className={styles.filterSec}>
            <div className={styles.filterTitle}>Min Rating</div>
            <div className={styles.ratingBtns}>
              <button className={`${styles.fopt} ${styles.foptOn}`}>Any</button>
              <button className={styles.fopt}>4+ ⭐</button>
              <button className={styles.fopt}>4.5+ ⭐</button>
            </div>
          </div>

          <div className={styles.filterSec}>
            <div className={styles.filterTitle}>Quick Guides</div>
            <div className={styles.guideBtns}>
              <button className={styles.guideBtn} onClick={() => openModelModal('gpt5')}>📐 Prompt engineering tips</button>
              <button className={styles.guideBtn} onClick={() => openModelModal('gpt5')}>🤖 Agent creation guide</button>
              <button className={styles.guideBtn} onClick={() => openModelModal('gpt5')}>💰 Pricing comparison</button>
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className={styles.grid}>
          {filtered.map((model) => (
            <div key={model.id} className={styles.card} onClick={() => openModelModal(model.id)}>
              <div className={styles.cardHead}>
                <div className={styles.cardEmoji}>{model.icon || model.emoji}</div>
                <div className={styles.cardMeta}>
                  {model.badge && (
                    <span className={`badge-${model.badge}`}>
                      {model.badge === 'hot' ? '🔥 Hot' : model.badge === 'new' ? '🆕 New' : '🌐 Open'}
                    </span>
                  )}
                  <div className={styles.cardLab}>{model.lab}</div>
                </div>
              </div>
              <h3 className={styles.cardName}>{model.name}</h3>
              <p className={styles.cardDesc}>{model.tagline || model.desc}</p>
              <div className={styles.cardStats}>
                <span>⭐ {model.rating}</span>
                <span>{model.contextWindow}</span>
                <span className={styles.cardPrice}>{model.price}</span>
              </div>
              <div className={styles.cardTags}>
                {model.tags.slice(0, 3).map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
