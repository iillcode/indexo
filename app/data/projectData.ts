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
          content: `import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CounterButton from './components/CounterButton';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <CounterButton count={count} onIncrement={() => setCount((count) => count + 1)} />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

`,
        },
        {
          name: "main.tsx",
          type: "file",
          path: "/src/main.tsx",
          icon: "tsx",
          language: "typescript",
          content: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

`,
        },
        {
          name: "app.css",
          type: "file",
          path: "/src/app.css",
          icon: "css",
          language: "css",
          content: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

`,
        },
        {
          name: "index.css",
          type: "file",
          path: "/src/index.css",
          icon: "css",
          language: "css",
          content: `:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}`,
        },
        {
          name: "vite-env.d.ts",
          type: "file",
          path: "/src/vite-env.d.ts",
          icon: "ts",
          language: "ts",
          content: `/// <reference types="vite/client" />`,
        },
        {
          name: "components",
          type: "folder",
          path: "/src/components",
          icon: "folder",
          children: [
            {
              name: "CounterButton.tsx",
              type: "file",
              path: "/src/components/CounterButton.tsx",
              icon: "tsx",
              language: "typescript",
              content: `import React from 'react';

interface CounterButtonProps {
  count: number;
  onIncrement: () => void;
}

const CounterButton: React.FC<CounterButtonProps> = ({ count, onIncrement }) => {
  return (
    <button onClick={onIncrement}>
      count is {count}
    </button>
  );
};

export default CounterButton;
`,
            },
          ],
        },
        {
          name: "assets",
          type: "folder",
          path: "/src/assets",
          icon: "folder",
          children: [
            {
              name: "react.svg",
              type: "file",
              path: "/src/context/react.svg",
              icon: "svg",
              language: "svg",
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
      ],
    },
    {
      name: "public",
      type: "folder",
      path: "/public",
      icon: "public",
      children: [
        {
          name: "vite.svg",
          type: "file",
          path: "/src/public/vite.svg",
          icon: "svg",
          language: "svg",
          content: `
`,
        },
      ],
    },
    {
      name: "index.html",
      type: "file",
      path: "/index.html",
      icon: "html",
      language: "html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
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
  "name": "show-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react-swc": "^4.0.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "vite": "^7.1.2"
  }
}
`,
    },
    {
      name: "tsconfig.app.json",
      type: "file",
      path: "/tsconfig.app.json",
      icon: "tsconfig",
      language: "json",
      content: `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

   
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}

`,
    },
    {
      name: "tsconfig.node.json",
      type: "file",
      path: "/tsconfig.node.json",
      icon: "tsconfig",
      language: "json",
      content: `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
   
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
`,
    },
    {
      name: "tsconfig.json",
      type: "file",
      path: "/tsconfig.json",
      icon: "tsconfig",
      language: "json",
      content: `
      {
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

`,
    },
    {
      name: ".gitignore",
      type: "file",
      path: "/.gitignore",
      icon: "gitignore",
      language: "md",
      content: `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

`,
    },
    {
      name: "postcss.config.js",
      type: "file",
      path: "/postcss.config.js",
      icon: "postcss",
      language: "javascript",
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
    },
    {
      name: "vite.config.jsx",
      type: "file",
      path: "/vite.config.jsx",
      icon: "vite",
      language: "typescript",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
`,
    },
    {
      name: "tailwind.config.js",
      type: "file",
      path: "/tailwind.config.js",
      icon: "tailwindcss",
      language: "javascript",
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}


