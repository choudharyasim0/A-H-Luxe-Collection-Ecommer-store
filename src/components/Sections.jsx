import { useState, useEffect, useRef } from 'react'
import Art, { Icon } from './Art.jsx'
import { Dial } from './Hero.jsx'
import { brands, reviews, fmt, brandSlug } from '../data/products.js'

const trustIcons = ['M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0 .01M17 19a1.5 1.5 0 1 0 0 .01', 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5zM8.5 12l2.5 2.5L16 9.5', 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5', 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z']

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.15 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return ref
}
function Reveal({ as: T = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  return <T ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}s` }} {...rest}>{children}</T>
}
function Head({ d }) { return <Reveal className="section-head"><span className="eyebrow">{d.e}</span><h2>{d.h}</h2><p>{d.p}</p></Reveal> }

function Trust({ t }) {
  return (
    <section className="trust"><div className="container trust__grid">
      {t.trust.map((x, i) => (
        <Reveal className="trust__card" key={i} tabIndex={0} delay={i * 0.1}>
          <div className="trust__ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={trustIcons[i]} /></svg></div>
          <h3>{x.t}</h3><p>{x.d}</p>
          <div className="whisper">{x.w}</div>
        </Reveal>
      ))}
    </div></section>
  )
}

function Card({ p, lang, t, addToCart, onQuick, i, settings }) {
  const [c, setC] = useState(0)
  const [fav, setFav] = useState(false)
  const colors = p.colors?.length ? p.colors : ['#111111']
  const image = p.images?.[0] || p.image
  const pct = p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0
  return (
    <Reveal as="article" className="card" role="link" tabIndex={0} onClick={e => { if (!e.target.closest('button,a')) window.location.href = `/product/${p.id}` }} onKeyDown={e => { if (e.key === 'Enter' && !e.target.closest('button,a')) window.location.href = `/product/${p.id}` }} delay={(i % 4) * 0.08}>
      <div className="card__img">
        {image ? <img src={image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Art type={p.type} color={colors[c]} />}
        {settings.badgesEnabled && pct > 0 && <span className="card__disc">-{pct}% {t.off}</span>}
        <button className={`card__heart ${fav ? 'on' : ''}`} onClick={() => setFav(!fav)} aria-label="Wishlist" aria-pressed={fav}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" /></svg>
        </button>
      </div>
      <div className="card__body">
        <h3><a href={`/product/${p.id}`}>{p.name}</a></h3>
        {p.brand&&<a className="eyebrow" href={`/brand/${brandSlug(p.brand)}`}>{p.brand}</a>}
        <p className="card__line">{p.description || p.line?.[lang] || ''}</p>
        <div className="price"><b>{fmt(Number(p.price))}</b>{Number(p.was || p.price) > Number(p.price) && <s>{fmt(Number(p.was || p.price))}</s>}</div>
        <div className="swatches">{colors.map((col, k) => <button key={col} className={k === c ? 'on' : ''} style={{ background: col }} onClick={() => setC(k)} aria-label={`Colour ${k + 1}`} />)}</div>
        <div className="card__btns">
          <button className="btn btn--outline" onClick={() => addToCart(p,colors[c])}>{t.add}</button>
          <button className="btn btn--primary" onClick={() => onQuick(p)}>{t.quick}</button>
        </div>
      </div>
    </Reveal>
  )
}

function Trending({ t, lang, addToCart, onQuick, products, settings }) {
  return (
    <section className="section" id="trending"><div className="container">
      <Head d={t.trending} />
      <div className="grid-4">{products.map((p, i) => <Card key={p.id} i={i} p={p} lang={lang} t={t} addToCart={addToCart} onQuick={onQuick} settings={settings} />)}</div>
    </div></section>
  )
}

function Brands({ t, lang }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    const el = ref.current; if (!el) return
    const step = el.firstChild.offsetWidth + 18
    const end = Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 4
    if (dir > 0 && end) el.scrollTo({ left: 0 }); else el.scrollBy({ left: dir * step * (lang === 'ur' ? -1 : 1) })
  }
  useEffect(() => { const id = setInterval(() => scroll(1), 3500); return () => clearInterval(id) })
  return (
    <section className="section section--pearl" id="brands"><div className="container">
      <Head d={t.brands} />
      <div className="brands">
        <button className="arrow arrow--prev" onClick={() => scroll(-1)} aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 5l-7 7 7 7" /></svg></button>
        <div className="brands__track" ref={ref}>{brands.map((b) => <a href={`/brand/${brandSlug(b.n)}`} className="brand" key={b.n}><b>{b.n}</b><span>{b.s[lang]}</span></a>)}</div>
        <button className="arrow arrow--next" onClick={() => scroll(1)} aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <div className="center"><a href="#trending" className="btn btn--outline">{t.brands.all}</a></div>
    </div></section>
  )
}

function Collections({ t, settings }) {
  const items = [['men', 'banner--men', false], ['women', 'banner--women', true]]
  return (
    <section className="section"><div className="container split">
      {items.map(([k, cls, w]) => (
        <Reveal as="a" key={k} id={k} href={`/category/${k === 'men' ? 'mens' : 'womens'}`} className={`banner ${cls}`} style={(settings.collectionCards?.[k === 'men' ? 'mens' : 'womens'] || settings.banners?.[k === 'men' ? 'mens' : 'womens']) ? { backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.65),rgba(0,0,0,.08)),url("${settings.collectionCards?.[k === 'men' ? 'mens' : 'womens'] || settings.banners?.[k === 'men' ? 'mens' : 'womens']}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} delay={k === 'women' ? .15 : 0}>
          <svg className="art" viewBox="0 0 200 200"><g transform="translate(0 0)"><rect x="82" y="8" width="36" height="184" rx="14" fill="#fff" opacity=".18" /><circle cx="100" cy="100" r={w ? 46 : 54} fill="#fff" opacity=".95" /><circle cx="100" cy="100" r={w ? 38 : 45} fill="#0d3b66" />{[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => { const a = i * Math.PI / 6, r1 = w ? 31 : 38, r2 = w ? 35 : 42; return <line key={i} x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)} x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)} stroke="#fff" strokeWidth="2" /> })}<line x1="100" y1="100" x2="100" y2="74" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /><line x1="100" y1="100" x2="118" y2="110" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g></svg>
          <div><span className="eyebrow" style={{ color: '#9fc0f5' }}>{t.cols[k].e}</span><h3>{t.cols[k].h}</h3><p>{t.cols[k].p}</p><span className="btn btn--ghost">{t.cols[k].c}</span></div>
        </Reveal>
      ))}
    </div></section>
  )
}

function HomePromotion({ settings }) {
  const image=settings.promotionalBanners?.home
  return image ? <section className="section" aria-label="Home page promotion"><div className="container"><img src={image} alt="A&H Luxe promotion" style={{display:'block',width:'100%',maxHeight:420,objectFit:'cover',borderRadius:'var(--radius-lg)'}} /></div></section> : null
}

function Showcase({ t }) {
  return (
    <section className="section section--pearl"><div className="container">
      <Head d={t.vids} />
      <div className="vids">
        {t.vids.caps.map((c, i) => { const v = [['/hero-video-1.mp4','/hero-poster-1.jpg'],['/hero-video-2.mp4','/hero-poster-2.jpg'],['/hero-video-v2.mp4','/hero-poster.jpg']][i]; return (
          <Reveal as="figure" className="vid" key={i} delay={i * 0.12}><Dial /><video src={v[0]} poster={v[1]} autoPlay loop muted playsInline preload="metadata" /><figcaption>{c}</figcaption></Reveal>
        ) })}
      </div>
    </div></section>
  )
}

function Accessories({ t, settings }) {
  return (
    <section className="section" id="accessories"><div className="container">
      <Head d={t.acc} />
      <div className="acc">{t.acc.items.map((x, i) => <Reveal as="a" href={`/category/${x.k}`} className="acc__tile" key={x.k} style={settings.categoryImages[x.k] ? { backgroundImage: `linear-gradient(0deg,rgba(255,255,255,.85),rgba(255,255,255,.25)),url("${settings.categoryImages[x.k]}")`, backgroundSize:'cover', backgroundPosition:'center' } : undefined} delay={i * 0.08}><Icon k={x.k} /><h4>{x.t}</h4><p>{x.d}</p></Reveal>)}</div>
    </div></section>
  )
}

function Reviews({ t, lang }) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % reviews.length), 6000); return () => clearInterval(id) }, [])
  const dir = -1
  return (
    <section className="section section--pearl"><div className="container">
      <Head d={t.rev} />
      <div className="reviews">
        <div className="rev__track" style={{ transform: `translateX(${dir * i * 100}%)`, direction: 'ltr' }}>
          {reviews.map((r) => (
            <div className="rev" key={r.name} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
              <div>
                <div className="stars" aria-label="5 stars">★★★★★</div>
                <blockquote>“{r.text[lang]}”</blockquote>
                <div className="rev__who"><div className="avatar">{r.name[0]}</div><div><b>{r.name}</b> · {r.city}<div className="verified"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2 3.1-.3 1 3 2.7 1.6-.8 3 .8 3-2.7 1.6-1 3-3.1-.3L12 22l-2.4-2-3.1.3-1-3L2.8 15.7l.8-3-.8-3L5.5 8l1-3 3.1.3z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none"/></svg>{t.rev.v}</div></div></div>
              </div>
              <div className="wa-shot" aria-label="WhatsApp order screenshot">
                <div className="head">● WhatsApp</div>
                <div className="bubble">{r.chat[lang][0]}<small>11:42</small></div>
                <div className="bubble me">{r.chat[lang][1]}<small>11:43 ✓✓</small></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rev__nav">{reviews.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} />)}</div>
      </div>
    </div></section>
  )
}

export default function Sections(props) {
  return <><Trust t={props.t} /><Trending {...props} /><Brands {...props} /><Collections t={props.t} settings={props.settings} /><HomePromotion settings={props.settings} /><Showcase t={props.t} /><Accessories t={props.t} settings={props.settings} /><Reviews {...props} /></>
}
