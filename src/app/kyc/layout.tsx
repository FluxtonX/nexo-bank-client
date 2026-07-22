import Image from "next/image";

export default function KYCLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#11409F] flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-6 relative">
      <div className="w-full max-w-[560px] flex flex-col items-center z-10">
        
        {/* Logo */}
        <div className="mb-5 flex items-center justify-center">
          <Image 
            src="/cdnt-logo.png" 
            alt="CDNT Bank" 
            width={450} 
            height={150} 
            className="h-20 md:h-24 w-auto object-contain"
            priority
            unoptimized
          />
        </div>


        {children}
      </div>

      {/* Footer (Requested by user) */}
      <footer className="mt-8 sm:mt-0 sm:absolute sm:bottom-6 w-full text-center flex flex-col items-center justify-center text-blue-200 text-[12px] opacity-80">
        <Image 
          src="/cdnt-logo.png" 
          alt="CDNT Bank" 
          width={80} 
          height={30} 
          className="w-[80px] h-auto object-contain brightness-0 invert mb-3 opacity-60"
          unoptimized
        />
        <p>&copy; {new Date().getFullYear()} CDNT Bank. All rights reserved.</p>
      </footer>
    </div>
  );
}
