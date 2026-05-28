import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'
import Container from '../layout/Container'
import { usePageTransition } from '../../contexts'

const NAV_LINKS = [
  { label: 'Shop', href: '/#shop', route: false },
  { label: 'Nations', href: '/#nations', route: false },
  { label: 'Pricing', href: '/#pricing', route: false },
  { label: 'About', href: '/about', route: true },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { navigateTo } = usePageTransition()
  const location = useLocation()

  function handleLinkClick(e: React.MouseEvent, link: (typeof NAV_LINKS)[number]) {
    if (link.route) {
      e.preventDefault()
      setMenuOpen(false)
      navigateTo(link.href)
    }
  }

  function handleLogoClick() {
    setMenuOpen(false)
    navigateTo('/')
  }

  return (
    <header className="relative z-10 py-4 md:py-5">
      <Container>
        <nav className={styles.nav}>
          <div
            className={styles.logo}
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.logoDot} />
            Cupwear
          </div>

          <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`${styles.link} ${location.pathname === link.href ? styles.active : ''}`}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button className={styles.btnGhost}>Sign in</button>
            <button className={styles.btnPrimary}>Get yours</button>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </Container>
    </header>
  )
}
