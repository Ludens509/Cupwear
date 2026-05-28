import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import PageLayout from '../components/layout/PageLayout'
import Container from '../components/layout/Container'
import { usePageTransition } from '../contexts'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const { navigateTo } = usePageTransition()

  const digit1   = useRef<HTMLSpanElement>(null)
  const digit2   = useRef<HTMLSpanElement>(null)
  const digit3   = useRef<HTMLSpanElement>(null)
  const textRef  = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from([digit1.current, digit2.current, digit3.current], {
          y: 100,
          opacity: 0,
          duration: 0.9,
          stagger: 0.09,
          delay: 0.15,
        })
        .from(textRef.current, {
          y: 28,
          opacity: 0,
          duration: 0.75,
        }, '-=0.4')
    })

    return () => ctx.revert()
  }, [])

  return (
    <PageLayout>
      <section className={styles.page}>
        <Container>
          <div className={styles.inner}>
            <div className={styles.numberRow}>
              <span ref={digit1} className={styles.digit}>4</span>
              <span ref={digit2} className={styles.digit}>0</span>
              <span ref={digit3} className={styles.digit}>4</span>
            </div>

            <div ref={textRef} className={styles.textBlock}>
              <p className={styles.tag}>
                <span className={styles.redCard} />
                Page not found
              </p>
              <h1 className={styles.headline}>This page got a red card.</h1>
              <p className={styles.sub}>
                Looks like this URL is out of bounds. Head back to the pitch
                and find what you're looking for.
              </p>
              <div className={styles.actions}>
                <button className={styles.homeBtn} onClick={() => navigateTo('/')}>
                  Back to home
                </button>
                <button className={styles.ghostBtn} onClick={() => navigateTo('/about')}>
                  About CupWear
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  )
}
