const Footer = () => {
  const navLinks = [
    {
      title: 'Shop',
      links: [{ label: 'All nations', href: '#nations' }, { label: 'Home kits', href: '#' }, { label: 'Away kits', href: '#' }, { label: 'Accessories', href: '#' }],
    },
    {
      title: 'Support',
      links: [{ label: 'Size guide', href: '#' }, { label: 'Shipping info', href: '#' }, { label: 'Returns', href: '#' }, { label: 'Contact', href: '#' }],
    },
    {
      title: 'Company',
      links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }, { label: 'Partners', href: '#' }],
    },
  ];

  return (
    <>
    {/* footer: background:#111, padding: 64px 40px 32px → pt-16 px-10 pb-8
       mobile: padding: 48px 24px 28px → md:pt-16 md:px-10 md:pb-8 */}
    <footer className="footer flex items-center justify-center  pt-16 px-6 pb-4 md:pt-16 md:px-10 md:pb-4">

      {/* inner: max-width:1100px, margin:0 auto */}
      <div className="m-1 w-full p-[28px_30px]  bg-[#f4f4f2] drop-shadow-xs rounded-b-lg  mx-auto"> {/* bg-[#e7e6e6e7]*/}

        {/* top: grid 1fr 2fr, gap:64px, mb:48px, pb:48px, border-bottom:#222
            mobile: single column, gap:40px */}
        <div className="grid grid-cols-1 gap-10 mb-1 pb-12 border-b border-[#979797]  md:grid-cols-[1fr_2fr] md:gap-16">

          {/* brand: flex col, gap:16px */}
          <div className="flex flex-col gap-4">

            {/* logo: flex, items-center, gap:8px, Bebas Neue 22px, tracking wide, white */}
            <div className="flex items-center gap-2 font-['Bebas_Neue'] text-[26px] tracking-[2px] text-[#333]">
              {/* logoDot: 10px circle, white bg */}
              <span className="inline-block w-[10px] h-[10px] rounded-full bg-[#333] shrink-0" />
              Cupwear
            </div>

            {/* tagline: text-[14px], color:#555, DM Sans, leading-relaxed */}
            <p className="text-[14px] text-[#555] font-['DM_Sans'] leading-relaxed">
              The official kit destination for the<br />
              2026 FIFA World Cup™
            </p>
          </div>

          {/* linksGrid: grid 3 cols, gap:32px — mobile: 2 cols */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {navLinks.map((col) => (
              /* linkCol: flex col, gap:10px */
              <div key={col.title} className="flex flex-col gap-[10px]">

                {/* colTitle: text-[12px], white, DM Sans medium, tracking wide, uppercase, mb:4px */}
                <p className="text-[16px] text-[#333] font-['DM_Sans'] font-medium tracking-[1px] uppercase mb-1">
                  {col.title}
                </p>

                {col.links.map((link) => (
                  /* linkCol a: text-[13px], color:#555, DM Sans, no underline, transition color 0.15s
                     hover: color:#ccc */
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-[#555] font-['DM_Sans'] no-underline transition-colors duration-150 hover:text-[#ccc]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* bottom: flex, items-center, justify-between, flex-wrap, gap:12px */}
        <div className="flex items-center justify-between flex-wrap gap-3">

          {/* copy: text-[13px], color:#444, DM Sans */}
          <p className="text-[13px] text-[#444] font-['DM_Sans']">
            © 2026 Cupwear. Not officially affiliated with FIFA.
          </p>

          {/* legal: flex, gap:20px */}
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              /* legal a: text-[13px], color:#444, DM Sans, no underline, transition, hover:#ccc */
              <a
                key={item}
                href="#"
                className="text-[13px] text-[#444] font-['DM_Sans'] no-underline transition-colors duration-150 hover:text-[#ccc]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
    </>
  );
};

export default Footer;