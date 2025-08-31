"use client";

import React from "react";
import { FileText, ScrollIcon } from "lucide-react";
import { guideContent } from "../data/projectData";
import fileIcons from "../data/fileIcons.json";
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

interface GuideSectionProps {
  selectedFile: string | null;
  onFileSelect?: (filePath: string) => void;
  onFileOpenInNewTab?: (
    filePath: string,
    content: string,
    language: string
  ) => void;
}

export default function GuideSection({
  selectedFile,
  onFileSelect,
  onFileOpenInNewTab: _onFileOpenInNewTab,
}: GuideSectionProps) {
  const content = selectedFile ? guideContent[selectedFile] : undefined;

  const getIconForPath = (path: string): string => {
    const ext = (path.split(".").pop() || "").toLowerCase();
    // @ts-ignore json import typing
    return (fileIcons as Record<string, string>)[ext] || "/file.svg";
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

  // Tokenize a line for inline formatting and file links
  const renderInline = (text: string, keyBase: string) => {
    const nodes: React.ReactNode[] = [];
    const regex =
      /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|('([A-Za-z0-9_\.\/-]+)')|(\/[A-Za-z0-9_\-\.\/]+\.[A-Za-z0-9]+)/g;
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
      // 4/5: 'token' => inline code
      else if (match[4]) {
        const token = match[5] || full.slice(1, -1);
        nodes.push(
          <code
            key={`${keyBase}-qcode-${start}`}
            className="px-1 py-0.5 rounded bg-gray-800 text-blue-200 font-mono text-[12px]"
          >
            {token}
          </code>
        );
      }
      // 6: file path with extension => clickable
      else if (match[6]) {
        const path = match[6];
        nodes.push(
          <button
            key={`${keyBase}-file-${start}`}
            onClick={() => onFileSelect && onFileSelect(path)}
            className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 hover:underline cursor-pointer px-0 py-0.5"
            title={`Open ${path}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getIconForPath(path)} alt="icon" className="w-4 h-4" />
            <span className="font-mono">{path}</span>
          </button>
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
      blocks.push(
        <SyntaxHighlighter
          key={`code-${key++}`}
          language={lang}
          style={vs2015 as any}
          customStyle={{
            background: "#0f0f0f",
            // border: "1px solid rgb(75 85 99)",
            borderRadius: 6,
            padding: 12,
            scrollbarWidth: "thin",
            scrollbarColor: "#2e2d2d #0f0f0f",
            border: "none",
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
      );
      lastIndex = start + match[0].length;
    }
    if (lastIndex < text.length) {
      const chunk = text.slice(lastIndex);
      blocks.push(...renderTextChunk(chunk, key++));
    }
    return <div className="space-y-2">{blocks}</div>;
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
      const liMatch = /^\s*[-*]\s+(.+)$/.exec(ln);
      if (liMatch) {
        // list item line
        listItems.push(
          <li key={`li-${keyBase}-${i}`}>
            {renderInline(liMatch[1], `li-${keyBase}-${i}`)}
          </li>
        );
      } else if (ln.trim().length === 0) {
        flushList();
        // add a small separator for paragraphs
        nodes.push(<div key={`sp-${keyBase}-${i}`} className="h-1" />);
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

  return (
    <div className="h-full bg-[#1a1a1a] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:px-5 py-1">
        {selectedFile ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">
                Guide for:{" "}
                <span className="font-mono text-blue-300">{selectedFile}</span>
              </h3>
            </div>
            {content ? (
              renderContent(content)
            ) : (
              <div className="text-sm text-gray-300">
                No guide available for this file yet.
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-400">
            Select a file from the tree to view its guide.
          </div>
        )}
      </div>
    </div>
  );
}
