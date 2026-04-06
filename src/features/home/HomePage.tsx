"use client";

import { useState } from "react";

import LoadingScreen from "./components/LoadingScreen";
import HeroSection from "./components/HeroSection";
import CollaboratorsSection from "./components/CollaboratorsSection";
import CommunitySection from "./components/CommunitySection";
import TestimonialSection from "./components/TestimonialSection";
import CTAFooter from "./components/CTAFooter";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <main>
        <HeroSection animate={loaded} />
        <CollaboratorsSection />
        <CommunitySection />
        <TestimonialSection />
        <CTAFooter />
      </main>
    </>
  );
}
