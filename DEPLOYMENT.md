# Deployment Guide (Vercel)

This guide explains how to deploy the **brAIn** app to Vercel.

## Prerequisites

1.  **GitHub Repository:** Ensure your code is pushed to GitHub.
2.  **Vercel Account:** Sign up at [vercel.com](https://vercel.com).

## Step 1: Import Project

1.  Go to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`brAIn`).
4.  Click **"Import"**.

## Step 2: Configure Project

Vercel should automatically detect that this is a **Vite** project.

*   **Framework Preset:** Vite
*   **Root Directory:** `./` (default)
*   **Build Command:** `npm run build` (default)
*   **Output Directory:** `dist` (default)

### Environment Variables

You must add your environment variables here.

1.  Expand the **"Environment Variables"** section.
2.  Add the following keys (copy values from your local `.env`):
    *   `VITE_GEMINI_API_KEY`
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`

## Step 3: Deploy

1.  Click **"Deploy"**.
2.  Wait for the build to complete.
3.  Once finished, you will get a live URL (e.g., `https://brain-app.vercel.app`).

## Step 4: Update Supabase Auth

1.  Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2.  Add your new Vercel URL to **Site URL** and **Redirect URLs**.
    *   Example: `https://brain-app.vercel.app/**`
3.  Click **Save**.

## Troubleshooting

### 404 on Refresh
If you get a 404 error when refreshing a page (like `/profile`), ensure the `vercel.json` file is present in your project root. This handles the Single Page Application (SPA) routing.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
