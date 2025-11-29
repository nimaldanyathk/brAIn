import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  subject: string;
  // We don't need 'html' in the request body anymore as we generate it here, 
  // but we might want to accept a 'name' or 'type' to customize it.
  name?: string; 
}

const getEmailTemplate = (name: string = "Cadet") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to brAIn</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
    .header { background-color: #000000; padding: 32px; text-align: center; }
    .logo { color: #3b82f6; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-decoration: none; }
    .hero { padding: 40px 32px; text-align: center; background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%); color: white; }
    .hero h1 { margin: 0 0 16px; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
    .hero p { margin: 0; font-size: 18px; color: #a1a1aa; line-height: 1.6; }
    .content { padding: 40px 32px; }
    .feature { margin-bottom: 32px; padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .feature h3 { margin: 0 0 8px; color: #0f172a; font-size: 18px; font-weight: 700; }
    .feature p { margin: 0; color: #64748b; font-size: 15px; line-height: 1.5; }
    .owl-section { background-color: #eff6ff; padding: 32px; text-align: center; border-top: 1px solid #dbeafe; }
    .owl-avatar { width: 64px; height: 64px; background-color: #3b82f6; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; border: 3px solid #000; }
    .btn { display: inline-block; background-color: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; border: 2px solid #000; transition: transform 0.1s; }
    .footer { padding: 32px; text-align: center; background-color: #f4f4f5; color: #71717a; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- REPLACE WITH YOUR ACTUAL LOGO URL -->
      <div class="logo">brAIn</div>
    </div>
    
    <div class="hero">
      <h1>Welcome to the Future, ${name}.</h1>
      <p>You've just taken the first step into a universe of interactive learning. Buckle up!</p>
      <a href="https://brain-app.vercel.app" class="btn">Launch App</a>
    </div>

    <div class="content">
      <div class="feature">
        <h3>⚛️ Interactive Simulations</h3>
        <p>Don't just read about Physics and Chemistry—experience them. Manipulate 3D models, run experiments, and see the invisible.</p>
      </div>

      <div class="feature">
        <h3>🏆 Gamified Profile</h3>
        <p>Earn XP, maintain your streak, and collect 3D badges in your Trophy Case. Learning has never been this rewarding.</p>
      </div>
    </div>

    <div class="owl-section">
      <div class="owl-avatar">🦉</div>
      <h3 style="margin:0 0 8px; color:#1e3a8a;">Meet Prof Owl</h3>
      <p style="margin:0; color:#1e40af;">"Hoo-Hoo! I'm your personal AI tutor. Stuck on a problem? Need a quiz? Just give me a hoot!"</p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} brAIn Education. All rights reserved.</p>
      <p>Made with 🧠 and 💻 for the students of tomorrow.</p>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Validate Auth (Ensure user is logged in)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authHeader,
        apikey: supabaseAnonKey,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Invalid Token");
    }

    const userData = await userResponse.json();
    const userEmail = userData.email;
    // Use user metadata name if available, otherwise 'Cadet'
    const userName = userData.user_metadata?.full_name || "Cadet";

    if (!userEmail) {
      throw new Error("User has no email");
    }

    // 2. Parse Request Body (Optional, for custom subject)
    const { subject }: EmailRequest = await req.json().catch(() => ({ subject: "Welcome to brAIn!" }));

    // 3. Send Email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "brAIn App <onboarding@resend.dev>", // Update this with your verified domain
        to: [userEmail],
        subject: subject || "Welcome to brAIn!",
        html: getEmailTemplate(userName),
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
