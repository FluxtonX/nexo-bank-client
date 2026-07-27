import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Helper function removed because we query exact network codes from admin panel

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cryptoParam = searchParams.get("crypto");
    const networkParam = searchParams.get("network");

    if (!cryptoParam) {
      return NextResponse.json({ error: "crypto param is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if user has a custom address for this crypto (no network filter initially)
    const { data: userAddresses, error: userError } = await supabase
      .from("user_wallet_addresses")
      .select("address, network")
      .eq("user_id", user.id)
      .eq("crypto", cryptoParam.toUpperCase());

    // Debug log to see what network strings are stored in DB
    console.log(`[deposit-address] User addresses for ${cryptoParam.toUpperCase()}:`, userAddresses);

    if (!userError && userAddresses && userAddresses.length > 0) {
      // For single-network assets (BTC, ETH), just return the first/only address
      if (cryptoParam.toUpperCase() === "BTC" || cryptoParam.toUpperCase() === "ETH") {
        return NextResponse.json({ address: userAddresses[0].address });
      }

      // For USDT (multi-network), do fuzzy matching on network
      if (cryptoParam.toUpperCase() === "USDT" && networkParam) {
        const upperNetworkParam = networkParam.toUpperCase();
        
        // TRC20: match rows where network contains "trc" OR "tron"
        if (upperNetworkParam === "TRC20") {
          const trcMatch = userAddresses.find(addr => 
            addr.network.toUpperCase().includes("TRC") || addr.network.toUpperCase().includes("TRON")
          );
          if (trcMatch) {
            return NextResponse.json({ address: trcMatch.address });
          }
        }

        // ERC20: match rows where network contains "erc" OR "eth"
        if (upperNetworkParam === "ERC20") {
          const ercMatch = userAddresses.find(addr => 
            addr.network.toUpperCase().includes("ERC") || addr.network.toUpperCase().includes("ETH")
          );
          if (ercMatch) {
            return NextResponse.json({ address: ercMatch.address });
          }
        }

        // If no fuzzy match but we have addresses, return the first one as fallback
        return NextResponse.json({ address: userAddresses[0].address });
      }

      // Default: return first address if no specific logic matched
      return NextResponse.json({ address: userAddresses[0].address });
    }

    // Fall back to platform wallets using admin client (bypasses RLS)
    const supabaseAdmin = createAdminClient();
    
    const { data: platformData, error } = await supabaseAdmin
      .from("platform_wallets")
      .select("address, network")
      .eq("crypto", cryptoParam.toUpperCase());

    if (error) {
      throw error;
    }

    if (platformData && platformData.length > 0) {
      // For single-network assets (BTC, ETH), just return the first/only address
      if (cryptoParam.toUpperCase() === "BTC" || cryptoParam.toUpperCase() === "ETH") {
        return NextResponse.json({ address: platformData[0].address });
      }

      // For USDT (multi-network), do fuzzy matching on network
      if (cryptoParam.toUpperCase() === "USDT" && networkParam) {
        const upperNetworkParam = networkParam.toUpperCase();
        
        // TRC20: match rows where network contains "trc" OR "tron"
        if (upperNetworkParam === "TRC20") {
          const trcMatch = platformData.find(addr => 
            addr.network && (addr.network.toUpperCase().includes("TRC") || addr.network.toUpperCase().includes("TRON"))
          );
          if (trcMatch) {
            return NextResponse.json({ address: trcMatch.address });
          }
        }

        // ERC20: match rows where network contains "erc" OR "eth"
        if (upperNetworkParam === "ERC20") {
          const ercMatch = platformData.find(addr => 
            addr.network && (addr.network.toUpperCase().includes("ERC") || addr.network.toUpperCase().includes("ETH"))
          );
          if (ercMatch) {
            return NextResponse.json({ address: ercMatch.address });
          }
        }

        // Fallback to first if no match
        return NextResponse.json({ address: platformData[0].address });
      }

      return NextResponse.json({ address: platformData[0].address });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err: any) {
    console.error("Error fetching deposit address:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
