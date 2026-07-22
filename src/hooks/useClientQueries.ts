"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchLiveCADRates, calculateCADBalance } from "@/lib/utils";
import { getCoinBySymbol } from "@/config/coins";
import { clientQueryKeys } from "@/lib/query-keys";

async function getAuthenticatedUserId() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

async function fetchMarketPrices() {
  let btcPrice = 60000;
  let ethPrice = 3000;
  try {
    const [btcRes, ethRes] = await Promise.all([
      fetch("/api/market/ticker?symbol=BTCUSDT"),
      fetch("/api/market/ticker?symbol=ETHUSDT"),
    ]);
    if (btcRes.ok) {
      const btcData = await btcRes.json();
      btcPrice = Number(btcData.lastPrice) || 60000;
    }
    if (ethRes.ok) {
      const ethData = await ethRes.json();
      ethPrice = Number(ethData.lastPrice) || 3000;
    }
  } catch (err) {
    console.error("Failed to fetch live prices:", err);
  }
  return { BTC: btcPrice, ETH: ethPrice, USDT: 1 };
}

export type DashboardMetrics = {
  prices: Record<string, number>;
  cadRates: Record<string, number>;
  wallets: Array<{ currency: string; balance: number }>;
  portfolioValue: number;
  cadBalance: number;
  thisMonthDeposits: number;
  percentChange: number;
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: clientQueryKeys.dashboard(),
    queryFn: async (): Promise<DashboardMetrics> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const walletsPromise = supabase.from("user_wallets").select("*").eq("user_id", user.id);
      const ledgerPromise = supabase
        .from("wallet_ledger")
        .select("amount, currency, created_at")
        .eq("user_id", user.id)
        .eq("type", "DEPOSIT")
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString());

      const [{ data: userWallets, error: walletsErr }, { data: ledger }] = await Promise.all([
        walletsPromise,
        ledgerPromise,
      ]);

      // Extract unique currencies for dynamic rate fetching
      const uniqueCurrencies = new Set<string>();
      (userWallets || []).forEach((w: any) => {
        if (w.currency) uniqueCurrencies.add(w.currency.toUpperCase());
      });
      const currencySymbols = Array.from(uniqueCurrencies);
      const liveCadRates = await fetchLiveCADRates(currencySymbols.length > 0 ? currencySymbols : ["BTC", "ETH", "USDT"]);

      const pricePromise = fetchMarketPrices();
      const prices = await pricePromise;

      let portfolioValue = 0;
      let cadBalance = 0;
      const wallets: Array<{ currency: string; balance: number }> = [];

      if (!walletsErr && userWallets) {
        userWallets.forEach((w: any) => {
          const balance = Number(w.balance || 0);
          // Include CAD wallet even if balance is 0 (for withdrawal functionality)
          if (balance > 0 || w.currency.toUpperCase() === 'CAD') {
            wallets.push({ currency: w.currency, balance });
            // If it's CAD, add directly to portfolio value (no conversion needed)
            if (w.currency.toUpperCase() === 'CAD') {
              portfolioValue += balance;
              cadBalance += balance;
            }
          }
        });
        
        // Calculate portfolio value for non-CAD currencies only
        const nonCadWallets = userWallets.filter((w: any) => w.currency.toUpperCase() !== 'CAD');
        portfolioValue += calculateCADBalance(nonCadWallets, liveCadRates);
      }

      let thisMonthDeposits = 0;
      let percentChange = 0;

      if (ledger) {
        const rates = { ...prices, CAD: 1, USDC: 1 };
        let thisMonth = 0;
        let lastMonth = 0;
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        ledger.forEach((item: { amount: number; currency?: string; created_at: string }) => {
          const date = new Date(item.created_at).getTime();
          const rate = (rates as Record<string, number>)[item.currency?.toUpperCase() || ""] || 1;
          const value = Number(item.amount) * rate;
          if (date >= firstDayThisMonth) {
            thisMonth += value;
          } else {
            lastMonth += value;
          }
        });

        thisMonthDeposits = thisMonth;
        percentChange = lastMonth === 0 ? (thisMonth > 0 ? 100 : 0) : ((thisMonth - lastMonth) / lastMonth) * 100;
      }

      return {
        prices,
        cadRates: liveCadRates,
        wallets,
        portfolioValue,
        cadBalance,
        thisMonthDeposits,
        percentChange,
      };
    },
    staleTime: 0,
  });
}

export type ClientTransaction = {
  id: string;
  type: string;
  asset: string;
  amount: number;
  status: string;
  date: Date;
  ref?: string;
  rejectionReason?: string;
  adminNote?: string;
};

