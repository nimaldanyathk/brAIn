import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    subject: string;
    html: string;
}

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

        // Create a Supabase client to validate the token and get user email
        // Note: In Edge Functions, we use the standard fetch API or a lightweight client
        // For simplicity, we'll trust the JWT payload passed by Supabase Gateway if configured,
        // but best practice is to use the supabase-js client to getUser().

        // For this template, we assume the user's email is passed in the body OR we fetch it.
        // Let's fetch it using the token for security.
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

        // We can't import supabase-js easily in Deno without a CDN, so we'll use the User Info endpoint
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

        if (!userEmail) {
            throw new Error("User has no email");
        }

        // 2. Parse Request Body
        const { subject, html }: EmailRequest = await req.json();

        // 3. Send Email via Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "brAIn App <onboarding@resend.dev>", // Use your verified domain or resend.dev for testing
                to: [userEmail],
                subject: subject,
                html: html,
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
