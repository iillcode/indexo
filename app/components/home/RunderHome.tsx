"use client";

import { HeroSection } from "@/app/components/landing/HeroSection";
import RotatingGradient from "@/app/components/landing/RotatingGradient";

import PricingDemo from "@/app/components/landing/PricingDemo";
import { Footer7 } from "@/app/components/landing/Footer";
import { TabSection } from "@/app/components/landing/TabSections";
import { featureSectionsData } from "@/app/data/featureSectionData";
import { WebPageSEO } from "@/lib/seo/jsonld";

export default function HomeRunder() {
  return (
    <>
      <WebPageSEO
        path="/"
        title="Home page"
        description="Next.js boilerplate. you save hourse"
        breadcrumbs={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_APP_URL}/` },
          { name: "About", item: `${process.env.NEXT_PUBLIC_APP_URL}/about` },
        ]}
      />
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
    </>
  );
}
