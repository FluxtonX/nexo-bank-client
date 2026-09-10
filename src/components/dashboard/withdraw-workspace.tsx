"use client";

import { useState, useEffect, useRef, ReactNode, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  RefreshCw,
  Banknote,
  Coins,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useDashboardMetrics, useCreateWithdrawalRequest } from "@/hooks/useClientQueries";
import { CoinLogo } from "@/components/market/CoinLogo";
import { getCoinBySymbol } from "@/config/coins";

// CoinGecko ID mapping for crypto symbols
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  LTC: "litecoin",
  ADA: "cardano",
  DOT: "polkadot",
};

// Supported Crypto Networks for Withdrawal
const CRYPTO_NETWORKS: Record<string, Array<{ id: string; name: string; warning?: string }>> = {
  BTC: [{ id: "BTC", name: "Bitcoin Network" }],
  ETH: [{ id: "ERC20", name: "Ethereum ERC20" }],
  USDT: [
    { id: "TRC20", name: "TRON (TRC20)", warning: "Send only to a TRON TRC20 compatible address." },
    { id: "ERC20", name: "Ethereum (ERC20)", warning: "Send only to an Ethereum ERC20 compatible address." },
  ],
  USDC: [
    { id: "ERC20", name: "Ethereum (ERC20)", warning: "Send only to an Ethereum ERC20 compatible address." },
  ],
  SOL: [{ id: "SOL", name: "Solana Network" }],
};

const SUPPORTED_CRYPTO_ASSETS = ["BTC", "ETH", "USDT", "USDC", "SOL"];

