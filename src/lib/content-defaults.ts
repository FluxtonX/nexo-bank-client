/**
 * content-defaults.ts
 *
 * Shared TypeScript types and hardcoded fallback values for all
 * DB-driven content on the Landing Page.
 *
 * These defaults serve two purposes:
 *  1. Instant fallback if Supabase is unreachable or a key is missing.
 *  2. The source of truth that matches exactly what was seeded into the DB.
 *
 * IMPORTANT: If you change a value here, update the seed SQL too so
 * they stay in sync for new environments.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export interface LandingFeatureItem {
  title: string;
  description: string;
}

export interface LandingOnboardingStep {
  title: string;
  description: string;
}

export interface LandingFooterLinkGroup {
  /** Column heading, e.g. "Company" */
  title: string;
  /** Comma-separated link names, e.g. "About, Careers, Press, Blog" */
  description: string;
}

export interface LandingHeroContent {
  trustBadge: string;
  /** Newline-separated headline lines — split on "\n" to render each line */
  headline: string;
  body: string;
  btn1: string;
  btn2: string;
  /** Format per item: "Value / Label" — split on " / " to separate them */
  stats: string[];
}

export interface LandingFeaturesContent {
  heading: string;
  sub: string;
  btn: string;
  list: LandingFeatureItem[];
  ctaCardTitle: string;
  ctaCardDesc: string;
  ctaCardBtn: string;
}

export interface LandingAssetsContent {
  overline: string;
  heading: string;
}

export interface LandingOnboardingContent {
  overline: string;
  heading: string;
  steps: LandingOnboardingStep[];
}

export interface LandingAppContent {
  overline: string;
  heading: string;
  body: string;
  benefits: string[];
}

export interface LandingCtaContent {
  overline: string;
  heading: string;
  body: string;
  btn1: string;
  btn2: string;
}

export interface LandingFooterContent {
  tagline: string;
  regulatory: string;
  copyright: string;
  links: LandingFooterLinkGroup[];
}

export interface LandingContent {
  hero: LandingHeroContent;
  features: LandingFeaturesContent;
  assets: LandingAssetsContent;
  onboarding: LandingOnboardingContent;
  app: LandingAppContent;
  cta: LandingCtaContent;
  footer: LandingFooterContent;
}

// ── Defaults ───────────────────────────────────────────────────────────────
// These must exactly match the values seeded in site_content_seed.sql.

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  hero: {
    trustBadge: "FINTRAC registered · CDIC-style insured deposits",
    headline: "Banking Meets\nCrypto\nIntelligence",
    body: "A regulated Canadian digital bank with a built-in crypto engine. Move money, save smarter, and invest in digital assets — all from one elegant, insured account.",
    btn1: "Open Account",
    btn2: "Explore Platform",
    stats: [
      "2M+ / Canadians onboard",
      "$2.4B / Assets secured",
      "4.9 / App Store",
    ],
  },
  features: {
    heading: "Everything a modern Canadian needs from a bank.",
    sub: "We've rebuilt banking from the ground up to support both your traditional financial needs and your digital asset investments.",
    btn: "Explore all features",
    list: [
      { title: "Crypto + Fiat Wallet",    description: "Hold CAD and digital assets side by side in one unified interface." },
      { title: "Instant e-Transfer",       description: "Send and receive Interac e-Transfers in seconds, free of charge." },
      { title: "Crypto Investing",         description: "Buy and sell 50+ cryptocurrencies with low, transparent fees." },
      { title: "Global Transfers",         description: "Send money internationally at mid-market rates with zero hidden markups." },
      { title: "Smart Savings",            description: "Earn high-yield interest on your Canadian Dollar deposits automatically." },
      { title: "AI Financial Insights",    description: "Get personalized alerts and insights to optimize your spending and saving." },
      { title: "Portfolio Tracking",       description: "Monitor your entire net worth with beautiful, real-time exotic curves." },
    ],
    ctaCardTitle: "And much more",
    ctaCardDesc: "Discover the full power of CDNT.",
    ctaCardBtn: "Get Started",
  },
  assets: {
    overline: "Digital Banking",
    heading: "Digital assets, held to a higher standard.",
  },
  onboarding: {
    overline: "Getting Started",
    heading: "From signup to first trade in minutes.",
    steps: [
      { title: "Create your account",       description: "Sign up online. ID documents and social insurance number required." },
      { title: "Verify your Identity",      description: "Government-issued ID, powered by Interac. Approved in minutes." },
      { title: "Start banking & investing", description: "Load your account, buy crypto, save smarter, and earn through the app." },
    ],
  },
  app: {
    overline: "Your Pocket Branch",
    heading: "Your entire financial life, in your pocket.",
    body: "Send money, manage cards, track investments and oversee your crypto portfolio — all from one beautifully designed interface.",
    benefits: [
      "Portfolio profiles with live data and live exotic curves",
      "Portfolio analytics with your daily and live exotic curves",
      "Instant e-Transfers, bill pay, and crypto through the app",
    ],
  },
  cta: {
    overline: "Your Financial Future",
    heading: "Your Financial Future, Unified.",
    body: "Join 2M+ Canadians saving, banking and investing — with the confidence of regulation and the speed of crypto.",
    btn1: "Open Account",
    btn2: "Talk to our Team",
  },
  footer: {
    tagline: "A modern Canadian digital bank uniting traditional finance with regulated digital assets.",
    regulatory: "Canadian National Trust Bank is a federally regulated Canadian financial institution. FINTRAC #M24-0042001.",
    copyright: "© 2026 Canadian National Trust Bank, Inc. All rights reserved.",
    links: [
      { title: "Company",  description: "About, Careers, Press, Blog" },
      { title: "Products", description: "Banking, Crypto, Savings, Cards" },
      { title: "Legal",    description: "Terms, Privacy, Cookies, Disclosures" },
      { title: "Security", description: "Trust center, Vulnerability, Status, Audits" },
    ],
  },
};

