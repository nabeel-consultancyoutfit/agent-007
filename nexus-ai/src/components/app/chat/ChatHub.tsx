'use client';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import InputArea from './InputArea';
import RightPanel from './RightPanel';
import styles from './ChatHub.module.css';

export default function ChatHub() {
  return (
    <div className={styles.chatView}>
      <Sidebar />
      <main className={styles.central}>
        <ChatArea />
        <InputArea />
      </main>
      <RightPanel />
    </div>
  );
}
