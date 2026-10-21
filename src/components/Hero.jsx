import { useState, useEffect, useRef } from 'react'
import { whatsappUrl } from '../data/store.js'

// Full-bleed background clips. Each cross-fades in over 1s. `pos` keeps the watch clear of the left-aligned copy.
const CLIPS = [
  { src: '/hero-video-1.mp4', poster: '/hero-poster-1.jpg', pos: '30% 50%' },
  { src: '/hero-video-2.mp4', poster: '/hero-poster-2.jpg', pos: '60% 50%' },
  { src: '/hero-video-3-wide.mp4', poster: '/hero-poster-3.jpg', pos: '72% 50%' },
]
const SLIDE_MS = 7000

const Words = ({ text, em }) => text.split(' ').filter(Boolean).map((w, k) => <span className="word" key={k}><i className={em ? 'em' : ''} style={{ '--i': k + (em ? 3 : 0) }}>{w}&nbsp;</i></span>)

export function Dial() {
  return (
    <div className="dial" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="46" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="40" strokeWidth=".5" strokeDasharray="1 2.6" />
        {[...Array(12)].map((_, i) => <line key={i} x1="50" y1="6" x2="50" y2={i % 3 ? 10 : 13} strokeWidth={i % 3 ? 1 : 1.8} transform={`rotate(${i * 30} 50 50)`} />)}
        <g className="sweep"><line x1="50" y1="50" x2="50" y2="12" strokeWidth="1" /><circle cx="50" cy="12" r="2" fill="currentColor" /></g>
      </svg>
    </div>
  )
}

export default function Hero({ t, settings }) {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(-1)
  const vids = useRef([])
  const slides = t.hero.slides

  useEffect(() => { const id = setTimeout(() => setI((x) => (x + 1) % CLIPS.length), SLIDE_MS); return () => clearTimeout(id) }, [i])

  const last = useRef(0)
  useEffect(() => { if (last.current !== i) setPrev(last.current); last.current = i }, [i])

  // restart the clip that is fading in so every cycle begins at its first frame; keep the others primed
  useEffect(() => {
    vids.current.forEach((v, k) => {
      if (!v) return
      if (k === i) { try { v.currentTime = 0 } catch {} }
      v.play().catch(() => {})
    })
  }, [i])

  const s = slides[i % slides.length]
  const clips = CLIPS.map((clip,k) => ({ ...clip, src: settings.hero.videos?.[k] || clip.src, poster: settings.hero.posters?.[k] || clip.poster }))
  const headline = settings.hero.headline ? [settings.hero.headline, ''] : s.h
  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        {clips.map((c, k) => (
          <video key={c.src} ref={(el) => (vids.current[k] = el)} className={`hero__vid ${k === i ? 'is-active' : k === prev ? 'is-prev' : ''}`}
            src={c.src} poster={c.poster} style={{ objectPosition: c.pos }}
            autoPlay loop muted playsInline preload="auto" />
        ))}
      </div>
      <div className="hero__overlay" />
      <div className="hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">{settings.hero.eyebrow || t.hero.eyebrow}</span>
          <h1 className="hero__tag" key={i}><span><Words text={headline[0]} /><Words text={headline[1]} em /></span></h1>
          <p className="hero__sub" key={'s' + i}>{settings.hero.subheading || s.s}</p>
          <div className="hero__cta">
            <a href="#trending" className="btn btn--primary pulse">{t.hero.cta1}</a>
            <a href={whatsappUrl(settings.whatsapp,t.waMsg)} target="_blank" rel="noreferrer" className="btn btn--wa pulse">{t.hero.cta2}</a>
          </div>
          <div className="hero__dots">{CLIPS.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}><span key={i} style={k === i ? { animationDuration: `${SLIDE_MS}ms` } : undefined} /></button>)}</div>
        </div>
      </div>
    </section>
  )
}
