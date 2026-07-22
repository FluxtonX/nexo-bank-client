import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing server environment configuration");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { merchantTradeNo } = await req.json();

    if (!merchantTradeNo) {
      return new Response(JSON.stringify({ error: "merchantTradeNo is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query payment_orders table
    // Since RLS is enabled and "Users can read own payment orders" is active,
    // querying using the user's anon key and authenticated client is fully secure and verifies ownership.
    const { data: order, error: queryError } = await supabaseClient
      .from("payment_orders")
      .select("status, amount, currency, merchant_trade_no, expire_time")
      .eq("merchant_trade_no", merchantTradeNo)
      .single();

    if (queryError || !order) {
      return new Response(JSON.stringify({ error: "Order not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the order is expired locally if it's pending but past expireTime
    let finalStatus = order.status;
    if (order.status === "PENDING" && order.expire_time && Date.now() > Number(order.expire_time)) {
      finalStatus = "EXPIRED";
      // Update status to EXPIRED in database using admin role
      const supabaseAdmin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
      await supabaseAdmin
        .from("payment_orders")
        .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
        .eq("merchant_trade_no", merchantTradeNo);
    }

    return new Response(JSON.stringify({
      status: finalStatus,
      amount: order.amount,
      currency: order.currency,
      merchantTradeNo: order.merchant_trade_no,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error fetching payment status:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
