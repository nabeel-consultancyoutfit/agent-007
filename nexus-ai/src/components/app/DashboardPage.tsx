'use client';
import { useAppStore } from '@/store/appStore';
import AppNav from './AppNav';
import ChatHub from './chat/ChatHub';
import Marketplace from './marketplace/Marketplace';
import AgentsPage from './agents/AgentsPage';
import DiscoverPage from './discover/DiscoverPage';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { activeTab } = useAppStore();

  return (
    <div className={styles.page}>
      <AppNav />
      <div className={styles.appBody}>
        {activeTab === 'chat' && <ChatHub />}
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'research' && <DiscoverPage />}
        {activeTab === 'agents' && <AgentsPage />}
      </div>
    </div>
  );
}
