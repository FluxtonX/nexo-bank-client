export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-banking-navy text-white">
      <div className="relative h-24 w-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-banking-gold animate-spin" />
        {/* Inner Logo Placeholder */}
        <div className="absolute inset-4 rounded-full bg-banking-gold/10 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-banking-gold animate-pulse" />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-banking-gold animate-pulse">
          Establishing Secure Link
        </p>
        <p className="mt-2 text-xs font-bold text-white/40">
          Syncing with CDNT Global Nodes...
        </p>
      </div>
    </div>
  );
}
