"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Book,
  FileText,
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
}

// Sample tutorial data - replace with your actual data structure
const tutorialCategories: Category[] = [
  {
    id: "layout",
    title: "Layout",
    expanded: true,
    topics: [
      { id: "aspect-ratio", title: "Aspect Ratio", category: "layout" },
      { id: "container", title: "Container", category: "layout" },
      { id: "columns", title: "Columns", category: "layout" },
      { id: "break-after", title: "Break After", category: "layout" },
      { id: "break-before", title: "Break Before", category: "layout" },
      { id: "break-inside", title: "Break Inside", category: "layout" },
      {
        id: "box-decoration-break",
        title: "Box Decoration Break",
        category: "layout",
      },
      { id: "box-sizing", title: "Box Sizing", category: "layout" },
      { id: "display", title: "Display", category: "layout" },
      { id: "floats", title: "Floats", category: "layout" },
      { id: "clear", title: "Clear", category: "layout" },
      { id: "isolation", title: "Isolation", category: "layout" },
      { id: "object-fit", title: "Object Fit", category: "layout" },
      { id: "object-position", title: "Object Position", category: "layout" },
      { id: "overflow", title: "Overflow", category: "layout" },
    ],
  },
  {
    id: "flexbox",
    title: "Flexbox & Grid",
    expanded: false,
    topics: [
      { id: "flex-direction", title: "Flex Direction", category: "flexbox" },
      { id: "flex-wrap", title: "Flex Wrap", category: "flexbox" },
      { id: "flex", title: "Flex", category: "flexbox" },
      { id: "flex-grow", title: "Flex Grow", category: "flexbox" },
      { id: "flex-shrink", title: "Flex Shrink", category: "flexbox" },
      { id: "order", title: "Order", category: "flexbox" },
      {
        id: "grid-template-columns",
        title: "Grid Template Columns",
        category: "flexbox",
      },
      { id: "grid-column", title: "Grid Column", category: "flexbox" },
      {
        id: "grid-template-rows",
        title: "Grid Template Rows",
        category: "flexbox",
      },
      { id: "grid-row", title: "Grid Row", category: "flexbox" },
      { id: "grid-auto-flow", title: "Grid Auto Flow", category: "flexbox" },
      {
        id: "grid-auto-columns",
        title: "Grid Auto Columns",
        category: "flexbox",
      },
      { id: "gap", title: "Gap", category: "flexbox" },
      { id: "justify-content", title: "Justify Content", category: "flexbox" },
      { id: "justify-items", title: "Justify Items", category: "flexbox" },
      { id: "justify-self", title: "Justify Self", category: "flexbox" },
      { id: "align-content", title: "Align Content", category: "flexbox" },
      { id: "align-items", title: "Align Items", category: "flexbox" },
      { id: "align-self", title: "Align Self", category: "flexbox" },
      { id: "place-content", title: "Place Content", category: "flexbox" },
      { id: "place-items", title: "Place Items", category: "flexbox" },
      { id: "place-self", title: "Place Self", category: "flexbox" },
    ],
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
    topics: [
      { id: "width", title: "Width", category: "sizing" },
      { id: "min-width", title: "Min-Width", category: "sizing" },
      { id: "max-width", title: "Max-Width", category: "sizing" },
      { id: "height", title: "Height", category: "sizing" },
      { id: "min-height", title: "Min-Height", category: "sizing" },
      { id: "max-height", title: "Max-Height", category: "sizing" },
      { id: "size", title: "Size", category: "sizing" },
    ],
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
    <div className="h-full bg-[#101010] flex flex-col overflow-hidden pl-6">
      {/* Search Bar */}
      <div className="p-5  ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredCategories.map((category) => (
            <div key={category.id} className="select-none">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2  py-2 text-sm font-medium text-gray-200  rounded transition-colors duration-150"
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
                <div className="ml-[7px] mt-1 space-y-1">
                  {category.topics.map((topic) => (
                    <div key={topic.id} className="relative group ">
                      <button
                        onClick={() => handleTopicClick(topic.id)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-left transition-colors duration-150 relative ${
                          selectedTopic === topic.id
                            ? "text-blue-400 font-medium"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {/* <FileText className="w-4 h-4 text-gray-400" /> */}
                        <span
                          className={`pl-2 ${
                            selectedTopic === topic.id
                              ? "text-blue-400 font-medium"
                              : "text-gray-200 hover:text-white"
                          }`}
                        >
                          {topic.title}
                        </span>
                      </button>

                      {/* Thin vertical line indicator */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 ${
                          selectedTopic === topic.id
                            ? "bg-blue-400"
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
      </div>
    </div>
  );
}
