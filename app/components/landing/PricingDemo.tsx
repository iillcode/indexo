"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/landing/Buttons";
import { CheckCircle2, XCircleIcon } from "lucide-react";

function PricingCardDemo() {
  const handleClick = (plan: string) => {
    alert(`Selected ${plan} plan!`);
  };

  const features = [
    "Up to 3 projects",
    "Basic templates",
    "Community support",
    "1GB storage",
  ];

  const lockedFeatures = [
    "Unlimited projects",
    "Premium templates",
    "Priority support",
  ];

  return (
    <div
      className={cn(
        "bg-card relative w-full max-w-sm rounded-xl dark:bg-transparent",
        "p-1.5 shadow-xl backdrop-blur-xl",
        "dark:border-border/80 border"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "bg-muted/80 dark:bg-muted/50 relative mb-4 rounded-xl border p-6"
        )}
      >
        {/* Top glass gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-48 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Plan Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Indie Kit{" "}
            <span className="text-muted-foreground font-normal">
              AI-optimised
            </span>
          </h3>
          <p className="text-muted-foreground text-sm">
            Perfect Starter Kit for building B2C products
          </p>
        </div>

        {/* Price */}
        <div className="mb-4 text-center">
          <div className="flex items-end justify-center gap-2 mb-3">
            <span className="text-6xl font-bold tracking-tight text-foreground">
              $79
            </span>
            <div className="flex flex-col items-start pb-1">
              <span className="text-muted-foreground text-sm line-through">
                $349
              </span>
              <span className="text-green-500 text-sm font-medium">
                $270 off
              </span>
            </div>
          </div>

          {/* Tags */}
          {/* <div className="flex gap-2 justify-center mb-4">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
              One time payment
            </span>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
              Early Access
            </span>
          </div> */}
        </div>

        {/* Button */}
        <Button
          className={cn(
            "w-full font-semibold text-white mb-3",
            "bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
          )}
          onClick={() => handleClick("Indie Kit")}
        >
          Get Indexo
        </Button>

        {/* Limited offer text */}
        <p className="text-center text-muted-foreground text-xs">
          $270 off for the first 450 customers (16 left)
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6 p-3">
        {/* Features List */}
        <ul className="space-y-3">
          {features.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground flex items-start gap-3 text-sm"
            >
              <span className="mt-0.5">
                <CheckCircle2
                  className="h-4 w-4 text-green-500"
                  aria-hidden="true"
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Separator */}
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span className="bg-muted-foreground/40 h-[1px] flex-1" />
          <span className="text-muted-foreground shrink-0">Pro features</span>
          <span className="bg-muted-foreground/40 h-[1px] flex-1" />
        </div>

        {/* Locked Features List */}
        <ul className="space-y-3">
          {lockedFeatures.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground flex items-start gap-3 text-sm opacity-75"
            >
              <span className="mt-0.5">
                <XCircleIcon
                  className="text-destructive h-4 w-4"
                  aria-hidden="true"
                />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingDemo() {
  return (
    <section className="relative py-16" id="pricing">
      {/* Subtle dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient( circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70% )",
        }}
      />
      {/* Radial spotlight */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-1 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full",
          "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
          "blur-[30px]"
        )}
      />

      {/* Header Section */}
      <div className="relative mx-auto max-w-3xl sm:text-center mb-12">
        <h3 className="font-geist mt-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-ellipsis">
          Get everything you need to start building
        </h3>
        <p className="font-geist text-foreground/60 mt-4">
          Everything you need to launch your next big idea.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center">
        <PricingCardDemo />
      </div>
    </section>
  );
}
