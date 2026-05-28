import type { ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../footer/Footer'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="app">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