export function useWithdrawalRequests() {
  return useQuery({
    queryKey: clientQueryKeys.withdrawalRequests(),
    queryFn: async () => {
      const { supabase, user } = await getAuthenticatedUserId();
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("id, amount, status, created_at, interac_email, asset, network, wallet_address, method")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
  });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: [...clientQueryKeys.transactions(), "recent"],
    queryFn: async (): Promise<ClientTransaction[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [depositsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("deposit_requests")
          .select("id, asset, expected_amount, status, created_at, tx_hash, admin_note")
          .eq("user_id", user.id),
        supabase
          .from("withdrawal_requests")
          .select("id, amount, status, created_at, interac_email, asset, network, wallet_address, rejection_reason, admin_note")
          .eq("user_id", user.id),
      ]);

      const depErr = depositsRes.error;
      const wdrErr = withdrawalsRes.error;
      const dbError = (depErr && depErr.code === "PGRST205") || (wdrErr && wdrErr.code === "PGRST205");

      if (dbError) {
        return [
          { id: "1", type: "Deposit", asset: "BTC", amount: 5000, status: "approved", date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { id: "2", type: "Withdrawal", asset: "ETH", amount: 1250, status: "completed", date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
          { id: "3", type: "Deposit", asset: "USDT", amount: 3000, status: "approved", date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { id: "4", type: "Withdrawal", asset: "BTC", amount: 500, status: "completed", date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        ];
      }

      const list: ClientTransaction[] = [];
      (depositsRes.data || []).forEach((d) => {
        list.push({
          id: d.id,
          type: "Deposit",
          asset: d.asset,
          amount: d.expected_amount,
          status: d.status,
          date: new Date(d.created_at),
          ref: d.tx_hash,
          rejectionReason: d.admin_note, // deposit_requests only has admin_note
          adminNote: d.admin_note,
        });
      });
      (withdrawalsRes.data || []).forEach((w) => {
        list.push({
          id: w.id,
          type: "Withdrawal",
          asset: w.asset || "CAD",
          amount: w.amount,
          status: w.status,
          date: new Date(w.created_at),
          ref: w.wallet_address || w.interac_email,
          rejectionReason: w.rejection_reason,
          adminNote: w.admin_note,
        });
      });

      list.sort((a, b) => b.date.getTime() - a.date.getTime());
      return list.slice(0, 4);
    },
    staleTime: 0,
  });
}

export type TransactionRow = {
  id: string;
  type: string;
  asset: string;
  amount: string;
  fiat: string;
  status: string;
  date: string;
  description?: string;
  rawDate: Date;
  rawAmount: number;
  txHash?: string;
  rejectionReason?: string;
  adminNote?: string;
};

export function useClientTransactions() {
  return useQuery({
    queryKey: clientQueryKeys.transactions(),
    queryFn: async (): Promise<TransactionRow[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [depositsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("deposit_requests")
          .select("id, created_at, expected_amount, asset, status, tx_hash, admin_note")
          .eq("user_id", user.id),
        supabase
          .from("withdrawal_requests")
          .select("id, created_at, amount, method, status, wallet_address, interac_email, rejection_reason, admin_note, asset")
          .eq("user_id", user.id),
      ]);

      if (depositsRes.error) {
        console.error("Failed to fetch deposit_requests:", depositsRes.error);
      }
      if (withdrawalsRes.error) {
        console.error("Failed to fetch withdrawal_requests:", withdrawalsRes.error);
      }

      const allAssets = Array.from(new Set([
        ...(depositsRes.data || []).map((d) => (d.asset || "USDT").toUpperCase()),
        ...(withdrawalsRes.data || []).map((w) => (w.asset || "USDT").toUpperCase()),
      ]));
      const cadRates = await fetchLiveCADRates(allAssets.length > 0 ? allAssets : ["BTC", "ETH", "USDT"]);

      const getCadValue = (asset: string, amount: number): string => {
        const sym = (asset || "USDT").toUpperCase();
        if (sym === "CAD") return `$${amount.toFixed(2)} CAD`;
        const rate = cadRates[sym] || cadRates["USDT"] || 1.36;
        const cadVal = amount * rate;
        return `$${cadVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`;
      };

      const deposits: TransactionRow[] = (depositsRes.data || []).map((d) => ({
        id: d.id,
        type: "deposit",
        asset: d.asset || "USD",
        amount: String(d.expected_amount),
        rawAmount: Number(d.expected_amount),
        fiat: getCadValue(d.asset || "USDT", Number(d.expected_amount)),
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString(),
        description: `TXN-${d.id.substring(0, 8).toUpperCase()}`,
        rawDate: new Date(d.created_at),
        txHash: d.tx_hash || undefined,
        rejectionReason: d.admin_note, // deposit_requests only has admin_note
        adminNote: d.admin_note,
      }));

      const withdrawals: TransactionRow[] = (withdrawalsRes.data || []).map((w) => ({
        id: w.id,
        type: "withdrawal",
        asset: w.asset || (w.method === "interac" ? "CAD" : "USD"),
        amount: String(w.amount),
        rawAmount: Number(w.amount),
        fiat: getCadValue(w.asset || (w.method === "interac" ? "CAD" : "USDT"), Number(w.amount)),
        status: w.status,
        date: new Date(w.created_at).toLocaleDateString(),
        description: `TXN-${w.id.substring(0, 8).toUpperCase()}`,
        rawDate: new Date(w.created_at),
        txHash: w.wallet_address || w.interac_email || undefined,
        rejectionReason: w.rejection_reason,
        adminNote: w.admin_note,
      }));

      return [...deposits, ...withdrawals].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    },
    staleTime: 0,
  });
}

export type WalletNetworkAddress = {
  network: string;
  address: string;
};

export type MappedWallet = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  rawBalance: number;
  rawFiatValue: number;
  value: string;
  change: string;
  changeType: string;
  network: string;
  address: string;
  addresses: WalletNetworkAddress[];
  image?: string;
  activities: Array<{
    id: string;
    type: string;
    time: string;
    amount: string;
    amountType: string;
    status: string;
    currency: string;
    createdAt: Date;
  }>;
};

