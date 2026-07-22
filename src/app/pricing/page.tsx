import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

export default async function PricingPage() {
  const content = await getSiteContent("pricing");

  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Header Section */}
        <section className="pt-16 pb-12 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-6 tracking-tight">
              {content.hero.heading}
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-medium whitespace-pre-wrap">
              {content.hero.body}
            </p>
          </div>
        </section>

        {/* Tables Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl space-y-12">
            
            {/* Transaction Fees Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="bg-[#1A3FBB] px-8 py-4">
                <h2 className="text-xl font-bold text-white">{content.fees.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {content.fees.columns.map((col, idx) => (
                        <th key={idx} className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {content.fees.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">{row[0]}</td>
                        <td className="px-8 py-5 text-sm font-bold text-[#1A3FBB]">{row[1]}</td>
                        <td className="px-8 py-5 text-sm text-[#6B7280]">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Limits Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              <div className="bg-[#F5B01E] px-8 py-4">
                <h2 className="text-xl font-bold text-[#0A0F2C]">{content.limits.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {content.limits.columns.map((col, idx) => (
                        <th key={idx} className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {content.limits.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 text-sm font-medium text-[#0A0F2C]">{row[0]}</td>
                        <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">{row[1]}</td>
                        <td className="px-8 py-5 text-sm font-bold text-[#0A0F2C]">{row[2]}</td>
                        <td className="px-8 py-5 text-sm text-[#6B7280]">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* Included With Every Account Section */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-4">{content.features.title}</h2>
              <p className="text-lg text-[#6B7280]">{content.features.subheading}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
              {content.features.list.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                  <span className="text-[#0A0F2C] font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C]">{content.faq.title}</h2>
            </div>
            
            <div className="space-y-6">
              {content.faq.list.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-[#0A0F2C] mb-3">{faq.question}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#1A3FBB] py-24 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{content.cta.heading}</h2>
            <p className="text-lg text-white/90 mb-10 font-medium whitespace-pre-wrap">
              {content.cta.body}
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-[#F5B01E] hover:bg-[#E0A015] text-[#0A0F2C] font-bold px-10 py-4 rounded-xl transition-colors duration-300 shadow-lg"
            >
              {content.cta.btn}
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
