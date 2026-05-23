const TrendKits = () => {
  return (
    <>
      {/* RIGHT FLOAT */}
      <div className="absolute right-[2%] top-1/2 -translate-y-1/2 flex flex-col gap-3 w-[18%] z-20">
        {/* Featured kit card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-black/8">
          <div className="h-20 bg-gradient-to-br from-[#74ACDF] to-white flex items-center justify-center text-3xl">
            🇦🇷
          </div>
          <div className="p-3">
            <p className="text-[13px] font-semibold text-neutral-900">
              Argentina
            </p>
            <p className="text-[11px] text-neutral-400 mb-2">
              Home kit — #10 Messi
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold">$99</span>
              <a
                href="#shop"
                className="text-[11px] bg-[#1a7a3f] text-white rounded-full px-3 py-1"
              >
                Shop →
              </a>
            </div>
          </div>
        </div>

        {/* Trending nations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-black/8">
          <p className="text-[11px] text-neutral-400 mb-2 uppercase tracking-wide">
            Trending
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {["🇧🇷 Brazil", "🇫🇷 France", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", "🇩🇪 Germany"].map((n) => (
              <span
                key={n}
                className="text-[10px] px-2 py-1 border border-neutral-200 rounded-full text-neutral-500"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-black/8 flex flex-col gap-2">
          {[
            { icon: "🚚", text: "Free shipping over $80" },
            { icon: "↩️", text: "30-day returns" },
            { icon: "🔒", text: "Secure checkout" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2">
              <span className="text-[14px]">{b.icon}</span>
              <span className="text-[11px] text-neutral-500">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrendKits;
