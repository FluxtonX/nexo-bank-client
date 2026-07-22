"use client";

import { Mail, MapPin, MessageSquare, Phone, Clock, Globe } from "lucide-react";

import { FinalCta, PublicHero } from "@/components/public/page-blocks";
import { SiteShell } from "@/components/public/site-shell";

export default function ContactPage() {
  return (
    <SiteShell>
      <PublicHero
        eyebrow="Get in Touch"
        title="Institutional Support. Available 24/7."
        description="Whether you have questions about institutional onboarding, crypto custody, or account security, our global support team is ready to assist you."
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Email Support", body: "support@cdnt.io", detail: "2-hour typical response time", icon: Mail },
            { title: "Institutional Desk", body: "partners@cdnt.io", detail: "For high-net-worth & corporate", icon: Globe },
            { title: "Media & PR", body: "press@cdnt.io", detail: "Global media inquiries", icon: MessageSquare },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-banking-border bg-white p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-banking-blue/5 text-banking-blue group-hover:bg-banking-blue group-hover:text-white transition-all">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-lg font-bold text-banking-text">{item.title}</h2>
              <p className="mt-2 text-banking-blue font-bold">{item.body}</p>
              <p className="mt-1 text-xs text-banking-muted font-medium uppercase tracking-wider">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-3xl border border-banking-border bg-white p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-banking-text">Submit a Support Ticket</h2>
            <p className="mt-3 text-sm leading-7 text-banking-muted">
              For account-specific issues, please use the email address associated with your CDNT account.
            </p>

            <form className="mt-8 grid gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-banking-muted">Full Name</label>
                  <input className="w-full h-14 rounded-xl border border-banking-border bg-banking-offWhite px-5 text-sm outline-none focus:border-banking-blue transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-banking-muted">Email Address</label>
                  <input className="w-full h-14 rounded-xl border border-banking-border bg-banking-offWhite px-5 text-sm outline-none focus:border-banking-blue transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-banking-muted">Subject</label>
                <select className="w-full h-14 rounded-xl border border-banking-border bg-banking-offWhite px-5 text-sm outline-none focus:border-banking-blue transition-all appearance-none">
                  <option>Account Onboarding / KYC</option>
                  <option>Crypto Deposit / Withdrawal</option>
                  <option>Security / 2FA Reset</option>
                  <option>Institutional Partnership</option>
                  <option>Other / General Inquiry</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-banking-muted">Message</label>
                <textarea className="w-full min-h-[160px] rounded-xl border border-banking-border bg-banking-offWhite px-5 py-4 text-sm outline-none focus:border-banking-blue transition-all" placeholder="Describe your issue in detail..." />
              </div>
              <button className="h-14 rounded-xl bg-banking-blue text-sm font-bold text-white hover:bg-banking-navy shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
                Submit Support Request
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-8 lg:pt-10">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-banking-muted mb-6">Global Offices</h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <MapPin className="h-6 w-6 text-banking-gold shrink-0" />
                  <div>
                    <p className="font-bold text-banking-text">CDNT HQ (Canada)</p>
                    <p className="mt-1 text-sm text-banking-muted leading-relaxed">
                      1200 Bay Street, 15th Floor<br />
                      Toronto, ON M5R 2A5, Canada
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <Clock className="h-6 w-6 text-banking-gold shrink-0" />
                  <div>
                    <p className="font-bold text-banking-text">Operating Hours</p>
                    <p className="mt-1 text-sm text-banking-muted leading-relaxed">
                      24/7 Digital Operations<br />
                      Office: Mon-Fri, 9:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-banking-ink p-8 text-white">
              <Phone className="h-8 w-8 text-banking-gold mb-6" />
              <h4 className="text-xl font-bold mb-2">Priority Phone Support</h4>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Available exclusively for institutional clients and wealth management account holders.
              </p>
              <p className="text-lg font-bold text-banking-gold">+1 (888) 555-0199</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="overflow-hidden rounded-3xl border border-banking-border bg-white shadow-2xl">
          <div className="p-8 border-b border-banking-border bg-banking-offWhite">
            <h3 className="text-xl font-bold text-banking-text">Global Headquarters</h3>
            <p className="mt-1 text-sm text-banking-muted">Visit our institutional desk for private wealth consultations.</p>
          </div>
          <div className="h-[450px] w-full bg-slate-100 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.113476313788!2d-79.3934371234125!3d43.670732871101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b349071f76d95%3A0xc39f99238386f7b!2s1200%20Bay%20St%2C%20Toronto%2C%20ON%20M5R%202A5!5e0!3m2!1sen!2sca!4v1715777000000!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-[1.1] brightness-[1.02] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      <FinalCta />

    </SiteShell>
  );
}