`,
    },
  ],
};

// Single-text guide content mapped by file path for REACT-CONCEPTS demo project
export const guideContent: Record<string, string> = {
  "/index.html":
    '**index.html is the foundation HTML file for our React application**\nThis is a `.html` file format that serves as the single page where our entire React app will be displayed. Initially we need this HTML structure to provide a mounting point for React to attach to\n\n**Overview**\n- This is the entry point HTML file that gets served by the web server\n- It contains the basic HTML5 document structure with proper meta tags\n- Most importantly, it has a `<div id="root"></div>` element where React will render the entire application\n- The script tag at the bottom loads our main React application file\n\n**How it works step by step**\n- When someone visits our website, the web server sends this HTML file\n- The browser reads the HTML and creates the basic page structure\n- It finds the `<div id="root">` element and keeps it empty (this is where React will add content)\n- Then it loads and executes the JavaScript from `/src/main.tsx`\n- React takes control and renders our App component inside the root div\n\n**Connections**\n- The `<script type="module" src="/src/main.tsx"></script>` line connects this HTML to our React app\n- The root div is used by `/src/main.tsx` to mount the React application\n- The favicon and title are displayed in the browser tab\n- CSS files are linked to style the page before React loads\n\n**Real-world usage**\n- This is the standard pattern for Single Page Applications (SPAs)\n- The HTML is minimal because React handles most of the content generation\n- The root div acts like a container that React "takes over"\n- This approach allows for fast navigation without full page reloads\n\n**HTML Structure Breakdown**\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Vite + React + TS</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>\n```\n\n**Key parts explained**\n- `<div id="root"></div>` - This empty div is where React will render everything\n- `<script type="module" src="/src/main.tsx"></script>` - This loads our React app\n- The head section contains metadata and the favicon\n- The viewport meta tag ensures proper display on mobile devices\n\n**Learning points**\n- HTML files provide the foundation that JavaScript frameworks build upon\n- The root div pattern is standard for React applications\n- Module scripts allow for modern ES6 import/export syntax\n- Proper meta tags improve SEO and mobile experience',
  "/src/main.tsx":
    "**main.tsx is the entry point TypeScript file for our React application**\nThis is a `.tsx` file format that serves as the first JavaScript/TypeScript code that runs when our app starts. Initially we use `import` statements to bring in React functionality and our main App component\n\n**Overview**\n- This file is the bridge between our HTML file and our React application\n- It uses React 18's `createRoot` API to create a root React instance\n- It renders our main App component wrapped in React.StrictMode\n- It's the starting point where React \"takes over\" the DOM\n\n**How it works step by step**\n- The browser loads this file via the script tag in index.html\n- First, we import necessary React functions and our App component\n- We also import our global CSS to style the app\n- Then we find the root div element from the HTML\n- We create a React root attached to that div\n- Finally, we render our App component wrapped in StrictMode\n\n**Connections**\n- Imported by the script tag in `/index.html`\n- Renders the App component from `/src/App.tsx`\n- Applies global styles from `/src/index.css`\n- Mounts everything inside the root div that was created in index.html\n\n**Real-world usage**\n- This pattern is standard for all modern React applications\n- StrictMode helps catch potential issues during development\n- The createRoot API is the new way (React 18+) to mount React apps\n- This file runs only once when the app starts\n\n**Code Structure Breakdown**\n```tsx\n// Part 1: Imports - bringing in what we need\nimport { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './index.css'\nimport App from './App.tsx'\n\n// Part 2: Creating and rendering the React app\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n)\n```\n\n**Key parts explained**\n- `import { StrictMode } from 'react'` - Gets React's development helper\n- `import { createRoot } from 'react-dom/client'` - Gets the function to create React root\n- `createRoot(document.getElementById('root')!)` - Finds the HTML div and creates React root there\n- `<StrictMode><App /></StrictMode>` - Renders our app with development checks\n\n**Learning points**\n- Every React app needs an entry point file like this\n- StrictMode helps catch bugs during development\n- The createRoot pattern is React 18's modern way to mount apps\n- Imports connect different parts of our application together\n- The exclamation mark (!) tells TypeScript we know the element exists",
  "/src/App.tsx":
    "**App.tsx is the main page of a React app**\nInitially, we use the `import` keyword to import components and other dependencies like `CounterButton` from the components folder, and also static assets like `reactLogo` and `viteLogo` from the assets folder. This helps us use other components and assets on this page.\n\n**Overview**\n- This is the root component that manages the main application state and layout.\n- It uses React's `useState` hook to store the count value.\n- We use `App` as our component name.\n- By using the component `<CounterButton count={count} />`, we can pass a value to child components.\n```html\n<CounterButton count={count} onIncrement={() => setCount((count) => count + 1)} />\n```\n\n**How it works step by step**\n- First, we import everything we need at the top of the file.\n- Then we declare our `App` component function.\n- Inside the component, we use `useState(0)` to create a state variable called `count` starting at 0.\n- We create an `onIncrement` function that increases the count when called.\n- The user will click the button `<button onClick={onIncrement}> count is {count} </button>` in /src/components/CounterButton.tsx, which triggers the `onIncrement` function passed from the `App` component.\n- Finally, the App component returns JSX with `return (< >...</>)`.\n\n**Learning points**\n- How to use React hooks like `useState` for local state.\n- How to pass data and functions as props to child components.\n- How to import and use static assets in React components.\n- How to structure a main app component that orchestrates the UI.\n- How component re-renders work when state changes.",
  "/src/components/CounterButton.tsx":
    "**CounterButton.tsx is a reusable React component for our counter functionality**\nThis is a `.tsx` file format that demonstrates how to create a simple interactive component. Initially we use `import` statements to bring in React and define our component with TypeScript interfaces\n\n**Overview**\n- This is a child component that receives data and behavior through props\n- It displays the current count number and handles click events\n- It shows how to define proper TypeScript interfaces for props\n- It demonstrates the concept of reusable UI components\n\n**How it works step by step**\n- First, we define a TypeScript interface for our props\n- We create a functional component that receives count and onIncrement\n- When the button is clicked, it calls the onIncrement function\n- The component re-renders whenever the count prop changes\n- The button displays the current count value\n\n**Connections**\n- Receives `count` prop from `/src/App.tsx`\n- Receives `onIncrement` callback function from `/src/App.tsx`\n- Gets imported and used in the main App component\n- The callback function updates the state in the parent component\n\n**Real-world usage**\n- This pattern is used everywhere in React applications\n- Props allow parent components to control child component behavior\n- Callback functions enable child-to-parent communication\n- TypeScript interfaces ensure type safety for props\n\n**Component Structure Breakdown**\n```tsx\n// Part 1: TypeScript interface for props\ninterface CounterButtonProps {\n  count: number;\n  onIncrement: () => void;\n}\n\n// Part 2: Functional component definition\nconst CounterButton: React.FC<CounterButtonProps> = ({ count, onIncrement }) => {\n  return (\n    <button onClick={onIncrement}>\n      count is {count}\n    </button>\n  );\n};\n\n// Part 3: Export for use in other files\nexport default CounterButton;\n```\n\n**Key parts explained**\n- `interface CounterButtonProps` - Defines what props this component expects\n- `React.FC<CounterButtonProps>` - TypeScript syntax for functional component with props\n- `{ count, onIncrement }` - Destructuring props in the function parameters\n- `onClick={onIncrement}` - Connecting the click event to the callback function\n- `count is {count}` - Displaying the dynamic count value\n\n**Learning points**\n- Props are how parent components pass data to child components\n- Callback functions allow children to communicate back to parents\n- TypeScript interfaces make components more maintainable\n- Functional components are the modern way to write React components\n- Event handlers in JSX use camelCase (onClick, not onclick)",
  "/src/app.css":
    "**app.css is the component-specific stylesheet for our main application**\nThis is a `.css` file format that contains styles specifically for the App component and its child elements. Initially we import this file in our App.tsx to apply these styles to our React components\n\n**Overview**\n- This file contains CSS rules that style the main app layout\n- It defines styles for logos, cards, and other app-specific elements\n- It uses CSS properties like flexbox, transitions, and filters\n- It demonstrates how to style React components with external CSS files\n\n**How it works step by step**\n- When App.tsx imports this CSS file, the styles become available globally\n- The `.logo` class styles the Vite and React logos\n- The `.card` class provides padding and layout for the main content area\n- CSS animations and transitions add visual polish to the logos\n- The styles are applied automatically when React renders the JSX\n\n**Connections**\n- Gets imported by `/src/App.tsx` with `import './app.css'`\n- Styles the logo images and card container in the App component\n- Works together with `/src/index.css` for complete styling\n- Affects the visual appearance of elements rendered by React\n\n**Real-world usage**\n- Component-specific CSS files help organize styles by feature\n- Importing CSS in React components is a common pattern\n- CSS classes correspond to className props in JSX\n- This approach separates styling concerns from component logic\n\n**CSS Rules Breakdown**\n```css\n/* Logo styling with animations */\n.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n\n/* Hover effects for logos */\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n\n/* Special effect for React logo */\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n/* Animation for React logo */\n@keyframes logo-spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n\n/* Card container styling */\n.card {\n  padding: 2em;\n}\n```\n\n**Key parts explained**\n- `.logo` - Styles all logo images with size, padding, and transitions\n- `.logo:hover` - Adds glow effect when hovering over logos\n- `.logo.react:hover` - Special blue glow for React logo\n- `@keyframes logo-spin` - Defines spinning animation\n- `.card` - Provides padding for the main content area\n\n**Learning points**\n- CSS files can be imported directly into React components\n- CSS classes are applied using the className prop in JSX\n- CSS animations and transitions enhance user experience\n- Component-specific CSS helps with style organization\n- CSS filters can create visual effects like drop shadows",
  "/src/index.css":
    "**index.css is the global stylesheet that sets up base styles for our entire application**\nThis is a `.css` file format that contains foundational styles applied to all elements. Initially we import this file in main.tsx to establish consistent styling across our React app\n\n**Overview**\n- This file sets up the global CSS reset and base styles\n- It defines CSS custom properties (variables) for consistent theming\n- It styles the body element and sets up the overall page layout\n- It includes responsive design considerations and accessibility features\n\n**How it works step by step**\n- When main.tsx imports this file, these styles apply to the entire document\n- The CSS custom properties in `:root` create a design system\n- Body styles center the content and set up the dark theme\n- Typography settings establish consistent text rendering\n- Button and link styles provide default interactive element appearance\n\n**Connections**\n- Gets imported by `/src/main.tsx` with `import './index.css'`\n- Styles are applied globally to all HTML elements\n- Works with `/src/app.css` which adds component-specific styles\n- Affects the appearance of all elements, including those created by React\n\n**Real-world usage**\n- Global CSS files establish design systems and consistent theming\n- CSS custom properties allow easy theme customization\n- Reset styles ensure consistent appearance across different browsers\n- This approach separates global concerns from component-specific styling\n\n**CSS Structure Breakdown**\n```css\n/* CSS Custom Properties for theming */\n:root {\n  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* Body layout and centering */\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\n/* Typography for headings */\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\n/* Default button styling */\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\n\n/* Button hover and focus states */\nbutton:hover {\n  border-color: #646cff;\n}\n\nbutton:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n}\n```\n\n**Key parts explained**\n- `:root` - Defines CSS custom properties for consistent theming\n- `color-scheme: light dark` - Enables automatic dark mode support\n- `font-synthesis: none` - Prevents browser from synthesizing bold/italic\n- `body` - Centers content and sets up flexbox layout\n- `button` - Provides consistent button styling across the app\n- `@media (prefers-color-scheme: light)` - Adapts colors for light mode\n\n**Learning points**\n- CSS custom properties create maintainable design systems\n- Global styles establish consistency across the entire application\n- Responsive design starts with proper viewport and body setup\n- CSS resets prevent browser default style inconsistencies\n- The @media query enables automatic dark/light mode switching\n- Proper focus styles are crucial for accessibility",
  "/src/assets/react.svg":
    '**react.svg is the official React logo file used for branding our application**\nThis is a `.svg` file format that contains vector graphics for the React logo. Initially we import this file in our App.tsx component to display the logo in our React application\n\n**Overview**\n- This SVG file contains the official React logo design\n- It uses scalable vector graphics that look crisp at any size\n- The logo includes the characteristic circular symbol with three orbital elements\n- It\'s designed to work well on both light and dark backgrounds\n\n**How it works step by step**\n- The SVG file is placed in the `/src/assets/` folder\n- In App.tsx, we import it using ES6 import syntax\n- The imported variable contains the path to the processed asset\n- We use it in an `<img>` tag with appropriate CSS classes\n- Vite processes the SVG and makes it available to our component\n\n**Connections**\n- Gets imported by `/src/App.tsx` as `import reactLogo from \'./assets/react.svg\'`\n- Used in JSX as `<img src={reactLogo} className="logo react" alt="React logo" />`\n- Styled by CSS rules in `/src/app.css` that target the `.logo.react` class\n- The logo is displayed alongside the Vite logo in the main app\n\n**Real-world usage**\n- SVG logos are perfect for web applications because they scale perfectly\n- Asset imports in Vite handle optimization and path resolution automatically\n- Logos help with brand recognition and user trust\n- Vector graphics remain sharp on high-DPI displays\n\n**SVG Structure Overview**\n```svg\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <!-- Circular background -->\n  <circle cx="50" cy="50" r="45" fill="#61dafb"/>\n  \n  <!-- Three orbital elements -->\n  <g fill="#ffffff">\n    <circle cx="50" cy="50" r="6"/>\n    <!-- Orbital paths and elements -->\n  </g>\n</svg>\n```\n\n**Key features**\n- Scalable Vector Graphics format for perfect scaling\n- Official React brand colors (cyan/teal blue)\n- Three orbital elements representing the atomic structure\n- Clean, modern design that works on any background\n- Optimized file size for web delivery\n\n**Learning points**\n- SVG files are ideal for logos and icons due to perfect scaling\n- Vite handles asset processing and optimization automatically\n- ES6 imports work for static assets, not just JavaScript modules\n- Asset paths in production are handled by the build system\n- Alt text is important for accessibility when using images',
  "/src/vite-env.d.ts":
    "**vite-env.d.ts is a TypeScript declaration file that provides types for Vite's development environment**\nThis is a `.d.ts` file format that contains TypeScript type definitions. Initially we include this file to help TypeScript understand Vite-specific features and modules\n\n**Overview**\n- This declaration file tells TypeScript about Vite's client-side APIs\n- It enables proper type checking for Vite-specific imports and modules\n- It references the official Vite client types\n- It helps prevent TypeScript errors related to Vite's module system\n\n**How it works step by step**\n- The file contains a single reference directive\n- TypeScript reads this when compiling our project\n- It pulls in type definitions from Vite's client package\n- This enables features like Hot Module Replacement (HMR) typing\n- It allows proper typing for imported assets and modules\n\n**Connections**\n- Referenced in `/tsconfig.json` and `/tsconfig.app.json`\n- Enables proper typing for asset imports in `/src/App.tsx`\n- Helps with Hot Module Replacement during development\n- Used by the TypeScript compiler across the entire project\n\n**Real-world usage**\n- Declaration files are essential for TypeScript projects using build tools\n- They provide type safety for tool-specific features\n- This pattern is used by all major bundlers and build tools\n- They help catch errors at compile time rather than runtime\n\n**File Content**\n```ts\n/// <reference types=\"vite/client\" />\n```\n\n**Key parts explained**\n- `/// <reference types=\"vite/client\" />` - References Vite's client-side type definitions\n- This single line enables all Vite-specific TypeScript support\n- The triple slash directive is TypeScript's way of referencing type definitions\n- \"vite/client\" refers to the official Vite client types package\n\n**Learning points**\n- Declaration files extend TypeScript's understanding of external libraries\n- Triple slash directives are TypeScript's way of referencing type definitions\n- Build tool integration often requires these declaration files\n- Type safety extends to build tools, not just application code\n- These files are usually maintained by the tool authors and referenced by projects",
  "/public/vite.svg":
    '**vite.svg is the official Vite logo file served directly from the public directory**\nThis is a `.svg` file format that contains the Vite logo as a vector graphic. Unlike assets in the src folder, files in public are served directly by the web server without processing\n\n**Overview**\n- This SVG file contains the official Vite logo design\n- It\'s placed in the `/public/` folder, making it available at the root path\n- It\'s used both as a favicon in the HTML and as a logo image in the app\n- Public assets are served statically without bundling or processing\n\n**How it works step by step**\n- The file is placed in the public folder during development\n- It\'s served directly by the development server at the root path\n- In index.html, it\'s referenced as `/vite.svg` for the favicon\n- In App.tsx, it\'s imported using the public path `/vite.svg`\n- The web server delivers it as-is without any transformation\n\n**Connections**\n- Referenced in `/index.html` as `<link rel="icon" type="image/svg+xml" href="/vite.svg" />`\n- Imported in `/src/App.tsx` as `import viteLogo from \'/vite.svg\'`\n- Used in JSX as `<img src={viteLogo} className="logo" alt="Vite logo" />`\n- Styled by CSS rules in `/src/app.css` that target the `.logo` class\n\n**Real-world usage**\n- Public folder is perfect for static assets that don\'t need processing\n- Favicons, robots.txt, and other static files belong in public\n- Assets in public are available at predictable URLs\n- No import statement needed - just reference by path\n\n**Key differences from src/assets**\n- **Public folder**: Served directly, no processing, available at root path\n- **Src/assets folder**: Processed by Vite, can be imported in JavaScript, optimized\n\n**Learning points**\n- Public folder bypasses the build system entirely\n- Files in public are served with their original names and paths\n- Good for static assets that rarely change\n- Public assets are available immediately without imports\n- Perfect for favicons, social media images, and static documents',
  "/package.json":
    '**package.json is the configuration file that defines our project\'s identity, dependencies, and scripts**\nThis is a `.json` file format that serves as the foundation of any Node.js project. Initially we use this file to manage our project\'s metadata and specify what packages our application needs to run\n\n**Overview**\n- This JSON file contains all the essential project information\n- It defines the project name, version, and basic metadata\n- It specifies which packages are required for the project to work\n- It contains scripts that can be run using npm or yarn commands\n- It\'s read by package managers to install dependencies and run tasks\n\n**How it works step by step**\n- When we run `npm install`, npm reads this file to know what to download\n- The dependencies section lists packages needed for the app to run\n- The devDependencies section lists tools needed only during development\n- Scripts define shortcuts for common tasks like starting the dev server\n- Package managers create a lock file to ensure consistent installations\n\n**Connections**\n- Read by npm/yarn when installing dependencies\n- Used by Vite build system to understand the project structure\n- Scripts are executed when running `npm run dev` or `npm run build`\n- Dependencies listed here are bundled by Vite for the final application\n\n**Real-world usage**\n- Every Node.js project needs a package.json file\n- It serves as documentation of what the project depends on\n- Scripts automate common development tasks\n- Version ranges allow for automatic security updates\n- The private flag prevents accidental publishing to npm\n\n**JSON Structure Breakdown**\n```json\n{\n  "name": "show-project",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc -b && vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^19.1.1",\n    "react-dom": "^19.1.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.33.0",\n    "@types/react": "^19.1.10",\n    "@types/react-dom": "^19.1.7",\n    "@vitejs/plugin-react-swc": "^4.0.0",\n    "autoprefixer": "^10.4.21",\n    "eslint": "^9.33.0",\n    "eslint-plugin-react-hooks": "^5.2.0",\n    "eslint-plugin-react-refresh": "^0.4.20",\n    "globals": "^16.3.0",\n    "postcss": "^8.5.6",\n    "tailwindcss": "^3.4.17",\n    "typescript": "~5.8.3",\n    "typescript-eslint": "^8.39.1",\n    "vite": "^7.1.2"\n  }\n}\n```\n\n**Key sections explained**\n- **name**: Project identifier used by package managers\n- **private**: Prevents publishing to npm registry\n- **scripts**: Shortcuts for common commands\n- **dependencies**: Packages needed for the app to run in production\n- **devDependencies**: Tools needed only during development\n- **version**: Semantic versioning for the project\n\n**Learning points**\n- Package.json is the single source of truth for project dependencies\n- Scripts automate repetitive tasks and improve developer experience\n- Version ranges (^ and ~) provide flexibility while ensuring compatibility\n- Separating devDependencies keeps production bundles smaller\n- The type field enables ES modules throughout the project\n\n**Common scripts explained**\n- `npm run dev` → Starts Vite development server with hot reload\n- `npm run build` → Compiles TypeScript and creates production build\n- `npm run preview` → Serves the production build locally for testing\n- `npm run lint` → Runs ESLint to check code quality',
  "/vite.config.jsx":
    "**vite.config.jsx is the configuration file that customizes how Vite builds and serves our application**\nThis is a `.jsx` file format that exports a configuration object for the Vite build tool. Initially we use this file to set up plugins and customize the development and build process\n\n**Overview**\n- This file defines how Vite should process our React application\n- It configures the React plugin to enable JSX transformation\n- It sets up Hot Module Replacement (HMR) for development\n- It customizes the build output and development server behavior\n- It's written in JavaScript with JSX syntax support\n\n**How it works step by step**\n- When Vite starts, it reads this configuration file\n- The `defineConfig` function provides TypeScript support and validation\n- The React plugin enables JSX parsing and Fast Refresh\n- Plugins are applied to the build process in order\n- The configuration is merged with Vite's defaults\n\n**Connections**\n- Imported by Vite when starting the development server\n- Uses `@vitejs/plugin-react-swc` for React JSX transformation\n- Enables Fast Refresh during development\n- Affects how assets are processed and bundled\n- Configures the development server and build output\n\n**Real-world usage**\n- Every Vite project needs a config file for React applications\n- Plugins extend Vite's capabilities for different frameworks\n- Configuration allows optimization for specific deployment targets\n- Build customization ensures proper production output\n- Development server configuration improves the development experience\n\n**Configuration Structure Breakdown**\n```jsx\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react-swc'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n```\n\n**Key parts explained**\n- `import { defineConfig }` - Gets the configuration helper function\n- `import react from '@vitejs/plugin-react-swc'` - Imports the React plugin\n- `defineConfig()` - Wraps configuration with TypeScript support\n- `plugins: [react()]` - Applies the React plugin to the build process\n- The comment references Vite's official configuration documentation\n\n**Learning points**\n- Vite config files are JavaScript modules that export configuration objects\n- Plugins are the primary way to extend Vite's functionality\n- The React plugin enables JSX transformation and Fast Refresh\n- `defineConfig` provides better TypeScript support and validation\n- Configuration can be customized for different environments\n\n**Common plugin uses**\n- **React plugin**: Enables JSX and Fast Refresh\n- **CSS plugins**: Process Sass, Less, or PostCSS\n- **Build plugins**: Optimize bundles, generate manifests\n- **Development plugins**: Add development tools and debugging\n\n**Build vs Development**\n- **Development**: Fast Refresh, source maps, error overlays\n- **Production**: Minification, code splitting, asset optimization",
  "/tsconfig.json":
    '**Title**\nTypeScript Project References\n\n**Overview**\n- Main TypeScript configuration that references multiple tsconfig files.\n- Uses project references for better build performance.\n\n**Connections**\n- References /tsconfig.app.json and /tsconfig.node.json.\n- Used by TypeScript compiler for the entire project.\n\n**Snippet**\n```json\n{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" },\n    { "path": "./tsconfig.node.json" }\n  ]\n}\n```\n\n**Real-world**\n- Project references enable faster compilation and better IDE support in large TypeScript projects.\n',
  "/tsconfig.app.json":
    '**Title**\nApplication TypeScript Config\n\n**Overview**\n- TypeScript configuration specifically for the application code.\n- Targets modern browsers with appropriate library settings.\n\n**Connections**\n- Applies to files in the src directory.\n- Referenced by main /tsconfig.json.\n\n**Snippet**\n```json\n{\n  "compilerOptions": {\n    "target": "ES2022",\n    "lib": ["ES2022", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "jsx": "react-jsx",\n    "strict": true\n  },\n  "include": ["src"]\n}\n```\n\n**Real-world**\n- Separate TypeScript configs allow different settings for app code vs build tools.\n',
  "/tsconfig.node.json":
    '**Title**\nNode.js TypeScript Config\n\n**Overview**\n- TypeScript configuration for Node.js build tools and configuration files.\n- Optimized for server-side TypeScript compilation.\n\n**Connections**\n- Applies to vite.config.jsx and other config files.\n- Referenced by main /tsconfig.json.\n\n**Snippet**\n```json\n{\n  "compilerOptions": {\n    "target": "ES2023",\n    "lib": ["ES2023"],\n    "module": "ESNext"\n  },\n  "include": ["vite.config.ts"]\n}\n```\n\n**Real-world**\n- Node-specific TypeScript configs ensure compatibility with server environments.\n',
  "/tailwind.config.js":
    "**Title**\nTailwind CSS Configuration\n\n**Overview**\n- Configuration file for Tailwind CSS utility framework.\n- Customizes available classes and design system.\n\n**Connections**\n- Processed by PostCSS through /postcss.config.js.\n- Enables Tailwind classes throughout the application.\n\n**Snippet**\n```js\n/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n```\n\n**Real-world**\n- Tailwind config allows customization of the utility-first CSS framework for specific design needs.\n",
  "/postcss.config.js":
    "**Title**\nPostCSS Configuration\n\n**Overview**\n- Configuration for PostCSS CSS processing pipeline.\n- Enables Tailwind CSS and Autoprefixer plugins.\n\n**Connections**\n- Processes CSS files during build.\n- Works with Vite build system.\n\n**Snippet**\n```js\nexport default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}\n```\n\n**Real-world**\n- PostCSS configurations enable modern CSS features and automatic vendor prefixing.\n",
  "/.gitignore":
    "**.gitignore is a special text file that tells Git which files and folders to ignore**\nThis is a `.gitignore` file format that contains patterns for files Git should not track. Initially we create this file to keep our repository clean by excluding build artifacts, dependencies, and environment-specific files\n\n**Overview**\n- This file contains patterns that match files Git should ignore\n- It prevents committing temporary files, build outputs, and sensitive data\n- Each line contains a pattern that matches files or directories\n- Comments start with `#` and are ignored by Git\n- It's placed in the root of the repository\n\n**How it works step by step**\n- When you run `git add .`, Git checks this file first\n- Any files matching the patterns are excluded from the commit\n- The patterns use glob syntax similar to shell wildcards\n- Lines starting with `#` are comments for documentation\n- Empty lines are ignored\n\n**Connections**\n- Read by Git during add, commit, and status operations\n- Affects the entire repository (all files and subdirectories)\n- Works with `/package.json` to exclude node_modules\n- Prevents committing build artifacts from `/dist` or `/build` folders\n- Keeps environment variables in `.env` files private\n\n**Real-world usage**\n- Every Git repository should have a .gitignore file\n- It prevents committing large binary files or build artifacts\n- Keeps sensitive information like API keys out of version control\n- Different project types have different standard .gitignore files\n- Teams often share .gitignore files as part of their workflow\n\n**Pattern Examples Breakdown**\n```gitignore\n# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n```\n\n**Key patterns explained**\n- `logs` and `*.log` - Exclude all log files\n- `node_modules` - Exclude npm dependencies (huge folder)\n- `dist` and `dist-ssr` - Exclude build outputs\n- `*.local` - Exclude local environment files\n- `.vscode/*` - Exclude editor settings (but keep extensions.json)\n- `!.vscode/extensions.json` - Include this specific file\n- `.idea` and `.DS_Store` - Exclude IDE-specific files\n\n**Learning points**\n- .gitignore uses glob patterns for flexible matching\n- The `!` prefix negates patterns (includes files that would be excluded)\n- Comments help document why certain files are ignored\n- Different tools have different standard ignore patterns\n- .gitignore is checked into version control itself\n\n**Common ignore categories**\n- **Dependencies**: node_modules, vendor, packages\n- **Build outputs**: dist, build, out, .next\n- **Environment**: .env, .local, config.local.json\n- **OS files**: .DS_Store, Thumbs.db, Desktop.ini\n- **IDE files**: .vscode, .idea, *.swp, *.swo\n- **Logs**: *.log, logs/, npm-debug.log*\n- **Cache**: .cache, .npm, .yarn\n\n**Best practices**\n- Use standard .gitignore templates for your tech stack\n- Be specific about what you ignore\n- Don't ignore files that other developers need\n- Review .gitignore before committing sensitive files\n- Use `git check-ignore` to debug ignore patterns",
};
