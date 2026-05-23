const StatsReview = () => {
  return (
    <>
      {/* LEFT FLOAT — position:absolute so it doesn't disturb the ball layout */}
      <div className="absolute left-[2%] top-1/2 -translate-y-1/2 flex flex-col gap-3 w-[18%] z-20">
        {/* Stat cards */}
        {[
          { label: "Nations available", value: "48" },
          { label: "Kit designs", value: "96" },
          { label: "Delivered in", value: "3 days" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-black/8"
          >
            <p className="text-[11px] text-neutral-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-neutral-900">{s.value}</p>
          </div>
        ))}

        {/* Review pill */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-black/8">
          <p className="text-[13px] text-amber-500 mb-1">★★★★★ 4.9</p>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            "Arrived in 2 days, quality is top tier"
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            — Marcus T., Brazil kit
          </p>
        </div>
      </div>
    </>
  );
};

export default StatsReview;
