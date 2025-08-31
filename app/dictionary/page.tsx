"use client";

import { useState } from "react";
import Link from "next/link";
import { Book, FileCode } from "lucide-react";
import FolderTree from "../components/FolderTree";
import CodeSection from "../components/CodeSection";
import GuideSection from "../components/GuideSection";
import { projectStructure, type FileNode } from "../data/projectData";

interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified?: boolean;
  source: "tree" | "guide"; // Track where the tab was opened from
  icon?: string;
}

export default function DictionaryPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [focusedFile, setFocusedFile] = useState<string | null>(null);
  const [focusTick, setFocusTick] = useState(0);

  const findNodeByPath = (
    node: FileNode,
    targetPath: string
  ): FileNode | null => {
    if (node.path === targetPath) return node;
    if (node.type === "folder" && node.children) {
      for (const child of node.children) {
        const found = findNodeByPath(child, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const getIconForPath = (filePath: string): string | undefined => {
    const node = findNodeByPath(projectStructure, filePath);
    return node?.icon;
  };

  const handleFileSelect = (
    filePath: string,
    content: string,
    lang: string
  ) => {
    const fileName = getFileName(filePath);
    const tabId = `tab-${Date.now()}-${fileName}`;

    // Check if tab already exists
    const existingTab = tabs.find((tab) => tab.path === filePath);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      setSelectedFile(filePath);
      setFocusedFile(filePath); // highlight in tree when clicked
      return;
    }

    const newTab: Tab = {
      id: tabId,
      name: fileName,
      path: filePath,
      content,
      language: lang,
      source: "tree",
      icon: getIconForPath(filePath),
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTabId(tabId);
    setSelectedFile(filePath);
    setFocusedFile(filePath); // highlight in tree when clicked
  };

  const handleFileFocus = (filePath: string) => {
    setFocusedFile(filePath);
    // Don't replace content when focusing from guide - only highlight in tree
  };

  // When clicking a file link in the GuideSection, open in code section
  const handleGuideFileClick = (filePath: string) => {
    const node = findNodeByPath(projectStructure, filePath);
    if (!node || node.type !== "file") {
      setFocusedFile(filePath);
      setFocusTick((t) => t + 1);
      return;
    }
    const content = node.content || "";
    const lang = node.language || "plaintext";
    handleFileOpenInNewTab(filePath, content, lang);
  };

  const handleFileOpenInNewTab = (
    filePath: string,
    content: string,
    lang: string
  ) => {
    const fileName = getFileName(filePath);
    // If a tab with this file is already open, just focus it
    const existing = tabs.find((t) => t.path === filePath);
    if (existing) {
      setActiveTabId(existing.id);
      setFocusedFile(filePath);
      setFocusTick((t) => t + 1);
      return;
    }

    const tabId = `tab-${Date.now()}-${fileName}`;
    const newTab: Tab = {
      id: tabId,
      name: fileName,
      path: filePath,
      content,
      language: lang,
      source: "guide",
      icon: getIconForPath(filePath),
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTabId(tabId);
    setFocusedFile(filePath);
    setFocusTick((t) => t + 1);
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);

      // If closing active tab, switch to another tab or clear selection
      if (activeTabId === tabId) {
        if (updatedTabs.length > 0) {
          const newActiveTab = updatedTabs[updatedTabs.length - 1];
          setActiveTabId(newActiveTab.id);
          // Only change selectedFile for tabs from folder tree
          if (newActiveTab.source === "tree") {
            setSelectedFile(newActiveTab.path);
          }
          setFocusedFile(newActiveTab.path);
        } else {
          setActiveTabId(null);
          setSelectedFile(null);
          setFocusedFile(null);
        }
      }

      return updatedTabs;
    });
  };

  const handleTabSelect = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      // Only change selectedFile (and thus guide content) for tabs opened from folder tree
      if (tab.source === "tree") {
        setSelectedFile(tab.path);
      }
      setFocusedFile(tab.path);
    }
  };

  const getActiveTabContent = () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return activeTab
      ? {
          content: activeTab.content,
          language: activeTab.language,
          name: activeTab.name,
        }
      : {
          content: "",
          language: "typescript",
          name: "",
        };
  };

  const getFileName = (filePath: string | null): string => {
    if (!filePath) return "";
    return filePath.split("/").pop() || "";
  };

  const activeContent = getActiveTabContent();

  return (
    <div className="h-screen bg-[#101010] text-white flex flex-col overflow-hidden">
      {/* Single Unified Header */}
      <div className="h-12 bg-[#1a1a1a] border-b border-gray-700 flex items-center px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">Indexo</h1>
          <span className="text-sm text-gray-400">Developer Dictionary</span>
        </div>

        {/* Navigation Links */}
        <div className="ml-6 flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-md p-1">
            <Link
              href="/dictionary"
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors bg-blue-600 text-white"
            >
              <FileCode className="w-4 h-4" />
              Dictionary
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              <Book className="w-4 h-4" />
              Tutorials
            </Link>
          </div>
        </div>

        {selectedFile && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">Current file:</span>
            <span className="text-sm text-blue-400 font-mono">
              {getFileName(selectedFile)}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Folder Tree Section */}
        <div className="w-[20%] border-r border-gray-700 overflow-hidden">
          <FolderTree
            onFileSelect={handleFileSelect}
            focusedFile={focusedFile}
            focusTick={focusTick}
          />
        </div>

        {/* Code Section with Tabs */}
        <div className="w-[45%] border-r border-gray-700 overflow-hidden">
          <CodeSection
            content={activeContent.content}
            language={activeContent.language}
            selectedFile={selectedFile}
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />
        </div>

        {/* Guide Section */}
        <div className="w-[35%] overflow-hidden">
          <GuideSection
            selectedFile={selectedFile}
            onFileSelect={handleGuideFileClick}
            onFileOpenInNewTab={handleFileOpenInNewTab}
          />
        </div>
      </div>
    </div>
  );
}