// ── About Page Types & Defaults ───────────────────────────────────────────

export interface AboutWhyFeature {
  icon: string;
  title: string;
  items: string[];
}

export interface AboutStatItem {
  value: string;
  label: string;
}

export interface AboutContent {
  hero: {
    heading: string;
    body: string;
  };
  mission: {
    title: string;
    body: string;
  };
  vision: {
    title: string;
    body: string;
  };
  why: {
    heading: string;
    subheading: string;
    features: AboutWhyFeature[];
  };
  stats: {
    items: AboutStatItem[];
  };
  cta: {
    heading: string;
    body: string;
    btn: string;
  };
}

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero: {
    heading: "About Canadian National Trust Bank",
    body: "We're building the future of banking in Canada—where traditional finance meets cryptocurrency innovation, creating a secure and accessible platform for everyone.",
  },
  mission: {
    title: "Our Mission",
    body: "To democratize access to cryptocurrency and modern financial services for all Canadians. We believe in creating a platform that combines the security of traditional banking with the innovation of blockchain technology—making it simple, safe, and transparent for everyone.",
  },
  vision: {
    title: "Our Vision",
    body: "To become Canada's most trusted digital banking and cryptocurrency platform. We envision a future where managing your finances—whether traditional currency or crypto—is as simple as sending a text message, backed by institutional-grade security and full regulatory compliance.",
  },
  why: {
    heading: "Why Choose Canadian National Trust Bank",
    subheading: "Built with trust, security, and simplicity at the core",
    features: [
      {
        icon: "Shield",
        title: "Bank-Grade Security",
        items: ["Multi-signature cold storage", "Two-factor authentication", "Real-time fraud detection", "Insurance up to $250,000"],
      },
      {
        icon: "Users",
        title: "Customer First",
        items: ["24/7 customer support", "No hidden fees", "Transparent pricing", "Educational resources"],
      },
      {
        icon: "Award",
        title: "Fully Compliant",
        items: ["FINTRAC registered MSB", "KYC/AML compliant", "Regular security audits", "Canadian regulated"],
      },
    ],
  },
  stats: {
    items: [
      { value: "100,000+", label: "Active Users" },
      { value: "$2.50B+", label: "Assets Protected" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "24/7", label: "Customer Support" },
    ],
  },
  cta: {
    heading: "Ready to Get Started?",
    body: "Join thousands of Canadians who trust Canadian National Trust Bank for their crypto banking needs",
    btn: "Open Your Account Today",
  },
};

// ── Pricing Page Types & Defaults ─────────────────────────────────────────

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export interface PricingContent {
  hero: {
    heading: string;
    body: string;
  };
  fees: {
    title: string;
    columns: string[];
    rows: string[][];
  };
  limits: {
    title: string;
    columns: string[];
    rows: string[][];
  };
  features: {
    title: string;
    subheading: string;
    list: string[];
  };
  faq: {
    title: string;
    list: PricingFaqItem[];
  };
  cta: {
    heading: string;
    body: string;
    btn: string;
  };
}

