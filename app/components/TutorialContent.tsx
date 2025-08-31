"use client";

import React, { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";
import { tutorialContent } from "../data/tutorialData";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import vs2015 from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";
// Register only the languages we need (Highlight.js engine)
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/hljs/markdown";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";

// Register languages once
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("yaml", yaml);

interface TutorialContentProps {
  selectedTopic: string | null;
}

export default function TutorialContent({
  selectedTopic,
}: TutorialContentProps) {
  const content = selectedTopic ? tutorialContent[selectedTopic] : undefined;
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());

  // Copy code to clipboard
  const copyCode = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks((prev) => new Set(prev).add(blockId));
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Map fenced code languages to highlight.js equivalents
  const mapFenceLang = (lang: string) => {
    const l = (lang || "").toLowerCase();
    const map: Record<string, string> = {
      tsx: "typescript",
      jsx: "javascript",
      sh: "bash",
      shell: "bash",
      markup: "xml",
      html: "xml",
      yml: "yaml",
    };
    return map[l] || l || "typescript";
  };

  // Tokenize a line for inline formatting
  const renderInline = (text: string, keyBase: string) => {
    const nodes: React.ReactNode[] = [];
    const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
      const [full] = match;
      // 1: `code`
      if (match[1]) {
        const val = full.slice(1, -1);
        nodes.push(
          <code
            key={`${keyBase}-code-${start}`}
            className="px-1 py-0.5 rounded bg-gray-800 text-blue-200 font-mono text-[12px]"
          >
            {val}
          </code>
        );
      }
      // 2: **bold**
      else if (match[2]) {
        nodes.push(
          <strong
            key={`${keyBase}-bold-${start}`}
            className="text-white font-semibold"
          >
            {full.slice(2, -2)}
          </strong>
        );
      }
      // 3: *italic*
      else if (match[3]) {
        nodes.push(
          <em key={`${keyBase}-em-${start}`} className="text-gray-200">
            {full.slice(1, -1)}
          </em>
        );
      }
      lastIndex = start + full.length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
  };

  // Render full content: supports fenced code blocks and lists
  const renderContent = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const start = match.index;
      if (start > lastIndex) {
        const chunk = text.slice(lastIndex, start);
        blocks.push(...renderTextChunk(chunk, key++));
      }
      const rawLang = (match[1] || "").toLowerCase();
      const lang = mapFenceLang(rawLang);
      const code = match[2];
      const blockId = `code-${key}`;
      const isCopied = copiedBlocks.has(blockId);

      blocks.push(
        <div key={blockId} className="relative group">
          <SyntaxHighlighter
            language={lang}
            style={vs2015 as any}
            customStyle={{
              background: "#0f0f0f",
              borderRadius: 6,
              padding: 12,
              scrollbarWidth: "thin",
              scrollbarColor: "#2e2d2d #0f0f0f",
              border: "none",
              paddingTop: "13px", // Space for copy button
            }}
            codeTagProps={{
              className: `text-[12px] language-${
                rawLang || lang
              } [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400`,
            }}
            showLineNumbers={false}
          >
            {code}
          </SyntaxHighlighter>

          {/* Copy Button */}
          <button
            onClick={() => copyCode(code, blockId)}
            className="absolute top-2 right-2 p-2 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title={isCopied ? "Copied!" : "Copy code"}
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>
      );
      key++;
      lastIndex = start + match[0].length;
    }
    if (lastIndex < text.length) {
      const chunk = text.slice(lastIndex);
      blocks.push(...renderTextChunk(chunk, key++));
    }
    return <div className="space-y-1">{blocks}</div>;
  };

  const renderTextChunk = (chunk: string, keyBase: number) => {
    const lines = chunk.split("\n");
    const nodes: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        nodes.push(
          <ul
            key={`ul-${keyBase}-${nodes.length}`}
            className="list-disc pl-5 text-sm text-gray-300 space-y-1"
          >
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((ln, i) => {
      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(ln);
      const liMatch = /^\s*[-*]\s+(.+)$/.exec(ln);

      if (headingMatch) {
        flushList();
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const sizeClasses = {
          1: "text-2xl font-bold text-white mb-4",
          2: "text-xl font-semibold text-white mb-3",
          3: "text-lg font-medium text-white mb-2",
          4: "text-md font-medium text-white mb-2",
          5: "text-sm font-medium text-white mb-1",
          6: "text-sm font-medium text-white mb-1",
        };

        const className = sizeClasses[level as keyof typeof sizeClasses];

        if (level === 1) {
          nodes.push(
            <h1 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h1>
          );
        } else if (level === 2) {
          nodes.push(
            <h2 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h2>
          );
        } else if (level === 3) {
          nodes.push(
            <h3 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h3>
          );
        } else if (level === 4) {
          nodes.push(
            <h4 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h4>
          );
        } else if (level === 5) {
          nodes.push(
            <h5 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h5>
          );
        } else {
          nodes.push(
            <h6 key={`h-${keyBase}-${i}`} className={className}>
              {text}
            </h6>
          );
        }
      } else if (liMatch) {
        // list item line
        listItems.push(
          <li key={`li-${keyBase}-${i}`}>
            {renderInline(liMatch[1], `li-${keyBase}-${i}`)}
          </li>
        );
      } else if (ln.trim().length === 0) {
        flushList();
        // add a small separator for paragraphs
        nodes.push(<div key={`sp-${keyBase}-${i}`} className="h-2" />);
      } else {
        flushList();
        nodes.push(
          <p
            key={`p-${keyBase}-${i}`}
            className="text-sm text-gray-300 leading-6"
          >
            {renderInline(ln, `p-${keyBase}-${i}`)}
          </p>
        );
      }
    });
    flushList();
    return nodes;
  };

  const formatTopicTitle = (topicId: string) => {
    return topicId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="h-full bg-[#1a1a1a] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 w-[70%]">
          {selectedTopic ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">
                  {formatTopicTitle(selectedTopic)}
                </h2>
              </div>
              {content ? (
                renderContent(content)
              ) : (
                <div className="text-sm text-gray-300">
                  Tutorial content for this topic is coming soon.
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                Welcome to Tutorials
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Select a topic from the navigation on the left to start
                learning. Explore categories like Layout, Flexbox & Grid,
                Typography, and more.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
