'use client';
import { useAppStore } from '@/store/appStore';
import styles from './Toast.module.css';

export default function Toast() {
  const { toastMsg, toastVisible } = useAppStore();
  return (
    <div className={`${styles.toast} ${toastVisible ? styles.show : ''}`}>
      {toastMsg}
    </div>
  );
}
