---
description: How to set up Supabase for the brAIn app
---

# Supabase Setup Guide

Follow these steps to connect your local app to a real Supabase backend.

## 1. Create a Supabase Project
1.  Go to [database.new](https://database.new) and sign in with GitHub.
2.  Create a new project (e.g., "brain-app").
3.  Set a database password and choose a region near you.
4.  Wait for the project to initialize (takes ~1-2 minutes).

## 2. Get Your API Keys
1.  Once the project is ready, go to **Project Settings** (cog icon) > **API**.
2.  Find the `Project URL` and `anon` / `public` key.

## 3. Configure Environment Variables
1.  In your project root, create a file named `.env` (if it doesn't exist).
2.  Add the following lines, replacing the values with your actual keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Enable Authentication
### Option A: Google OAuth (Recommended for Production)
1.  Go to **Authentication** > **Providers** in your Supabase dashboard.
2.  Click **Google**.
3.  You need a **Client ID** and **Client Secret** from Google Cloud Console.
    - *If you see "Unsupported provider: missing OAuth secret", this is what's missing.*
    - [Supabase Guide for Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)

### Option B: Email/Password (Easiest for Testing)
1.  Go to **Authentication** > **Providers**.
2.  Click **Email**.
3.  Ensure **Enable Email provider** is toggled **ON**.
4.  (Optional) Disable "Confirm email" in **Authentication** > **URL Configuration** if you want instant login.

## 5. Restart the Server
1.  Stop the running server (Ctrl+C).
2.  Run `npm run dev` again to load the new environment variables.

Your app is now connected! The "Simulate Demo User" warning should disappear from the login page.
