import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageLayout from '../components/layout/PageLayout'
import Container from '../components/layout/Container'
import { usePageTransition } from '../contexts'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    num: '01',
    title: 'Quality',
    desc: 'Every kit is crafted to meet the standard of the sport itself — technical fabric, accurate crests, and precise colorways that honour each nation.',
  },
  {
    num: '02',
    title: 'Authentic',
    desc: "We stay true to each nation's identity. No shortcuts, no generic templates — just genuine representation of the flags and colors that matter.",
  },
  {
    num: '03',
    title: 'Community',
    desc: 'Football unites billions. CupWear is built to reflect that energy, bringing fans together across borders, kits, and generations.',
  },
]

export default function About() {
  const { navigateTo } = usePageTransition()

  const heroEyebrow   = useRef<HTMLSpanElement>(null)
  const heroLine1     = useRef<HTMLSpanElement>(null)
  const heroLine2     = useRef<HTMLSpanElement>(null)
  const heroLine3     = useRef<HTMLSpanElement>(null)
  const heroSub       = useRef<HTMLParagraphElement>(null)
  const heroScroll    = useRef<HTMLDivElement>(null)

  const storyRef      = useRef<HTMLElement>(null)
  const statsRef      = useRef<HTMLElement>(null)
  const valuesRef     = useRef<HTMLElement>(null)
  const ctaRef        = useRef<HTMLElement>(null)

  const count1 = useRef<HTMLSpanElement>(null)
  const count2 = useRef<HTMLSpanElement>(null)
  const count3 = useRef<HTMLSpanElement>(null)
  const count4 = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero entrance ──────────────────────────────
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from(heroEyebrow.current, { y: 16, opacity: 0, duration: 0.7, delay: 0.2 })
        .from(
          [heroLine1.current, heroLine2.current, heroLine3.current],
          { y: '105%', duration: 1.05, stagger: 0.12 },
          '-=0.35',
        )
        .from(heroSub.current,   { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(heroScroll.current, { opacity: 0, duration: 0.6 }, '-=0.3')

      // ── Story section ──────────────────────────────
      gsap.from(storyRef.current!.querySelectorAll('[data-animate]'), {
        y: 48,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 72%',
        },
      })

      // ── Stats counter ──────────────────────────────
      const statsData = [
        { el: count1.current, value: 48,   suffix: '' },
        { el: count2.current, value: 96,   suffix: '+' },
        { el: count3.current, value: 2026, suffix: '' },
        { el: count4.current, value: 50,   suffix: 'k+' },
      ]

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          statsData.forEach(({ el, value, suffix }) => {
            if (!el) return
            const obj = { val: 0 }
            gsap.to(obj, {
              val: value,
              duration: 2.2,
              ease: 'power2.out',
              onUpdate() {
                el.textContent = Math.round(obj.val) + suffix
              },
            })
          })
        },
      })

      gsap.from(statsRef.current!.querySelectorAll('[data-stat]'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 72%',
        },
      })

      // ── Values ─────────────────────────────────────
      gsap.from(valuesRef.current!.querySelectorAll('[data-card]'), {
        y: 60,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: valuesRef.current,
          start: 'top 72%',
        },
      })

      // ── CTA ────────────────────────────────────────
      gsap.from(ctaRef.current!.querySelectorAll('[data-cta]'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 75%',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <PageLayout>
      <main>

        {/* ── Hero ──────────────────────────────────── */}
        <section className={styles.hero}>
          <Container>
            <div className={styles.heroContent}>
              <span ref={heroEyebrow} className={styles.heroEyebrow}>
                <span className={styles.heroEyebrowDot} />
                CupWear — Our story
              </span>

              <h1 className={styles.heroHeadline}>
                <span className={styles.heroLineOuter}>
                  <span ref={heroLine1} className={styles.heroLineInner}>The Story</span>
                </span>
                <span className={styles.heroLineOuter}>
                  <span ref={heroLine2} className={styles.heroLineInner}>Behind the</span>
                </span>
                <span className={styles.heroLineOuter}>
                  <span ref={heroLine3} className={styles.heroLineInner}>Crest.</span>
                </span>
              </h1>

              <p ref={heroSub} className={styles.heroSub}>
                CupWear is more than a kit shop — it's a celebration of national pride,
                football culture, and the global sport we all love.
              </p>
            </div>
          </Container>

          <div ref={heroScroll} className={styles.heroScroll}>
            <div className={styles.heroScrollLine} />
            scroll
          </div>
        </section>

        {/* ── Story ─────────────────────────────────── */}
        <section ref={storyRef} className={styles.story}>
          <Container>
            <div className={styles.storyGrid}>
              <div className={styles.storyText}>
                <span data-animate className={styles.eyebrow}>Our Story</span>
                <h2 data-animate className={styles.storyHeadline}>
                  Born from<br />the game.
                </h2>
                <p data-animate className={styles.storyBody}>
                  CupWear was founded by fans, for fans. We saw the 2026 FIFA World Cup
                  approaching and knew billions of people would want to represent their
                  nation — but finding official-style kits shouldn't require a scavenger hunt.
                </p>
                <p data-animate className={styles.storyBody}>
                  From Argentina's sky-blue stripes to Germany's bold crest, every kit we carry
                  tells a story. We built the platform that makes wearing yours effortless.
                  Every nation. Every kit. One place.
                </p>
              </div>

              <div data-animate className={styles.storyVisual}>
                <img
                  src="/about-jerseys.webp"
                  alt="Seven national team jerseys hung on a clothesline"
                  className={styles.storyImage}
                />
                <div className={styles.storyImageBadge}>
                  <span className={styles.storyImageBadgeDot} />
                  48 nations. One platform.
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Stats ─────────────────────────────────── */}
        <section ref={statsRef} className={styles.stats}>
          <Container>
            <div className={styles.statsGrid}>
              {[
                { ref: count1, initial: '48',   label: 'Nations covered' },
                { ref: count2, initial: '96+',  label: 'Kit designs' },
                { ref: count3, initial: '2026', label: 'World Cup edition' },
                { ref: count4, initial: '50k+', label: 'Fans worldwide' },
              ].map(({ ref, initial, label }) => (
                <div key={label} data-stat className={styles.statItem}>
                  <span className={styles.statNum}>
                    <span ref={ref}>{initial}</span>
                  </span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Values ────────────────────────────────── */}
        <section ref={valuesRef} className={styles.values}>
          <Container>
            <div className={styles.valuesSectionHeader}>
              <span className={styles.eyebrow}>What we stand for</span>
              <h2 className={styles.valuesHeadline}>Our Pillars</h2>
            </div>
            <div className={styles.valuesGrid}>
              {VALUES.map(({ num, title, desc }) => (
                <div key={num} data-card className={styles.valueCard}>
                  <span className={styles.valueNum}>{num}</span>
                  <h3 className={styles.valueTitle}>{title}</h3>
                  <p className={styles.valueDesc}>{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CTA ───────────────────────────────────── */}
        <section ref={ctaRef} className={styles.cta}>
          <Container>
            <div className={styles.ctaContent}>
              <h2 data-cta className={styles.ctaHeadline}>
                Ready to rep<br />your nation?
              </h2>
              <p data-cta className={styles.ctaSub}>
                Find your country's official-style jersey for the 2026 FIFA World Cup.
              </p>
              <button
                data-cta
                className={styles.ctaBtn}
                onClick={() => navigateTo('/')}
              >
                Shop jerseys — from $49
              </button>
            </div>
          </Container>
        </section>

      </main>
    </PageLayout>
  )
}
