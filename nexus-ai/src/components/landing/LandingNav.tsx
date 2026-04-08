'use client';
import { useRef, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import styles from './LandingNav.module.css';

const LANGUAGES = [
  { code: 'EN', label: 'English', flag: '🇺🇸' },
  { code: 'AR', label: 'العربية', flag: '🇸🇦' },
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
  { code: 'PT', label: 'Português', flag: '🇧🇷' },
  { code: 'ZH', label: '中文', flag: '🇨🇳' },
  { code: 'JA', label: '日本語', flag: '🇯🇵' },
  { code: 'KO', label: '한국어', flag: '🇰🇷' },
  { code: 'HI', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'UR', label: 'اردو', flag: '🇵🇰' },
];

export default function LandingNav() {
  const { openApp, showLoginModal, langCode, langMenuOpen, setLang, toggleLangMenu, closeLangMenu } = useAppStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeLangMenu();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [closeLangMenu]);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => useAppStore.getState().goHome()}>
        <div className={styles.logoMark}>
          <svg viewBox="0 0 14 14"><path d="M7 1 L13 7 L7 13 L1 7 Z" fill="white"/></svg>
        </div>
        NexusAI
      </div>

      <ul className={styles.navLinks}>
        <li><a onClick={() => openApp('chat')}>Chat Hub</a></li>
        <li><a onClick={() => openApp('marketplace')}>Marketplace</a></li>
        <li><a onClick={() => openApp('research')}>Discover New</a></li>
        <li><a onClick={() => openApp('agents')}>Agents</a></li>
      </ul>

      <div className={styles.navActions}>
        {/* Language selector */}
        <div className={styles.langWrap} ref={menuRef}>
          <button className={styles.langBtn} onClick={toggleLangMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>{langCode}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 10, height: 10 }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {langMenuOpen && (
            <div className={styles.langMenu}>
              <div className={styles.langMenuHead}>App Language</div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`${styles.langOpt} ${langCode === lang.code ? styles.active : ''}`}
                  onClick={() => setLang(lang.code, lang.label)}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={styles.btnGhost} onClick={showLoginModal}>Sign in</button>
        <button className={styles.btnPrimary} onClick={() => openApp('chat')}>Get Started →</button>
      </div>
    </nav>
  );
}
