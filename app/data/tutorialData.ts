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

  "Centralized app configuration": `# Centralized  Application Configuration

Learn how to customize your application's settings using the centralized configuration system. This guide explains all the options available in the app config file. 🚀 


## What is App Configuration?

The app configuration file (\`config/app-config.ts\`) is the central place where you manage all your application settings. Instead of hunting through multiple files, you can control key features from one location.


## Configuration Sections 📂

The configuration is organized into four main sections:

1. **App Details** - Basic information about your application
2. **Login Settings** - Authentication options
3. **Routing** - Page access control
4. **Theme** - Visual appearance settings



## App Details Configuration ℹ️

This section controls basic information about your application:

\`\`\`typescript
app_details: {
  name: "Indexo",
  description: "A Next.js boilerplate application with Supabase and Stripe integration",
  version: "1.0.0",
}
\`\`\`


### Customization Options:
- **name**: Your application's name (appears in browser tab, SEO titles)
- **description**: Brief description for SEO and social sharing
- **version**: Current version of your application



## Login Configuration 🔐

Control how users can access your application:

\`\`\`typescript
login: {
  google_auth_enabled: true,
  email_auth_enabled: true,
  show_social_divider: true,
}
\`\`\`

### Options Explained:
- **google_auth_enabled**: Allow users to sign in with Google
- **email_auth_enabled**: Allow users to sign in with email/password
- **show_social_divider**: Show "Or sign in with" separator in login forms


## Routing Configuration 🛣️

Manage which pages require authentication:

\`\`\`typescript
routing: {
  private_routes_enabled: true,
  protected_routes: ["/dashboard", "/profile", "/pricing"],
}
\`\`\`

### Key Settings:
- **private_routes_enabled**: Turn on/off all route protection
- **protected_routes**: List of pages that require login

To add a new private page like "/settings":
\`\`\`typescript
protected_routes: ["/dashboard", "/profile", "/pricing", "/settings"]
  \`\`\`


  ## Theme Configuration 🎨

  Control your application's visual appearance:
  
  \`\`\`typescript
  theme: {
    default_mode: "dark",
    allow_user_toggle: true,
    persist_to_local_storage: false,
    brand: {
      light: {
        primary: "#101010",
        primary_foreground: "#ffffff",
        // ... other colors
      },
      dark: {
        primary: "#60a5fa",
        primary_foreground: "#0a0a0a",
        // ... other colors
      },
    },
  }
  \`\`\`
  
### Theme Options:
  - **default_mode**: Initial theme ("light", "dark", or "system")
  - **allow_user_toggle**: Let users switch between light/dark mode
  - **persist_to_local_storage**: Remember user's theme preference
  - **brand**: Color schemes for light and dark modes
  
### Brand Colors:
  Each mode (light/dark) has these color settings:
  - **primary**: Main brand color
  - **primary_foreground**: Text color on primary buttons
  - **primary_hover**: Color when hovering over primary buttons
  - **secondary**: Secondary color for less important elements
  - **secondary_foreground**: Text color on secondary elements
  

  `,
  "Payment integration": `# Stripe Payment Integration


Learn how to set up and use Stripe payments in your application. This guide covers everything from Stripe Dashboard setup to frontend implementation and backend customization. 🚀


## Getting Started with Stripe 🎯

### 1. Create a Stripe Account

1. Visit [**Stripe.com**](*https://stripe.com*) and click "Start now"
2. Complete the registration process
3. Verify your email and phone number
4. Complete the business verification process

### 2. Access Your Stripe Dashboard

1. Log in to your Stripe account
2. Navigate to the Dashboard
3. Familiarize yourself with the main sections:
   - Payments
   - Products
   - Customers
   - Balance
   - Settings

## Setting Up Products in Stripe 📦

### 1. Create Your First Product

1. In your Stripe Dashboard, go to **"Products"**
2. Click **"Add product"**
3. Enter product details:
   - Product name (e.g., "Basic Plan")
   - Description
   - Price (e.g., $9.99/month)
   - Billing period (monthly/yearly)

### 2. Get Your Price ID

1. After creating a product, you'll see its Price ID
2. It looks like this: \`price_1S0wdPSgaKSlhaHpHHpuizBIN\`
3. Save this ID for later use in your application


## Environment Configuration ⚙️

### 1. Find Your API Keys

In your Stripe Dashboard:
1. Go to **"Developers"** → **"API keys"**
2. Find your:
   - Publishable key (starts with \`pk_\`)
   - Secret key (starts with \`sk_\`)

### 2. Configure Environment Variables

Update your \`.env.local\` file with your Stripe keys:

\`\`\`env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
\`\`\`



## Using the Payment Hook on Frontend 🪝

### 1. Import the Payment Hook

In your component file:

\`\`\`typescript
import { useCreatePaymentLink } from "@/hooks/useCreatePaymentLink";
\`\`\`

### 2. Use the Hook in Your Component

\`\`\`typescript
import { useCreatePaymentLink } from "@/hooks/useCreatePaymentLink";
import { useAuth } from "@/lib/auth-context";

export default function PricingPage() {
  const { createPaymentLink, loading, error } = useCreatePaymentLink();
  const { user } = useAuth();

  const handleSubscribe = async (planId) => {
    // Create payment link with user details
    const result = await createPaymentLink({
      planId: planId,
      metadata: {
        userId: user?.id,
        userEmail: user?.email,
      }
    });

    // Redirect to Stripe payment page
    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div>
      {/* Pricing plans */}
      <button onClick={() => handleSubscribe("basic")}>
        Subscribe to Basic Plan
      </button>
      
      {error && <p>Error: {error}</p>}
    </div>
  );
}
\`\`\`



### 3. Hook Return Values

The hook provides:
- \`createPaymentLink\`: Function to create a payment link
- \`loading\`: Boolean indicating if request is in progress
- \`error\`: Error message if something goes wrong

## Customizing Backend Personal Details 🛠️

### 1. Update Plan Details

In \`app/api/stripe/create-link/route.ts\`, modify the \`getPlanDetails\` function:

\`\`\`typescript
async function getPlanDetails(planId: string) {
  // Update with your actual plan IDs from Stripe
  const plans = {
    basic: { 
      stripePriceId: "price_your_basic_plan_id", 
      name: "Basic Plan" 
    },
    pro: { 
      stripePriceId: "price_your_pro_plan_id", 
      name: "Pro Plan" 
    },
    enterprise: { 
      stripePriceId: "price_your_enterprise_plan_id", 
      name: "Enterprise Plan" 
    },
  };
  return plans[planId as keyof typeof plans];
}
\`\`\`

`,
  Authentications: `# Authentications
 Learn how to implement authentication in your application using both frontend and backend systems. This guide covers everything from basic login to protecting API routes. 🚀
  
 
## Frontend Authentication 🖥️

### 1. Understanding the Auth Context

The frontend authentication system uses React Context to manage user state across your application. The \`useAuth()\` hook provides all the functions you need:


\`\`\`typescript
import { useAuth } from "@/lib/auth-context";

const MyComponent = () => {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useAuth();
  
  // user: Current user object (null if not logged in)
  // loading: Boolean indicating if auth state is loading
  // signIn: Function to sign in a user
  // signUp: Function to create a new user
  // signOut: Function to log out
  // resetPassword: Function to send password reset email
};
\`\`\`



## 2. Protecting Pages with Authentication

Use the \`withAuth\` higher-order component to protect pages:

\`\`\`typescript
"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user && !loading) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, don't render content
  if (!user) {
    return null;
  }

  // Render protected content
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page is only visible to authenticated users.</p>
    </div>
  );
}
\`\`\`



## Backend Authentication 🔐

### 1. Understanding withAuthRequired

The backend authentication system uses \`withAuthRequired\` to protect API routes. This function ensures only authenticated users can access your API endpoints:

\`\`\`typescript
import { withAuthRequired } from "@/lib/auth/withAuth";

export const GET = withAuthRequired(async (req, { session }) => {
  // session contains user information
  const userId = session.user.id;
  
  // Your API logic here
  return NextResponse.json({ userId });
});
\`\`\`


### 2. Protecting API Routes

Create a protected API route:

\`\`\`typescript
// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { withAuthRequired } from "@/lib/auth/withAuth";

export const GET = withAuthRequired(async (req, { session }) => {
  // Only authenticated users can access this
  const userId = session.user.id;
  const userEmail = session.user.email;

  // Fetch user profile data
  const profile = {
    id: userId,
    email: userEmail,
    // ... other profile data
  };

  return NextResponse.json({ profile });
});

export const PUT = withAuthRequired(async (req, { session }) => {
  // Only authenticated users can update their profile
  const userId = session.user.id;
  const body = await req.json();

  // Update user profile logic
  // ... update database

  return NextResponse.json({ success: true });
});
\`\`\`

## Key Benefits of the Authentication System ⭐

- **Full-Stack Authentication**
- **Multiple Authentication Methods**
- **Flexible Route Protection**
- **Developer-Friendly APIs**
- **Production-Ready Security**
`,
};
