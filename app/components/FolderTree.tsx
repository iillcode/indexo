"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { projectStructure, FileNode } from "../data/projectData";
import fileIcons from "../data/fileIcons.json";
import pathIcons from "../data/pathIcons.json";

interface FolderTreeProps {
  onFileSelect: (filePath: string, content: string, language: string) => void;
  focusedFile?: string | null;
  focusTick?: number;
}

const FileIcon = ({
  node,
  isExpanded,
}: {
  node: FileNode;
  isExpanded?: boolean;
}) => {
  const iconClass = "w-4 h-4";

  if (node.type === "folder") {
    const pathLower = (node.path || "").toLowerCase();
    try {
      const rules = (pathIcons as any)?.pathRules as Array<{
        pattern: string;
        active?: string;
        inactive?: string;
      }>;
      if (Array.isArray(rules)) {
        for (const rule of rules) {
          if (!rule?.pattern) continue;
          const re = new RegExp(rule.pattern, "i");
          if (re.test(pathLower)) {
            const src =
              (isExpanded ? rule.active : rule.inactive) ||
              rule.active ||
              rule.inactive;
            if (src) {
              return <img src={src} alt="folder icon" className={iconClass} />;
            }
          }
        }
      }
    } catch {}
    return isExpanded ? (
      <FolderOpen className={`${iconClass} text-blue-400`} />
    ) : (
      <Folder className={`${iconClass} text-blue-400`} />
    );
  }

  // File icons based on extension or type using devicon mapping
  const nameLower = node.name.toLowerCase();
  const ext = node.name.includes(".")
    ? node.name.split(".").pop()!.toLowerCase()
    : "";
  const key = (ext || nameLower) as keyof typeof fileIcons;
  const byExt = (fileIcons as Record<string, string>)[key];
  const byIcon = node.icon
    ? (fileIcons as Record<string, string>)[node.icon]
    : undefined;
  // Prioritize projectData icon over extension-based detection
  const src = byIcon || byExt || "/file.svg";
  return (
    <img src={src} alt={`${ext || nameLower} icon`} className={iconClass} />
  );
};

const TreeNode = ({
  node,
  level = 0,
  onFileSelect,
  isLast = false,
  parentLines = [],
  focusedFile,
  focusTick,
}: {
  node: FileNode;
  level?: number;
  onFileSelect: (filePath: string, content: string, language: string) => void;
  isLast?: boolean;
  parentLines?: boolean[];
  focusedFile?: string | null;
  focusTick?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isFocused = focusedFile === node.path;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node.path, node.content || "", node.language || "text");
    }
  };

  const currentLines = [...parentLines, !isLast];

  // Sort children: folders first (A-Z), then files (A-Z), case-insensitive
  const childrenSorted = node.children
    ? [...node.children].sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      })
    : [];

  // Auto-expand if the currently focused file is within this folder's subtree
  useEffect(() => {
    if (node.type !== "folder" || !focusedFile) return;
    const base = (node.path || "").toLowerCase();
    const target = focusedFile.toLowerCase();
    const isRoot = base === "/";
    const prefix = isRoot ? "/" : base.endsWith("/") ? base : base + "/";
    if (target.startsWith(prefix)) {
      setIsExpanded(true);
    }
  }, [focusedFile, node, focusTick]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-0.5 px-2 hover:bg-gray-800 cursor-pointer text-sm group ${
          isFocused ? "bg-blue-900/30 border-l-2 border-blue-400" : ""
        }`}
        onClick={handleClick}
      >
        {/* Indentation lines */}
        <div className="flex items-center" style={{ width: `${level * 16}px` }}>
          {level > 0 && (
            <div className="flex">
              {parentLines.map((hasLine, index) => (
                <div key={index} className="w-4 flex justify-center">
                  {hasLine && <div className="w-px h-6 "></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Folder arrow */}
        {node.type === "folder" && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
          </div>
        )}

        {/* File icon */}
        <FileIcon node={node} isExpanded={isExpanded} />

        {/* File/folder name */}
        <span
          className={`text-gray-200 group-hover:text-white ${
            node.type === "folder" ? "font-medium" : ""
          } ${isFocused ? "text-blue-300" : ""}`}
        >
          {node.name}
        </span>

      </div>

      {/* Children */}
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {childrenSorted.map((child, index) => (
            <TreeNode
              key={`${child.path}-${index}`}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              isLast={index === childrenSorted.length - 1}
              parentLines={currentLines}
              focusedFile={focusedFile}
              focusTick={focusTick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FolderTree({
  onFileSelect,
  focusedFile,
  focusTick,
}: FolderTreeProps) {
  return (
    <div className="h-full bg-[#1a1a1a] overflow-y-auto">
      <div className="py-2">
        <TreeNode
          node={projectStructure}
          onFileSelect={onFileSelect}
          focusedFile={focusedFile}
          focusTick={focusTick}
        />
      </div>
    </div>
  );
}
