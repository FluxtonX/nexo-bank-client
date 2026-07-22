"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, QrCode, TriangleAlert, ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import { CoinLogo } from "@/components/market/CoinLogo";
import { useClientWallets } from "@/hooks/useClientQueries";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client";

export default function WalletsPage() {
  const { data: wallets = [], isLoading: loading } = useClientWallets();
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);

  // Wallets content from CMS
  const [cadTitle, setCadTitle] = useState("Withdrawal Only");
  const [cadBody, setCadBody] = useState("This wallet is only suitable for withdrawals. CAD deposits are not accepted on this platform due to Canadian regulations.");
  const [instructions, setInstructions] = useState<string[]>([
    "Only send {asset name} to this address",
    "Minimum deposit: 0.0005 BTC / 0.01 ETH / 5.0 USDT",
    "Requires 3 network confirmations",
    "Submit transaction hash on deposit request page after sending",
  ]);
  const [confirmations, setConfirmations] = useState("3");

  const supabase = createClient();

  // Auto-select the first wallet once data loads
  useEffect(() => {
    if (wallets.length > 0 && !wallets.find(w => w.id === selectedWalletId)) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets]);

  // Reset network selection when wallet changes
  useEffect(() => {
    setSelectedNetworkIndex(0);
    setShowQr(false);
  }, [selectedWalletId]);

  // Fetch wallets content from site_content
  useEffect(() => {
    async function loadWalletsContent() {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("key, value")
          .eq("category", "wallets");
        
        if (!error && data) {
          data.forEach((row) => {
            switch (row.key) {
              case "wallets.cad_title":
                setCadTitle(row.value);
                break;
              case "wallets.cad_body":
                setCadBody(row.value);
                break;
              case "wallets.instructions":
                if (Array.isArray(row.value)) {
                  setInstructions(row.value);
                }
                break;
              case "wallets.confirmations":
                setConfirmations(row.value);
                break;
              default:
                break;
            }
          });
        }
      } catch (err) {
        console.error("Error loading wallets content:", err);
      }
    }
    loadWalletsContent();
  }, [supabase]);

  const selectedWallet = wallets.find(w => w.id === selectedWalletId);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">My Wallets</h1>
        <p className="mt-1 text-sm text-[#6B7280]">Manage your cryptocurrency wallets and addresses</p>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-[148px]">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200" />
                  <div className="w-16 h-6 rounded-full animate-pulse bg-gray-200" />
                </div>
                <div>
                  <div className="w-24 h-5 rounded animate-pulse bg-gray-200 mb-2" />
                  <div className="w-32 h-7 rounded animate-pulse bg-gray-200 mb-1" />
                  <div className="w-20 h-4 rounded animate-pulse bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-[400px] animate-pulse">
              <div className="w-48 h-6 bg-gray-200 rounded mb-6" />
              <div className="w-full h-12 bg-gray-200 rounded-xl mb-6" />
              <div className="w-full h-32 bg-gray-200 rounded-xl mb-6" />
              <div className="w-full h-12 bg-gray-200 rounded-xl" />
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-[400px] animate-pulse">
              <div className="w-48 h-6 bg-gray-200 rounded mb-6" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-10 bg-gray-200 rounded" />)}
              </div>
            </div>
          </div>
        </>
      ) : wallets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {wallets.map(wallet => {
              const isSelected = wallet.id === selectedWalletId;
              return (
                <div
                  key={wallet.id}
                  onClick={() => setSelectedWalletId(wallet.id)}
                  className={`cursor-pointer bg-white rounded-2xl p-6 transition-all ${isSelected
                      ? "border-[2px] border-primary-blue shadow-sm"
                      : "border border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    {wallet.symbol === "CAD" ? (
                      <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                        <span className="text-[#16A34A] font-bold text-lg">$</span>
                      </div>
                    ) : (
                      <CoinLogo src={wallet.image} symbol={wallet.symbol} className="h-10 w-10 p-1.5" />
                    )}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${wallet.changeType === "positive"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : wallet.change === "Fiat"
                          ? "bg-[#E0E7FF] text-primary-blue"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                      {wallet.change}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{wallet.name}</h3>
                    <div className="text-[26px] font-bold text-gray-900 mt-0.5">{wallet.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{Number(wallet.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })} {wallet.symbol}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {selectedWallet?.symbol === "CAD" ? (
                // CAD-specific view
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">CAD Wallet</h2>
                    <div className="px-3 py-1 bg-[#E0E7FF] text-primary-blue rounded-full text-xs font-medium">
                      Fiat
                    </div>
                  </div>

                  <div className="bg-[#E0E7FF] rounded-xl p-6 border border-blue-100/50 mb-6">
                    <div className="flex items-center gap-2 text-primary-blue font-semibold text-sm mb-3">
                      <TriangleAlert className="w-4 h-4" />
                      {cadTitle}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {cadBody}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/withdraw"
                      className="w-full bg-primary-blue hover:bg-blue-800 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-center"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                      Withdraw CAD
                    </Link>
                  </div>
                </>
              ) : (
                // Crypto wallet view
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Wallet Address</h2>
                    <div className="px-3 py-1 bg-[#FFF9EE] text-[#E8A020] rounded-full text-xs font-medium">
                      {selectedWallet?.network}
                    </div>
                  </div>

                  <div>
                    {/* Network tab switcher — shown when wallet has multiple networks (e.g. USDT TRC20/ERC20) */}
                    {selectedWallet?.addresses && selectedWallet.addresses.length > 1 && (
                      <div className="flex gap-2 mb-4">
                        {selectedWallet?.addresses.map((net, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedNetworkIndex(idx); setShowQr(false); setCopied(false); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${selectedNetworkIndex === idx
                                ? "bg-primary-blue text-white border-primary-blue"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            {net.network}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-sm font-semibold text-gray-900 mb-2">Your Platform {selectedWallet?.name} Deposit Address</p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        readOnly
                        value={selectedWallet?.addresses[selectedNetworkIndex]?.address || selectedWallet?.address || ""}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopy(selectedWallet?.addresses[selectedNetworkIndex]?.address || selectedWallet?.address || "")}
                        className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                        title="Copy Address"
                      >
                        {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setShowQr(!showQr)}
                        className={`p-3 border rounded-xl transition-colors ${showQr ? "bg-blue-50 border-primary-blue text-primary-blue" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                        title="Show QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {showQr && (
                    <div className="mt-5 flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <QRCodeSVG value={selectedWallet?.addresses[selectedNetworkIndex]?.address || selectedWallet?.address || ""} size={160} />
                      <p className="mt-3 text-xs text-gray-500 font-mono font-bold">{selectedWallet?.addresses[selectedNetworkIndex]?.address || selectedWallet?.address || ""}</p>
                    </div>
                  )}

                  <div className="mt-6 bg-[#FFF9EE] rounded-xl p-5 border border-orange-100/50">
                    <div className="flex items-center gap-2 text-[#E8A020] font-semibold text-sm">
                      <TriangleAlert className="w-4 h-4" />
                      Important Instructions
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-gray-500 list-disc pl-5">
                      {instructions.map((instruction, idx) => (
                        <li key={idx}>
                          {instruction
                            .replace("{asset name}", selectedWallet?.name || "")
                            .replace("{symbol}", selectedWallet?.symbol || "")
                            .replace("3 network confirmations", `${confirmations} network confirmations`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Link
                      href={`/deposit?asset=${selectedWallet?.symbol}`}
                      className="flex-1 bg-primary-blue hover:bg-blue-800 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-center"
                    >
                      <ArrowDownLeft className="w-5 h-5" />
                      Deposit {selectedWallet?.symbol}
                    </Link>
                    <Link
                      href="/withdraw"
                      className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors text-center"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                      Withdraw {selectedWallet?.symbol}
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Network Information</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Network</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedWallet?.network}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cryptocurrency</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedWallet?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Symbol</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedWallet?.symbol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                  <p className="text-sm font-semibold text-gray-900">{Number(selectedWallet?.balance).toLocaleString(undefined, { maximumFractionDigits: 8 })} {selectedWallet?.symbol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">CAD Value</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedWallet?.value}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent {selectedWallet?.name} Activity</h2>
            <div className="space-y-6">
              {selectedWallet?.activities.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  No recent transactions found for {selectedWallet?.symbol}.
                </div>
              ) : (
                selectedWallet?.activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === "Deposit" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#E0E7FF] text-primary-blue"
                        }`}>
                        {activity.type === "Deposit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${activity.amountType === "positive" ? "text-[#16A34A]" : "text-gray-900"
                        }`}>
                        {activity.amount}
                      </p>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${activity.status === "Confirmed" || activity.status === "COMPLETED" || activity.status === "PAID"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : activity.status === "Pending Approval"
                              ? "bg-[#FFF9EE] text-[#E8A020]"
                              : "bg-red-50 text-red-650"
                          }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Copy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Wallets Found</h3>
          <p className="text-sm text-gray-500">You don't have any wallets yet. Make a deposit to get started.</p>
        </div>
      )}
    </div>
  );
}
