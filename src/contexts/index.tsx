import { createContext, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import type { ReactNode } from 'react'

interface TransitionContextType {
  navigateTo: (path: string) => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)

  function navigateTo(path: string) {
    const el = overlayRef.current
    if (!el) {
      navigate(path)
      window.scrollTo(0, 0)
      return
    }

    gsap.timeline()
      .set(el, { scaleX: 0, transformOrigin: 'left center', visibility: 'visible' })
      .to(el, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' })
      .call(() => {
        navigate(path)
        window.scrollTo(0, 0)
      })
      .set(el, { transformOrigin: 'right center' })
      .to(el, { scaleX: 0, duration: 0.45, ease: 'power2.inOut', delay: 0.1 })
      .set(el, { visibility: 'hidden' })
  }

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#111',
          zIndex: 9999,
          visibility: 'hidden',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used within TransitionProvider')
  return ctx
}
