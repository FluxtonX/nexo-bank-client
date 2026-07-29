"use client";

import { Phone, Shield } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-16 md:py-20 bg-[#022c22] px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-4">
          Contact Us
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          We're Here to Help
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
          Reach our team directly. Available 24/7 for all account and security concerns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support */}
          <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-[#047857] transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#047857]/20 border border-[#047857]/30 mx-auto mb-6 group-hover:bg-[#047857]/40 transition-all">
              <Phone className="h-6 w-6 text-[#047857]" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
              General Support
            </p>
            <a
              href="tel:+12498881077"
              className="text-2xl md:text-3xl font-bold text-white hover:text-accent-gold transition-colors"
            >
              +1 (249) 888-1077
            </a>
            <p className="mt-3 text-sm text-gray-500">
              For account help, onboarding & general inquiries
            </p>
          </div>

          {/* Fraud Department */}
          <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-6 group-hover:bg-red-500/20 transition-all">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
              Fraud Department
            </p>
            <a
              href="tel:+14378889050"
              className="text-2xl md:text-3xl font-bold text-white hover:text-red-400 transition-colors"
            >
              +1 (437) 888-9050
            </a>
            <p className="mt-3 text-sm text-gray-500">
              Report fraud or suspicious activity on your account
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
