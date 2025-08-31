"use client";
// import { Button } from "@/app/components/landing/Buttons";
import { CheckCircle } from "lucide-react";

interface TabContentProps {
  title: string;
  items: string[];
  timeSaved: string;
  buttons: string[];
}

export function TabContent({
  title,
  items,
  timeSaved,
  buttons,
}: TabContentProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-normal text-foreground mb-6">{title}</h2>

      <ul className="space-y-3 mb-6">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-muted-foreground flex items-start gap-3 text-sm"
          >
            <span className="mt-0.5 text-orange-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 text-green-500 mb-6">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Time saved: {timeSaved}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {buttons.map((button, index) => (
          <button
            key={index}
            // variant="outline"
            className=""
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  );
}