// Fetch live CAD price from CoinGecko
async function fetchLiveCadRate(symbol: string): Promise<number | null> {
  const id = COINGECKO_IDS[symbol.toUpperCase()];
  if (!id) return null;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=cad`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[id]?.cad ?? null;
  } catch {
    return null;
  }
}

function formatCrypto(value: number, symbol: string): string {
  const s = symbol.toUpperCase();
  if (s === "USDT" || s === "USDC") {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return parseFloat(value.toFixed(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });
}

interface WithdrawWorkspaceProps {
  initialMethod?: string;
  initialAsset?: string;
}

export function WithdrawWorkspace({ initialMethod, initialAsset }: WithdrawWorkspaceProps) {
  // Method selection: "cash" | "crypto"
  const defaultMethod =
    initialMethod === "crypto" || (initialAsset && initialAsset.toUpperCase() !== "CAD")
      ? "crypto"
      : "cash";
  const [methodTab, setMethodTab] = useState<"cash" | "crypto">(defaultMethod);

  // Common State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<ReactNode | null>(null);
  const supabase = createClient();
  const { notify } = useToast();
  const router = useRouter();

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const wallets = metrics?.wallets || [];
  const cadRates = metrics?.cadRates || {};

  const createWithdrawal = useCreateWithdrawalRequest();

  // ----------------------------------------------------
  // CASH (INTERAC CAD) WITHDRAWAL STATE & LOGIC
  // ----------------------------------------------------
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [twoFa, setTwoFa] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  // CMS content for CAD withdraw
  const [pageSubheading, setPageSubheading] = useState("Transfer to your bank via Interac e-Transfer");
  const [feeAmount, setFeeAmount] = useState("2.50");
  const [importantBox, setImportantBox] = useState("Make sure the recipient email is correct. The recipient will need the security answer to claim the funds.");
  const [otpText, setOtpText] = useState("We have sent a 6-digit code to your registered email address.");

  const cadWallet = useMemo(
    () => wallets.find((w) => w.currency.toUpperCase() === "CAD") || { currency: "CAD", balance: 0 },
    [wallets]
  );
  const availableBalanceCAD = cadWallet.balance;
  const numAmount = parseFloat(amount || "0");
  const FEE_CAD = parseFloat(feeAmount) || 2.5;

  const youReceiveDisplay = `$${Math.max(0, numAmount - FEE_CAD).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} CAD`;

  // ----------------------------------------------------
  // CRYPTO WITHDRAWAL STATE & LOGIC
  // ----------------------------------------------------
  const [cryptoStep, setCryptoStep] = useState(1);
  const defaultCryptoAsset = useMemo(() => {
    if (initialAsset && SUPPORTED_CRYPTO_ASSETS.includes(initialAsset.toUpperCase())) {
      return initialAsset.toUpperCase();
    }
    return "BTC";
  }, [initialAsset]);

  const [selectedCryptoAsset, setSelectedCryptoAsset] = useState<string>(defaultCryptoAsset);
  const [selectedCryptoNetwork, setSelectedCryptoNetwork] = useState<string>(
    CRYPTO_NETWORKS[defaultCryptoAsset]?.[0]?.name || "Network"
  );
  const [cryptoAmount, setCryptoAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Crypto OTP state
  const [cryptoOtpDigits, setCryptoOtpDigits] = useState(["", "", "", "", "", ""]);
  const [cryptoTwoFa, setCryptoTwoFa] = useState("");
  const [cryptoSubmitting, setCryptoSubmitting] = useState(false);
  const [cryptoSendingOtp, setCryptoSendingOtp] = useState(false);
  const [cryptoOtpResendTimer, setCryptoOtpResendTimer] = useState(0);
  const cryptoOtpTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live rate for selected crypto asset
  const [cryptoLiveRate, setCryptoLiveRate] = useState<number | null>(null);
  const [cryptoRateLoading, setCryptoRateLoading] = useState(false);

  const selectedCryptoWallet = useMemo(() => {
    return (
      wallets.find((w) => w.currency.toUpperCase() === selectedCryptoAsset.toUpperCase()) || {
        currency: selectedCryptoAsset,
        balance: 0,
      }
    );
  }, [wallets, selectedCryptoAsset]);

  const fetchCryptoRate = async (sym: string) => {
    setCryptoRateLoading(true);
    const rate = await fetchLiveCadRate(sym);
    if (rate !== null) {
      setCryptoLiveRate(rate);
    } else {
      setCryptoLiveRate(cadRates[sym] ?? null);
    }
    setCryptoRateLoading(false);
  };

  useEffect(() => {
    fetchCryptoRate(selectedCryptoAsset);
  }, [selectedCryptoAsset, cadRates]);

  // Update default network when selected crypto asset changes
  const handleCryptoAssetSelect = (sym: string) => {
    setSelectedCryptoAsset(sym);
    const nets = CRYPTO_NETWORKS[sym] ?? [];
    setSelectedCryptoNetwork(nets[0]?.name || `${sym} Network`);
    setCryptoAmount("");
    setErrorMsg(null);
  };

  // Switch Method tab handler
  const handleSwitchMethod = (method: "cash" | "crypto") => {
    setMethodTab(method);
    setErrorMsg(null);
    if (method === "cash") {
      setStep(1);
    } else {
      setCryptoStep(1);
    }
  };

  // Get user email on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, [supabase]);

  // CAD OTP timer countdown
  useEffect(() => {
    if (otpResendTimer > 0) {
      otpTimerRef.current = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
        otpTimerRef.current = null;
      }
    }
    return () => {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    };
  }, [otpResendTimer]);

  // Crypto OTP timer countdown
  useEffect(() => {
    if (cryptoOtpResendTimer > 0) {
      cryptoOtpTimerRef.current = setInterval(() => {
        setCryptoOtpResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      if (cryptoOtpTimerRef.current) {
        clearInterval(cryptoOtpTimerRef.current);
        cryptoOtpTimerRef.current = null;
      }
    }
    return () => {
      if (cryptoOtpTimerRef.current) clearInterval(cryptoOtpTimerRef.current);
    };
  }, [cryptoOtpResendTimer]);

  // Fetch withdraw content from site_content
  useEffect(() => {
    async function loadWithdrawContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "withdraw");

        if (!error && data) {
          data.forEach((row) => {
            switch (row.key) {
              case "withdraw.page_subheading":
                setPageSubheading(row.value);
                break;
              case "withdraw.fee_amount":
                setFeeAmount(row.value);
                break;
              case "withdraw.important_box":
                setImportantBox(row.value);
                break;
              case "withdraw.otp_text":
                setOtpText(row.value);
                break;
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.error("Error loading withdraw content:", err);
      }
    }
    loadWithdrawContent();
  }, [supabase]);

  // CAD Handlers
  const handleCryptoChange = (val: string) => {
    setAmount(val);
    setErrorMsg(null);
  };

  const handleNextStep2 = async () => {
    setErrorMsg(null);
    setSendingOtp(true);
    try {
      if (!userEmail) throw new Error("Could not determine your registered email.");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, purpose: "withdrawal" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send 2FA code.");
      setStep(3);
      setOtpResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send 2FA code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg(null);
    setSendingOtp(true);
    try {
      if (!userEmail) throw new Error("Could not determine your registered email.");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, purpose: "withdrawal" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend 2FA code.");
      setOtpResendTimer(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTwoFa("");
      notify({ title: "New code sent successfully!" });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend 2FA code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newDigits = [...otpDigits];
    const numValue = value.replace(/[^0-9]/g, "");
    newDigits[index] = numValue.slice(0, 1);
    setOtpDigits(newDigits);
    if (numValue && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    setTwoFa(newDigits.join(""));
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    const pastedDigits = pastedData.split("");
    const newDigits = [...pastedDigits, ...Array(6 - pastedDigits.length).fill("")];
    setOtpDigits(newDigits);
    setTwoFa(newDigits.join(""));
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleConfirmWithdrawal = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (!userEmail) throw new Error("Session expired. Please log in again.");

      const verifyRes = await fetch("/api/withdraw/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: twoFa }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid 2FA code.");

      await createWithdrawal.mutateAsync({
        asset: "CAD",
        amount: numAmount,
        method: "interac",
        interacEmail: email,
        securityQuestion: question,
        securityAnswer: answer,
      });

      notify({
        title: "Withdrawal request submitted successfully!",
        description: "Awaiting admin approval.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error submitting withdrawal:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // CRYPTO HANDLERS
  // ----------------------------------------------------
  const parsedCryptoAmount = parseFloat(cryptoAmount || "0");
  const cryptoCadEquivalent =
    cryptoLiveRate && parsedCryptoAmount > 0 ? parsedCryptoAmount * cryptoLiveRate : null;

  const handleCryptoPasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDestinationAddress(text.trim());
        setErrorMsg(null);
      }
    } catch {
      // Clipboard read denied
    }
  };

  const handleCryptoNextStep2 = () => {
    setErrorMsg(null);
    if (!destinationAddress.trim()) {
      setErrorMsg("Please enter the recipient destination wallet address.");
      return;
    }
    if (parsedCryptoAmount <= 0) {
      setErrorMsg("Please enter a valid withdrawal amount.");
      return;
    }
    if (parsedCryptoAmount > selectedCryptoWallet.balance) {
      setErrorMsg(
        `Amount exceeds your available balance (${formatCrypto(selectedCryptoWallet.balance, selectedCryptoAsset)} ${selectedCryptoAsset}).`
      );
      return;
    }
    setCryptoStep(2);
  };

  const handleCryptoNextStep3 = async () => {
    setErrorMsg(null);
    setCryptoSendingOtp(true);
    try {
      if (!userEmail) throw new Error("Could not determine your registered email.");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, purpose: "withdrawal" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send 2FA code.");
      setCryptoStep(3);
      setCryptoOtpResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send 2FA code.");
    } finally {
      setCryptoSendingOtp(false);
    }
  };

  const handleCryptoResendOtp = async () => {
    setErrorMsg(null);
    setCryptoSendingOtp(true);
    try {
      if (!userEmail) throw new Error("Could not determine your registered email.");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, purpose: "withdrawal" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend 2FA code.");
      setCryptoOtpResendTimer(60);
      setCryptoOtpDigits(["", "", "", "", "", ""]);
      setCryptoTwoFa("");
      notify({ title: "New code sent successfully!" });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend 2FA code.");
    } finally {
      setCryptoSendingOtp(false);
    }
  };

  const handleCryptoOtpChange = (index: number, value: string) => {
    const newDigits = [...cryptoOtpDigits];
    const numValue = value.replace(/[^0-9]/g, "");
    newDigits[index] = numValue.slice(0, 1);
    setCryptoOtpDigits(newDigits);
    if (numValue && index < 5) {
      document.getElementById(`crypto-otp-${index + 1}`)?.focus();
    }
    setCryptoTwoFa(newDigits.join(""));
  };

  const handleCryptoOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    const pastedDigits = pastedData.split("");
    const newDigits = [...pastedDigits, ...Array(6 - pastedDigits.length).fill("")];
    setCryptoOtpDigits(newDigits);
    setCryptoTwoFa(newDigits.join(""));
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`crypto-otp-${lastIndex}`)?.focus();
  };

  const handleCryptoOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !cryptoOtpDigits[index] && index > 0) {
      document.getElementById(`crypto-otp-${index - 1}`)?.focus();
    }
  };

  const handleConfirmCryptoWithdrawal = async () => {
    setCryptoSubmitting(true);
    setErrorMsg(null);
    try {
      if (!userEmail) throw new Error("Session expired. Please log in again.");

      const verifyRes = await fetch("/api/withdraw/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: cryptoTwoFa }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid 2FA code.");

      await createWithdrawal.mutateAsync({
        asset: selectedCryptoAsset,
        amount: parsedCryptoAmount,
        method: "crypto",
        network: selectedCryptoNetwork,
        walletAddress: destinationAddress.trim(),
      });

      notify({
        title: "Crypto withdrawal requested successfully!",
        description: "Your withdrawal is pending admin processing.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error submitting crypto withdrawal:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setCryptoSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[660px]">
      {/* Top Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-[20px] w-[20px]" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">
            {methodTab === "cash" ? "Withdraw Funds" : "Withdraw Cryptocurrency"}
          </h1>
          <p className="text-[14px] text-[#718096]">
            {methodTab === "cash"
              ? pageSubheading
              : "Transfer cryptocurrency to an external wallet address"}
          </p>
        </div>
      </div>

      {/* Dual-Method Selector Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2 p-1.5 bg-gray-100/90 rounded-2xl border border-gray-200/70 shadow-inner">
        <button
          type="button"
          onClick={() => handleSwitchMethod("cash")}
          className={cn(
            "flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer",
            methodTab === "cash"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200/80"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
          )}
        >
          <Banknote className={cn("h-4 w-4", methodTab === "cash" ? "text-emerald-600" : "text-gray-400")} />
          <span>Cash Withdrawal (CAD)</span>
        </button>
        <button
          type="button"
          onClick={() => handleSwitchMethod("crypto")}
          className={cn(
            "flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer",
            methodTab === "crypto"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200/80"
              : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
          )}
        >
          <Coins className={cn("h-4 w-4", methodTab === "crypto" ? "text-amber-500" : "text-gray-400")} />
          <span>Crypto Withdrawal</span>
        </button>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* ======================================================================== */}
        {/* METHOD 1: CASH (INTERAC CAD) WITHDRAWAL                                 */}
        {/* ======================================================================== */}
        {methodTab === "cash" && (
          <>
            {/* Stepper */}
            <div className="mb-10 flex items-center justify-center">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    step >= 1 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  1
                </div>
                <div
                  className={cn(
                    "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
                    step >= 2 ? "bg-[#047857]" : "bg-[#F1F5F9]"
                  )}
                />
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    step >= 2 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  2
                </div>
                <div
                  className={cn(
                    "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
                    step >= 3 ? "bg-[#047857]" : "bg-[#F1F5F9]"
                  )}
                />
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    step >= 3 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  3
                </div>
              </div>
            </div>

            {/* Step 1: CAD Amount & Asset */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-6 text-center text-[18px] font-bold text-[#0A0F2C]">
                  Withdraw Canadian Dollars (CAD)
                </h2>

                <div className="mb-6">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Withdrawal Asset</label>
                  <div className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-5 py-4 text-[16px] font-bold text-[#0A0F2C] flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                        CAD
                      </span>
                      <span>Canadian Dollar</span>
                    </div>
                    <span className="text-[#718096]">
                      ${cadWallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                    </span>
                  </div>
                </div>

                <div className="mb-5 rounded-[12px] border border-[#E8EDF5] bg-[#EEF3FF] px-4 py-3">
                  {metricsLoading ? (
                    <p className="text-[13px] text-[#718096]">Loading balance...</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#718096]">Available balance</span>
                      <span className="text-[14px] font-bold text-[#047857]">
                        ${cadWallet.balance.toFixed(2)} CAD
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                    Enter amount in CAD
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleCryptoChange(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 pr-16 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#718096]">
                      CAD
                    </span>
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="mb-8 flex flex-wrap gap-3 sm:flex-nowrap">
                  {["100", "500", "1000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleCryptoChange(preset)}
                      className="flex-1 rounded-[12px] border border-gray-200 bg-white py-3 text-[14px] font-bold text-[#0A0F2C] hover:bg-gray-50 transition-colors outline-none cursor-pointer"
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCryptoChange(availableBalanceCAD.toString())}
                    className="flex-1 rounded-[12px] border border-gray-200 bg-white py-3 text-[14px] font-bold text-[#047857] hover:bg-gray-50 outline-none cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                {/* Fee summary */}
                <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-5 border border-gray-100">
                  <div className="mb-3 flex justify-between">
                    <span className="text-[14px] font-medium text-[#718096]">Transaction Fee</span>
                    <span className="text-[14px] font-bold text-[#0A0F2C]">${FEE_CAD.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] font-bold text-[#0A0F2C]">You will receive</span>
                    <span className="text-[18px] font-bold text-[#047857]">{youReceiveDisplay}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (numAmount <= 0) {
                      setErrorMsg("Please enter a valid amount.");
                      return;
                    }
                    if (numAmount > availableBalanceCAD) {
                      setErrorMsg("Amount exceeds your available CAD balance.");
                      return;
                    }
                    setErrorMsg(null);
                    setStep(2);
                  }}
                  disabled={!amount || numAmount <= 0 || numAmount > availableBalanceCAD || metricsLoading}
                  className="w-full rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Recipient Details */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Recipient Details</h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                      Recipient Email (Interac e-Transfer)
                    </label>
                    <input
                      type="email"
                      placeholder="recipient@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Question</label>
                    <input
                      type="text"
                      placeholder="What is your favorite color?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Answer</label>
                    <input
                      type="text"
                      placeholder="Answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                  </div>
                </div>

                <div className="mb-8 rounded-[16px] bg-[#FFF9EA] p-5 border border-[#FFEDCC]">
                  <div className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#F5A524]">
                    <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    Important
                  </div>
                  <p className="text-[14px] text-[#4A5568] leading-relaxed">{importantBox}</p>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={sendingOtp}
                    className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    disabled={!email || !question || !answer || sendingOtp}
                    className="flex-1 rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm & Verify */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Confirm &amp; Verify</h2>

                <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-6 border border-gray-100">
                  <h3 className="mb-5 text-[15px] font-bold text-[#0A0F2C]">Transaction Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[14px] font-medium text-[#718096]">Amount</span>
                      <span className="text-[14px] font-bold text-[#0A0F2C]">
                        ${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[14px] font-medium text-[#718096]">Fee</span>
                      <span className="text-[14px] font-bold text-[#0A0F2C]">${FEE_CAD.toFixed(2)} CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[14px] font-medium text-[#718096]">Recipient</span>
                      <span className="text-[14px] font-bold text-[#0A0F2C] truncate max-w-[240px]">{email}</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-200 mb-5" />
                  <div className="flex justify-between items-center">
                    <span className="text-[16px] font-bold text-[#0A0F2C]">You will receive</span>
                    <span className="text-[18px] font-bold text-[#047857]">{youReceiveDisplay}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div className="mb-8">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">2FA Verification Code</label>
                  <p className="mb-4 text-sm text-[#718096]">{otpText}</p>
                  <div className="flex gap-2 justify-center mb-4">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 rounded-[12px] border border-gray-200 bg-white text-center text-[20px] font-bold text-[#0A0F2C] outline-none transition-all focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20"
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    {otpResendTimer > 0 ? (
                      <span className="text-sm text-[#718096]">Resend code in {otpResendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={sendingOtp}
                        className="text-sm font-bold text-[#047857] hover:text-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {sendingOtp ? "Sending..." : "Resend code"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={submitting}
                    className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    disabled={twoFa.length < 6 || submitting}
                    onClick={handleConfirmWithdrawal}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Confirm Withdrawal"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================================================================== */}
        {/* METHOD 2: CRYPTOCURRENCY WITHDRAWAL                                      */}
        {/* ======================================================================== */}
        {methodTab === "crypto" && (
          <>
            {/* Stepper */}
            <div className="mb-10 flex items-center justify-center">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    cryptoStep >= 1 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  1
                </div>
                <div
                  className={cn(
                    "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
                    cryptoStep >= 2 ? "bg-[#047857]" : "bg-[#F1F5F9]"
                  )}
                />
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    cryptoStep >= 2 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  2
                </div>
                <div
                  className={cn(
                    "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
                    cryptoStep >= 3 ? "bg-[#047857]" : "bg-[#F1F5F9]"
                  )}
                />
                <div
                  className={cn(
                    "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
                    cryptoStep >= 3 ? "bg-[#047857] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
                  )}
                >
                  3
                </div>
              </div>
            </div>

            {/* Crypto Step 1: Asset, Network, Destination & Amount */}
            {cryptoStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-6 text-center text-[18px] font-bold text-[#0A0F2C]">
                  Select Asset &amp; Destination Address
                </h2>

                {/* Crypto Asset Picker */}
                <div className="mb-6">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                    Select Cryptocurrency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SUPPORTED_CRYPTO_ASSETS.map((asset) => {
                      const isSelected = selectedCryptoAsset === asset;
                      const w = wallets.find((item) => item.currency.toUpperCase() === asset);
                      const bal = w?.balance ?? 0;
                      const cfg = getCoinBySymbol(`${asset}USDT`);

                      return (
                        <button
                          key={asset}
                          type="button"
                          onClick={() => handleCryptoAssetSelect(asset)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#047857] bg-emerald-50/40 ring-2 ring-[#047857]/20 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                          )}
                        >
                          <CoinLogo
                            src={cfg?.logoUrl}
                            symbol={asset}
                            className="h-8 w-8 shrink-0 rounded-full border border-gray-100"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-[#0A0F2C] leading-tight">{asset}</div>
                            <div className="text-[11px] text-[#718096] truncate font-mono">
                              {formatCrypto(bal, asset)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Balance Box */}
                <div className="mb-6 rounded-[14px] border border-[#E8EDF5] bg-[#EEF3FF] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#718096]">
                      Available {selectedCryptoAsset} balance
                    </span>
                    <span className="text-[15px] font-bold text-[#047857]">
                      {formatCrypto(selectedCryptoWallet.balance, selectedCryptoAsset)} {selectedCryptoAsset}
                    </span>
                  </div>
                  {cryptoLiveRate && (
                    <div className="mt-1 flex items-center justify-between text-[12px] text-[#718096]">
                      <span>Live CAD Valuation</span>
                      <span className="font-semibold text-gray-700">
                        ≈ $
                        {(selectedCryptoWallet.balance * cryptoLiveRate).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        CAD
                      </span>
                    </div>
                  )}
                </div>

                {/* Network Selection */}
                {CRYPTO_NETWORKS[selectedCryptoAsset]?.length > 1 && (
                  <div className="mb-6">
                    <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                      Select Network
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {CRYPTO_NETWORKS[selectedCryptoAsset].map((net) => {
                        const isNetSelected = selectedCryptoNetwork === net.name;
                        return (
                          <button
                            key={net.id}
                            type="button"
                            onClick={() => setSelectedCryptoNetwork(net.name)}
                            className={cn(
                              "py-3 px-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer",
                              isNetSelected
                                ? "border-[#047857] bg-emerald-50 text-[#047857] ring-1 ring-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            {net.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Destination Wallet Address Input */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[14px] font-bold text-[#0A0F2C]">
                      Destination Wallet Address / Wallet ID
                    </label>
                    <button
                      type="button"
                      onClick={handleCryptoPasteAddress}
                      className="text-xs font-semibold text-[#047857] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Paste from clipboard
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Enter recipient ${selectedCryptoAsset} address`}
                      value={destinationAddress}
                      onChange={(e) => {
                        setDestinationAddress(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] font-mono text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                  </div>
                  <p className="mt-1.5 text-[12px] text-[#718096]">
                    Make sure this address is compatible with the{" "}
                    <span className="font-semibold text-gray-800">{selectedCryptoNetwork}</span>.
                  </p>
                </div>

                {/* Crypto Amount Input */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-[14px] font-bold text-[#0A0F2C]">
                      Withdrawal Amount
                    </label>
                    {cryptoCadEquivalent !== null && (
                      <span className="text-xs font-semibold text-[#718096]">
                        ≈ ${cryptoCadEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={cryptoAmount}
                      onChange={(e) => {
                        setCryptoAmount(e.target.value);
                        setErrorMsg(null);
                      }}
                      step={selectedCryptoAsset === "USDT" || selectedCryptoAsset === "USDC" ? "0.01" : "0.00000001"}
                      min="0"
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 pr-20 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#047857] focus:ring-1 focus:ring-[#047857]"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#718096]">
                      {selectedCryptoAsset}
                    </span>
                  </div>
                </div>

                {/* Quick percentage buttons */}
                <div className="mb-8 flex gap-2.5">
                  {["25%", "50%", "75%"].map((pct) => {
                    const pctVal = parseFloat(pct) / 100;
                    const val = (selectedCryptoWallet.balance * pctVal).toFixed(
                      selectedCryptoAsset === "USDT" || selectedCryptoAsset === "USDC" ? 2 : 8
                    );
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setCryptoAmount(val);
                          setErrorMsg(null);
                        }}
                        className="flex-1 rounded-[12px] border border-gray-200 bg-white py-2.5 text-[13px] font-bold text-[#0A0F2C] hover:bg-gray-50 transition-colors outline-none cursor-pointer"
                      >
                        {pct}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setCryptoAmount(
                        selectedCryptoWallet.balance.toFixed(
                          selectedCryptoAsset === "USDT" || selectedCryptoAsset === "USDC" ? 2 : 8
                        )
                      );
                      setErrorMsg(null);
                    }}
                    className="flex-1 rounded-[12px] border border-gray-200 bg-white py-2.5 text-[13px] font-bold text-[#047857] hover:bg-gray-50 outline-none cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                {/* Summary Info Card */}
                <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-5 border border-gray-100">
                  <div className="mb-3 flex justify-between">
                    <span className="text-[14px] font-medium text-[#718096]">Network Fee</span>
                    <span className="text-[14px] font-bold text-emerald-600">0.00 {selectedCryptoAsset} (0% Fee)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[16px] font-bold text-[#0A0F2C]">Recipient Receives</span>
                    <span className="text-[18px] font-bold text-[#047857]">
                      {parsedCryptoAmount > 0
                        ? `${formatCrypto(parsedCryptoAmount, selectedCryptoAsset)} ${selectedCryptoAsset}`
                        : `0.00 ${selectedCryptoAsset}`}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCryptoNextStep2}
                  disabled={
                    !cryptoAmount ||
                    parsedCryptoAmount <= 0 ||
                    parsedCryptoAmount > selectedCryptoWallet.balance ||
                    !destinationAddress.trim()
                  }
                  className="w-full rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Review Withdrawal
                </button>
              </div>
            )}

            {/* Crypto Step 2: Confirmation / Summary */}
            {cryptoStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">
                  Confirm Crypto Withdrawal
                </h2>

                <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-6 border border-gray-100 space-y-4">
                  <h3 className="text-[15px] font-bold text-[#0A0F2C] border-b border-gray-200/80 pb-3">
                    Withdrawal Summary
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-[#718096]">Cryptocurrency</span>
                    <div className="flex items-center gap-2">
                      <CoinLogo
                        src={getCoinBySymbol(`${selectedCryptoAsset}USDT`)?.logoUrl}
                        symbol={selectedCryptoAsset}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-[15px] font-bold text-[#0A0F2C]">{selectedCryptoAsset}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-[#718096]">Amount</span>
                    <div className="text-right">
                      <div className="text-[15px] font-bold text-[#0A0F2C]">
                        {formatCrypto(parsedCryptoAmount, selectedCryptoAsset)} {selectedCryptoAsset}
                      </div>
                      {cryptoCadEquivalent && (
                        <div className="text-xs text-[#718096]">
                          ≈ ${cryptoCadEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-[#718096]">Network</span>
                    <span className="text-[14px] font-bold text-[#0A0F2C]">{selectedCryptoNetwork}</span>
                  </div>

                  <div>
                    <span className="text-[14px] font-medium text-[#718096] block mb-1">
                      Destination Address
                    </span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                      <span className="font-mono text-xs sm:text-sm text-[#0A0F2C] break-all">
                        {destinationAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(destinationAddress);
                          setCopiedAddress(true);
                          setTimeout(() => setCopiedAddress(false), 2000);
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-900 cursor-pointer shrink-0"
                        title="Copy address"
                      >
                        {copiedAddress ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[14px] font-medium text-[#718096]">Network Fee</span>
                    <span className="text-[14px] font-bold text-emerald-600">0.00 {selectedCryptoAsset}</span>
                  </div>

                  <div className="h-px w-full bg-gray-200" />

                  <div className="flex justify-between items-center">
                    <span className="text-[16px] font-bold text-[#0A0F2C]">Recipient Receives</span>
                    <span className="text-[18px] font-bold text-[#047857]">
                      {formatCrypto(parsedCryptoAmount, selectedCryptoAsset)} {selectedCryptoAsset}
                    </span>
                  </div>
                </div>

                {/* Blockchain irreversible advisory */}
                <div className="mb-8 rounded-[16px] bg-[#FFF9EA] p-5 border border-[#FFEDCC]">
                  <div className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#F5A524]">
                    <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    Irreversible Blockchain Transfer
                  </div>
                  <p className="text-[14px] text-[#4A5568] leading-relaxed">
                    Please double-check that your destination address supports the{" "}
                    <span className="font-bold text-gray-900">{selectedCryptoNetwork}</span>. Once verified
                    and processed, cryptocurrency transfers cannot be refunded or reversed.
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCryptoStep(1)}
                    disabled={cryptoSendingOtp}
                    className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCryptoNextStep3}
                    disabled={cryptoSendingOtp}
                    className="flex-1 rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {cryptoSendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      "Send 2FA Code"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Crypto Step 3: 2FA Verification */}
            {cryptoStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">
                  Verify &amp; Submit Withdrawal
                </h2>

                <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-6 border border-gray-100">
                  <h3 className="mb-3 text-[15px] font-bold text-[#0A0F2C]">Transfer Details</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#718096]">Sending:</span>
                    <span className="font-bold text-[#0A0F2C]">
                      {formatCrypto(parsedCryptoAmount, selectedCryptoAsset)} {selectedCryptoAsset}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-[#718096]">To Address:</span>
                    <span className="font-mono font-bold text-[#0A0F2C] truncate max-w-[200px]">
                      {destinationAddress}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-[#718096]">Network:</span>
                    <span className="font-bold text-[#0A0F2C]">{selectedCryptoNetwork}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <div className="mb-8">
                  <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">2FA Verification Code</label>
                  <p className="mb-4 text-sm text-[#718096]">{otpText}</p>
                  <div className="flex gap-2 justify-center mb-4">
                    {cryptoOtpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`crypto-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCryptoOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleCryptoOtpKeyDown(index, e)}
                        onPaste={handleCryptoOtpPaste}
                        className="w-12 h-14 rounded-[12px] border border-gray-200 bg-white text-center text-[20px] font-bold text-[#0A0F2C] outline-none transition-all focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20"
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    {cryptoOtpResendTimer > 0 ? (
                      <span className="text-sm text-[#718096]">Resend code in {cryptoOtpResendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCryptoResendOtp}
                        disabled={cryptoSendingOtp}
                        className="text-sm font-bold text-[#047857] hover:text-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {cryptoSendingOtp ? "Sending..." : "Resend code"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCryptoStep(2)}
                    disabled={cryptoSubmitting}
                    className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-[14px] bg-[#047857] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#022c22] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    disabled={cryptoTwoFa.length < 6 || cryptoSubmitting}
                    onClick={handleConfirmCryptoWithdrawal}
                  >
                    {cryptoSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Crypto Withdrawal"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
