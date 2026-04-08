'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { RESEARCH } from '@/data/research';
import type { ResearchPaper } from '@/types';
import styles from './DiscoverPage.module.css';

const RF_TABS = [
  { key: 'all', label: 'All' },
  { key: 'reasoning', label: '🧠 Reasoning' },
  { key: 'multimodal', label: '🌐 Multimodal' },
  { key: 'alignment', label: '🛡️ Alignment' },
  { key: 'efficiency', label: '⚡ Efficiency' },
  { key: 'openweights', label: '🔓 Open Weights' },
];

export default function DiscoverPage() {
  const { openApp, addMessage, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  const filtered = RESEARCH.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  const discuss = (paper: ResearchPaper) => {
    openApp('chat');
    setTimeout(() => {
      addMessage({ role: 'user', text: `Tell me more about the research: "${paper.title}"` });
    }, 300);
  };

  return (
    <div className={styles.discoverView}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>AI Research Feed</h2>
            <span className={styles.headerSub}>Curated breakthroughs · Updated daily</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot}></span>
              <span>6 papers this week</span>
            </div>
            <button className={styles.subscribeBtn} onClick={() => showToast('🔔 Subscribed!')}>
              🔔 Subscribe
            </button>
          </div>
        </div>
        <div className={styles.rfTabs}>
          {RF_TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.rfTab} ${activeTab === t.key ? styles.rfTabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split body */}
      <div className={styles.body}>
        {/* Left: card list */}
        <div className={styles.listCol}>
          {filtered.map((paper) => (
            <div
              key={paper.id}
              className={`${styles.paperCard} ${selectedPaper?.id === paper.id ? styles.paperCardActive : ''}`}
              onClick={() => setSelectedPaper(paper)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardOrg}>{paper.lab}</span>
                <span className={`${styles.cardBadge} ${styles[`cat_${paper.category}`]}`}>
                  {paper.category}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{paper.title}</h3>
              <p className={styles.cardAbstract}>{paper.abstract?.substring(0, 140)}…</p>
              <div className={styles.cardMeta}>
                <span className={styles.cardDate}>{paper.date}</span>
                {paper.stats?.map((s, i) => (
                  <span key={i} className={styles.cardStat}>{s.icon} {s.value} {s.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div className={`${styles.detailCol} ${!selectedPaper ? styles.empty : ''}`}>
          {!selectedPaper ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔬</div>
              <div className={styles.emptyTitle}>Select a paper</div>
              <div className={styles.emptySub}>Click any card on the left to read the full details, key findings, and models referenced.</div>
            </div>
          ) : (
            <div className={styles.detail}>
              <div className={styles.detailBanner}>
                <div className={styles.detailOrg}>{selectedPaper.lab}</div>
                <h2 className={styles.detailTitle}>{selectedPaper.title}</h2>
                <div className={styles.detailMeta}>
                  {selectedPaper.date} · {selectedPaper.category}
                </div>
              </div>
              <div className={styles.detailBody}>
                <h4 className={styles.detailSection}>Abstract</h4>
                <p className={styles.detailText}>{selectedPaper.abstract}</p>

                {selectedPaper.findings && (
                  <>
                    <h4 className={styles.detailSection}>Key Findings</h4>
                    <ul className={styles.findingsList}>
                      {selectedPaper.findings.map((f, i) => (
                        <li key={i} className={styles.findingItem}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedPaper.models && (
                  <>
                    <h4 className={styles.detailSection}>Models Referenced</h4>
                    <div className={styles.modelTags}>
                      {selectedPaper.models.map((m) => (
                        <span key={m} className={styles.modelTag}>{m}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.actionBar}>
                <button className={styles.btnPrimary} onClick={() => discuss(selectedPaper)}>
                  💬 Discuss in Chat Hub
                </button>
                <button className={styles.btnGhost} onClick={() => showToast('🔖 Paper bookmarked!')}>
                  🔖 Save
                </button>
                <button className={styles.btnGhost} onClick={() => showToast('🔗 Link copied!')}>
                  🔗 Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
