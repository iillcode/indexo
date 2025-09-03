"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  FileText,
  Menu,
  X,
  User,
} from "lucide-react";

interface Topic {
  id: string;
  title: string;
  category: string;
}

interface Category {
  id: string;
  title: string;
  topics: Topic[];
  expanded?: boolean;
}

interface TutorialNavigationProps {
  onTopicSelect: (topicId: string) => void;
  selectedTopic: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Sample tutorial data - replace with your actual data structure
const tutorialCategories: Category[] = [
  {
    id: "layout",
    title: "Layout",
    expanded: true,
    topics: [
      { id: "Start your page", title: "Start your page", category: "layout" },
      { id: "Create SEO page", title: "Create SEO page", category: "layout" },
      {
        id: "Private Route Integration",
        title: "Private Route Integration",
        category: "layout",
      },
      {
        id: "Centralized app configuration",
        title: "Centralized app configuration",
        category: "layout",
      },
      {
        id: "Payment integration",
        title: "Payment integration",
        category: "layout",
      },
      {
        id: "Authentications",
        title: "Authentications",
        category: "layout",
      },
    ],
  },
  {
    id: "flexbox",
    title: "Flexbox & Grid",
    expanded: false,
    topics: [],
  },
  {
    id: "spacing",
    title: "Spacing",
    expanded: false,
    topics: [
      { id: "padding", title: "Padding", category: "spacing" },
      { id: "margin", title: "Margin", category: "spacing" },
      { id: "space-between", title: "Space Between", category: "spacing" },
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    expanded: false,
    topics: [{ id: "width", title: "Width", category: "sizing" }],
  },
  {
    id: "typography",
    title: "Typography",
    expanded: false,
    topics: [
      { id: "font-family", title: "Font Family", category: "typography" },
      { id: "font-size", title: "Font Size", category: "typography" },
      { id: "font-smoothing", title: "Font Smoothing", category: "typography" },
      { id: "font-style", title: "Font Style", category: "typography" },
      { id: "font-weight", title: "Font Weight", category: "typography" },
      {
        id: "font-variant-numeric",
        title: "Font Variant Numeric",
        category: "typography",
      },
      { id: "letter-spacing", title: "Letter Spacing", category: "typography" },
      { id: "line-clamp", title: "Line Clamp", category: "typography" },
      { id: "line-height", title: "Line Height", category: "typography" },
      {
        id: "list-style-image",
        title: "List Style Image",
        category: "typography",
      },
      {
        id: "list-style-position",
        title: "List Style Position",
        category: "typography",
      },
      {
        id: "list-style-type",
        title: "List Style Type",
        category: "typography",
      },
      { id: "text-align", title: "Text Align", category: "typography" },
      { id: "text-color", title: "Text Color", category: "typography" },
      {
        id: "text-decoration",
        title: "Text Decoration",
        category: "typography",
      },
      {
        id: "text-decoration-color",
        title: "Text Decoration Color",
        category: "typography",
      },
      {
        id: "text-decoration-style",
        title: "Text Decoration Style",
        category: "typography",
      },
      {
        id: "text-decoration-thickness",
        title: "Text Decoration Thickness",
        category: "typography",
      },
      {
        id: "text-underline-offset",
        title: "Text Underline Offset",
        category: "typography",
      },
      { id: "text-transform", title: "Text Transform", category: "typography" },
      { id: "text-overflow", title: "Text Overflow", category: "typography" },
      { id: "text-wrap", title: "Text Wrap", category: "typography" },
      { id: "text-indent", title: "Text Indent", category: "typography" },
      { id: "vertical-align", title: "Vertical Align", category: "typography" },
      { id: "whitespace", title: "Whitespace", category: "typography" },
      { id: "word-break", title: "Word Break", category: "typography" },
      { id: "hyphens", title: "Hyphens", category: "typography" },
      { id: "content", title: "Content", category: "typography" },
    ],
  },
];

export default function TutorialNavigation({
  onTopicSelect,
  selectedTopic,
  isCollapsed,
  onToggleCollapse,
}: TutorialNavigationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>(tutorialCategories);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder="Quick search..."]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      topics: category.topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.topics.length > 0 || searchTerm === "");

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const handleTopicClick = (topicId: string) => {
    onTopicSelect(topicId);
  };

  return (
    <div
      className={`h-full bg-[#111111] flex flex-col overflow-hidden transition-all duration-300 ease-in-out border-r border-[#101010]/10 ${
        isCollapsed ? "w-16" : "w-full"
      }`}
    >
      {/* Header with Toggle Button */}
      <div className="px-3 pt-2 flex items-center justify-between sticky top-0 z-10 bg-[#111111]">
        <div
          className={`flex flex-row items-center gap-2 text-2xl font-bold text-white transition-all duration-300 ${
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <img className="h-8 w-8" src="/app.icon.svg" alt="" />
          <p>Indexo</p>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-md hover:bg-gray-700/20 transition-colors duration-200 ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label="Toggle navigation"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-white" />
          ) : (
            <X className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
      {/* Search Bar with Shadow Effect */}
      {!isCollapsed && (
        <div className="px-3 pt-2 pb-2 sticky top-14 z-10 bg-[#111111]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-20" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md pl-12 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none backdrop-blur-sm"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Ctrl K
            </span>
          </div>
          {/* Shadow fade effect */}
          <div className="h-4 bg-gradient-to-b from-[#111111] to-transparent w-full absolute left-0 bottom-0 translate-y-full pointer-events-none"></div>
        </div>
      )}

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
        {!isCollapsed ? (
          <div className="space-y-1 py-2">
            {filteredCategories.map((category) => (
              <div key={category.id} className="select-none">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 py-2 text-sm font-medium text-gray-200 rounded transition-colors duration-150 hover:bg-gray-700/20"
                >
                  {category.expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-white">{category.title}</span>
                </button>

                {/* Topics */}
                {(category.expanded || searchTerm) && (
                  <div className="ml-[7px] mt-1 space-y-1 relative">
                    {/* Vertical connecting line that runs through all topics */}
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-700"></div>

                    {category.topics.map((topic) => (
                      <div key={topic.id} className="relative group">
                        <button
                          onClick={() => handleTopicClick(topic.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left transition-colors duration-150 relative rounded-md ${
                            selectedTopic === topic.id
                              ? "text-orange-400 font-medium "
                              : "text-gray-300 hover:text-orange-200 "
                          }`}
                        >
                          <span
                            className={`pl-2 ${
                              selectedTopic === topic.id
                                ? "text-orange-400 font-medium"
                                : "text-gray-200 hover:text-orange-200"
                            }`}
                          >
                            {topic.title}
                          </span>
                        </button>

                        {/* Thin vertical line indicator */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 rounded-r ${
                            selectedTopic === topic.id
                              ? "bg-orange-400"
                              : "bg-transparent group-hover:bg-gray-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Collapsed Navigation - Show only icons */
          <div className="space-y-2 py-4">
            {tutorialCategories.map((category) => (
              <div
                key={category.id}
                className="flex justify-center"
                title={category.title}
              >
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-2 rounded-md hover:bg-orange-500/20 transition-colors duration-200"
                >
                  {/* Removed FileText icon to clean up collapsed view */}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className={` p-3 ${isCollapsed ? "flex justify-center" : ""}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
        ) : (
          <button className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
            <User className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
