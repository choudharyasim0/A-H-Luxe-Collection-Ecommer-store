import { useState, useEffect } from 'react'
import Art from './Art.jsx'
import { fmt } from '../data/products.js'
import { whatsappUrl } from '../data/store.js'

export default function QuickBuy({ p, t, lang, onClose, addToCart, settings }) {
  const [c, setC] = useState(0); const [q, setQ] = useState(1); const [shown, setShown] = useState(null)
  useEffect(() => { if (p) { setShown(p); setC(0); setQ(1) } }, [p])
  useEffect(() => { if (!p) return; const k = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown',k); document.body.style.overflow='hidden'; return () => { window.removeEventListener('keydown',k); document.body.style.overflow='' } }, [p,onClose])
  const x=shown; const colors=x?.colors?.length ? x.colors : ['#111111']; const msg=x ? `Hello A&H Luxe, I have a question about ${x.name}. Could you please help?` : ''
  return <div className={`modal-bg ${p ? 'open' : ''}`} onClick={onClose} aria-hidden={!p}>{x && <div className="modal" role="dialog" aria-modal="true" aria-label={x.name} onClick={e=>e.stopPropagation()}>
    <button className="modal__x" onClick={onClose} aria-label={t.close}>×</button><div className="modal__img">{x.image ? <img src={x.image} alt={x.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <Art type={x.type} color={colors[c]}/>}</div>
    <div className="modal__body"><span className="eyebrow">{t.quick}</span><h3>{x.name}</h3><p className="card__line">{x.description || x.line?.[lang] || ''}</p><div className="price"><b>{fmt(Number(x.price)*q)}</b>{Number(x.was)>Number(x.price) && <s>{fmt(Number(x.was)*q)}</s>}</div><div className="swatches">{colors.map((col,k)=><button key={typeof col==='string'?col:col.hex} className={k===c?'on':''} style={{background:typeof col==='string'?col:col.hex}} onClick={()=>setC(k)} aria-label={`Colour ${typeof col==='string'?col:col.name}`}/>)}</div><div className="qty" aria-label={t.qty}><button onClick={()=>setQ(Math.max(1,q-1))}>−</button><span>{q}</span><button onClick={()=>setQ(q+1)}>+</button></div><div className="modal__trust">✓ {t.secure}</div><a className="btn btn--outline" href={whatsappUrl(settings.whatsapp,msg)} target="_blank" rel="noreferrer">Need Help? Chat on WhatsApp</a><button className="btn btn--primary" onClick={()=>{const selected=colors[c];addToCart(x,typeof selected==='string'?selected:selected.name,q);onClose()}}>{t.add}</button></div>
  </div>}</div>
}
