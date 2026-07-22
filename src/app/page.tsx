/**
 * Landing Page — Async Server Component
 *
 * Fetches all landing content server-side (never in the browser) then
 * passes typed props down to each section. With ISR enabled, Next.js
 * caches the rendered HTML and only re-fetches Supabase after the
 * revalidation window expires — users always get pre-rendered HTML
 * with zero blank flash.
 *
 * Revalidation: 300 seconds (5 minutes).
 * For instant propagation after admin edits, wire up an on-demand
 * revalidation webhook that calls: revalidatePath('/') from a
 * protected API route triggered by the admin "Save" button.
 */
import { getLandingContent } from "@/lib/site-content";

import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerBar from "@/components/TickerBar";
import FeaturesSection from "@/components/FeaturesSection";
import DigitalAssetsSection from "@/components/DigitalAssetsSection";
import OnboardingSection from "@/components/OnboardingSection";
import AppPreviewSection from "@/components/AppPreviewSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

// ISR: re-render this page at most every 5 minutes.
// Remove or set to 0 for fully dynamic (per-request) rendering.
export const revalidate = 300;

export default async function Home() {
  const content = await getLandingContent();

  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
      <Navbar />
      <HeroSection content={content.hero} />
      <TickerBar />

      <FeaturesSection content={content.features} />
      <DigitalAssetsSection content={content.assets} />
      <OnboardingSection content={content.onboarding} />
      <AppPreviewSection content={content.app} />

      <CTASection content={content.cta} />
      <Footer content={content.footer} />
    </main>
  );
}
