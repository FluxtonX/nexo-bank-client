import Link from "next/link";
import {
  ArrowDownToLine,
  BellRing,
  FileCheck2,
  FileText,
  LifeBuoy,
  Wallet,
} from "lucide-react";

const actions = [
  { href: "/kyc", label: "KYC", icon: FileCheck2 },
  { href: "/deposit", label: "Deposit", icon: ArrowDownToLine },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/statements", label: "Reports", icon: FileText },
  { href: "/price-alerts", label: "Alerts", icon: BellRing },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-banking-border bg-banking-offWhite/50 p-4 transition-all hover:bg-white hover:shadow-lg hover:shadow-banking-blue/5 hover:-translate-y-0.5 group"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white border border-banking-border text-banking-muted group-hover:text-banking-blue group-hover:border-banking-blue transition-colors shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-banking-muted group-hover:text-banking-ink">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

