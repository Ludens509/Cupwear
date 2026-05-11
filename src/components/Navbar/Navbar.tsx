import { useState } from "react";
import styles from "./Navbar.module.css";


export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
       <nav className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.logoDot} />
        Cupwear
      </div>
 
      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {['Shop', 'Nations', 'Pricing', 'About'].map((link) => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} className={styles.link}>
              {link}
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
  


    
    {/* <nav className="flex items-center justify-between p-[18px_40px] relative z-10">
      <div className="flex items-center gap-2 font-[Bebas_Neue,Sans_Serif] tracking-[2px] text-[#111] text-[22px]">
        <span className="inline-block w-2.5 h-2.5 bg-[#111] rounded-[50%]"/>
        Cupwear
      </div>
      <ul className={`flex gap-7 list-none m-0 p-0 sm:hidden sm:absolute sm:top-16 sm:left-0 sm:right-0 sm:bg-[#f0f0ee] sm:flex-col sm:p-[16px_40px] sm:gap-4 sm:border-t sm:border-solid sm:border-[#ddd]  ${menuOpen ? "sm:flex" :''}`}>
         {['Shop', 'Nations', 'Pricing', 'About'].map((link) => (
        <li key={link}>
          <a href={`#${link.toLowerCase()}`} className="text-[13px] text-[#555] tracking-[0.5px] no-underline transition-colors duration-200">
            {link}
          </a>
        </li>
         ))}
      </ul>

      <div className="flex gap-10 items-center">
        <button className="bg-transparent border-solid border-[#bbb] rounded-[999px] p-[8px_20px] text-[13px] font-[DM_Sans,sans-serif] text-[#333] cursor-pointer transition-colors duration-200 hover:border-[#555] hover:text-[#111]">Sign in</button>
        <button className="bg-[#111] text-white border-none rounded-[999px] p-[8px_20px] text-[13px] font-[DM_Sans,sans-serif] cursor-pointer transition duration-200 ease-linear will-change-transform hover:bg-[#333] hover:scale-[1.02]">Get yours</button>
      </div>

      <button
        className="hidden flex-col gap-5 bg-none border-none cursor-pointer p-1"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span className="block w-5.5 h-0.5 bg-[#111] rounded-xs"/>
        <span className="block w-5.5 h-0.5 bg-[#111] rounded-xs"/>
        <span className="block w-5.5 h-0.5 bg-[#111] rounded-xs"/>
      </button>
    </nav> */}
      </>
  );
}