export const DEFAULT_PRICING_CONTENT: PricingContent = {
  hero: {
    heading: "Simple, Transparent Pricing",
    body: "No hidden fees. No surprises. Just straightforward pricing designed for Canadians.",
  },
  fees: {
    title: "Transaction Fees",
    columns: ["Transaction Type", "Fee", "Details"],
    rows: [
      ["Cryptocurrency Deposit", "Free", "No limit on all crypto deposits"],
      ["Cryptocurrency Withdrawal", "Network Fee Only", "Strictly external blockchain costs"],
      ["Interac e-Transfer Withdrawal", "$2.50 CAD", "Flat fee to withdraw your funds to bank"],
      ["Currency Conversion (CAD ↔ Crypto)", "Free", "Competitive spread on all trades"],
    ],
  },
  limits: {
    title: "Account Limits",
    columns: ["Verification Level", "Daily Limit", "Monthly Limit", "Requirements"],
    rows: [
      ["Basic (Unverified)", "$1,000", "$5,000", "Email verification only"],
      ["Verified KYC (Standard)", "$5M", "$50M", "ID and proof of residence required"],
      ["Premium", "Unlimited", "Unlimited", "Contact support to upgrade"],
    ],
  },
  features: {
    title: "Included With Every Account",
    subheading: "Everything you need to manage your crypto, at no extra cost.",
    list: [
      "Bank-grade security & encryption",
      "Two-factor authentication",
      "Multi-signature cold storage",
      "24/7 customer support",
      "Mobile & desktop access",
      "Real-time portfolio tracking",
      "Transaction history & exports",
      "Email & push notifications",
      "Instant Interac e-Transfer",
      "Multi-currency support (BTC, ETH, USDT)",
      "Educational resources",
      "Insurance up to $250,000",
    ],
  },
  faq: {
    title: "Pricing FAQs",
    list: [
      {
        question: "Are there any monthly or annual fees?",
        answer: "Canadian National Trust Bank does not charge any monthly, annual, or account maintenance fees. You only pay transaction fees when you move funds.",
      },
      {
        question: "What are network fees?",
        answer: "Canadian National Trust Bank does not charge any monthly, annual, or account maintenance fees. You only pay transaction fees when you move funds.",
      },
      {
        question: "Can I withdraw to my bank account for free?",
        answer: "Interac e-Transfer withdrawals cost a flat $2.50 CAD per transaction, regardless of the amount. This is one of the lowest withdrawal fees in Canada.",
      },
      {
        question: "How do I increase my account limits?",
        answer: "Complete the KYC verification process to increase your limits from $1,000/day to $50,000/day. For unlimited access, contact our support team to upgrade to a Premium account.",
      },
    ],
  },
  cta: {
    heading: "Ready to Get Started?",
    body: "Open your account today. No hidden fees, no surprises.",
    btn: "Create Free Account",
  },
};

// ── Security Page Types & Defaults ────────────────────────────────────────

export interface SecurityBadgeItem {
  icon: string;
  title: string;
}

