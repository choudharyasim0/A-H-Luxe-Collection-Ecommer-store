import { whatsappUrl } from '../data/store.js'

export default function Footer({ t, settings }) {
  const f = t.footer
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div><div className="logo">A&amp;H <span>Luxe</span></div><p>{f.tag}</p></div>
          <div><h4>{f.q}</h4>{[['/', t.nav.home], ['/category/mens', t.nav.men], ['/category/womens', t.nav.women], ['/category/accessories', t.nav.acc], ['/category/watches', t.nav.best]].map(([h, l]) => <a key={l} href={h}>{l}</a>)}</div>
          <div><h4>Customer Support</h4><a href="/track-order">Track Your Order</a><p>{f.addr}</p><a href={`mailto:${settings.email}`}>{settings.email}</a><a href={whatsappUrl(settings.whatsapp,'')} dir="ltr">WhatsApp: +{settings.whatsapp}</a></div>
          <div><h4>{f.f}</h4><div className="social">{Object.entries(settings.social).map(([s,url]) => <a key={s} href={url} target="_blank" rel="noreferrer">{s}</a>)}</div><a className="btn btn--primary" href="/admin" aria-label="Open Admin Panel login" style={{ display:'inline-flex',width:'auto',marginTop:16,padding:'12px 22px',fontSize:'.9rem',letterSpacing:'.04em' }}>Admin Panel Login</a></div>
        </div>
        <div className="footer__bottom">© {new Date().getFullYear()} A&amp;H Luxe Collection. {f.rights}</div>
      </div>
    </footer>
  )
}
