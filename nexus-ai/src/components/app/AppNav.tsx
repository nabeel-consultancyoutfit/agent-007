'use client';
import { useAppStore } from '@/store/appStore';
import type { AppTab } from '@/types';
import styles from './AppNav.module.css';

const TABS: { key: AppTab; label: string; icon: string }[] = [
  { key: 'chat', label: 'Chat Hub', icon: '💬' },
  { key: 'marketplace', label: 'Marketplace', icon: '🛍️' },
  { key: 'research', label: 'Discover New', icon: '🔬' },
  { key: 'agents', label: 'Agents', icon: '🤖' },
];

export default function AppNav() {
  const { activeTab, switchTab, goHome, showToast } = useAppStore();

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={goHome}>
        <div className={styles.logoMark}>
          <svg viewBox="0 0 14 14"><path d="M7 1 L13 7 L7 13 L1 7 Z" fill="white"/></svg>
        </div>
        NexusAI
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.active : ''}`}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Settings" onClick={() => showToast('⚙️ Settings coming soon')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <div className={styles.avatar} title="Profile">D</div>
      </div>
    </nav>
  );
}
