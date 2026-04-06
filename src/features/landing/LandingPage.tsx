"use client";

import LandingNavbar from "./components/LandingNavbar";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialSection from "./components/TestimonialSection";
import SocialProofSection from "./components/SocialProofSection";
import CreatorsSection from "./components/CreatorsSection";
import EditorialSection from "./components/EditorialSection";
import LandingFooter from "./components/LandingFooter";
import { useScrollAnimations } from "./hooks/useScrollAnimations";

export default function LandingPage() {
  useScrollAnimations();

  return (
    <div className="landing-page overflow-x-clip bg-white text-[#0a0a0a]">
      <LandingNavbar />
      <HeroSection />
      <HowItWorksSection />
      <TestimonialSection />
      <SocialProofSection />
      <CreatorsSection />
      <EditorialSection />
      <LandingFooter />
    </div>
  );
}