export function useClientWallets() {
  return useQuery({
    queryKey: clientQueryKeys.wallets(),
    queryFn: async (): Promise<MappedWallet[]> => {
      const { supabase, user } = await getAuthenticatedUserId();

      const [
        userWalletsRes,
        platformWalletsRes,
        userWalletAddressesRes,
        ledgerRes,
        depositsRes,
        withdrawalsRes,
      ] = await Promise.all([
        supabase.from("user_wallets").select("*").eq("user_id", user.id),
        supabase.from("platform_wallets").select("crypto, network, address"),
        supabase.from("user_wallet_addresses").select("crypto, network, address").eq("user_id", user.id),
        supabase.from("wallet_ledger").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("deposit_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
        supabase.from("withdrawal_requests").select("*").eq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
      ]);

      if (userWalletsRes.error) throw userWalletsRes.error;
      if (platformWalletsRes.error) throw platformWalletsRes.error;
      if (userWalletAddressesRes.error) throw userWalletAddressesRes.error;
      if (ledgerRes.error) throw ledgerRes.error;
      if (depositsRes.error) throw depositsRes.error;
      if (withdrawalsRes.error) throw withdrawalsRes.error;

      const userWallets = userWalletsRes.data;
      const platformWallets = platformWalletsRes.data;
      const userWalletAddresses = userWalletAddressesRes.data;
      const ledger = ledgerRes.data;
      const deposits = depositsRes.data;
      const withdrawals = withdrawalsRes.data;

      // Extract unique currencies for dynamic rate fetching
      const uniqueCurrencies = new Set<string>();
      (userWallets || []).forEach((w: any) => {
        if (w.currency) uniqueCurrencies.add(w.currency.toUpperCase());
      });
      const currencySymbols = Array.from(uniqueCurrencies);
      const cadRates = await fetchLiveCADRates(currencySymbols.length > 0 ? currencySymbols : ["BTC", "ETH", "USDT"]);

      // Hardcoded fallback addresses (used when platform_wallets table has no entry)
      const FALLBACK_ADDRESSES: Record<string, WalletNetworkAddress[]> = {
        BTC: [{ network: "Bitcoin Network", address: "bc1q7q50t9edden65k94vjzqef0lx3vfjjv4klz5zy" }],
        ETH: [{ network: "Ethereum (ERC20)", address: "0x150B3BB98224598e20821De1A516A9fcC3bB65f9" }],
        USDT: [
          { network: "TRC20 (Tron)", address: "TVphkS3RjtbYV5TQAyNnc27Ae4BKFrV7QK" },
          { network: "ERC20 (Ethereum)", address: "0x150B3BB98224598e20821De1A516A9fcC3bB65f9" },
        ],
      };

      const platformAddressMap = (platformWallets || []).reduce((acc: Record<string, string>, w: { crypto: string; address: string }) => {
        acc[w.crypto] = w.address;
        return acc;
      }, {});

      // Build user-specific address map (takes precedence over platform addresses)
      const userAddressMap = (userWalletAddresses || []).reduce((acc: Record<string, { address: string; network: string }>, w: { crypto: string; network: string; address: string }) => {
        const key = `${w.crypto}_${w.network}`;
        acc[key] = { address: w.address, network: w.network };
        return acc;
      }, {});

      const allActivities = [
        ...(ledger || []).map((l: { id: string; type: string; created_at: string; amount: number; currency: string; status?: string }) => ({
          id: l.id,
          type: l.type === "DEPOSIT" ? "Deposit" : "Withdrawal",
          time: `${new Date(l.created_at).toLocaleDateString()} ${new Date(l.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `${l.type === "DEPOSIT" ? "+" : "-"}${Number(l.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${l.currency}`,
          amountType: l.type === "DEPOSIT" ? "positive" : "negative",
          status: l.status || "Confirmed",
          currency: l.currency,
          createdAt: new Date(l.created_at),
        })),
        ...(deposits || []).map((d: { id: string; created_at: string; expected_amount: number; asset: string }) => ({
          id: d.id,
          type: "Deposit",
          time: `${new Date(d.created_at).toLocaleDateString()} ${new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `+${Number(d.expected_amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${d.asset}`,
          amountType: "positive",
          status: "Pending Approval",
          currency: d.asset,
          createdAt: new Date(d.created_at),
        })),
        ...(withdrawals || []).map((w: { id: string; created_at: string; amount: number; asset?: string }) => ({
          id: w.id,
          type: "Withdrawal",
          time: `${new Date(w.created_at).toLocaleDateString()} ${new Date(w.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          amount: `-${Number(w.amount).toLocaleString(undefined, { maximumFractionDigits: 8 })} ${w.asset || "CAD"}`,
          amountType: "negative",
          status: "Pending Approval",
          currency: w.asset || "CAD",
          createdAt: new Date(w.created_at),
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Dynamically create wallet entries for each currency
      const mappedWallets: MappedWallet[] = [];
      const userWalletCurrencies = new Set((userWallets || []).map((w: any) => w.currency?.toUpperCase()));

      // Default currencies to show even with 0 balance
      const defaultCurrencies = ["BTC", "ETH", "USDT"];
      
      // Get all currencies from user wallets plus defaults
      const allCurrencies = Array.from(new Set([...defaultCurrencies, ...Array.from(userWalletCurrencies)]));
      
      // Calculate total portfolio value in CAD (excluding CAD wallet itself)
      let totalPortfolioValue = 0;
      (userWallets || []).forEach((w: any) => {
        const currency = w.currency?.toUpperCase();
        const balance = Number(w.balance || 0);
        // Skip CAD for portfolio calculation since it's already in CAD
        if (currency === 'CAD') return;
        const rate = cadRates[currency] || cadRates.USDT || 1.36;
        totalPortfolioValue += balance * rate;
      });
      
      // Add CAD balance directly if it exists
      const cadWallet = (userWallets || []).find((w: any) => w.currency?.toUpperCase() === 'CAD');
      const cadBalance = Number(cadWallet?.balance || 0);
      totalPortfolioValue += cadBalance;
      
      allCurrencies.forEach((currency) => {
        if (currency === 'CAD') return; // CAD is handled separately below

        const userWallet = (userWallets || []).find((w: any) => w.currency?.toUpperCase() === currency);
        const balance = Number(userWallet?.balance || 0);

        // Only show wallets for default currencies or if balance > 0
        if (!defaultCurrencies.includes(currency) && balance === 0) {
          return;
        }

        const rate = cadRates[currency] || cadRates.USDT || 1.36;
        const decimals = currency === "USDT" || currency === "USDC" ? 2 : 8;
        
        // Build addresses: prefer user-specific, then platform DB entries, then fallback hardcoded
        const fallbackAddresses = FALLBACK_ADDRESSES[currency] || [];
        
        // Check if user has custom addresses for this currency
        const userAddressesForCurrency = (userWalletAddresses || [])
          .filter(w => w.crypto === currency)
          .map(w => ({ network: w.network, address: w.address }));
        
        let addresses: WalletNetworkAddress[];
        if (userAddressesForCurrency.length > 0) {
          // Use user-specific addresses
          addresses = userAddressesForCurrency;
        } else {
          // Fall back to platform addresses or hardcoded fallbacks
          const dbAddress = platformAddressMap[currency];
          addresses = dbAddress
            ? [{ network: fallbackAddresses[0]?.network || `${currency} Network`, address: dbAddress }]
            : fallbackAddresses;
        }
        
        const primaryAddress = addresses[0]?.address || `${currency.toLowerCase()}...address`;
        const primaryNetwork = addresses[0]?.network || `${currency} Network`;

        // CAD balance is stored directly — use it as-is without any rate conversion.
        const displayValue = currency === "CAD" ? balance : balance * rate;
        mappedWallets.push({
          id: currency.toLowerCase(),
          name: currency,
          symbol: currency,
          balance: balance.toFixed(decimals),
          rawBalance: balance,
          rawFiatValue: displayValue,
          value: `$${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: currency === "USDT" || currency === "USDC" ? "Stable" : "Live",
          changeType: currency === "USDT" || currency === "USDC" ? "neutral" : "positive",
          network: primaryNetwork,
          address: primaryAddress,
          addresses,
          image: getCoinBySymbol(`${currency}USDT`)?.logoUrl,
          activities: allActivities.filter((act) => act.currency === currency).slice(0, 5),
        });
      });

      // Add CAD wallet with stored balance (not calculated)
      if (cadBalance > 0 || defaultCurrencies.includes("CAD")) {
        mappedWallets.push({
          id: "cad",
          name: "CAD",
          symbol: "CAD",
          balance: cadBalance.toFixed(2),
          rawBalance: cadBalance,
          rawFiatValue: cadBalance,
          value: `$${cadBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: "Fiat",
          changeType: "neutral",
          network: "Canadian Dollar",
          address: "",
          addresses: [],
          image: undefined,
          activities: allActivities.filter((act) => act.currency === "CAD").slice(0, 5),
        });
      }

      const hasNonZeroBalance = mappedWallets.some(w => w.rawFiatValue >= 0.005);

      if (hasNonZeroBalance) {
        return mappedWallets.filter(w => w.rawFiatValue >= 0.005);
      }

      return mappedWallets;
    },
  });
}

export function useWithdrawBalance() {
  return useQuery({
    queryKey: clientQueryKeys.withdrawBalance(),
    queryFn: async () => {
      const { supabase, user } = await getAuthenticatedUserId();
      const { data: wallets } = await supabase
        .from("user_wallets")
        .select("currency, balance")
        .eq("user_id", user.id);

      if (!wallets || wallets.length === 0) return 0;

      // CAD balance is stored directly — do NOT multiply by any exchange rate.
      // Only convert non-CAD crypto wallets to CAD using live rates.
      const cadWallet = wallets.find((w: any) => w.currency?.toUpperCase() === "CAD");
      const cadBalance = Number(cadWallet?.balance || 0);

      const nonCadWallets = wallets.filter((w: any) => w.currency?.toUpperCase() !== "CAD");
      const rates = await fetchLiveCADRates();
      const cryptoValueInCad = calculateCADBalance(nonCadWallets, rates);

      return cadBalance + cryptoValueInCad;
    },
  });
}

type CreateWithdrawalInput = {
  asset: string;
  amount: number;
  interacEmail: string;
  securityQuestion: string;
  securityAnswer: string;
};

export function useCreateWithdrawalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWithdrawalInput) => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User session not found. Please log in again.");
      }

      // Fetch user's name from KYC table first, then profiles
      const { data: kyc } = await supabase
        .from("kyc_submissions")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      
      let userName = kyc?.full_name;
      
      if (!userName) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        userName = profile?.full_name || user.email || "A user";
      }

      const { error: insertError } = await supabase.from("withdrawal_requests").insert({
        user_id: user.id,
        asset: input.asset,
        amount: input.amount,
        method: "interac",
        interac_email: input.interacEmail,
        security_question: input.securityQuestion,
        security_answer: input.securityAnswer,
        status: "pending",
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      await supabase.from("notifications").insert([
        {
          user_id: user.id,
          type: "Info",
          title: "Withdrawal Pending",
          message: `Your withdrawal request for $${input.amount.toLocaleString()} CAD is pending confirmation.`,
          audience: "User",
          is_read: false
        },
        {
          audience: "Admin",
          type: "Info",
          title: "New Withdrawal Request",
          message: `${userName} has submitted a new withdrawal request for $${input.amount.toLocaleString()} CAD.`,
          is_read: false,
          link: "/dashboard/withdrawals"
        }
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.withdrawalRequests() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.wallets() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.withdrawBalance() });
    },
  });
}
