import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await req.json();

  const { review_id, property_opinion, community_opinion, owner_opinion, moderation_status, rejection_reason } = body;

  // Validar entrada mínima
  if (!review_id || 
      (property_opinion !== undefined && typeof property_opinion !== "string") ||
      (community_opinion !== undefined && typeof community_opinion !== "string") ||
      (owner_opinion !== undefined && typeof owner_opinion !== "string")) {
    return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400 });
  }

  // Crear cliente Supabase con clave service_role
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verificar quién está haciendo la petición
  const authHeader = req.headers.get("Authorization");
  const jwt = authHeader?.replace("Bearer ", "");

  if (!jwt) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data: user, error: userError } = await supabase.auth.getUser(jwt);

  if (userError || !user?.user) {
    return new Response("No autorizado", { status: 401 });
  }

  // Email del administrador para control de acceso
  // Asegúrate de cambiar esto a tu email real antes de desplegar
  const ALLOWED_EMAIL = "xjesusvr@gmail.com";

  if (user.user.email !== ALLOWED_EMAIL) {
    return new Response("Acceso denegado", { status: 403 });
  }

  // Ejecutar la función RPC
  const { error } = await supabase.rpc("moderate_review", {
    p_review_id: review_id,
    p_property_opinion: property_opinion,
    p_community_opinion: community_opinion,
    p_owner_opinion: owner_opinion,
    p_moderation_status: moderation_status || "approved",
    p_rejection_reason: rejection_reason || ""
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
