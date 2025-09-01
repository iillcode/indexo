# Authentication Setup Guide

This guide explains how to set up the authentication system with Supabase and the animated sign-in component.

## 🚀 Features Implemented

- ✅ Modern animated sign-in/sign-up forms
- ✅ Supabase authentication integration
- ✅ Google OAuth login
- ✅ Email/password authentication
- ✅ Protected routes with middleware
- ✅ Authentication context and state management
- ✅ Responsive design with dark mode support
- ✅ Form validation and error handling

## 📋 Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Google OAuth**: Set up Google OAuth credentials in Supabase

## ⚙️ Configuration Steps

### 1. Environment Variables

Update `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# For Google OAuth
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Supabase Setup

#### Enable Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable email authentication
3. Configure Site URL: `http://localhost:3000`
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

#### Google OAuth Setup

1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Set redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`

## 🎨 Component Structure

```
components/ui/
└── modern-animated-sign-in.tsx    # Animated form components

app/auth/
├── login/
│   └── page.tsx                   # Login page
├── register/
│   └── page.tsx                   # Registration page
└── callback/
    └── page.tsx                   # OAuth callback handler

contexts/
└── AuthContext.tsx                # Authentication context

lib/
├── supabase.ts                    # Client-side Supabase client
└── supabase-server.ts             # Server-side Supabase client

middleware.ts                      # Authentication middleware
```

## 🔐 Authentication Flow

### Login Process

1. User enters email/password or clicks Google login
2. Supabase handles authentication
3. On success, redirect to `/dashboard`
4. On error, display error message

### Registration Process

1. User enters email/password and confirms password
2. Supabase sends confirmation email
3. User confirms email to activate account
4. User can then log in

### Google OAuth Flow

1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. After approval, redirected to `/auth/callback`
4. Callback handler processes the session
5. Redirect to `/dashboard` on success

## 🛡️ Protected Routes

The middleware automatically protects routes:

- **Public routes**: `/`, `/auth/login`, `/auth/register`, `/auth/callback`
- **Protected routes**: All other routes require authentication
- **Auto-redirect**:
  - Unauthenticated users → `/auth/login`
  - Authenticated users accessing auth pages → `/dashboard`

## 🎯 Usage Examples

### Access Authentication State

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Protected Component

```tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## 🧪 Testing the Setup

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Test Registration**:

   - Visit `http://localhost:3000/auth/register`
   - Fill out the form and submit
   - Check your email for confirmation

3. **Test Login**:

   - Visit `http://localhost:3000/auth/login`
   - Enter credentials and login
   - Should redirect to `/dashboard`

4. **Test Google OAuth**:

   - Click "Login with Google" button
   - Complete Google authentication flow
   - Should redirect to `/dashboard`

5. **Test Protected Routes**:
   - Try accessing `/dashboard` without logging in
   - Should redirect to `/auth/login`

## 🎨 Customization

### Modify Form Fields

Edit the `formFields` object in the auth pages:

```tsx
const formFields = {
  header: "Custom Title",
  subHeader: "Custom subtitle",
  fields: [
    // Add custom fields
  ],
  submitButton: "Custom Button Text",
};
```

### Style Customization

The component uses Tailwind CSS and CSS variables. Modify `globals.css` to customize:

```css
:root {
  --skeleton: your-color;
  --btn-border: your-border-color;
  /* ... other variables */
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login credentials"**: Check email/password combination
2. **Google OAuth not working**: Verify OAuth settings in Supabase and Google Console
3. **Middleware redirect loops**: Check middleware configuration
4. **Environment variables not loading**: Restart development server

### Debug Steps

1. Check browser console for errors
2. Verify Supabase project settings
3. Confirm environment variables are set correctly
4. Test Supabase connection in browser network tab

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Middleware](https://nextjs.org/docs/middleware)

## 🔄 Next Steps

1. Set up email templates in Supabase
2. Configure password reset functionality
3. Add user profile management
4. Implement role-based access control
5. Add social login with other providers
