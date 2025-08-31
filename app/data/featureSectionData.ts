import {
  Shield,
  BarChart3,
  Rocket,
  Terminal,
  Paintbrush,
  Cpu,
  Zap,
  Globe,
  Lock,
  Smartphone,
  Database,
  Cloud,
} from "lucide-react";

export interface Feature {
  icon: string; // We'll use string names and map to icons
  title: string;
  desc: string;
}

export interface FeatureSectionData {
  id: string;
  title: string;
  subtitle: string;
  layout: "ltr" | "rtl"; // ltr = card left, content right | rtl = content left, card right
  cardContent: {
    title: string;
    progress: number;
    maxProgress: number;
    description: string;
    buttonText: string;
  };
  contentSection: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink?: string;
  };
  features: Feature[];
}

// Icon mapping
export const iconMap = {
  Shield,
  BarChart3,
  Rocket,
  Terminal,
  Paintbrush,
  Cpu,
  Zap,
  Globe,
  Lock,
  Smartphone,
  Database,
  Cloud,
};

export const featureSectionsData: FeatureSectionData[] = [
  {
    id: "ui-components",
    title: "Build and scale your product with confidence",
    subtitle:
      "From secure foundations and scalable infra to analytics, automation, and a developer-first toolkit.",
    layout: "ltr",
    cardContent: {
      title: "Ruixen UI",
      progress: 92,
      maxProgress: 99,
      description:
        "Building components… please keep the project open until the process is complete.",
      buttonText: "Cancel",
    },
    contentSection: {
      title: "Modern UI Components",
      subtitle:
        "Build beautiful, modern interfaces with our comprehensive component library. No setup, no configuration needed.",
      buttonText: "Try Ruixen UI",
      buttonLink: "/ui-components",
    },
    features: [
      {
        icon: "Shield",
        title: "Enterprise-grade Security",
        desc: "SOC 2-ready controls, SSO/SAML, audit logs, and encryption at rest and in transit.",
      },
      {
        icon: "BarChart3",
        title: "Analytics & Dashboards",
        desc: "Real-time metrics, custom reports, and alerts to measure adoption and ROI.",
      },
      {
        icon: "Rocket",
        title: "Scalable Infrastructure",
        desc: "Auto-scaling, multi-region failover, and a 99.9% uptime SLA as you grow.",
      },
    ],
  },
  {
    id: "api-development",
    title: "Powerful API Development Platform",
    subtitle:
      "Build, test, and deploy APIs with enterprise-grade tools and monitoring.",
    layout: "rtl",
    cardContent: {
      title: "API Gateway",
      progress: 87,
      maxProgress: 100,
      description:
        "Configuring endpoints… setting up authentication and rate limiting.",
      buttonText: "Stop",
    },
    contentSection: {
      title: "REST & GraphQL APIs",
      subtitle:
        "Create robust APIs with built-in documentation, testing tools, and real-time monitoring.",
      buttonText: "Explore APIs",
      buttonLink: "/api-docs",
    },
    features: [
      {
        icon: "Terminal",
        title: "Powerful APIs & Webhooks",
        desc: "Clean REST/GraphQL APIs with webhooks and SDKs for seamless integration.",
      },
      {
        icon: "Globe",
        title: "Global CDN",
        desc: "Lightning-fast API responses with our worldwide content delivery network.",
      },
      {
        icon: "Lock",
        title: "Advanced Security",
        desc: "OAuth2, JWT tokens, rate limiting, and DDoS protection out of the box.",
      },
    ],
  },
  {
    id: "ai-workflows",
    title: "AI-Powered Development Workflows",
    subtitle:
      "Accelerate development with intelligent automation and smart suggestions.",
    layout: "ltr",
    cardContent: {
      title: "AI Assistant",
      progress: 95,
      maxProgress: 100,
      description: "Training models… optimizing suggestions for your codebase.",
      buttonText: "Pause",
    },
    contentSection: {
      title: "Intelligent Automation",
      subtitle:
        "Let AI handle repetitive tasks while you focus on building amazing features.",
      buttonText: "Try AI Tools",
      buttonLink: "/ai-tools",
    },
    features: [
      {
        icon: "Cpu",
        title: "AI-Assisted Workflows",
        desc: "Automation, smart suggestions, and summarization built into your processes.",
      },
      {
        icon: "Paintbrush",
        title: "Brandable UI",
        desc: "Theme, typography, and component-level overrides to match your brand.",
      },
      {
        icon: "Database",
        title: "Smart Data Management",
        desc: "Intelligent data optimization and automated backup strategies.",
      },
    ],
  },
];
