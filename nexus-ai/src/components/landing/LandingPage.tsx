'use client';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import FeaturedModels from './FeaturedModels';
import ComparisonTable from './ComparisonTable';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <LandingNav />
      <HeroSection />
      <FeaturedModels />
      <ComparisonTable />
    </div>
  );
}
