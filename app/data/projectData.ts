// Project data structure and guide content

export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
  icon?: string;
}

// Structured guide types
export interface GuideLesson {
  id: string;
  title: string;
  summary: string;
  keyPoints?: string[];
  relatedFiles?: string[]; // project file paths
}

export interface GuideModule {
  id: string;
  title: string;
  description: string;
  lessons: GuideLesson[];
}

// React Concepts demo project structure
export const projectStructure: FileNode = {
  name: "REACT-CONCEPTS",
  type: "folder",
  path: "/",
  children: [
    {
      name: "src",
      type: "folder",
      path: "/src",
      icon: "folder",
      children: [
        {
          name: "App.tsx",
          type: "file",
          path: "/src/App.tsx",
          icon: "tsx",
          language: "typescript",
          content: `import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import ThemeToggle from './components/ThemeToggle';
import './app.css';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <h1>React Concepts Demo</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <ThemeToggle />
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
`,
        },
        {
          name: "main.tsx",
          type: "file",
          path: "/src/main.tsx",
          icon: "tsx",
          language: "typescript",
          content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './app.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
`,
        },
        {
          name: "app.css",
          type: "file",
          path: "/src/app.css",
          icon: "css",
          language: "css",
          content: `.app{ font-family: system-ui, Arial, sans-serif; color:#e5e7eb; background:#0f1115; min-height:100vh; }
.app-header{ display:flex; gap:16px; align-items:center; padding:12px 16px; border-bottom:1px solid #374151; }
.app-header a{ color:#93c5fd; text-decoration:none; margin-right:8px; }
.app-main{ padding:16px; }
.card{ background:#111318; border:1px solid #374151; border-radius:8px; padding:12px; margin-bottom:12px; }
button{ background:#1f2937; color:#e5e7eb; border:1px solid #374151; border-radius:6px; padding:6px 10px; cursor:pointer; }
input{ background:#0b0d12; color:#e5e7eb; border:1px solid #374151; border-radius:6px; padding:6px 8px; }
ul{ padding-left:18px; }
`,
        },
        {
          name: "components",
          type: "folder",
          path: "/src/components",
          icon: "folder",
          children: [
            {
              name: "Welcome.tsx",
              type: "file",
              path: "/src/components/Welcome.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';

type Props = { name: string };
export default function Welcome({ name }: Props) {
  return <div className="card">Hello, <strong>{name}</strong>! 👋</div>;
}
`,
            },
            {
              name: "Counter.tsx",
              type: "file",
              path: "/src/components/Counter.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(0);
  const isEven = count % 2 === 0;
  return (
    <div className="card">
      <div>Count: <strong>{count}</strong> ({isEven ? 'even' : 'odd'})</div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
`,
            },
            {
              name: "TodoList.tsx",
              type: "file",
              path: "/src/components/TodoList.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React, { useState } from 'react';

type Todo = { id: number; text: string; done: boolean };

export default function TodoList() {
  const [items, setItems] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  }

  function toggle(id: number) {
    setItems(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <div className="card">
      <form onSubmit={addItem} style={{ display:'flex', gap:8 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <label>
              <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)} />
              <span style={{ marginLeft: 6, textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
            },
            {
              name: "ThemeToggle.tsx",
              type: "file",
              path: "/src/components/ThemeToggle.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} title="Toggle theme">
      Theme: {theme}
    </button>
  );
}
`,
            },
            {
              name: "ConditionalRenderer.tsx",
              type: "file",
              path: "/src/components/ConditionalRenderer.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';

type Props = { condition: boolean; children: React.ReactNode; fallback?: React.ReactNode };
export default function ConditionalRenderer({ condition, children, fallback = null }: Props) {
  return <>{condition ? children : fallback}</>;
}
`,
            },
            {
              name: "ReconciliationDemo.tsx",
              type: "file",
              path: "/src/components/ReconciliationDemo.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React, { useState } from 'react';

export default function ReconciliationDemo() {
  const [useStableKeys, setUseStableKeys] = useState(true);
  const items = ['A','B','C'];
  return (
    <div className="card">
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <span>Keys: </span>
        <button onClick={() => setUseStableKeys(s => !s)}>
          {useStableKeys ? "Stable (index as suffix)" : "Unstable (random)"}
        </button>
      </div>
      <ul>
        {items.map((label, idx) => (
          <li key={useStableKeys ? idx : Math.random()}>
            Item {label}
          </li>
        ))}
      </ul>
      <small>Changing keys forces remount; stable keys preserve state.</small>
    </div>
  );
}
`,
            },
          ],
        },
        {
          name: "context",
          type: "folder",
          path: "/src/context",
          icon: "folder",
          children: [
            {
              name: "ThemeContext.tsx",
              type: "file",
              path: "/src/context/ThemeContext.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextValue = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
`,
            },
          ],
        },
        {
          name: "hooks",
          type: "folder",
          path: "/src/hooks",
          icon: "folder",
          children: [
            {
              name: "useFetch.ts",
              type: "file",
              path: "/src/hooks/useFetch.ts",
              icon: "ts",
              language: "typescript",
              content: `import { useEffect, useState } from 'react';

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: ctrl.signal })
      .then(r => r.json())
      .then(setData)
      .catch(e => { if (e.name !== 'AbortError') setError(String(e)); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [url]);

  return { data, loading, error };
}
`,
            },
          ],
        },
        {
          name: "pages",
          type: "folder",
          path: "/src/pages",
          icon: "folder",
          children: [
            {
              name: "Home.tsx",
              type: "file",
              path: "/src/pages/Home.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';
import Welcome from '../components/Welcome';
import Counter from '../components/Counter';
import TodoList from '../components/TodoList';
import ConditionalRenderer from '../components/ConditionalRenderer';
import ReconciliationDemo from '../components/ReconciliationDemo';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const { data, loading, error } = useFetch<any>('https://jsonplaceholder.typicode.com/todos?_limit=3');
  return (
    <div className="space-y">
      <Welcome name="Developer" />
      <Counter />
      <TodoList />
      <div className="card">
        <h3>Conditional Rendering</h3>
        <ConditionalRenderer condition={Boolean(data) && !loading} fallback={<em>Loading sample data...</em>}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
        </ConditionalRenderer>
        {error && <div style={{ color: 'salmon' }}>Error: {error}</div>}
      </div>
      <ReconciliationDemo />
    </div>
  );
}
`,
            },
            {
              name: "About.tsx",
              type: "file",
              path: "/src/pages/About.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { theme } = useTheme();
  return (
    <div className="card">
      <h3>About</h3>
      <p>Theme via Context API: <strong>{theme}</strong></p>
      <p>This page demonstrates client-side routing with React Router.</p>
    </div>
  );
}
`,
            },
          ],
        },
        {
          name: "connection-map.ts",
          type: "file",
          path: "/src/connection-map.ts",
          icon: "ts",
          language: "typescript",
          content: `export type Connection = { title: string; file: string; code: string; description: string };

export const connections: Connection[] = [
  {
    title: 'Props from App to Welcome',
    file: '/src/components/Welcome.tsx',
    code: '<Welcome name="Developer" />',
    description: 'App passes a name prop down to a child component demonstrating unidirectional data flow.'
  },
  {
    title: 'Stateful Counter',
    file: '/src/components/Counter.tsx',
    code: '<Counter />',
    description: 'Local state with useState drives UI updates and conditional rendering.'
  },
  {
    title: 'Controlled Form and List Keys',
    file: '/src/components/TodoList.tsx',
    code: '<TodoList />',
    description: 'Input is controlled by state; list items render with stable keys for performance.'
  },
  {
    title: 'Context Provider and Consumer',
    file: '/src/context/ThemeContext.tsx',
    code: '<ThemeProvider>...<ThemeToggle/></ThemeProvider>',
    description: 'Global theme state shared without prop drilling.'
  },
  {
    title: 'Routing',
    file: '/src/App.tsx',
    code: '<Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/></Routes>',
    description: 'Client-side navigation across pages via React Router.'
  }
];
`,
        },
      ],
    },
    {
      name: "index.html",
      type: "file",
      path: "/index.html",
      icon: "xml",
      language: "html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Concepts Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    {
      name: "package.json",
      type: "file",
      path: "/package.json",
      icon: "json",
      language: "json",
      content: `{
  "name": "react-concepts-demo",
  "private": true,
  "version": "0.1.0",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": { "vite": "^5.0.0", "typescript": "^5.3.0" }
}`,
    },
    {
      name: "tsconfig.json",
      type: "file",
      path: "/tsconfig.json",
      icon: "json",
      language: "json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
    },
    {
      name: "vite.config.ts",
      type: "file",
      path: "/vite.config.ts",
      icon: "ts",
      language: "typescript",
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
    },
  ],
};
// Single-text guide content mapped by file path
export const guideContent: Record<string, string> = {
  "/index.html":
    "**Title**\nIndex HTML entry\n\n**Overview**\n- Hosts the root div and bootstraps the SPA by loading /src/main.tsx .\n\n**Connections**\n- Mount point: `<div id=\"root\" />` used by /src/main.tsx.\n- Script module: /src/main.tsx starts the React app.\n\n**Real-world**\n- This file is served by your build tool (e.g., Vite). React hydrates or renders into the root element.\n\n\n\n",
  "/src/main.tsx":
    "**Title**\nBootstrapping & JSX\n\n**Overview**\n- Creates the React root and renders <App/> inside <BrowserRouter>.\n- Demonstrates JSX, StrictMode, and client-side routing setup.\n\n**Connections**\n- Renders /src/App.tsx.\n- Depends on 'react-router-dom' for routing.\n\n**Snippet**\n```tsx\ncreateRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <BrowserRouter>\n      <App />\n    </BrowserRouter>\n  </React.StrictMode>\n);\n```\n\n**Real-world**\n- This is where you attach global providers (router, state, i18n, error boundaries).\n",
  "/src/App.tsx":
    "**Title**\nApp Shell, Routing, Context Provider\n\n**Overview**\n- Provides navigation (Links), wraps children with ThemeProvider, defines Routes.\n- Demonstrates unidirectional data flow: parent <App/> composes pages and components.\n\n**Connections**\n- Wraps with /src/context/ThemeContext.tsx provider.\n- Renders /src/pages/Home.tsx and /src/pages/About.tsx.\n- Uses /src/components/ThemeToggle.tsx inside header.\n\n**Snippet**\n```tsx\n<ThemeProvider>\n  <Routes>\n    <Route path=\"/\" element={<Home />} />\n    <Route path=\"/about\" element={<About />} />\n  </Routes>\n</ThemeProvider>\n```\n\n**Real-world**\n- Your app shell often contains layout, global providers, and top-level navigation.\n",
  "/src/context/ThemeContext.tsx":
    "**Title**\nContext API\n\n**Overview**\n- Shares 'theme' and 'toggle' without prop-drilling.\n- 'ThemeProvider' uses useState; 'useTheme' exposes the context.\n\n**Connections**\n- Provider used in /src/App.tsx.\n- Consumed by /src/components/ThemeToggle.tsx and /src/pages/About.tsx.\n\n**Snippet**\n```tsx\nconst ThemeContext = createContext<Ctx | undefined>(undefined);\nexport function ThemeProvider({ children }: { children: React.ReactNode }) {\n  const [theme, setTheme] = useState<'light'|'dark'>('light');\n  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;\n}\n```\n\n**Real-world**\n- Useful for auth, themes, A/B flags, current locale, and other cross-cutting state.\n",
  "/src/components/ThemeToggle.tsx":
    "**Title**\nEvent Handling via Context\n\n**Overview**\n- Reads 'theme' from context and toggles on click.\n\n**Connections**\n- Consumes /src/context/ThemeContext.tsx.\n- Rendered by /src/App.tsx.\n\n**Snippet**\n```tsx\nconst { theme, toggle } = useTheme();\nreturn <button onClick={toggle}>Theme: {theme}</button>;\n```\n\n**Real-world**\n- Centralized state + local event handlers give predictable behavior and testability.\n",
  "/src/components/Welcome.tsx":
    "**Title**\nComponents & Props\n\n**Overview**\n- Stateless component that receives 'name' via props and renders JSX.\n\n**Connections**\n- Used by /src/pages/Home.tsx.\n- Demonstrates unidirectional data flow from parent to child.\n\n**Snippet**\n```tsx\ntype Props = { name: string };\nexport default function Welcome({ name }: Props) {\n  return <div>Hello, {name}!</div>;\n}\n```\n\n**Real-world**\n- Props customize reusable UI across product surfaces.\n",
  "/src/components/Counter.tsx":
    "**Title**\nState, Conditional Rendering, Events\n\n**Overview**\n- Local state via useState. Button clicks update state. UI branches on even/odd.\n\n**Connections**\n- Used by /src/pages/Home.tsx.\n- Shows how state changes trigger re-renders.\n\n**Snippet**\n```tsx\nconst [count, setCount] = useState(0);\nconst isEven = count % 2 === 0;\n<button onClick={() => setCount(c => c + 1)}>+1</button>\n```\n\n**Real-world**\n- Core interaction pattern for counters, ratings, toggles, pagination, etc.\n",
  "/src/components/TodoList.tsx":
    "**Title**\nForms, Controlled Inputs, Lists & Keys\n\n**Overview**\n- Controlled 'input' binds to state. Submitting pushes new items with stable keys.\n\n**Connections**\n- Used by /src/pages/Home.tsx.\n- Keys ensure efficient list updates and preserve item identity.\n\n**Snippet**\n```tsx\n<form onSubmit={addItem}>\n  <input value={text} onChange={e => setText(e.target.value)} />\n  <button>Add</button>\n</form>\n<ul>{items.map(i => <li key={i.id}>{i.text}</li>)}</ul>\n```\n\n**Real-world**\n- Forms are the backbone of CRUD UI, validations, and workflows.\n",
  "/src/components/ConditionalRenderer.tsx":
    "**Title**\nConditional Rendering\n\n**Overview**\n- Utility component that renders 'children' when 'condition' is true, else a fallback.\n\n**Connections**\n- Used by /src/pages/Home.tsx to wait for async data.\n\n**Snippet**\n```tsx\nreturn <> {condition ? children : fallback} </>;\n```\n\n**Real-world**\n- Encapsulates branching logic; keeps pages declarative.\n",
  "/src/components/ReconciliationDemo.tsx":
    "**Title**\nReconciliation & Keys\n\n**Overview**\n- Shows how changing keys remounts items; stable keys preserve state.\n\n**Connections**\n- Used by /src/pages/Home.tsx.\n\n**Snippet**\n```tsx\n<li key={useStableKeys ? idx : Math.random()}>Item</li>\n```\n\n**Real-world**\n- Proper keys improve performance and prevent UI glitches in dynamic lists.\n",
  "/src/hooks/useFetch.ts":
    "**Title**\nHooks & Lifecycle (useEffect)\n\n**Overview**\n- Custom hook abstracts fetching with loading and error states.\n- Demonstrates mount, update, and cleanup via AbortController.\n\n**Connections**\n- Used by /src/pages/Home.tsx to fetch sample todos.\n\n**Snippet**\n```ts\nuseEffect(() => {\n  const ctrl = new AbortController();\n  fetch(url, { signal: ctrl.signal })\n    .then(r => r.json())\n    .then(setData)\n    .catch(handle)\n    .finally(() => setLoading(false));\n  return () => ctrl.abort();\n}, [url]);\n```\n\n**Real-world**\n- Encapsulate side-effects to keep UI components focused and testable.\n",
  "/src/pages/Home.tsx":
    "**Title**\nHome Page Composition\n\n**Overview**\n- Composes multiple components to showcase core React concepts together.\n\n**Connections**\n- Uses /src/components/Welcome.tsx, /src/components/Counter.tsx, /src/components/TodoList.tsx.\n- Async example with /src/hooks/useFetch.ts and /src/components/ConditionalRenderer.tsx.\n- Demonstrates reconciliation via /src/components/ReconciliationDemo.tsx.\n\n**Snippet**\n```tsx\n<Welcome name=\"Developer\" />\n<Counter />\n<TodoList />\n<ConditionalRenderer condition={Boolean(data) && !loading}>\n  <pre>{JSON.stringify(data, null, 2)}</pre>\n</ConditionalRenderer>\n```\n\n**Real-world**\n- Page-level containers orchestrate child components and data fetching.\n",
  "/src/pages/About.tsx":
    "**Title**\nAbout Page & Context Consumer\n\n**Overview**\n- Simple page reading the current theme from context.\n\n**Connections**\n- Consumes /src/context/ThemeContext.tsx.\n- Navigated to via /src/App.tsx routing.\n\n**Real-world**\n- Pages often need app-wide settings (theme, auth) without prop chains.\n",
  "/src/connection-map.ts":
    "**Title**\nConnection Map\n\n**Overview**\n- Central registry of important connections: title, file, representative code, and explanation.\n\n**How to read**\n- Each entry links a concept to its source file and a short code snippet.\n\n**Entries (selected)**\n- Props: /src/components/Welcome.tsx via <Welcome name=\"Developer\" /> from /src/pages/Home.tsx.\n- State & Events: /src/components/Counter.tsx updates UI on click.\n- Controlled Form & Keys: /src/components/TodoList.tsx.\n- Context: /src/context/ThemeContext.tsx + /src/components/ThemeToggle.tsx.\n- Routing: /src/App.tsx with client-side routes.\n\n**Real-world**\n- Keeping an explicit map helps onboarding and architectural reviews.\n",
  "/package.json":
    "**Title**\nProject manifest\n\n**Overview**\n- Declares dependencies and scripts for a Vite + React + TS project.\n\n**Connections**\n- Dev server runs and serves /index.html; module graph starts at /src/main.tsx.\n\n**Real-world**\n- Scripts are integrated in CI/CD and local dev workflows.\n",
  "/vite.config.ts":
    "**Title**\nBuild tool config\n\n**Overview**\n- Enables React plugin and modern dev server features.\n\n**Real-world**\n- Customize aliasing, env, HMR behavior for large apps.\n",
  "/tsconfig.json":
    "**Title**\nTypeScript configuration\n\n**Overview**\n- Strict typing improves refactors and prevents runtime bugs.\n\n**Connections**\n- JSX transform: 'react-jsx'.\n\n**Real-world**\n- Teams standardize TS options across repos for consistency.\n",
};