'use client';
import { useAppStore } from '@/store/appStore';
import LandingPage from '@/components/landing/LandingPage';
import DashboardPage from '@/components/app/DashboardPage';
import LoginModal from '@/components/shared/LoginModal';
import ModelModal from '@/components/shared/ModelModal';
import Toast from '@/components/shared/Toast';

export default function HomePage() {
  const view = useAppStore((s) => s.view);

  return (
    <>
      {view === 'landing' ? <LandingPage /> : <DashboardPage />}
      <LoginModal />
      <ModelModal />
      <Toast />
    </>
  );
}