export interface SecurityCardItem {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

export interface SecurityComplianceItem {
  icon: string;
  title: string;
  description: string;
}

export interface SecurityContent {
  hero: {
    heading: string;
    body: string;
  };
  badges: {
    items: SecurityBadgeItem[];
  };
  architecture: {
    heading: string;
    subheading: string;
    cards: SecurityCardItem[];
  };
  twofa: {
    heading: string;
    body: string;
    benefits: string[];
    card_title: string;
    card_subtitle: string;
  };
  compliance: {
    heading: string;
    subheading: string;
    items: SecurityComplianceItem[];
  };
  cta: {
    heading: string;
    body: string;
    btn: string;
  };
}

export const DEFAULT_SECURITY_CONTENT: SecurityContent = {
  hero: {
    heading: "Your Security is Our Priority",
    body: "We employ bank-grade security measures to protect your funds and personal information. Your trust is the foundation of everything we do.",
  },
  badges: {
    items: [
      { icon: "ShieldCheck", title: "FINTRAC\nRegistered" },
      { icon: "Lock", title: "256-bit\nEncryption" },
      { icon: "Server", title: "Cold Storage" },
      { icon: "FileText", title: "$250K\nInsurance" },
    ],
  },
  architecture: {
    heading: "Multi-Layer Security Architecture",
    subheading: "Every layer designed to protect your assets",
    cards: [
      {
        icon: "Lock",
        title: "End-to-End Encryption",
        description: "All data is encrypted in transit and at rest using AES-256 encryption, the standard for banks.",
        items: ["TLS 1.3 in-transit", "Encrypted database storage", "Secure key management", "Zero-knowledge architecture"],
      },
      {
        icon: "Server",
        title: "Cold Storage Protection",
        description: "98% of all digital assets are held offline in distributed, geographically secured vaults.",
        items: ["Multi-signature wallets", "Geographically isolated", "Hardware security modules", "Strict access protocols"],
      },
      {
        icon: "Activity",
        title: "Real-Time Monitoring",
        description: "Our advanced AI system monitors all transactions 24/7 for suspicious activity.",
        items: ["Fraud detection algorithms", "Anomaly prevention", "Instant alerts", "Transaction pattern analysis"],
      },
      {
        icon: "UserCheck",
        title: "Identity Verification (KYC)",
        description: "Strict identity verification processes ensure that only you can access your account.",
        items: ["Government ID verification", "Biometric authentication", "Anti-fraud checks", "Ongoing monitoring"],
      },
    ],
  },
  twofa: {
    heading: "Two-Factor\nAuthentication (2FA)",
    body: "Add an extra layer of security to your account with mandatory two-factor authentication. Even if someone obtains your password, they cannot access your account without your mobile device.",
    benefits: [
      "Authenticator app support (Google Authenticator, Authy)",
      "Hardware security key support (YubiKey)",
      "Required for all withdrawals",
      "Backup codes for recovery",
    ],
    card_title: "Protected Login",
    card_subtitle: "Verify your identity to access your portfolio",
  },
  compliance: {
    heading: "Regulatory Compliance",
    subheading: "Fully compliant with Canadian financial regulations",
    items: [
      {
        icon: "Shield",
        title: "FINTRAC\nRegistration",
        description: "Registered as a Money Services Business (MSB) with the Financial Transactions and Reports Analysis Centre of Canada.",
      },
      {
        icon: "ShieldCheck",
        title: "KYC/AML\nCompliance",
        description: "Strict Know Your Customer and Anti-Money Laundering procedures to prevent illicit activity and ensure responsible compliance.",
      },
      {
        icon: "FileText",
        title: "Regular Audits",
        description: "Independent third-party security audits to maintain integrity and ensure the highest standards of protection.",
      },
    ],
  },
  cta: {
    heading: "Your Security, Our Promise",
    body: "Experience the peace of mind that comes with bank-grade security.",
    btn: "Open Secure Account",
  },
};

// ── Help Page Types & Defaults ────────────────────────────────────────────

export interface HelpCategoryItem {
  icon: string;
  title: string;
  links: string[];
}

export interface HelpSupportChannel {
  icon: string;
  title: string;
  description: string;
  btnText: string;
  premiumOnly: boolean;
}

export interface HelpContent {
  hero: {
    heading: string;
    body: string;
    placeholder: string;
  };
  categories: {
    items: HelpCategoryItem[];
  };
  faq: {
    heading: string;
    subheading: string;
    list: string[];
  };
  support: {
    heading: string;
    subheading: string;
    channels: HelpSupportChannel[];
  };
}

export const DEFAULT_HELP_CONTENT: HelpContent = {
  hero: {
    heading: "How Can We Help?",
    body: "Search our knowledge base or browse categories below",
    placeholder: "Search for help articles...",
  },
  categories: {
    items: [
      {
        icon: "Smartphone",
        title: "Getting\nStarted",
        links: ["How to create an account", "Completing KYC verification", "Setting up two-factor authentication", "Making your first deposit"],
      },
      {
        icon: "CreditCard",
        title: "Deposits &\nWithdrawals",
        links: ["How to deposit cryptocurrency", "Withdrawal methods and fees", "Understanding network confirmations", "Interac e-Transfer guide"],
      },
      {
        icon: "Shield",
        title: "Security &\nPrivacy",
        links: ["Securing your account", "Understanding cold storage", "Privacy and data protection", "Reporting suspicious activity"],
      },
      {
        icon: "UserCog",
        title: "Account\nManagement",
        links: ["Updating personal information", "Account limits and upgrades", "Transaction history and exports", "Closing your account"],
      },
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subheading: "Quick answers to common questions",
    list: [
      "How long does KYC verification take?",
      "What are the withdrawal fees?",
      "Is my cryptocurrency insured?",
      "Can I withdraw to any Canadian bank?",
      "What cryptocurrencies are supported?",
      "How do I enable two-factor authentication?",
    ],
  },
  support: {
    heading: "Still Need Help?",
    subheading: "Our support team is here for you",
    channels: [
      {
        icon: "MessageSquare",
        title: "Live Chat",
        description: "Chat with our support team in real-time",
        btnText: "Start Chat",
        premiumOnly: false,
      },
      {
        icon: "Mail",
        title: "Email Support",
        description: "Get help via email within 24 hours",
        btnText: "Email Us",
        premiumOnly: false,
      },
      {
        icon: "Phone",
        title: "Phone Support",
        description: "Available for premium customers only",
        btnText: "Premium Feature",
        premiumOnly: true,
      },
    ],
  },
};

