"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useDashboardMetrics, useCreateWithdrawalRequest } from "@/hooks/useClientQueries";

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

// Fetch live USD price from CoinGecko (free, no API key required)
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

function formatRemainingCryptoBalance(currency: string, balance: number): string {
  const symbol = currency.toUpperCase();
  if (symbol === "USDT" || symbol === "USDC") {
    return balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return parseFloat(balance.toFixed(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });
}

export function WithdrawWorkspace() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [cadAmount, setCadAmount] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [twoFa, setTwoFa] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ReactNode | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Withdraw content from CMS
  const [pageSubheading, setPageSubheading] = useState("Transfer to your bank via Interac e-Transfer");
  const [feeAmount, setFeeAmount] = useState("2.50");
  const [partialErrMsg, setPartialErrMsg] = useState("For partial withdrawals, please contact support.");
  const [supportLink, setSupportLink] = useState("/support");
  const [importantBox, setImportantBox] = useState("Make sure the recipient email is correct. The recipient will need the security answer to claim the funds.");
  const [otpText, setOtpText] = useState("We have sent a 6-digit code to your registered email address.");

  // Live rate state
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const rateTimerRef = useRef<NodeJS.Timeout | null>(null);

  const supabase = createClient();
  const { notify } = useToast();
  const router = useRouter();

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const wallets = metrics?.wallets || [];
  const cadRates = metrics?.cadRates || {};

  // Auto-select CAD wallet
  useEffect(() => {
    setSelectedAsset("CAD");
    /*
    if (wallets.length > 0 && !selectedAsset) {
      setSelectedAsset(wallets[0].currency);
    } else if (wallets.length > 0 && !wallets.some(w => w.currency === selectedAsset)) {
      setSelectedAsset(wallets[0].currency);
    }
    */
  }, [wallets]);

  // Fetch live CAD rate whenever selected asset changes
  const fetchRate = async (asset: string) => {
    if (!asset || asset.toUpperCase() === "CAD") {
      setLiveRate(1);
      return;
    }
    setRateLoading(true);
    setRateError(false);
    const rate = await fetchLiveCadRate(asset);
    if (rate !== null) {
      setLiveRate(rate);
      setLastUpdated(new Date());
      setRateError(false);
    } else {
      // Fallback to metrics rate
      const fallback = cadRates[asset] ?? null;
      setLiveRate(fallback);
      setRateError(true);
    }
    setRateLoading(false);
  };

  useEffect(() => {
    if (!selectedAsset) return;
    fetchRate(selectedAsset);

    // Refresh every 60 seconds
    if (rateTimerRef.current) clearInterval(rateTimerRef.current);
    rateTimerRef.current = setInterval(() => fetchRate(selectedAsset), 60_000);
    return () => {
      if (rateTimerRef.current) clearInterval(rateTimerRef.current);
    };
  }, [selectedAsset]);

  // Get user email on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });
  }, [supabase]);

  // OTP resend timer countdown
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
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
    };
  }, [otpResendTimer]);

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
              case "withdraw.partial_error_message":
                setPartialErrMsg(row.value);
                break;
              case "withdraw.support_link":
                setSupportLink(row.value);
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

  const createWithdrawal = useCreateWithdrawalRequest();

  const isCADAsset = selectedAsset.toUpperCase() === "CAD";
  const selectedWallet = wallets.find(w => w.currency === selectedAsset) || { currency: selectedAsset, balance: 0 };

  const remainingCryptoWallets = wallets.filter(
    (w) => w.currency.toUpperCase() !== "CAD" && w.balance > 0
  );
  const hasRemainingCryptoBalance = remainingCryptoWallets.length > 0;

  const getCryptoWithdrawalBlockMessage = (): ReactNode => (
    <div className="space-y-3">
      <p>You still have cryptocurrency that hasn&apos;t been sold for CAD.</p>
      <div>
        <p className="mb-1.5">The following assets must be sold before you can withdraw:</p>
        <ul className="space-y-0.5">
          {remainingCryptoWallets.map((w) => (
            <li key={w.currency}>
              {formatRemainingCryptoBalance(w.currency, w.balance)} {w.currency.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
      <p>Please sell these assets for CAD from the Buy &amp; Sell page, then try again.</p>
      <Link href="/exchange" className="inline-block font-bold underline text-[#113285] hover:text-[#0c2461]">
        Go to Buy &amp; Sell →
      </Link>
    </div>
  );

  // Effective rate: live rate > metrics rate > fallback
  const effectiveRate = liveRate ?? cadRates[selectedAsset] ?? 1;
  const availableBalanceCAD = isCADAsset ? selectedWallet.balance : selectedWallet.balance * effectiveRate;

  const numAmount = parseFloat(amount || "0");
  const cadEquivalent = isCADAsset ? numAmount : numAmount * effectiveRate;
  const FEE_CAD = parseFloat(feeAmount) || 2.5;
  const feeInCrypto = isCADAsset ? FEE_CAD : (effectiveRate > 0 ? FEE_CAD / effectiveRate : 0);

  const youReceiveDisplay = isCADAsset
    ? `$${Math.max(0, numAmount - FEE_CAD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
    : `${Math.max(0, numAmount - feeInCrypto).toFixed(8)} ${selectedAsset} ($${Math.max(0, cadEquivalent - FEE_CAD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD)`;

  // Two-way calculator handlers
  const handleCryptoChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && effectiveRate > 0) {
      setCadAmount((num * effectiveRate).toFixed(2));
    } else {
      setCadAmount("");
    }
    
    // Instant validation
    if (val === "" || num === 0) {
      setErrorMsg(null);
    } else if (num !== availableBalanceCAD) {
      setErrorMsg(
        <span>
          {partialErrMsg} <Link href={supportLink} className="underline text-[#113285] hover:text-[#0c2461]">support</Link>.
        </span>
      );
    } else {
      setErrorMsg(null);
    }
  };

  const handleCadChange = (val: string) => {
    setCadAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && effectiveRate > 0) {
      setAmount((num / effectiveRate).toFixed(8));
    } else {
      setAmount("");
    }
  };

  const handleButtonMouseEnter = () => {
    setErrorMsg(
      <span>
        {partialErrMsg} <Link href={supportLink} className="underline text-[#113285] hover:text-[#0c2461]">support</Link>.
      </span>
    );
  };

  const handleButtonMouseLeave = () => {
    const currentNum = parseFloat(amount || "0");
    if (amount !== "" && currentNum !== 0 && currentNum !== availableBalanceCAD) {
      // Keep error if the input amount is still not matching the full balance
      setErrorMsg(
        <span>
          {partialErrMsg} <Link href={supportLink} className="underline text-[#113285] hover:text-[#0c2461]">support</Link>.
        </span>
      );
    } else {
      setErrorMsg(null);
    }
  };

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    setAmount("");
    setCadAmount("");
    setErrorMsg(null);
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(1, s - 1));
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
      setOtpResendTimer(60); // Start 60 second countdown
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
      setOtpResendTimer(60); // Reset timer
      setOtpDigits(["", "", "", "", "", ""]); // Clear OTP inputs
      setTwoFa(""); // Clear OTP
      notify({
        title: "New code sent successfully!",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend 2FA code.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newDigits = [...otpDigits];
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, "");
    newDigits[index] = numValue.slice(0, 1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (numValue && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Update twoFa for verification
    const otpValue = newDigits.join("");
    setTwoFa(otpValue);
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    const pastedDigits = pastedData.split("");
    const newDigits = [...pastedDigits, ...Array(6 - pastedDigits.length).fill("")];
    setOtpDigits(newDigits);
    setTwoFa(newDigits.join(""));

    // Focus the last filled input or the first empty one
    const lastIndex = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`otp-${lastIndex}`);
    nextInput?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User session not found. Please log in again.");

      await createWithdrawal.mutateAsync({
        asset: selectedAsset,
        amount: numAmount,
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

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-[20px] w-[20px]" strokeWidth={2} />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0A0F2C]">Withdraw Funds</h1>
          <p className="text-[14px] text-[#718096]">{pageSubheading}</p>
        </div>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-6 sm:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 1 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              1
            </div>
            <div className={cn(
              "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
              step >= 2 ? "bg-[#113285]" : "bg-[#F1F5F9]"
            )} />
            {/* Step 2 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 2 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              2
            </div>
            <div className={cn(
              "mx-2 h-[3px] w-[40px] sm:w-[60px] rounded-full transition-colors",
              step >= 3 ? "bg-[#113285]" : "bg-[#F1F5F9]"
            )} />
            {/* Step 3 */}
            <div className={cn(
              "flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-bold transition-colors",
              step >= 3 ? "bg-[#113285] text-white shadow-sm" : "bg-[#F8F9FA] text-[#718096]"
            )}>
              3
            </div>
          </div>
        </div>

        {/* ── Step 1: Select Asset & Enter Amount ── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Withdraw Funds</h2>

            {/* Select Asset */}
            <div className="mb-6">
              <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Select Asset</label>
              <div className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-5 py-4 text-[16px] font-bold text-[#0A0F2C] flex justify-between items-center cursor-not-allowed">
                <span>CAD</span>
                <span className="text-[#718096]">${selectedWallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {/*
              <select
                value={selectedAsset}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[16px] font-medium text-[#0A0F2C] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
              >
                {wallets.length === 0 && (
                  <option value="USDT">USDT (No balance)</option>
                )}
                {wallets.map((w) => (
                  <option key={w.currency} value={w.currency}>
                    {w.currency} — {isCADAsset ? `$${w.balance.toFixed(2)}` : w.balance.toFixed(8)}
                  </option>
                ))}
              </select>
              */}
            </div>

            {/* Live Rate Badge */}
            {/*
            {!isCADAsset && selectedAsset && (
              <div className="mb-4 flex items-center justify-between rounded-[12px] border border-gray-100 bg-[#F8F9FA] px-4 py-3">
                <div className="flex items-center gap-2">
                  {rateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#113285]" />
                  ) : rateError ? (
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  )}
                  <span className="text-[13px] font-medium text-[#718096]">
                    {rateLoading
                      ? "Fetching live rate..."
                      : liveRate
                      ? `1 ${selectedAsset} = $${liveRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
                      : "Rate unavailable"}
                  </span>
                  {rateError && (
                    <span className="text-[11px] text-amber-500 font-medium">(estimated)</span>
                  )}
                </div>
                <button
                  onClick={() => fetchRate(selectedAsset)}
                  disabled={rateLoading}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[#113285] hover:opacity-70 disabled:opacity-40 transition-opacity"
                >
                  <RefreshCw className={cn("h-3 w-3", rateLoading && "animate-spin")} />
                  Refresh
                </button>
              </div>
            )}
            */}

            {/* Available Balance */}
            <div className="mb-5 rounded-[12px] border border-[#E8EDF5] bg-[#EEF3FF] px-4 py-3">
              {metricsLoading ? (
                <p className="text-[13px] text-[#718096]">Loading balance...</p>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#718096]">Available balance</span>
                  <span className="text-[14px] font-bold text-[#113285]">
                    {isCADAsset
                      ? `$${selectedWallet.balance.toFixed(2)} CAD`
                      : `${selectedWallet.balance.toFixed(8)} ${selectedAsset}`}
                    {!isCADAsset && liveRate && (
                      <span className="ml-1 text-[12px] font-medium text-[#718096]">
                        (≈ ${availableBalanceCAD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Amount Inputs */}
            <div className="mb-6 space-y-4">
              {/* Crypto field */}
              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">
                  {isCADAsset ? "Enter amount in CAD" : `Enter amount in ${selectedAsset}`}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={isCADAsset ? "0.00" : "0.00000000"}
                    value={amount}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    step={isCADAsset ? "0.01" : "0.00000001"}
                    min="0"
                    className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 pr-16 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#718096]">
                    {selectedAsset}
                  </span>
                </div>
              </div>

              {/* CAD calculator field (only for non-CAD assets) */}
              {/*
              {!isCADAsset && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-[14px] font-bold text-[#0A0F2C]">
                    Or enter amount in CAD
                    <span className="rounded-[6px] bg-[#EEF3FF] px-2 py-0.5 text-[11px] font-semibold text-[#113285]">
                      calculator
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={cadAmount}
                      onChange={(e) => handleCadChange(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 pr-16 text-[16px] font-medium text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#718096]">
                      CAD
                    </span>
                  </div>
                  {numAmount > 0 && liveRate && (
                    <p className="mt-1.5 text-[12px] text-[#718096]">
                      {numAmount.toFixed(8)} {selectedAsset} ≈ ${cadEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD at live rate
                    </p>
                  )}
                </div>
              )}
              */}
            </div>

            {/* Quick amount buttons */}
            <div className="mb-8 flex flex-wrap gap-3 sm:flex-nowrap">
              {isCADAsset ? (
                ["100", "500", "1000"].map((preset) => (
                  <button
                    key={preset}
                    disabled
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                    className="flex-1 rounded-[12px] border border-gray-100 bg-gray-100 py-3 text-[14px] font-bold text-gray-400 cursor-not-allowed opacity-60 outline-none"
                  >
                    ${preset}
                  </button>
                ))
              ) : (
                ["25%", "50%", "75%"].map((pct) => {
                  const pctVal = parseFloat(pct) / 100;
                  const cryptoAmt = (selectedWallet.balance * pctVal).toFixed(8);
                  return (
                    <button
                      key={pct}
                      disabled
                      onMouseEnter={handleButtonMouseEnter}
                      onMouseLeave={handleButtonMouseLeave}
                      className="flex-1 rounded-[12px] border border-gray-100 bg-gray-100 py-3 text-[14px] font-bold text-gray-400 cursor-not-allowed opacity-60 outline-none"
                    >
                      {pct}
                    </button>
                  );
                })
              )}
              <button
                onClick={() => handleCryptoChange(
                  isCADAsset ? availableBalanceCAD.toString() : selectedWallet.balance.toString()
                )}
                className="flex-1 rounded-[12px] border border-gray-200 bg-white py-3 text-[14px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 focus:border-[#113285] focus:ring-1 focus:ring-[#113285] outline-none"
              >
                Max
              </button>
            </div>

            {/* Fee summary */}
            <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-5 border border-gray-100">
              <div className="mb-3 flex justify-between">
                <span className="text-[14px] font-medium text-[#718096]">Transaction Fee</span>
                <span className="text-[14px] font-bold text-[#0A0F2C]">
                  {isCADAsset ? `$${FEE_CAD.toFixed(2)} CAD` : `${feeInCrypto.toFixed(8)} ${selectedAsset} ($${FEE_CAD.toFixed(2)} CAD)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[16px] font-bold text-[#0A0F2C]">You will receive</span>
                <span className="text-[18px] font-bold text-[#113285]">{youReceiveDisplay}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <button
              onClick={() => {
                if (hasRemainingCryptoBalance) {
                  setErrorMsg(getCryptoWithdrawalBlockMessage());
                  return;
                }
                if (numAmount <= 0) {
                  setErrorMsg("Please enter a valid amount.");
                  return;
                }
                if (numAmount !== availableBalanceCAD) {
                  setErrorMsg(
                    <span>
                      {partialErrMsg} <Link href={supportLink} className="underline text-[#113285] hover:text-[#0c2461]">support</Link>.
                    </span>
                  );
                  return;
                }
                /*
                if (numAmount > selectedWallet.balance) {
                  setErrorMsg(`Amount exceeds your available ${selectedAsset} balance.`);
                  return;
                }
                const minCrypto = isCADAsset ? 10 : (effectiveRate > 0 ? 10 / effectiveRate : 0);
                if (numAmount < minCrypto) {
                  setErrorMsg(isCADAsset ? "Minimum withdrawal amount is $10 CAD." : `Minimum withdrawal is $10 CAD equivalent (≈ ${minCrypto.toFixed(8)} ${selectedAsset}).`);
                  return;
                }
                */
                setErrorMsg(null);
                setStep(2);
              }}
              disabled={!amount || numAmount <= 0 || metricsLoading || rateLoading}
              className="w-full rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Step 2: Recipient Details ── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Recipient Details</h2>

            <div className="space-y-6 mb-8">
              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Recipient Email (Interac e-Transfer)</label>
                <input
                  type="email"
                  placeholder="recipient@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Question</label>
                <input
                  type="text"
                  placeholder="What is your favorite color?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-bold text-[#0A0F2C]">Security Answer</label>
                <input
                  type="text"
                  placeholder="Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full rounded-[14px] border border-gray-200 bg-white px-5 py-4 text-[15px] text-[#0A0F2C] placeholder-[#A0AEC0] outline-none transition-all focus:border-[#113285] focus:ring-1 focus:ring-[#113285]"
                />
              </div>
            </div>

            <div className="mb-8 rounded-[16px] bg-[#FFF9EA] p-5 border border-[#FFEDCC]">
              <div className="mb-2 flex items-center gap-2 text-[15px] font-bold text-[#F5A524]">
                <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Important
              </div>
              <p className="text-[14px] text-[#4A5568] leading-relaxed">
                {importantBox}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                disabled={sendingOtp}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleNextStep2}
                disabled={!email || !question || !answer || sendingOtp}
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* ── Step 3: Confirm & Verify ── */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="mb-8 text-center text-[18px] font-bold text-[#0A0F2C]">Confirm &amp; Verify</h2>

            <div className="mb-8 rounded-[16px] bg-[#F8F9FA] p-6 border border-gray-100">
              <h3 className="mb-5 text-[15px] font-bold text-[#0A0F2C]">Transaction Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Amount</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">
                    {isCADAsset
                      ? `$${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`
                      : `${numAmount.toFixed(8)} ${selectedAsset} (≈ $${cadEquivalent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Fee</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">
                    {isCADAsset ? `$${FEE_CAD.toFixed(2)} CAD` : `${feeInCrypto.toFixed(8)} ${selectedAsset} ($${FEE_CAD.toFixed(2)} CAD)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] font-medium text-[#718096]">Recipient</span>
                  <span className="text-[14px] font-bold text-[#0A0F2C]">{email}</span>
                </div>
              </div>

              <div className="h-px w-full bg-gray-200 mb-5" />

              <div className="flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#0A0F2C]">You will receive</span>
                <span className="text-[18px] font-bold text-[#113285]">{youReceiveDisplay}</span>
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
                    className="w-12 h-14 rounded-[12px] border border-gray-200 bg-white text-center text-[20px] font-bold text-[#0A0F2C] outline-none transition-all focus:border-[#113285] focus:ring-2 focus:ring-[#113285]/20"
                  />
                ))}
              </div>
              <div className="text-center">
                {otpResendTimer > 0 ? (
                  <span className="text-sm text-[#718096]">
                    Resend code in {otpResendTimer}s
                  </span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={sendingOtp}
                    className="text-sm font-bold text-[#113285] hover:text-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingOtp ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                disabled={submitting}
                className="flex-1 rounded-[14px] border border-gray-200 bg-white py-4 text-[15px] font-bold text-[#0A0F2C] transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                className="flex-1 rounded-[14px] bg-[#113285] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#0c2461] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      </div>
    </div>
  );
}
