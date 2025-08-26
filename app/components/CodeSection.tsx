"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import fileIcons from "../data/fileIcons.json";

// Convert a VS Code theme JSON to Monaco theme data
function toMonacoColor(hex?: string): string | undefined {
  if (!hex || typeof hex !== "string") return undefined;
  return hex.startsWith("#") ? hex.slice(1) : hex;
}

function isDarkColor(hex: string): boolean {
  let h = hex.startsWith("#") ? hex.slice(1) : hex;
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}

function convertVsCodeThemeToMonaco(vsTheme: any) {
  const colors = (vsTheme && vsTheme.colors) || {};
  const tokenColors = (vsTheme && vsTheme.tokenColors) || [];
  const rules: Array<{
    token: string;
    foreground?: string;
    fontStyle?: string;
  }> = [];

  for (const entry of tokenColors) {
    const settings = entry?.settings || {};
    const fg = toMonacoColor(settings.foreground);
    const fontStyle: string | undefined = settings.fontStyle;

    let scopes: string[] = [];
    if (typeof entry?.scope === "string") {
      scopes = entry.scope
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(entry?.scope)) {
      scopes = entry.scope.filter(Boolean);
    } else {
      // Scope-less defaults are handled by editor.foreground, skip here
      continue;
    }

    for (const s of scopes) {
      const rule: { token: string; foreground?: string; fontStyle?: string } = {
        token: s,
      };
      if (fg) rule.foreground = fg;
      if (fontStyle) rule.fontStyle = fontStyle;
      rules.push(rule);
    }
  }

  let base: "vs-dark" | "vs" = "vs-dark";
  if (typeof vsTheme?.type === "string") {
    base = vsTheme.type.toLowerCase().includes("light") ? "vs" : "vs-dark";
  } else if (colors["editor.background"]) {
    base = isDarkColor(colors["editor.background"]) ? "vs-dark" : "vs";
  }

  const monacoTheme = {
    base,
    inherit: true,
    rules,
    colors: {
      ...colors,
      // Ensure a background is present
      ...(colors["editor.background"]
        ? {}
        : { "editor.background": base === "vs-dark" ? "#1e1e1e" : "#ffffff" }),
    },
  } as const;

  return monacoTheme;
}

interface Tab {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified?: boolean;
  source: "tree" | "guide";
}

interface CodeSectionProps {
  content: string;
  language: string;
  selectedFile: string | null;
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function CodeSection({
  content,
  language,
  selectedFile,
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
}: CodeSectionProps) {
  const editorRef = useRef<any>(null);
  // Keep refs to each tab element for auto-scrolling focus into view
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Ref to the tab bar container
  const tabbarRef = useRef<HTMLDivElement | null>(null);
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: "on" as const,
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    automaticLayout: true,
    wordWrap: "on" as const,
    formatOnPaste: false,
    formatOnType: false,
    // Prevent dimming of unused/unreachable code ranges
    showUnused: false,
    // Keep markers visible without dimming text
    renderValidationDecorations: "on" as const,
  };

