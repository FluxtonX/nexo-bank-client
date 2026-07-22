import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryBinanceOrder } from "@/lib/binancePay";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tradeNo = searchParams.get("tradeNo");

    if (!tradeNo) {
      return NextResponse.json({ error: "tradeNo parameter is required" }, { status: 400 });
    }

    // Query Binance Pay order status
    const binanceRes = await queryBinanceOrder({ merchantTradeNo: tradeNo });

    if (binanceRes.status !== "SUCCESS" || !binanceRes.data) {
      console.error("Binance Pay query failed:", binanceRes);
      return NextResponse.json(
        { error: binanceRes.errorMessage || "Failed to query order status from Binance" },
        { status: 400 }
      );
    }

    const payStatus = binanceRes.data.status; // INITIAL | PENDING | PAID | CANCELED | ERROR | REFUNDING | REFUNDED

    // If order is paid, update deposit request status in database
    if (payStatus === "PAID") {
      const supabaseAdmin = createAdminClient();
      
      // Get current status of the request
      const { data: requestData, error: fetchError } = await supabaseAdmin
        .from("deposit_requests")
        .select("status, user_id")
        .eq("tx_hash", tradeNo)
        .single();

      if (fetchError) {
        console.error("Error fetching deposit request details:", fetchError);
      } else if (requestData && requestData.status === "pending") {
        // Double check user matches
        if (requestData.user_id === user.id) {
          const { error: updateError } = await supabaseAdmin
            .from("deposit_requests")
            .update({ status: "approved", reviewed_at: new Date().toISOString() })
            .eq("tx_hash", tradeNo);

          if (updateError) {
            console.error("Failed to update deposit request to approved:", updateError);
          } else {
            console.log(`Successfully auto-approved deposit request ${tradeNo} via verification query`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: payStatus, // Returns paid status to frontend
    });
  } catch (error: any) {
    console.error("Verify Binance Order API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
