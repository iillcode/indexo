export interface TutorialContent {
  [key: string]: string;
}

export const tutorialContent: TutorialContent = {
  "Start your page": `# Home Page Component Integration
  Learn how to put together all the pieces of your home page quickly and easily.


## How Your Home Page Works
Your home page is built like a puzzle - each piece (component) fits together to create the complete picture. Here's how the pieces fit:
  

# 1. Adding Components to Your Home Page 🧩

Let's see how to add components to your home page in simple steps:

- Open file \`app/page.tsx\` and copy paste the following code:

\`\`\`typescript
import HomeClient from "@/components/home/HomeClient";

export default function Home() {
  return <HomeClient />;
}
\`\`\`



# 2. Import all components 
This is where all components come together:

- Open \`components/home/HomeClient.tsx\` file and copy paste the following code:


\`\`\`typescript
"use client";

import { HeroHeader } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { Testimonial } from "@/components/Testimonials";
import { Footer7 } from "@/components/Footer";

export default function HomeClient() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <Testimonial />
      <Footer7 />
    </>
  );
}
\`\`\`

`,

  "Create SEO page": `# Create SEO page

Learn how to create a search engine optimized static page using the built-in SEO system.


## Creating a Static SEO Page 📄

Let's create an "About Us" page with full SEO integration:



### 1. Basic Page Structure

Create a new page file (e.g., \`app/about/page.tsx\` ) and add the following code:


\`\`\`typescript
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { WebPageSEO } from "@/lib/seo/jsonld";
import AboutComponent from "@/components/AboutComponent";


// Add SEO metadata
export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description: "Learn more about our company, mission, and values.",
  path: "/about",
  keywords: ["about", "company", "mission", "values"],
});

export default function AboutPage() {
  return (
    <>
      {/* Add structured data */}
      <WebPageSEO
        path="/about"
        title="About Us"
        description="Learn more about our company, mission, and values."
      />
      
      {/* Your page content */}
      <div className="container mx-auto py-12">
        <h1>About Our Company</h1>
        <p className="mt-4">Your company story here...</p>
      </div>
    </>
  );
}
\`\`\`

## 2. Create a About component

- Create a new file \`components/AboutComponent.tsx\` and add the following code:

\`\`\`typescript
"use client";

import { WebPageSEO } from "@/lib/seo/jsonld";


export default function AboutComponent() {
  return (
    <>
      {/* Add structured data */}
      <WebPageSEO
        path="/about"
        title="About Us"
        description="Learn more about our company, mission, and values."
      />
      
      {/* Your page content */}
      <div className="container mx-auto py-12">
        <h1>About Our Company</h1>
        <p className="mt-4">Your company story here...</p>
      </div>
    </>
  );
}
\`\`\`



## 2. Add your static page route on \`sitemap.tsx\` 

- Open \`lib/seo/sitemap.ts\` and edit the following code:

\`\`\`typescript
// Central list of static routes. Add project pages here.
export const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  // Add new path
  { path: "/new-path", changeFrequency: "monthly", priority: 0.8 }, 
];

\`\`\`

## Testing Your SEO 🧪

### Check Metadata
1. View page source in browser
2. Verify title and description tags
3. Confirm canonical URL


`,

  "Private Route Integration": `# Private Route Integration

Learn how to protect pages that should only be accessible to authenticated users.

## Why Private Routes Matter

Private routes protect sensitive content and user-specific information. They ensure only logged-in users can access certain pages like dashboards, profiles, or account settings.


## Setting Up Private Routes 🔐

### 1. Configure Protected Routes

The centralized configuration system makes it easy to manage private routes. Open \`config/app-config.ts\`:

\`\`\`typescript
export const defaultAppConfig: AppConfig = {
  // ... other config
  routing: {
    private_routes_enabled: true, // Enable private route protection
    protected_routes: ["/dashboard", "/profile", "/pricing"], // Routes that require authentication
  },
};
\`\`\`


### 2. Add New Private Routes

To add a new private route like \`"/settings"\`:

\`\`\`typescript
routing: {
  private_routes_enabled: true,
  protected_routes: ["/dashboard", "/profile", "/pricing", "/settings"], // Added new route
}
\`\`\`


### 3. How It Works

The system automatically protects routes listed in \`protected_routes\` when \`private_routes_enabled\` is true.

`,

  width: `# Width

Utilities for setting the width of an element.

## Fixed widths

Use utilities like \`w-96\`, \`w-64\`, and \`w-48\` to set an element to a fixed width.

\`\`\`html
<div class="w-96 ..."></div>
<div class="w-80 ..."></div>
<div class="w-72 ..."></div>
<div class="w-64 ..."></div>
<div class="w-60 ..."></div>
<div class="w-56 ..."></div>
<div class="w-52 ..."></div>
<div class="w-48 ..."></div>
\`\`\`

## Fluid widths

Use \`w-{fraction}\` or \`w-full\` to set an element to a percentage based width.

\`\`\`html
<div class="flex ...">
  <div class="w-1/2 ... ">w-1/2</div>
  <div class="w-1/2 ... ">w-1/2</div>
</div>
<div class="flex ...">
  <div class="w-2/5 ...">w-2/5</div>
  <div class="w-3/5 ...">w-3/5</div>
</div>
<div class="w-1/3 ...">w-1/3</div>
<div class="w-2/3 ...">w-2/3</div>
<div class="w-1/4 ...">w-1/4</div>
<div class="w-3/4 ...">w-3/4</div>
<div class="w-1/5 ...">w-1/5</div>
<div class="w-2/5 ...">w-2/5</div>
<div class="w-3/5 ...">w-3/5</div>
<div class="w-4/5 ...">w-4/5</div>
<div class="w-1/6 ...">w-1/6</div>
<div class="w-5/6 ...">w-5/6</div>
<div class="w-full ...">w-full</div>
\`\`\``,

  height: `# Height

Utilities for setting the height of an element.

## Fixed heights

Use utilities like \`h-96\`, \`h-64\`, and \`h-48\` to set an element to a fixed height.

\`\`\`html
<div class="h-96 ..."></div>
<div class="h-80 ..."></div>
<div class="h-72 ..."></div>
<div class="h-64 ..."></div>
<div class="h-60 ..."></div>
<div class="h-56 ..."></div>
<div class="h-52 ..."></div>
<div class="h-48 ..."></div>
\`\`\`

## Full height

Use \`h-screen\` to make an element span the entire height of the viewport.

\`\`\`html
<div class="h-screen">
  <!-- This div will be the full height of the screen -->
</div>
\`\`\`

## Dynamic heights

Use \`h-auto\` to let the browser determine the height for the element.

\`\`\`html
<div class="h-auto ...">
  <!-- Height will be determined by the content -->
</div>
\`\`\``,

  "font-size": `# Font Size

Utilities for controlling the font size of an element.

## Usage

Control the font size of an element using the \`text-{size}\` utilities.

\`\`\`html
<p class="text-sm ...">The quick brown fox ...</p>
<p class="text-base ...">The quick brown fox ...</p>
<p class="text-lg ...">The quick brown fox ...</p>
<p class="text-xl ...">The quick brown fox ...</p>
<p class="text-2xl ...">The quick brown fox ...</p>
<p class="text-3xl ...">The quick brown fox ...</p>
<p class="text-4xl ...">The quick brown fox ...</p>
<p class="text-5xl ...">The quick brown fox ...</p>
<p class="text-6xl ...">The quick brown fox ...</p>
\`\`\`

## Responsive Design

To control the font size of an element at a specific breakpoint, add a \`{screen}:\` prefix to any existing font size utility.

\`\`\`html
<p class="text-base md:text-lg lg:text-xl">
  The quick brown fox jumps over the lazy dog.
</p>
\`\`\`

## Arbitrary values

If you need to use a one-off font size value that doesn't make sense to include in your theme, use square brackets to generate a property on the fly using any arbitrary value.

\`\`\`html
<p class="text-[14px]">
  The quick brown fox jumps over the lazy dog.
</p>
\`\`\``,
};
