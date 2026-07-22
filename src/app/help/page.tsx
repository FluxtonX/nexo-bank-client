import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  Smartphone, 
  CreditCard, 
  Shield, 
  UserCog,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

const IconMap: Record<string, React.ComponentType<any>> = {
  Search,
  Smartphone,
  CreditCard,
  Shield,
  UserCog,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone
};

export default async function HelpPage() {
  const content = await getSiteContent("help");

  return (
    <main className="bg-[#F8F9FA] pb-0 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24">
        {/* Header Section */}
        <section className="pt-16 pb-16 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3FBB] mb-4 tracking-tight">
              {content.hero.heading}
            </h1>
            <p className="text-lg text-[#6B7280] mb-10">
              {content.hero.body}
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#1A3FBB] focus:border-transparent outline-none text-[#0A0F2C] placeholder-gray-400 transition-all" 
                placeholder={content.hero.placeholder}
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.categories.items.map((cat, i) => {
              const IconComponent = IconMap[cat.icon] || Smartphone;
              return (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <div className="h-14 w-14 rounded-2xl bg-[#1A3FBB] flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <IconComponent className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0F2C] mb-6 whitespace-pre-wrap">{cat.title}</h3>
                  <ul className="space-y-4 flex-grow">
                    {cat.links.map((link, idx) => (
                      <li key={idx}>
                        <Link href="#" className="text-sm text-[#6B7280] hover:text-[#1A3FBB] transition-colors inline-block leading-relaxed">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="px-6 py-24 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-3">{content.faq.heading}</h2>
              <p className="text-lg text-[#6B7280]">{content.faq.subheading}</p>
            </div>

            <div className="space-y-4">
              {content.faq.list.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex justify-between items-center cursor-pointer hover:border-gray-200 transition-colors">
                  <h3 className="text-[15px] font-bold text-[#0A0F2C]">{faq}</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Need Help Section */}
        <section className="px-6 py-24 bg-[#F8F9FA]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0A0F2C] mb-3">{content.support.heading}</h2>
              <p className="text-lg text-[#6B7280]">{content.support.subheading}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {content.support.channels.map((channel, i) => {
                const IconComponent = IconMap[channel.icon] || MessageSquare;
                return (
                  <div key={i} className={`bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 ${channel.premiumOnly ? 'opacity-60' : ''}`}>
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md ${channel.premiumOnly ? 'bg-gray-400' : (i === 1 ? 'bg-[#F5B01E] shadow-yellow-500/20' : 'bg-[#1A3FBB] shadow-blue-500/20')}`}>
                      <IconComponent className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0F2C] mb-3">{channel.title}</h3>
                    <p className="text-[#6B7280] text-sm mb-8 leading-relaxed h-10">
                      {channel.description}
                    </p>
                    <button 
                      className={`w-full font-bold py-3.5 px-6 rounded-xl transition-colors duration-300 ${
                        channel.premiumOnly 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : (i === 1 
                              ? 'bg-white hover:bg-gray-50 text-[#0A0F2C] border border-gray-200' 
                              : 'bg-[#1A3FBB] hover:bg-[#153299] text-white')
                      }`} 
                      disabled={channel.premiumOnly}
                    >
                      {channel.btnText}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