  const getFileIcon = (
    fileName: string,
    filePath?: string,
    isActive?: boolean
  ) => {
    const base = "w-3.5 h-3.5";
    const nameLower = fileName.toLowerCase();
    const ext = fileName.includes(".")
      ? fileName.split(".").pop()!.toLowerCase()
      : "";
    const key = (ext || nameLower) as keyof typeof fileIcons;
    const src = (fileIcons as Record<string, string>)[key] || "/file.svg";
    return <img src={src} alt={`${ext || nameLower} icon`} className={base} />;
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  // Intentionally no auto-format to avoid undesirable formatting changes

  const [themeName, setThemeName] = useState<string>("custom-dark");

  // When active tab changes, ensure it's visible and focused (robust and centered)
  useLayoutEffect(() => {
    if (!activeTabId) return;
    const run = () => {
      const el = tabRefs.current[activeTabId!];
      if (!el) return;
      const parent =
        tabbarRef.current || (el.parentElement as HTMLElement | null);
      if (parent) {
        const elRect = el.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const deltaLeft = elRect.left - parentRect.left;
        const targetLeft =
          parent.scrollLeft +
          deltaLeft -
          (parent.clientWidth - el.clientWidth) / 2;
        const maxLeft = Math.max(0, parent.scrollWidth - parent.clientWidth);
        const clampedLeft = Math.max(0, Math.min(targetLeft, maxLeft));
        if (typeof parent.scrollTo === "function") {
          parent.scrollTo({ left: clampedLeft, behavior: "auto" });
        } else {
          parent.scrollLeft = clampedLeft;
        }
      } else {
        // Fallback
        try {
          el.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        } catch {
          el.scrollIntoView();
        }
      }
      // Avoid programmatic focus to prevent showing browser default focus outline on first load
    };
    // Run now and once after paint to catch tabs added at the end
    run();
    const t = setTimeout(() => {
      // Another frame to ensure layout settled
      if (typeof requestAnimationFrame !== "undefined")
        requestAnimationFrame(run);
      else run();
    }, 0);
    return () => clearTimeout(t);
  }, [activeTabId, tabs.length]);

  return (
    <div className="h-full bg-[#1a1a1a] flex flex-col">
      {/* Tab Bar */}
      {tabs.length > 0 && (
        <div
          className="tabbar flex whitespace-nowrap bg-[#1a1a1a] border-b border-x border-gray-700 divide-x divide-gray-700 overflow-x-auto overflow-y-hidden"
          ref={tabbarRef}
          role="tablist"
          aria-label="Open files"
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer flex-shrink-0 min-w-[120px] max-w-[200px] group focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-gray-800 border-t-2 ${
                activeTabId === tab.id
                  ? "bg-[#101010] text-white border-t-2 border-t-blue-400"
                  : "text-gray-400 hover:text-white border-t-2 border-transparent"
              }`}
              role="tab"
              aria-selected={activeTabId === tab.id}
              tabIndex={activeTabId === tab.id ? 0 : -1}
              onClick={() => onTabSelect(tab.id)}
            >
              <span className="flex items-center">
                {getFileIcon(tab.name, tab.path, activeTabId === tab.id)}
              </span>
              <span className="text-xs font-mono truncate" title={tab.name}>
                {tab.name}
              </span>
              {tab.isModified && (
                <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
              )}
              <button
                className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded p-0.5 flex-shrink-0"
                onClick={(e) => handleTabClose(e, tab.id)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
        {content ? (
          <Editor
            height="100%"
            language={language}
            value={content}
            theme={themeName}
            options={editorOptions}
            beforeMount={(monaco) => {
              // Customize the dark theme to match our black background
              monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                // Token color rules to style JSX/HTML tag names
                rules: [],
                colors: {
                  "editor.background": "#101010",
                  "editor.foreground": "#ffffff",
                  // Make gutter (line number area) match editor background
                  "editorGutter.background": "#101010",
                  "editorLineNumber.foreground": "#666666",
                  "editorLineNumber.activeForeground": "#ffffff",
                  "editor.selectionBackground": "#264f78",
                  "editor.inactiveSelectionBackground": "#3a3d41",
                  "editorCursor.foreground": "#ffffff",
                  // Do not fade text for unused/unreachable code (transparent overlay + no border)
                  "editorUnnecessaryCode.opacity": "#00000000",
                  "editorUnnecessaryCode.border": "#00000000",
                },
              });

              // Configure TypeScript/JavaScript to avoid unreachable/unused fading and errors
              try {
                // Keep validation on, but don't flag unreachable/unused
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                  }
                );
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                  }
                );

                monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                  {
                    allowUnreachableCode: true,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                  } as any
                );
                monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
                  {
                    allowUnreachableCode: true,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                  } as any
                );
              } catch {}
            }}
            onMount={(editor, monaco) => {
              editorRef.current = editor;

              // Try loading and converting VS Code theme first; fallback to pre-converted Monaco theme
              (async () => {
                try {
                  const res = await fetch("/my-vscode-theme.json");
                  if (res.ok) {
                    const vsTheme = await res.json();
                    const converted = convertVsCodeThemeToMonaco(vsTheme);
                    // Prevent faded text for unnecessary/unreachable code in the derived theme
                    try {
                      (converted as any).colors = {
                        ...(converted as any).colors,
                        "editorUnnecessaryCode.opacity": "#00000000",
                        "editorUnnecessaryCode.border": "#00000000",
                      };
                    } catch {}
                    monaco.editor.defineTheme(
                      "vscode-derived",
                      converted as any
                    );
                    monaco.editor.setTheme("vscode-derived");
                    setThemeName("vscode-derived");
                    return; // Done
                  }
                } catch (e) {
                  console.warn(
                    "VS Code theme fetch/convert failed, falling back:",
                    e
                  );
                }

                try {
                  const res2 = await fetch("/monaco-theme.json");
                  if (res2.ok) {
                    const theme = await res2.json();
                    // Ensure no faded text in fallback theme as well
                    try {
                      (theme as any).colors = {
                        ...(theme as any).colors,
                        "editorUnnecessaryCode.opacity": "#00000000",
                        "editorUnnecessaryCode.border": "#00000000",
                      };
                    } catch {}
                    monaco.editor.defineTheme("my-vscode-theme", theme as any);
                    monaco.editor.setTheme("my-vscode-theme");
                    setThemeName("my-vscode-theme");
                  }
                } catch {
                  // Ignore; fallback theme remains
                }
              })();
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg">
                Select a file from the project structure
              </p>
              <p className="text-sm mt-2">
                Choose any file to view its contents in the Monaco editor
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
