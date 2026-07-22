import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  FileText, 
  Activity, 
  UserCheck, 
  CheckCircle2, 
  Shield 
} from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

const IconMap: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  Lock,
  Server,
  FileText,
  Activity,
  UserCheck,
  CheckCircle2,
  Shield
};

export default async function SecurityPage() {
  const content = await getSiteContent("security");

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

        {/* 4 Badges Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.badges.items.map((badge, i) => {
              const IconComponent = IconMap[badge.icon] || Shield;
              const isEven = i % 2 !== 0;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 h-40">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 shadow-md ${isEven ? 'bg-[#F5B01E] shadow-yellow-500/20' : 'bg-[#1A3FBB] shadow-blue-500/20'}`}>
                    <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-[#0A0F2C] text-sm leading-tight whitespace-pre-wrap">{badge.title}</h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Multi-Layer Security Architecture */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-4">{content.architecture.heading}</h2>
              <p className="text-lg text-[#6B7280]">{content.architecture.subheading}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {content.architecture.cards.map((card, i) => {
                const IconComponent = IconMap[card.icon] || Lock;
                return (
                  <div key={i} className="bg-[#F8F9FA] rounded-3xl p-10 border border-gray-100">
                    <div className="h-12 w-12 rounded-xl bg-[#1A3FBB] flex items-center justify-center mb-6">
                      <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">{card.title}</h3>
                    <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
                      {card.description}
                    </p>
                    <ul className="space-y-4">
                      {card.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" strokeWidth={2.5} />
                          <span className="text-[#0A0F2C] font-medium text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Two-Factor Authentication Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-6 whitespace-pre-wrap">{content.twofa.heading}</h2>
                <p className="text-[#6B7280] text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                  {content.twofa.body}
                </p>
                <ul className="space-y-5">
                  {content.twofa.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-[#0A0F2C] font-medium text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#1A3FBB] rounded-[2rem] p-12 text-center text-white flex flex-col items-center justify-center min-h-[400px] shadow-2xl shadow-blue-900/20">
                <div className="h-20 w-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-8 bg-white/10 backdrop-blur-sm">
                  <Lock className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{content.twofa.card_title}</h3>
                <p className="text-blue-100/80 max-w-xs mx-auto">{content.twofa.card_subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Regulatory Compliance */}
        <section className="px-6 py-24 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A0F2C] mb-4">{content.compliance.heading}</h2>
              <p className="text-lg text-[#6B7280]">{content.compliance.subheading}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {content.compliance.items.map((item, i) => {
                const IconComponent = IconMap[item.icon] || Shield;
                return (
                  <div key={i} className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="h-16 w-16 rounded-full bg-[#F5B01E]/10 flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-[#F5B01E]" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0F2C] mb-4 whitespace-pre-wrap">{item.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
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
