"use client";
import { useState } from "react";
import { AnimatedTabs } from "@/app/components/landing/AnimatedTabs";
import { Button } from "@/app/components/landing/Buttons";

interface TabContent {
  title: string;
  description: string;
  features: string[];
  timeSaved: string;
  buttons: string[];
}

const tabContents: Record<string, TabContent> = {
  "Email Setup & Design": {
    title: "Email Setup & Design",
    description:
      "Beautiful, responsive email templates design using react-email",
    features: [
      "Beautiful, responsive email templates design using react-email",
      "Automated welcome & onboarding sequences",
      "SES integration guide",
      "Resend integration guide",
    ],
    timeSaved: "Time saved: 4 hours",
    buttons: ["Resend", "SES", "Mailgun", "Mailchimp"],
  },
  Authentication: {
    title: "Authentication",
    description: "Secure user authentication and authorization systems",
    features: [
      "JWT-based authentication implementation",
      "OAuth2 integration with 10+ social providers",
      "Build in email and otp verifications",
    ],
    timeSaved: "Time saved: 6 hours",
    buttons: ["Auth0", "Supabase"],
  },
  "Database Setup": {
    title: "Database",
    description: "Efficient database design and optimization strategies",
    features: [
      "Database schema design best practices",
      "Index optimization for performance",
      "Migration and seeding scripts",
    ],
    timeSaved: "Time saved: 8 hours",
    buttons: ["Supabase"],
  },
  "API Development": {
    title: "API Development",
    description: "RESTful API development best practices",
    features: [
      "RESTful API design principles",
      "Auth based api routings",
      "Secured responses optimzation",
      "Rate limiting and security measures",
    ],
    timeSaved: "Time saved: 7 hours",
    buttons: ["REST", "GraphQL", "tRPC", "Apollo"],
  },
  "UI Components": {
    title: "UI Components",
    description: "Ready to use tailwind Based componenets",
    features: [
      "Build in landing UI components",
      "Customizable components",
      "Centralized them integrations",
      "Login and signup forms",
    ],
    timeSaved: "Time saved: 7 hours",
    buttons: ["REST", "GraphQL", "tRPC", "Apollo"],
  },
  Payments: {
    title: "Payments    ",
    description: "Ready to use tailwind Based componenets",
    features: [
      "Handle subscriptions and one-time payments",
      "Stripe integration with webhooks and checkout.",
      "Subscription management & billing using Customer Portal.",
    ],
    timeSaved: "Time saved: 7 hours",
    buttons: ["REST", "GraphQL", "tRPC", "Apollo"],
  },
};

export function TabSection() {
  const [activeTab, setActiveTab] = useState("Email Setup & Design");

  const tabs = [
    { label: "Email Setup & Design" },
    { label: "Authentication" },
    { label: "Database Setup" },
    { label: "Payments" },
    { label: "API Development" },
    { label: "UI Components" },
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const currentContent = tabContents[activeTab];

  return (
    <section className="relative ">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-3xl sm:text-center mb-12">
          <h3 className="font-geist mt-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl  text-ellipsis">
            You don't need to write everything, Just call it.
          </h3>
          <p className="font-geist text-foreground/60 mt-4">
            Explore all the feature we provide.
          </p>
        </div>

        <div className="mb-12">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabClick}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl border p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {currentContent.title}
            </h2>

            <p className="text-muted-foreground mb-6">
              {currentContent.description}
            </p>

            <ul className="space-y-3 mb-6">
              {currentContent.features.map((feature, index) => (
                <li key={index} className="text-foreground flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center text-green-500 mb-8">
              <span className="mr-2">✓</span>
              {currentContent.timeSaved}
            </div>

            <div className="flex flex-wrap gap-3">
              {currentContent.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border border-border text-orange-600 hover:bg-orange-500/20 hover:text-gray-200"
                >
                  {button}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
