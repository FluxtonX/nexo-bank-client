import {
  CircleDollarSign,
  FileText,
  Globe2,
  GraduationCap,
  HelpCircle,
  Landmark,
  PiggyBank,
  WalletCards,
} from "lucide-react";
import type { AccountDetail } from "./account-detail-page";

export const accountPages: Record<string, AccountDetail> = {
  chequing: {
    eyebrow: "Chequing Accounts",
    title: "Everyday chequing built for modern money movement.",
    description:
      "Manage bills, card purchases, Interac e-Transfers, payroll deposits, and advisor-supported banking from one secure account experience.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2200",
    icon: WalletCards,
    highlights: [
      "Unlimited digital transactions on eligible chequing plans.",
      "Direct deposit, bill payments, debit access, and mobile cheque deposit.",
      "Secure transfers between chequing, savings, and supported crypto deposit workflows.",
    ],
    stats: [["$0", "with balance"], ["24/7", "digital access"], ["2FA", "security"]],
    sections: [
      {
        title: "Daily banking control",
        body: "Use chequing as your operating account for pay, bills, debit card spend, and transfers.",
        bullets: ["Recurring bill setup", "Instant account alerts", "Debit card controls"],
      },
      {
        title: "Digital-first service",
        body: "CDNT keeps routine banking fast while still making advisor help available when decisions get complex.",
        bullets: ["Mobile cheque deposit", "Secure document upload", "Advisor appointment support"],
      },
      {
        title: "Connected money movement",
        body: "Move money cleanly across savings goals, deposits, withdrawals, and portfolio funding workflows.",
        bullets: ["Internal transfers", "Interac withdrawal support", "Clear transaction history"],
      },
      {
        title: "Protection by default",
        body: "Account access is supported by multi-factor authentication, device monitoring, and risk checks.",
        bullets: ["2FA prompts", "Known-device review", "Fraud monitoring"],
      },
    ],
    fees: [["Monthly fee", "$0-$16.95 depending on plan"], ["Interac e-Transfer", "Included on eligible plans"], ["ATM access", "CDNT network included"], ["Overdraft", "Subject to approval"]],
    eligibility: ["Canadian resident or eligible applicant profile.", "Verified email, phone, and identity documents.", "KYC approval before sensitive money movement."],
    bestFor: ["Paycheques and recurring bills.", "Clients who want one primary daily account.", "Users connecting banking with portfolio activity."],
  },
  savings: {
    eyebrow: "Savings Accounts",
    title: "Savings accounts for goals, reserves, and liquidity.",
    description:
      "Separate everyday spending from emergency reserves, high-interest goals, and planned contributions with clear visibility.",
    image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=2200",
    icon: PiggyBank,
    highlights: [
      "No-fee savings options for short and medium-term goals.",
      "Automated transfers from chequing into goal-based buckets.",
      "Designed to keep cash reserves distinct from crypto market exposure.",
    ],
    stats: [["4.25%", "sample APY"], ["$0", "monthly fee"], ["Auto", "savings rules"]],
    sections: [
      {
        title: "Goal-based buckets",
        body: "Organize savings for emergency funds, education, travel, taxes, or major purchases.",
        bullets: ["Named savings goals", "Progress tracking", "Recurring transfers"],
      },
      {
        title: "Liquidity planning",
        body: "Keep cash available before taking investment or crypto risk, so market movement does not force withdrawals.",
        bullets: ["Emergency reserve planning", "Transfer scheduling", "Cash-first guidance"],
      },
      {
        title: "Interest visibility",
        body: "See earned interest, contribution history, and goal progress without digging through statements.",
        bullets: ["Monthly interest view", "Statement exports", "Projected timeline"],
      },
      {
        title: "Connected experience",
        body: "Move funds between chequing and savings when bills, deposits, or investments need liquidity.",
        bullets: ["Internal transfers", "Mobile approvals", "Advisor review support"],
      },
    ],
    fees: [["Monthly fee", "$0"], ["Minimum balance", "$0"], ["Transfers to CDNT accounts", "Included"], ["External transfer timing", "Varies by network"]],
    eligibility: ["Verified CDNT profile.", "Linked chequing account recommended.", "Subject to account review and platform limits."],
    bestFor: ["Emergency funds.", "Short-term goals.", "Clients who want cash discipline before investing."],
  },
  international: {
    eyebrow: "International Banking",
    title: "Bank across borders with clearer control.",
    description:
      "Support international transfers, travel needs, foreign payments, and global advisory conversations from one CDNT relationship.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2200",
    icon: Globe2,
    highlights: [
      "International transfer guidance with transparent status tracking.",
      "Travel-ready account support, card controls, and fraud monitoring.",
      "Advisor help for cross-border cash flow and business payments.",
    ],
    stats: [["Global", "transfers"], ["FX", "guidance"], ["24/7", "alerts"]],
    sections: [
      {
        title: "Global transfers",
        body: "Send funds internationally with clear recipient details, review states, and compliance checks.",
        bullets: ["Recipient setup", "Transfer review", "Status visibility"],
      },
      {
        title: "Travel banking",
        body: "Prepare cards, emergency access, and account alerts before leaving the country.",
        bullets: ["Card controls", "Travel notifications", "Suspicious activity alerts"],
      },
      {
        title: "Cross-border planning",
        body: "Coordinate international income, tuition, family support, or supplier payments with advisor help.",
        bullets: ["Payment planning", "Documentation support", "Cash flow review"],
      },
      {
        title: "Digital asset awareness",
        body: "Understand where crypto settlement differs from bank transfers, and where compliance review still applies.",
        bullets: ["Network risk education", "Withdrawal review", "Stablecoin liquidity context"],
      },
    ],
    fees: [["Transfer fee", "Varies by destination"], ["FX spread", "Shown before confirmation"], ["Incoming wire", "Plan-dependent"], ["Trace request", "May apply"]],
    eligibility: ["Verified identity and address.", "Recipient details required.", "Enhanced review may apply for higher-risk corridors."],
    bestFor: ["Families sending money abroad.", "Frequent travelers.", "Businesses with global payment needs."],
  },
  student: {
    eyebrow: "Student Banking",
    title: "Student banking that keeps first finances simple.",
    description:
      "Start with everyday banking, savings habits, credit education, and security basics without unnecessary complexity.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2200",
    icon: GraduationCap,
    highlights: [
      "Low-fee student account options with mobile-first tools.",
      "Budgeting, savings, and first-credit guidance built into the experience.",
      "Education around crypto volatility before students take market risk.",
    ],
    stats: [["$0", "student fee"], ["Budget", "tools"], ["Learn", "credit basics"]],
    sections: [
      {
        title: "Everyday student money",
        body: "Handle deposits, debit purchases, rent, tuition, subscriptions, and transfers with simple controls.",
        bullets: ["Spending alerts", "Bill reminders", "Mobile deposit"],
      },
      {
        title: "Build financial habits",
        body: "Use budgeting and savings tools to prepare for school terms and avoid surprise shortfalls.",
        bullets: ["Goal buckets", "Monthly snapshots", "Cash flow guidance"],
      },
      {
        title: "Credit readiness",
        body: "Learn how credit works before applying for products that affect long-term financial flexibility.",
        bullets: ["Credit basics", "Payment reminders", "Responsible card use"],
      },
      {
        title: "Crypto education",
        body: "Students can learn about BTC, ETH, and USDT without confusing volatility for guaranteed growth.",
        bullets: ["Risk disclosure", "Allocation basics", "Security hygiene"],
      },
    ],
    fees: [["Monthly fee", "$0 while eligible"], ["Debit transactions", "Included"], ["Interac e-Transfer", "Included"], ["Student proof", "May be required"]],
    eligibility: ["Eligible student status.", "Age and identity requirements apply.", "Guardian support may be required for some applicants."],
    bestFor: ["College and university students.", "First bank account users.", "Students learning budgeting and credit basics."],
  },
  help: {
    eyebrow: "Help With My Account",
    title: "Get account help without losing momentum.",
    description:
      "Find support for login issues, transactions, documents, cards, statements, deposits, withdrawals, and account security.",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=2200",
    icon: HelpCircle,
    highlights: [
      "Support paths for account access, cards, statements, and transfers.",
      "Clear escalation for deposits, withdrawals, and KYC document review.",
      "Security-first guidance when activity looks unusual.",
    ],
    stats: [["24/7", "self-service"], ["Secure", "tickets"], ["KYC", "support"]],
    sections: [
      {
        title: "Account access",
        body: "Recover login access, update profile details, and review trusted devices safely.",
        bullets: ["Password reset", "2FA help", "Device management"],
      },
      {
        title: "Transactions and cards",
        body: "Get help with card controls, pending transactions, bill payments, and transfer status.",
        bullets: ["Card lock", "Payment tracing", "Dispute guidance"],
      },
      {
        title: "Documents and statements",
        body: "Download statements, upload KYC files, and find account letters for routine financial needs.",
        bullets: ["PDF statements", "Document upload", "Profile verification"],
      },
      {
        title: "Crypto workflows",
        body: "Understand deposit confirmations, withdrawal review, network choice, and supported assets.",
        bullets: ["BTC/ETH/USDT support", "Network warnings", "Withdrawal status"],
      },
    ],
    fees: [["Support ticket", "Included"], ["Statement download", "Included"], ["Card replacement", "Plan-dependent"], ["Investigation request", "May apply"]],
    eligibility: ["Active or pending CDNT profile.", "Secure authentication may be required.", "Sensitive changes require additional verification."],
    bestFor: ["Clients who need account support.", "Users troubleshooting transfers.", "Anyone reviewing security settings."],
    cta: "Open support options",
  },
  vantage: {
    eyebrow: "NUB Vantage",
    title: "Premium banking intelligence for connected clients.",
    description:
      "NUB Vantage brings priority support, richer insights, rewards, portfolio visibility, and advanced account controls into one relationship tier.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2200",
    icon: Landmark,
    highlights: [
      "Priority service for banking, account reviews, and support tickets.",
      "Enhanced portfolio insights across cash, investments, BTC, ETH, and USDT.",
      "Premium controls for card, account, and device security.",
    ],
    stats: [["Priority", "support"], ["360", "insights"], ["Vantage", "rewards"]],
    sections: [
      {
        title: "Priority relationship",
        body: "Get faster access to support and advisor-led reviews for more complex financial decisions.",
        bullets: ["Priority tickets", "Advisor scheduling", "Annual reviews"],
      },
      {
        title: "Portfolio intelligence",
        body: "Review allocation, cash reserves, crypto concentration, and liquidity from a single dashboard.",
        bullets: ["Portfolio snapshots", "Risk guardrails", "Performance context"],
      },
      {
        title: "Premium account value",
        body: "Use bundled benefits to reduce friction across cards, transfers, statements, and account services.",
        bullets: ["Reward offers", "Fee waivers", "Partner benefits"],
      },
      {
        title: "Security layer",
        body: "Vantage clients receive deeper account monitoring and guided security checkups.",
        bullets: ["Device reviews", "Sensitive action checks", "Fraud monitoring"],
      },
    ],
    fees: [["Monthly fee", "$16.95 sample tier"], ["Advisor review", "Included"], ["Premium support", "Included"], ["Partner benefits", "Tier-dependent"]],
    eligibility: ["Approved CDNT profile.", "Eligible account relationship.", "Good standing and completed security setup."],
    bestFor: ["Clients with multiple CDNT products.", "Users who want portfolio and crypto visibility.", "Premium banking clients who value service access."],
    cta: "Join Vantage",
  },
  rates: {
    eyebrow: "Current Rates",
    title: "Current account rates and common service pricing.",
    description:
      "Review sample rates, account fees, and service charges before choosing or changing your CDNT account.",
    image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=2200",
    icon: CircleDollarSign,
    highlights: [
      "Transparent sample pricing for common account services.",
      "Savings and premium tier examples shown before application.",
      "Final pricing is confirmed during account opening and review.",
    ],
    stats: [["$0", "student/savings"], ["4.25%", "sample APY"], ["Clear", "fees"]],
    sections: [
      {
        title: "Account pricing",
        body: "Compare monthly fees, balance waivers, and account tier value before applying.",
        bullets: ["Chequing tiers", "Savings rate examples", "Vantage pricing"],
      },
      {
        title: "Transfer costs",
        body: "Understand where domestic, international, and network-related costs may apply.",
        bullets: ["Interac transfers", "International transfers", "Trace requests"],
      },
      {
        title: "Service charges",
        body: "Review common charges for card replacement, special documents, or investigation requests.",
        bullets: ["Card services", "Statements", "Account letters"],
      },
      {
        title: "Crypto notices",
        body: "Digital asset network fees and confirmation times are separate from account service pricing.",
        bullets: ["Network fees", "Withdrawal review", "Supported assets"],
      },
    ],
    fees: [["Advantage Banking", "$11.95, waivable"], ["Student Banking", "$0 while eligible"], ["Savings", "$0 monthly fee"], ["NUB Vantage", "$16.95 sample tier"]],
    eligibility: ["Rates are examples for planning.", "Final terms are shown during application.", "Promotions and fees may vary by profile."],
    bestFor: ["Comparing accounts.", "Checking service fees.", "Preparing for an advisor conversation."],
  },
  apply: {
    eyebrow: "Apply Online",
    title: "Open a CDNT account with guided onboarding.",
    description:
      "Start your application, verify identity, set up security, choose account preferences, and prepare for deposits or transfers.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2200",
    icon: FileText,
    highlights: [
      "Secure online application with email, phone, and identity verification.",
      "Choose chequing, savings, student, international, or Vantage account paths.",
      "KYC and 2FA setup before sensitive deposits and withdrawals.",
    ],
    stats: [["Minutes", "to start"], ["KYC", "required"], ["2FA", "setup"]],
    sections: [
      {
        title: "Step 1: Profile",
        body: "Create secure credentials and confirm your preferred contact information.",
        bullets: ["Email verification", "Phone confirmation", "Password setup"],
      },
      {
        title: "Step 2: Identity",
        body: "Submit information needed for KYC, account security, and compliance review.",
        bullets: ["Identity details", "Address information", "Document upload"],
      },
      {
        title: "Step 3: Choose account",
        body: "Select the account type and features that match your financial workflow.",
        bullets: ["Account comparison", "Fee review", "Feature selection"],
      },
      {
        title: "Step 4: Activate",
        body: "Set up 2FA, review disclosures, and prepare deposits or account transfers.",
        bullets: ["Security setup", "Risk disclosure", "Funding options"],
      },
    ],
    fees: [["Application fee", "$0"], ["Identity verification", "Included"], ["Account activation", "After approval"], ["Funding", "Based on method"]],
    eligibility: ["Valid identity information.", "Verifiable contact details.", "Acceptance of account terms and risk disclosures."],
    bestFor: ["New CDNT clients.", "Existing users adding accounts.", "Clients preparing for digital asset workflows."],
    cta: "Start secure application",
  },
  faq: {
    eyebrow: "Account FAQs",
    title: "Answers to common account questions.",
    description:
      "Find clear answers about account opening, fees, student eligibility, international transfers, Vantage, KYC, and supported crypto workflows.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2200",
    icon: HelpCircle,
    highlights: [
      "Plain-language answers for account selection and application steps.",
      "Guidance for KYC, login security, statements, deposits, and withdrawals.",
      "Crypto-specific reminders for BTC, ETH, USDT, network choice, and volatility.",
    ],
    stats: [["FAQ", "support"], ["KYC", "answers"], ["Crypto", "guidance"]],
    sections: [
      {
        title: "Which account should I choose?",
        body: "Choose chequing for daily use, savings for reserves, student for eligibility-based value, and Vantage for premium service.",
        bullets: ["Compare monthly fees", "Review transaction needs", "Consider advisor access"],
      },
      {
        title: "Why does KYC matter?",
        body: "KYC helps protect accounts, meet compliance needs, and support sensitive money movement.",
        bullets: ["Identity verification", "Document checks", "Withdrawal review"],
      },
      {
        title: "Can I use crypto features?",
        body: "Supported workflows currently focus on BTC, ETH, and USDT with clear network warnings and review states.",
        bullets: ["Supported assets only", "Confirm network carefully", "Read risk disclosure"],
      },
      {
        title: "How do I get help?",
        body: "Use account support for login, card, statement, transaction, deposit, withdrawal, or security issues.",
        bullets: ["Help center", "Secure tickets", "Advisor contact"],
      },
    ],
    fees: [["FAQ access", "Included"], ["Support request", "Included"], ["Special investigation", "May apply"], ["Advisor appointment", "Included for eligible clients"]],
    eligibility: ["No login required for general FAQs.", "Secure login may be required for account-specific help.", "Some support actions require identity verification."],
    bestFor: ["Quick account answers.", "Application preparation.", "Clients comparing banking and crypto workflows."],
    cta: "Contact support",
  },
};
