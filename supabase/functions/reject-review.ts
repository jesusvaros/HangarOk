// supabase/functions/reject-review.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  } as const;

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const { review_session_id, rejection_reason } = await req.json();

    if (!review_session_id || !rejection_reason) {
      return new Response("Missing review_session_id or rejection_reason", { status: 400, headers: corsHeaders });
    }

    // Obtener email del usuario (via FK a auth.users)
    const { data: session, error } = await supabase
      .from("review_sessions")
      .select("user_id, rejection_reason, status, auth_user:auth.users(email)")
      .eq("id", review_session_id)
      .single();

    if (error || !session?.auth_user?.email) {
      return new Response("User not found", { status: 404, headers: corsHeaders });
    }

    const email = session.auth_user.email as string;

    // Actualizar estado a rejected
    const { error: updateError } = await supabase
      .from("review_sessions")
      .update({ status: "rejected", rejection_reason })
      .eq("id", review_session_id);

    if (updateError) {
      return new Response("Failed to update session", { status: 500, headers: corsHeaders });
    }

    // Enviar email usando Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_SENDER"),
        to: email,
        subject: "Tu review ha sido rechazada",
        html: `
        <p>Hola,</p>
        <p>Tu review ha sido rechazada por el siguiente motivo:</p>
        <blockquote>${rejection_reason}</blockquote>
        <p>Puedes editarla y volver a enviarla desde la plataforma.</p>
      `,
      }),
    });

    if (!response.ok) {
      return new Response("Error al enviar email", { status: 500, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    return new Response(`Bad Request: ${e instanceof Error ? e.message : String(e)}`, { status: 400, headers: corsHeaders });
  }
});
