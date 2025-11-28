# Deploying brAIn to Vercel

This guide will help you deploy the `brAIn` application to Vercel.

## Prerequisites

1.  A [Vercel Account](https://vercel.com/signup).
2.  The project pushed to a GitHub repository (which we have already done).

## Steps

1.  **Log in to Vercel:** Go to [vercel.com](https://vercel.com) and log in.
2.  **Add New Project:**
    *   Click the **"Add New..."** button on your dashboard.
    *   Select **"Project"**.
3.  **Import Git Repository:**
    *   You should see a list of your GitHub repositories.
    *   Find `brAIn` (or whatever you named your repo) and click **"Import"**.
4.  **Configure Project:**
    *   **Framework Preset:** Vercel should automatically detect **Vite**. If not, select it from the dropdown.
    *   **Root Directory:** Leave as `./` (default).
    *   **Build Command:** `npm run build` (default).
    *   **Output Directory:** `dist` (default).
5.  **Environment Variables:**
    *   Expand the **"Environment Variables"** section.
    *   You need to add your API keys here. Copy them from your local `.env` file.
    *   **Key:** `VITE_GEMINI_API_KEY`
    *   **Value:** `[Your Gemini API Key]`
    *   *(Add any other keys from your .env file, like Supabase keys if you have them)*
6.  **Deploy:**
    *   Click **"Deploy"**.

## Post-Deployment

Vercel will build your project. Once finished, you will get a live URL (e.g., `brain-app.vercel.app`).

### Troubleshooting 404 Errors on Refresh
If you refresh a page like `/physix` and get a 404 error, ensure the `vercel.json` file is present in your repository root. This file handles the routing for Single Page Applications.
