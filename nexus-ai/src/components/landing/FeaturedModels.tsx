'use client';
import { useAppStore } from '@/store/appStore';
import { MODELS } from '@/data/models';
import styles from './FeaturedModels.module.css';

// Show top 6 featured models
const FEATURED = MODELS.slice(0, 6);

export default function FeaturedModels() {
  const { openModelModal, openApp } = useAppStore();

  return (
    <section className={`${styles.section} ${styles.alt}`}>
      <div className={styles.secHd}>
        <h2>Featured Models</h2>
        <span className={styles.secLink} onClick={() => openApp('marketplace')}>
          Browse all 525 →
        </span>
      </div>
      <div className={styles.modelsGrid}>
        {FEATURED.map((model) => (
          <div
            key={model.id}
            className={styles.modelCard}
            onClick={() => openModelModal(model.id)}
          >
            <div className={styles.cardHead}>
              <div className={styles.modelEmoji}>{model.icon || model.emoji}</div>
              <div className={styles.cardMeta}>
                <div className={styles.cardLab}>{model.lab}</div>
                {model.badge && (
                  <span className={`badge-${model.badge}`}>{model.badge === 'hot' ? '🔥 Hot' : model.badge === 'new' ? '🆕 New' : '🌐 Open'}</span>
                )}
              </div>
            </div>
            <h3 className={styles.modelName}>{model.name}</h3>
            <p className={styles.modelDesc}>{model.tagline || model.desc}</p>
            <div className={styles.cardFoot}>
              <div className={styles.cardTags}>
                {model.tags.slice(0, 2).map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              <div className={styles.cardPrice}>{model.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
