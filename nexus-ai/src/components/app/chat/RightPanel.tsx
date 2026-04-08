'use client';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import styles from './RightPanel.module.css';

const QUICK_ACTIONS_NAV = [
  { icon: '🛍', text: 'Browse Marketplace', tab: 'marketplace' as const },
  { icon: '📖', text: 'How to use Guide', modal: 'guide' },
  { icon: '📐', text: 'Prompt Engineering', modal: 'prompt' },
  { icon: '💰', text: 'View Pricing', modal: 'pricing' },
  { icon: '📊', text: 'AI Models Analysis', msg: 'Give me a detailed analysis and comparison of the top AI models available today' },
];

const QUICK_ACTIONS_CREATE = [
  { icon: '🎨', text: 'Create image', msg: 'Create an image for me' },
  { icon: '🎵', text: 'Generate Audio', msg: 'Generate audio for me' },
  { icon: '🎬', text: 'Create video', msg: 'Create a video for me' },
  { icon: '📊', text: 'Create slides', msg: 'Create a presentation or slides for me' },
  { icon: '📈', text: 'Create Infographs', msg: 'Create an infographic for me' },
  { icon: '❓', text: 'Create quiz', msg: 'Create a quiz for me' },
];

const QUICK_ACTIONS_ANALYZE = [
  { icon: '📄', text: 'Analyze docs', msg: 'Help me analyse documents and extract key information' },
  { icon: '📉', text: 'Analyze Data', msg: 'Help me analyze data' },
  { icon: '✍️', text: 'Write content', msg: 'Help me write content' },
  { icon: '💻', text: 'Generate code', msg: 'Help me with code generation and debugging' },
  { icon: '🌐', text: 'Translate', msg: 'Help me translate text to another language' },
  { icon: '🧠', text: 'Mind map', msg: 'Create a mind map for me' },
];

export default function RightPanel() {
  const { currentModelId, addMessage, openModelModal, switchTab } = useAppStore();
  const model = MODELS.find((m) => m.id === currentModelId);

  const sendSug = (text: string) => {
    addMessage({ role: 'user', text });
  };

  return (
    <aside className={styles.rpanel}>
      {/* Active Model */}
      <div className={styles.rpSec}>
        <div className={styles.rpLbl}>Active Model</div>
        <div className={styles.activeModelCard}>
          <div className={styles.amHead}>
            <div className={styles.amIcon}>{model?.icon || model?.emoji || '🧠'}</div>
            <div>
              <div className={styles.amName}>{model?.name || 'GPT-5.4'}</div>
              <div className={styles.amOrg}>by {model?.lab || 'OpenAI'}</div>
            </div>
            <span className={styles.amLive}>Live</span>
          </div>
          <div className={styles.amDesc}>{model?.tagline || model?.desc || 'Select a model to see details.'}</div>
          <div className={styles.amStats}>
            <div className={styles.amStat}>
              <strong>{model?.contextWindow || '1.05M'}</strong>
              <span>Context</span>
            </div>
            <div className={styles.amStat}>
              <strong>{model?.price || '$2.50'}</strong>
              <span>/1M tk</span>
            </div>
            <div className={styles.amStat}>
              <strong>{model?.rating ? `${model.rating}⭐` : '4.8⭐'}</strong>
              <span>Rating</span>
            </div>
          </div>
          <div className={styles.amBtns}>
            <button className={`${styles.amBtn} ${styles.outline}`} onClick={() => model && openModelModal(model.id)}>Details</button>
            <button className={`${styles.amBtn} ${styles.filled}`} onClick={() => model && openModelModal(model.id)}>Pricing</button>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className={styles.rpSec}>
        <div className={styles.rpLbl}>Usage Overview</div>
        <div className={styles.usageStats}>
          <div className={styles.usageStat}>
            <div className={styles.uLabel}>Requests</div>
            <div className={styles.uVal}>1,284</div>
          </div>
          <div className={styles.usageStat}>
            <div className={styles.uLabel}>Avg Latency</div>
            <div className={styles.uVal}>1.2s</div>
          </div>
          <div className={styles.usageStat}>
            <div className={styles.uLabel}>Cost (today)</div>
            <div className={styles.uVal}>$2.40</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${styles.rpSec} ${styles.qaSection}`}>
        <div className={styles.rpLbl}>Quick Actions</div>

        <div className={styles.qaGroupLabel}>Navigation &amp; Tools</div>
        <div className={styles.qaGrid}>
          {QUICK_ACTIONS_NAV.map((a) => (
            <button
              key={a.text}
              className={styles.qaBtn}
              onClick={() => {
                if (a.tab) switchTab(a.tab);
                else if (a.msg) sendSug(a.msg);
                else if (a.modal && model) openModelModal(model.id);
              }}
            >
              <span className={styles.qaIcon}>{a.icon}</span>
              <span className={styles.qaText}>{a.text}</span>
            </button>
          ))}
        </div>

        <div className={`${styles.qaGroupLabel} ${styles.mt}`}>Create &amp; Generate</div>
        <div className={styles.qaGrid}>
          {QUICK_ACTIONS_CREATE.map((a) => (
            <button key={a.text} className={styles.qaBtn} onClick={() => sendSug(a.msg)}>
              <span className={styles.qaIcon}>{a.icon}</span>
              <span className={styles.qaText}>{a.text}</span>
            </button>
          ))}
        </div>

        <div className={`${styles.qaGroupLabel} ${styles.mt}`}>Analyze &amp; Write</div>
        <div className={styles.qaGrid}>
          {QUICK_ACTIONS_ANALYZE.map((a) => (
            <button key={a.text} className={styles.qaBtn} onClick={() => sendSug(a.msg)}>
              <span className={styles.qaIcon}>{a.icon}</span>
              <span className={styles.qaText}>{a.text}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
