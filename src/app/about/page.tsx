import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, TrendingUp, Shield, Users, Award } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

const IconMap: Record<string, React.ComponentType<any>> = {
  Target,
  TrendingUp,
  Shield,
  Users,
  Award,
};

export default async function AboutPage() {
  const content = await getSiteContent("about");

  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen">
      <Navbar />
      {/* Header Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-6 tracking-tight">
            {content.hero.heading}
          </h1>
          <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-3xl mx-auto font-medium whitespace-pre-wrap">
            {content.hero.body}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
            <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
              <Target className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-bold text-[#0A0F2C] mb-6">{content.mission.title}</h2>
            <p className="text-[#6B7280] leading-loose whitespace-pre-wrap">
              {content.mission.body}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
            <div className="h-14 w-14 rounded-2xl bg-[#F5B01E] flex items-center justify-center mb-8 shadow-lg shadow-yellow-500/20">
              <TrendingUp className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-bold text-[#0A0F2C] mb-6">{content.vision.title}</h2>
            <p className="text-[#6B7280] leading-loose whitespace-pre-wrap">
              {content.vision.body}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A0F2C] mb-4">{content.why.heading}</h2>
            <p className="text-lg text-[#6B7280]">{content.why.subheading}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.why.features.map((feature, i) => {
              const IconComponent = IconMap[feature.icon] || Shield;
              return (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                  <div className="h-12 w-12 rounded-full bg-[#1A3FBB] flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0F2C] mb-6">{feature.title}</h3>
                  <ul className="space-y-4">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#F5B01E]" />
                        <span className="text-[#6B7280] font-medium text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white pb-24 px-6 border-b border-gray-100">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {content.stats.items.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-2 tracking-tight">{stat.value}</div>
              <div className="text-[#6B7280] font-medium">{stat.label}</div>
            </div>
          ))}
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
      <Footer />
    </main>
  );
}
