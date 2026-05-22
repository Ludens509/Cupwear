import type { Testimonials } from "../types";

// ── Testimonial data — adapted for Cupwear e-commerce ────────────────────────
export const testimonials:Testimonials[] = [
  {
    id: 1,
    // Quote split into segments: each has text + whether it's muted (grey)
    segments: [
      { text: '"GOT MY JERSEY ', muted: false },
      { text: 'THREE DAYS BEFORE ', muted: true },
      { text: 'THE OPENING MATCH —', muted: false },
      { text: ' QUALITY IS ', muted: true },
      { text: 'UNREAL!"', muted: false },
    ],
    name: 'Marcus T.',
    role: 'Brazil Kit — 2026 World Cup',
    avatar: 'https://i.pravatar.cc/80?img=11',
  },
  {
    id: 2,
    segments: [
      { text: '"WORE IT TO THE ', muted: false },
      { text: 'WATCH PARTY,', muted: true },
      { text: ' EVERYONE ASKED ', muted: false },
      { text: 'WHERE I GOT', muted: true },
      { text: ' MY KIT!"', muted: false },
    ],
    name: 'Priya S.',
    role: 'Argentina Kit — 2026 World Cup',
    avatar: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 3,
    segments: [
      { text: '"BEST ', muted: false },
      { text: 'OFFICIAL-STYLE KIT ', muted: true },
      { text: 'I\'VE EVER OWNED —', muted: false },
      { text: ' WORTH EVERY ', muted: true },
      { text: 'PENNY!"', muted: false },
    ],
    name: 'Liam O.',
    role: 'England Kit — 2026 World Cup',
    avatar: 'https://i.pravatar.cc/80?img=33',
  },
];