export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-banking-navy text-white">
      <div className="relative h-16 w-16">
        {/* Outer Ring - Faster spin */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-banking-gold animate-spin" style={{ animationDuration: '0.8s' }} />
        {/* Inner Logo Placeholder - Faster pulse */}
        <div className="absolute inset-3 rounded-full bg-banking-gold/10 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-banking-gold animate-pulse" style={{ animationDuration: '1s' }} />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-banking-gold animate-pulse" style={{ animationDuration: '1.5s' }}>
          Establishing Secure Link
        </p>
        <p className="mt-2 text-xs font-bold text-white/40">
          Syncing with Nexo Bank Global Nodes...
        </p>
      </div>
    </div>
  );
}
