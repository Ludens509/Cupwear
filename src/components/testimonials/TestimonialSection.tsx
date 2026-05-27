import { useState } from 'react';
import { testimonials } from '../../data/testimonials';
import Container from '../layout/Container';

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="bg-[#e7e6e6e7] py-16 md:py-20 lg:py-24 overflow-hidden">
      <Container className="relative">

        {/* ── Decorative giant quote mark — top left ── */}
        {/* position:absolute, huge, light grey, font Bebas Neue */}
        <span
          aria-hidden="true"
          className="absolute -top-4 left-0 font-['Bebas_Neue'] text-[180px] md:text-[220px] leading-none text-[#e8e8e8] select-none pointer-events-none"
        >
          "
        </span>

        {/* ── Quote text — main hero content ── */}
        {/* Sits below the decorative quote mark with left indent to align
            with where the real quote starts (matches screenshot) */}
        <div className="relative pt-28 md:pt-32 pb-12">
          <p className="font-['Bebas_Neue'] text-[clamp(44px,10.5vw,120px)] leading-[0.97] tracking-[0.01em] m-0">
            {t.segments.map((seg, i) => (
              <span
                key={i}
                className={seg.muted ? 'text-[#b0b0b0]' : 'text-[#111]'}
              >
                {seg.text}
              </span>
            ))}
          </p>
        </div>

        {/* ── Bottom bar: pill + author + nav buttons ── */}
        <div className="flex items-end justify-between flex-wrap gap-6">

          {/* Left side: pill + author */}
          <div className="flex flex-col gap-4">

            {/* "Testimonials" pill — outlined, same as screenshot */}
            <span className="inline-block w-fit border border-[#ccc] rounded-full px-4 py-[6px] text-[13px] font-['DM_Sans'] text-[#555] tracking-[0.3px]">
              Testimonials
            </span>

            {/* Author row: avatar + name + role */}
            <div className="flex items-center gap-3">
              {/* Avatar: dark rounded square (matches screenshot — not circular) */}
              <div className="w-[52px] h-[52px] rounded-[10px] overflow-hidden shrink-0 bg-[#222]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-full h-full object-cover block grayscale"
                />
              </div>

              <div className="flex flex-col gap-[2px]">
                <span className="font-['DM_Sans'] font-semibold text-[15px] text-[#111] leading-tight">
                  {t.name}
                </span>
                <span className="font-['DM_Sans'] text-[13px] text-[#888] leading-tight">
                  {t.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right side: prev / next buttons */}
          <div className="flex items-center gap-3">

            {/* Prev — outlined circle */}
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-[52px] h-[52px] rounded-full border border-[#ccc] flex items-center justify-center text-[#333] transition-all duration-200 hover:border-[#111] hover:text-[#111] active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Next — solid green (matches screenshot) */}
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-[52px] h-[52px] rounded-full bg-[#1a7a3f] flex items-center justify-center text-white transition-all duration-200 hover:bg-[#155f31] active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Slide indicator dots ── */}
        <div className="flex gap-[6px] mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-[#1a7a3f]'
                  : 'w-3 bg-[#ddd]'
              }`}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}