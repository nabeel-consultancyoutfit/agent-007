'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { MODELS, MODEL_VARS } from '@/data/models';
import styles from './ModelModal.module.css';

const MODAL_TABS = ['overview', 'guide', 'benchmarks', 'variations', 'api'];

export default function ModelModal() {
  const { modelModalOpen, modelModalId, modelModalTab, closeModelModal, openApp, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState(modelModalTab || 'overview');

  const m = MODELS.find((x) => x.id === modelModalId) || MODELS[0];
  const vars = MODEL_VARS[m.id] || [];

  if (!modelModalOpen) return null;

  const handleProceed = () => {
    closeModelModal();
    openApp('chat');
    setTimeout(() => useAppStore.getState().selectModel(m.id), 200);
  };

  return (
    <div className={styles.overlay} onClick={closeModelModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.modelHead}>
            <div className={styles.modelIcon} style={{ background: m.bg }}>{m.icon}</div>
            <div>
              <div className={styles.modelName}>{m.name}</div>
              <div className={styles.modelOrg}>by {m.org}</div>
            </div>
            {m.badge && (
              <span className={`${styles.badge} ${m.badgeClass}`}>
                {m.badge.charAt(0).toUpperCase() + m.badge.slice(1)}
              </span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={closeModelModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {MODAL_TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${activeTab === t ? styles.on : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {activeTab === 'overview' && (
            <div className={styles.panel}>
              <p className={styles.desc}>{m.desc}</p>
              <div className={styles.statGrid}>
                <div className={styles.stat}><strong>{m.rating}⭐</strong><span>Rating</span></div>
                <div className={styles.stat}><strong>{(m.reviews ?? 0).toLocaleString()}</strong><span>Reviews</span></div>
                <div className={styles.stat}><strong>{m.price}</strong><span>Pricing</span></div>
              </div>
              <div className={styles.tagRow}>
                {m.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
              <div className={styles.capabilities}>
                <div className={styles.capsLabel}>Capabilities</div>
                <div className={styles.capsList}>
                  {(m.types ?? []).map((tp) => (
                    <div key={tp} className={styles.capItem}>
                      <span className={styles.capCheck}>✓</span>
                      <span>{tp.charAt(0).toUpperCase() + tp.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.btnRow}>
                <button className={styles.proceedBtn} onClick={handleProceed}>Use this model →</button>
                <button className={styles.outlineBtn} onClick={() => showToast('📋 API docs coming soon')}>
                  View API Docs
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className={styles.panel}>
              <h3 className={styles.sectionHead}>How to use {m.name}</h3>
              <p className={styles.guideText}>
                {m.name} by {m.org} is optimised for {m.tags.slice(0, 2).join(' and ').toLowerCase()} tasks.
                Here&apos;s how to get started:
              </p>
              <div className={styles.steps}>
                {[
                  { n: '1', t: 'Get API Access', d: `Sign up at ${(m.org || m.lab || '').toLowerCase().replace(/ /g,'')} and obtain your API key from the dashboard.` },
                  { n: '2', t: 'Install SDK',    d: `Install the official SDK: npm install ${(m.org || m.lab || '').toLowerCase().includes('open') ? 'openai' : (m.org || m.lab || '').toLowerCase().replace(/ /g,'-')}` },
                  { n: '3', t: 'Make your first call', d: `Send a POST request with your messages in JSON format. The model will respond with high-quality output.` },
                  { n: '4', t: 'Tune your prompts', d: 'Use system prompts to set context. Be specific about format, length, and tone for best results.' },
                ].map((s) => (
                  <div key={s.n} className={styles.step}>
                    <div className={styles.stepNum}>{s.n}</div>
                    <div>
                      <div className={styles.stepTitle}>{s.t}</div>
                      <div className={styles.stepDesc}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className={styles.panel}>
              <h3 className={styles.sectionHead}>Benchmark Results</h3>
              <div className={styles.benchGrid}>
                {[
                  { name: 'MMLU', score: Math.round(70 + m.rating * 4), max: 100, color: '#1E4DA8' },
                  { name: 'HumanEval', score: Math.round(65 + m.rating * 5), max: 100, color: '#0A5E49' },
                  { name: 'GSM8K', score: Math.round(72 + m.rating * 4), max: 100, color: '#C8622A' },
                  { name: 'MATH', score: Math.round(60 + m.rating * 5), max: 100, color: '#8A5A00' },
                ].map((b) => (
                  <div key={b.name} className={styles.benchItem}>
                    <div className={styles.benchLabel}>
                      <span>{b.name}</span>
                      <span style={{ color: b.color, fontWeight: 700 }}>{b.score}%</span>
                    </div>
                    <div className={styles.benchBar}>
                      <div className={styles.benchFill} style={{ width: `${b.score}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.benchNote}>* Scores are representative estimates based on published results.</p>
            </div>
          )}

          {activeTab === 'variations' && (
            <div className={styles.panel}>
              <h3 className={styles.sectionHead}>Available Variations</h3>
              {vars.length > 0 ? (
                <div className={styles.varList}>
                  {vars.map((v, i) => (
                    <div key={i} className={styles.varCard}>
                      <div className={styles.varName}>{v.label}</div>
                      <div className={styles.varDesc}>{v.desc}</div>
                      <div className={styles.varStats}>
                        <span>Context: <strong>{v.ctx}</strong></span>
                        <span>Input: <strong>{v.input}</strong></span>
                        <span>Output: <strong>{v.output}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noVars}>
                  <div className={styles.noVarsIcon}>🔧</div>
                  <p>One unified version available. Check the provider docs for the latest deployment options.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'api' && (
            <div className={styles.panel}>
              <h3 className={styles.sectionHead}>API Reference</h3>
              <div className={styles.codeBlock}>
                <div className={styles.codeLang}>JavaScript / Node.js</div>
                <pre className={styles.code}>{`import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.API_KEY });

const response = await client.chat.completions.create({
  model: "${m.id}",
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: 1024,
});
console.log(response.choices[0].message.content);`}</pre>
              </div>
              <div className={styles.apiEndpoints}>
                <div className={styles.endpointLabel}>Pricing</div>
                <div className={styles.endpointRow}>
                  <span className={styles.endpointKey}>Rate</span>
                  <span className={styles.endpointVal}>{m.price}</span>
                </div>
                <div className={styles.endpointRow}>
                  <span className={styles.endpointKey}>Free tier</span>
                  <span className={styles.endpointVal}>{m.price_start === 0 ? 'Yes — self-host' : 'Limited trial'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.proceedBtn} onClick={handleProceed}>Use this model →</button>
          <button className={styles.outlineBtn} onClick={closeModelModal}>Close</button>
        </div>
      </div>
    </div>
  );
}
