/**
 * site-content.ts
 *
 * Server-side utility for fetching content from the site_content table.
 * Always falls back to matching DEFAULT_*_CONTENT on any error or missing key,
 * so the page is never empty even if Supabase is unreachable.
 *
 * This function runs ONLY on the server (Server Components / ISR).
 * It must never be imported into a "use client" component.
 */

import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_PRICING_CONTENT,
  DEFAULT_SECURITY_CONTENT,
  DEFAULT_HELP_CONTENT,
  type LandingContent,
  type AboutContent,
  type PricingContent,
  type SecurityContent,
  type HelpContent,
} from "./content-defaults";

export async function getSiteContent(category: "landing"): Promise<LandingContent>;
export async function getSiteContent(category: "about"): Promise<AboutContent>;
export async function getSiteContent(category: "pricing"): Promise<PricingContent>;
export async function getSiteContent(category: "security"): Promise<SecurityContent>;
export async function getSiteContent(category: "help"): Promise<HelpContent>;
export async function getSiteContent(category: string): Promise<any> {
  let fallback: any;
  if (category === "landing") fallback = DEFAULT_LANDING_CONTENT;
  else if (category === "about") fallback = DEFAULT_ABOUT_CONTENT;
  else if (category === "pricing") fallback = DEFAULT_PRICING_CONTENT;
  else if (category === "security") fallback = DEFAULT_SECURITY_CONTENT;
  else if (category === "help") fallback = DEFAULT_HELP_CONTENT;
  else fallback = {};

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("category", category);

    // If the table doesn't exist yet or DB is unreachable, use defaults
    if (error || !data || data.length === 0) {
      console.warn(`[site-content] Falling back to defaults for ${category}:`, error?.message ?? "no data");
      return fallback;
    }

    // Build a fast lookup map: key → parsed JSONB value
    const db = new Map<string, unknown>(
      data.map((row) => [row.key, row.value])
    );

    /**
     * get<T>(key, fallback) — returns the DB value if present and non-null,
     * otherwise returns the fallback from default content.
     */
    function get<T>(key: string, fallbackVal: T): T {
      const val = db.get(key);
      return val !== undefined && val !== null ? (val as T) : fallbackVal;
    }

    if (category === "landing") {
      const D = DEFAULT_LANDING_CONTENT;
      return {
        hero: {
          trustBadge: get("landing.hero.trust_badge", D.hero.trustBadge),
          headline:   get("landing.hero.headline",    D.hero.headline),
          body:       get("landing.hero.body",         D.hero.body),
          btn1:       get("landing.hero.btn1",         D.hero.btn1),
          btn2:       get("landing.hero.btn2",         D.hero.btn2),
          stats:      get("landing.hero.stats",        D.hero.stats),
        },
        features: {
          heading:     get("landing.features.heading",       D.features.heading),
          sub:         get("landing.features.sub",           D.features.sub),
          btn:         get("landing.features.btn",           D.features.btn),
          list:        get("landing.features.list",          D.features.list),
          ctaCardTitle: get("landing.features.cta_card_title", D.features.ctaCardTitle),
          ctaCardDesc:  get("landing.features.cta_card_desc",  D.features.ctaCardDesc),
          ctaCardBtn:   get("landing.features.cta_card_btn",   D.features.ctaCardBtn),
        },
        assets: {
          overline: get("landing.assets.overline", D.assets.overline),
          heading:  get("landing.assets.heading",  D.assets.heading),
        },
        onboarding: {
          overline: get("landing.onboarding.overline", D.onboarding.overline),
          heading:  get("landing.onboarding.heading",  D.onboarding.heading),
          steps:    get("landing.onboarding.steps",    D.onboarding.steps),
        },
        app: {
          overline: get("landing.app.overline", D.app.overline),
          heading:  get("landing.app.heading",  D.app.heading),
          body:     get("landing.app.body",     D.app.body),
          benefits: get("landing.app.benefits", D.app.benefits),
        },
        cta: {
          overline: get("landing.cta.overline", D.cta.overline),
          heading:  get("landing.cta.heading",  D.cta.heading),
          body:     get("landing.cta.body",     D.cta.body),
          btn1:     get("landing.cta.btn1",     D.cta.btn1),
          btn2:     get("landing.cta.btn2",     D.cta.btn2),
        },
        footer: {
          tagline:    get("landing.footer.tagline",    D.footer.tagline),
          regulatory: get("landing.footer.regulatory", D.footer.regulatory),
          copyright:  get("landing.footer.copyright",  D.footer.copyright),
          links:      get("landing.footer.links",       D.footer.links),
        },
      };
    }

    if (category === "about") {
      const D = DEFAULT_ABOUT_CONTENT;
      return {
        hero: {
          heading: get("about.hero.heading", D.hero.heading),
          body:    get("about.hero.body",    D.hero.body),
        },
        mission: {
          title: get("about.mission.title", D.mission.title),
          body:  get("about.mission.body",  D.mission.body),
        },
        vision: {
          title: get("about.vision.title", D.vision.title),
          body:  get("about.vision.body",  D.vision.body),
        },
        why: {
          heading:    get("about.why.heading",    D.why.heading),
          subheading: get("about.why.subheading", D.why.subheading),
          features:   get("about.why.features",   D.why.features),
        },
        stats: {
          items: get("about.stats.items", D.stats.items),
        },
        cta: {
          heading: get("about.cta.heading", D.cta.heading),
          body:    get("about.cta.body",    D.cta.body),
          btn:     get("about.cta.btn",     D.cta.btn),
        },
      };
    }

    if (category === "pricing") {
      const D = DEFAULT_PRICING_CONTENT;
      return {
        hero: {
          heading: get("pricing.hero.heading", D.hero.heading),
          body:    get("pricing.hero.body",    D.hero.body),
        },
        fees: {
          title:   get("pricing.fees.title",   D.fees.title),
          columns: get("pricing.fees.columns", D.fees.columns),
          rows:    get("pricing.fees.rows",    D.fees.rows),
        },
        limits: {
          title:   get("pricing.limits.title",   D.limits.title),
          columns: get("pricing.limits.columns", D.limits.columns),
          rows:    get("pricing.limits.rows",    D.limits.rows),
        },
        features: {
          title:      get("pricing.features.title",      D.features.title),
          subheading: get("pricing.features.subheading", D.features.subheading),
          list:       get("pricing.features.list",       D.features.list),
        },
        faq: {
          title: get("pricing.faq.title", D.faq.title),
          list:  get("pricing.faq.list",  D.faq.list),
        },
        cta: {
          heading: get("pricing.cta.heading", D.cta.heading),
          body:    get("pricing.cta.body",    D.cta.body),
          btn:     get("pricing.cta.btn",     D.cta.btn),
        },
      };
    }

    if (category === "security") {
      const D = DEFAULT_SECURITY_CONTENT;
      return {
        hero: {
          heading: get("security.hero.heading", D.hero.heading),
          body:    get("security.hero.body",    D.hero.body),
        },
        badges: {
          items: get("security.badges.items", D.badges.items),
        },
        architecture: {
          heading:    get("security.architecture.heading",    D.architecture.heading),
          subheading: get("security.architecture.subheading", D.architecture.subheading),
          cards:      get("security.architecture.cards",      D.architecture.cards),
        },
        twofa: {
          heading:       get("security.twofa.heading",       D.twofa.heading),
          body:          get("security.twofa.body",          D.twofa.body),
          benefits:      get("security.twofa.benefits",      D.twofa.benefits),
          card_title:    get("security.twofa.card_title",    D.twofa.card_title),
          card_subtitle: get("security.twofa.card_subtitle", D.twofa.card_subtitle),
        },
        compliance: {
          heading:    get("security.compliance.heading",    D.compliance.heading),
          subheading: get("security.compliance.subheading", D.compliance.subheading),
          items:      get("security.compliance.items",      D.compliance.items),
        },
        cta: {
          heading: get("security.cta.heading", D.cta.heading),
          body:    get("security.cta.body",    D.cta.body),
          btn:     get("security.cta.btn",     D.cta.btn),
        },
      };
    }

    if (category === "help") {
      const D = DEFAULT_HELP_CONTENT;
      return {
        hero: {
          heading:     get("help.hero.heading",     D.hero.heading),
          body:        get("help.hero.body",        D.hero.body),
          placeholder: get("help.hero.placeholder", D.hero.placeholder),
        },
        categories: {
          items: get("help.categories.items", D.categories.items),
        },
        faq: {
          heading:    get("help.faq.heading",    D.faq.heading),
          subheading: get("help.faq.subheading", D.faq.subheading),
          list:       get("help.faq.list",       D.faq.list),
        },
        support: {
          heading:    get("help.support.heading",    D.support.heading),
          subheading: get("help.support.subheading", D.support.subheading),
          channels:   get("help.support.channels",   D.support.channels),
        },
      };
    }

    return fallback;
  } catch (err) {
    console.error(`[site-content] Unexpected error for ${category}, using defaults:`, err);
    return fallback;
  }
}

/**
 * Backwards compatibility wrapper for Landing Page.
 */
export async function getLandingContent(): Promise<LandingContent> {
  return getSiteContent("landing");
}

