"use client";

import { useState } from "react";
import Link from "next/link";
import { Book, FileCode } from "lucide-react";
import TutorialNavigation from "../components/TutorialNavigation";
import TutorialContent from "../components/TutorialContent";

export default function DocsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  return (
    <div className="h-screen bg-[#1a1a1a] text-white flex flex-col overflow-hidden ">
      {/* Header */}
      <div className="h-12 bg-[#1a1a1a] border-b border-gray-700 flex items-center px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">Indexo</h1>
          <span className="text-sm text-gray-400">Developer Tutorial</span>
        </div>

        {/* Navigation Links */}
        <div className="ml-6 flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-md p-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              <FileCode className="w-4 h-4" />
              Dictionary
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors bg-blue-600 text-white"
            >
              <Book className="w-4 h-4" />
              Tutorials
            </Link>
          </div>
        </div>

        {selectedTopic && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">Current topic:</span>
            <span className="text-sm text-blue-400 font-mono">
              {selectedTopic}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden ">
        {/* Navigation Section */}
        <div className="w-[25%] border-r border-gray-700 overflow-hidden">
          <TutorialNavigation
            onTopicSelect={handleTopicSelect}
            selectedTopic={selectedTopic}
          />
        </div>

        {/* Tutorial Content Section */}
        <div className="w-[75%] overflow-hidden ">
          <TutorialContent selectedTopic={selectedTopic} />
        </div>
      </div>
    </div>
  );
}
