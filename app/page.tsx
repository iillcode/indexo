"use client";

import { HeroSection } from "./components/landing/HeroSection";
import RotatingGradient from "./components/landing/RotatingGradient";
import Feature1 from "./components/landing/Feature";
import PricingDemo from "./components/landing/PricingDemo";
import { Footer7 } from "./components/landing/Footer";
import { TabSection } from "./components/landing/TabSections";
import { featureSectionsData } from "./data/featureSectionData";

export default function Home() {
  return (
    <div className=" bg-[#101010] text-white flex flex-col">
      <div className="flex-grow">
        <HeroSection />
        <TabSection />
        {featureSectionsData.map((sectionData, index) => (
          <RotatingGradient
            key={sectionData.id}
            data={sectionData}
            isFirstSection={index === 0}
          />
        ))}
        <PricingDemo />
      </div>
      <Footer7 />
    </div>
  );
}
