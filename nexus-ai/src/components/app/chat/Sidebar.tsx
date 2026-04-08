'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { currentModelId, selectModel, switchTab } = useAppStore();
  const [search, setSearch] = useState('');

  const filtered = MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.lab.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sec} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className={styles.lbl}>Models</div>
        <input
          className={styles.search}
          type="text"
          placeholder="Search 525 models…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.modelList}>
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`${styles.model} ${currentModelId === m.id ? styles.active : ''}`}
              onClick={() => selectModel(m.id)}
            >
              <div className={styles.modelIcon}>{m.icon || m.emoji}</div>
              <div className={styles.modelInfo}>
                <div className={styles.modelName}>{m.name}</div>
                <div className={styles.modelMeta}>
                  <span className={`${styles.dot} ${styles.live}`}></span>
                  {m.lab}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sec}>
        <div
          className={styles.createAgent}
          onClick={() => { switchTab('agents'); }}
        >
          <div className={styles.createAgentTitle}>+ Create Agent</div>
          <div className={styles.createAgentSub}>Build a custom AI agent with any model</div>
        </div>
      </div>
    </aside>
  );
}
