"use client";

import { useState } from "react";
import Link from "next/link";
import { Book, FileCode } from "lucide-react";
import TutorialNavigation from "../components/TutorialNavigation";
import TutorialContent from "../components/TutorialContent";

export default function DocsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleToggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className="h-screen bg-[#101010] text-white flex flex-col overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Section */}
        <div
          className={`border-r border-gray-800 bg-[#111111] overflow-hidden transition-all duration-300 ease-in-out ${
            isNavCollapsed ? "w-16" : "w-[20%]"
          }`}
        >
          <TutorialNavigation
            onTopicSelect={handleTopicSelect}
            selectedTopic={selectedTopic}
            isCollapsed={isNavCollapsed}
            onToggleCollapse={handleToggleNav}
          />
        </div>

        {/* Tutorial Content Section */}
        <div className="flex-1 overflow-hidden relative z-10">
          <TutorialContent selectedTopic={selectedTopic} />
        </div>
      </div>
    </div>
  );
}
