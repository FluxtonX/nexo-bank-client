import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, GitBranch } from "lucide-react";
import type { LandingFooterContent } from "@/lib/content-defaults";
import { DEFAULT_LANDING_CONTENT } from "@/lib/content-defaults";

export default function Footer({ content = DEFAULT_LANDING_CONTENT.footer }: { content?: LandingFooterContent }) {
  // Convert list of complex objects to key-value record to map dynamically
  const footerLinksMap: Record<string, { name: string; href: string }[]> = {};
  
  content.links.forEach((linkCol) => {
    footerLinksMap[linkCol.title.toUpperCase()] = linkCol.description.split(", ").map((item) => ({
      name: item,
      href: "#"
    }));
  });

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-4 mb-6 group ">
              <Image
                src="/bluelogo.png"
                alt="Canadian National Trust Bank Logo"
                width={120}
                height={40}
                quality={100}
                priority
                unoptimized={true}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-[#64748b] leading-relaxed max-w-sm mb-8 text-[15px]">
              {content.tagline.split("\n").map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {part}
                </span>
              ))}
            </p>
            <div className="flex items-center space-x-3">
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors">
                <span className="sr-only">Branch</span>
                <GitBranch className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinksMap).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="text-[#0f172a] font-bold text-xs tracking-[0.1em] mb-6 uppercase">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[#64748b] hover:text-[#0f172a] transition-colors text-[15px]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12">
          <p className="text-[#64748b] text-xs shrink-0">
            {content.copyright}
          </p>
          <p className="text-[#94a3b8] text-xs leading-relaxed lg:text-right max-w-3xl">
            {content.regulatory}
          </p>
        </div>

      </div>
    </footer>
  );
}
