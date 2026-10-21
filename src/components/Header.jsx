import { useState, useEffect } from 'react'
import { whatsappUrl } from '../data/store.js'
import { brands, brandSlug } from '../data/products.js'

const Svg = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
const accKeys = ['wallets', 'rings', 'bracelets', 'chains', 'caps']
const brandNames = brands.map(brand => brand.n)

export default function Header({ t, lang, setLang, cart, openCart, settings, onSearch }) {
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % t.announce.length), 4000); return () => clearInterval(id) }, [t])
  const n = t.nav
  return <>
    {settings.announcementEnabled && <div className="announce"><span className="announce__msg" key={i} dangerouslySetInnerHTML={{ __html: settings.announcement || t.announce[i] }} /><a href={whatsappUrl(settings.whatsapp,'')} target="_blank" rel="noreferrer">{t.track} &rarr;</a></div>}
    <header className="header"><div className="container header__row">
      <button className="icon-btn burger" aria-label={t.menu} onClick={() => setOpen(true)}><Svg d="M3 6h18M3 12h18M3 18h18" /></button>
      <a href="/" className="logo">A&amp;H <span>Luxe</span></a>
      <nav className="nav" aria-label="Main"><a href="/">{n.home}</a>
        <div className="dropdown"><button className="nav__trigger">{n.brands} &darr;</button><div className="dropdown__menu">{brandNames.map(b => <a key={b} href={`/brand/${brandSlug(b)}`}>{b}</a>)}</div></div>
        <a href="/category/mens">{n.men}</a><a href="/category/womens">{n.women}</a>
        <div className="dropdown"><button className="nav__trigger">{n.acc} &darr;</button><div className="dropdown__menu">{accKeys.map(k => <a key={k} href={`/category/${k}`}>{t.accItems[k]}</a>)}</div></div>
        <a href="/category/watches">{n.fresh}</a><a href="/category/watches">{n.best}</a><a href="/category/couples">{n.couples}</a>
      </nav>
      <div className="tools"><label className="search"><Svg d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" size={16} /><input placeholder={t.search} aria-label={t.search} style={{ marginInline: 8 }} onChange={e => onSearch(e.target.value)} /></label>
        <button className="icon-btn lang" onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} aria-label="Language">{t.lang}</button>
        <button className="icon-btn" aria-label={t.cart} onClick={openCart}><Svg d="M6 6h15l-1.5 9h-12zM6 6L5 2H2M9 20a1 1 0 1 0 0 .01M18 20a1 1 0 1 0 0 .01" />{cart > 0 && <span className="badge-dot">{cart}</span>}</button>
      </div>
    </div></header>
    <div className={`drawer-bg ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
    <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}><a href="/" className="logo" onClick={() => setOpen(false)}>A&amp;H <span>Luxe</span></a>
      {[["/", n.home], ['/category/mens', n.men], ['/category/womens', n.women], ['/category/watches', n.fresh], ['/category/couples', n.couples]].map(([h,l]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
      <h4>{n.brands}</h4>{brandNames.map(b => <a key={b} href={`/brand/${brandSlug(b)}`} onClick={() => setOpen(false)}>{b}</a>)}<h4>{n.acc}</h4>{accKeys.map(k => <a key={k} href={`/category/${k}`} onClick={() => setOpen(false)}>{t.accItems[k]}</a>)}
    </aside>
  </>
}
