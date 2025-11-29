# Email Integration Guide (Supabase + Resend)

This guide explains how to send emails to logged-in users using **Supabase Edge Functions** and **Resend**.

## Prerequisites

1.  **Supabase Project:** You already have this.
2.  **Resend Account:** Sign up at [resend.com](https://resend.com) (Free tier allows 3000 emails/mo).
3.  **Supabase CLI:** You need this installed on your machine to deploy functions.

## Step 1: Install Supabase CLI

If you haven't already:
```bash
brew install supabase/tap/supabase
```

## Step 2: Login to Supabase CLI

```bash
supabase login
```
Follow the browser instructions to log in.

## Step 3: Initialize Supabase (Locally)

Inside your project root (`brAIn` folder):
```bash
supabase init
```

## Step 4: Configure Secrets

You need to give your Supabase function access to your Resend API Key.
1.  Get your API Key from [Resend Dashboard](https://resend.com/api-keys).
2.  Run this command (replace `YOUR_RESEND_KEY`):
```bash
supabase secrets set RESEND_API_KEY=re_123456789
```

## Step 5: Deploy the Function

I have created the function code for you in `supabase/functions/send-email/index.ts`.
To deploy it to the cloud:

```bash
supabase functions deploy send-email
```

## Step 6: Usage

### Option A: Call from Frontend (React)
You can trigger this function directly from your app (e.g., when a user clicks a button).

```typescript
import { supabase } from '../lib/supabase';

const sendWelcomeEmail = async () => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      subject: 'Welcome to brAIn!',
      html: '<h1>Welcome Cadet!</h1><p>Ready to learn?</p>'
    },
  });

  if (error) console.error('Error:', error);
  else console.log('Email sent:', data);
};
```

### Option B: Call from Database (Trigger)
You can set up a Database Webhook in the Supabase Dashboard to automatically call this function whenever a new user is created in the `auth.users` table.
