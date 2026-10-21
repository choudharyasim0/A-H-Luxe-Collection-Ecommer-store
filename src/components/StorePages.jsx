import { useState, useEffect } from 'react'
import Art from './Art.jsx'
import { fmt, brands as knownBrands, brandSlug } from '../data/products.js'
import { categoryOf, whatsappUrl, KEYS, read, getSettings } from '../data/store.js'

const normalizeHex = value => /^#[\da-f]{6}$/i.test(value||'') ? value : '#111111'
const productColors = product => (Array.isArray(product?.colors)?product.colors:[]).map((color,index)=>typeof color==='string'?{name:color.startsWith('#')?`Color ${index+1}`:color,hex:normalizeHex(color),image:product.colorImages?.[index]||''}:{name:color.name||`Color ${index+1}`,hex:normalizeHex(color.hex||color.color),image:color.image||product.colorImages?.[index]||''})

function Card({ p, onAdd, settings }) {
  const colors = productColors(p)
  const [colorIndex, setColorIndex] = useState(0)
  const retail = Number(p.was || p.price)
  const sale = Number(p.price)
  const pct = retail > sale ? Math.round((1 - sale / retail) * 100) : 0
  const image = p.images?.[0] || p.image
  return <article className="card" role="link" tabIndex={0} onClick={e => { if (!e.target.closest('button,a')) window.location.href = `/product/${p.id}` }} onKeyDown={e => { if (e.key === 'Enter' && !e.target.closest('button,a')) window.location.href = `/product/${p.id}` }}>
    <a className="card__img" href={`/product/${p.id}`}>{image ? <img src={image} alt={p.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} /> : <Art type={p.type || 'watch'} color={colors[colorIndex]?.hex||'#111111'} />}{settings.badgesEnabled && pct > 0 && <span className="card__disc">-{pct}% OFF</span>}</a>
    <div className="card__body"><a href={`/product/${p.id}`}><h3>{p.name}</h3></a>{p.brand&&<a className="eyebrow" href={`/brand/${brandSlug(p.brand)}`} onClick={e=>e.stopPropagation()}>{p.brand}</a>}<p className="card__line">{p.description || p.line?.en || ''}</p><div className="price"><b>{fmt(sale)}</b>{retail > sale && <s>{fmt(retail)}</s>}</div><div className="swatches">{colors.map((variation,index) => <button key={`${variation.hex}-${index}`} className={colorIndex === index ? 'on' : ''} style={{ background:variation.hex }} onClick={() => setColorIndex(index)} aria-label={`Colour ${variation.name}`} title={variation.name} />)}</div><div className="card__btns"><button className="btn btn--outline" onClick={() => onAdd(p,colors[colorIndex]?.name||'')}>Add to Cart</button><a className="btn btn--primary" href={`/product/${p.id}`}>View</a></div></div>
  </article>
}

export function CategoryPage({ slug, products, settings, onAdd }) {
  const [activeSettings,setActiveSettings] = useState(settings)
  useEffect(() => setActiveSettings(settings),[settings])
  useEffect(() => {
    const syncMedia = () => setActiveSettings(getSettings())
    window.addEventListener('site_media_updated',syncMedia)
    window.addEventListener('storage',syncMedia)
    window.addEventListener('ahluxe:storage',syncMedia)
    return () => { window.removeEventListener('site_media_updated',syncMedia); window.removeEventListener('storage',syncMedia); window.removeEventListener('ahluxe:storage',syncMedia) }
  },[])
  const filtered = slug === 'search' ? products : products.filter(p => categoryOf(p) === slug || (slug === 'mens' && categoryOf(p) === 'watches') || (slug === 'accessories' && ['wallets','chains','caps','bracelets','rings'].includes(categoryOf(p))))
  const defaults={mens:{title:"Men's Luxury Quartz & Chronograph Watches in Pakistan",description:'Shop men’s watches with nationwide Cash on Delivery. Delivery in 3–5 days to Faisalabad, Lahore, Karachi and across Pakistan. Check each product for warranty details.'},womens:{title:"Women's Watches & Gifts in Pakistan",description:'Explore women’s watches and gift styles with nationwide Cash on Delivery and 3–5 day delivery across Pakistan.'},accessories:{title:'Gents Bracelets, Chains & Accessories Collection',description:'Shop gents bracelets, chains, wallets and accessories with nationwide delivery in 3–5 days.'},couples:{title:'Premium Matching Couple Watches for Wedding & Anniversary Gifts',description:'Discover matching couple watches for wedding and anniversary gifts. Nationwide COD and 3–5 day delivery across Pakistan.'},watches:{title:'Quartz & Chronograph Watches in Pakistan',description:'Browse A&H Luxe watches with nationwide COD and 3–5 day delivery. Warranty details are listed on each product.'}}
  const copy=activeSettings.seo?.categories?.[slug]||defaults[slug]
  const title = slug === 'search' ? 'Search Results' : copy?.title||slug.replace(/-/g, ' ').replace(/\b\w/g, s => s.toUpperCase())
  const description=slug==='search'?'Browse matching A&H Luxe watches and accessories.':copy?.description||`Browse ${title} at A&H Luxe. Nationwide Cash on Delivery across Pakistan.`
  const categoryImage=activeSettings.categoryImages?.[slug] || activeSettings.categoryImages?.[slug==='mens'?'men':slug==='womens'?'women':''] || (['mens','watches'].includes(slug)?activeSettings.promotionalBanners?.categoryHeader:'') || activeSettings.banners?.[slug]
  useEffect(()=>{document.title=`${title} | A&H Luxe`;let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}meta.content=description},[title,description])
  return <main className="section"><div className="container">{categoryImage && <img src={categoryImage} alt={`${title} collection`} style={{ width:'100%',maxHeight:380,objectFit:'cover',borderRadius:'var(--radius-lg)',marginBottom:28 }} />}<div className="section-head"><span className="eyebrow">A&amp;H Luxe Collection · Nationwide COD</span><h1>{title}</h1><p>{description}</p><p>{filtered.length} products</p></div><div className="grid-4">{filtered.map(p => <Card key={p.id} p={p} settings={activeSettings} onAdd={onAdd} />)}</div>{!filtered.length && <p className="center">No products in this category yet.</p>}</div></main>
}

export function BrandPage({ slug, products, settings, onAdd }) {
  const filtered=products.filter(product=>brandSlug(product.brand)===slug)
  const brandName=knownBrands.find(brand=>brandSlug(brand.n)===slug)?.n||filtered[0]?.brand||slug.split('-').map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ')
  const description=`Browse ${brandName} watches and products currently listed by A&H Luxe. Product details and available variations are shown on each item.`
  useEffect(()=>{document.title=`${brandName} Watches & Products | A&H Luxe`;let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}meta.content=description},[brandName,description])
  return <main className="section"><div className="container"><div className="section-head"><span className="eyebrow">Shop by Brand</span><h1>{brandName}</h1><p>{description}</p><p>{filtered.length} products</p></div><div className="grid-4">{filtered.map(product=><Card key={product.id} p={product} settings={settings} onAdd={onAdd}/>)}</div>{!filtered.length&&<p className="center">No {brandName} products are currently listed. <a href="/category/watches">Browse all watches</a>.</p>}</div></main>
}

export function ProductPage({ product, settings, onAdd }) {
  const colors = productColors(product)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [photo, setPhoto] = useState(0)
  useEffect(() => {
    if (!product) return
    const title = product.metaTitle || `${product.name} | A&H Luxe Pakistan`
    const baseDescription=product.shortDescription||product.description||`${product.name} from A&H Luxe.`
    const description = product.metaDescription || `${baseDescription} Nationwide COD · ${product.deliveryTime||'3–5 day delivery'} · ${product.warranty||'See product listing for warranty details'}.`
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = description
    const schema = { '@context':'https://schema.org', '@graph':[{ '@type':'Product', name:product.name, description, image:(product.images?.length?product.images:product.image?[product.image]:[]), sku:product.sku||undefined, brand:product.brand?{'@type':'Brand',name:product.brand}:undefined, offers:{'@type':'Offer',priceCurrency:'PKR',price:Number(product.price),availability:product.stockStatus==='Out of Stock'?'https://schema.org/OutOfStock':'https://schema.org/InStock'} }, ...(product.faqs?.length?[{'@type':'FAQPage',mainEntity:product.faqs.map(faq=>({'@type':'Question',name:faq.question,acceptedAnswer:{'@type':'Answer',text:faq.answer}}))}]:[])] }
    let script = document.getElementById('product-jsonld')
    if (!script) { script=document.createElement('script');script.id='product-jsonld';script.type='application/ld+json';document.head.appendChild(script) }
    script.textContent=JSON.stringify(schema)
    return () => { document.getElementById('product-jsonld')?.remove() }
  }, [product])
  if (!product) return <main className="section container"><h1>Product not found</h1><a className="btn btn--outline" href="/">Back to store</a></main>

  const color = colors[colorIndex] || {name:'',hex:'#111111',image:''}
  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const variationImage = color.image || product.colorImages?.[colorIndex]
  const activeImage = variationImage || images[Math.min(photo, images.length - 1)]
  const retail = Number(product.was || product.price)
  const sale = Number(product.price)
  const discount = retail > sale ? Math.round((1 - sale / retail) * 100) : 0
  const specifications = Array.isArray(product.specifications) ? product.specifications : product.specifications ? [product.specifications] : []
  const details = [
    ['Warranty', product.warranty || '1-Year Movement Warranty'],
    ['Movement', product.movement || 'Please contact us for movement details'],
    ['Dial size', product.dialSize || 'Please contact us for dial size'],
    ['Water resistance', product.waterResistance || 'Please contact us for water-resistance details'],
    ['Delivery', product.deliveryNotes || 'Cash on delivery available across Pakistan. Delivery timing is confirmed when your order is placed.'],
    ['Delivery timeframe', product.deliveryTime || '3-5 days COD'],
    ...(Number(product.shippingCost)>0?[['Shipping',`PKR ${Number(product.shippingCost).toLocaleString('en-PK')}`]]:[]),
    ...(product.weight? [['Weight',product.weight]]:[]), ...(product.dimensions?[['Dimensions',product.dimensions]]:[]),
  ]
  const productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`
  const message = `Hello A&H Luxe, I have a question about ${product.name}${color.name?` in ${color.name}`:''}. Could you please help? ${productUrl}`
  return <main className="section"><div className="container" style={{ display:'grid',gridTemplateColumns:'minmax(260px,1fr) minmax(280px,1fr)',gap:32,alignItems:'start' }}>
    <div><div className="card__img" style={{ margin:0,background:'#fff',minHeight:340 }}>{activeImage ? <img src={activeImage} alt={product.altText || `${product.name} in ${color.name||'standard color'}`} style={{ width:'100%',height:'100%',objectFit:'cover' }} /> : <Art type={product.type || 'watch'} color={color.hex} />}</div>{images.length > 1 && <div style={{ display:'flex',gap:8,overflowX:'auto',marginTop:10 }}>{images.map((src,i) => <button key={`${src}-${i}`} onClick={() => setPhoto(i)} aria-label={`View product photo ${i+1}`} style={{ width:72,height:72,flex:'0 0 72px',borderRadius:'var(--radius-sm)',overflow:'hidden',border:photo === i ? '2px solid var(--gold-deep)' : '1px solid var(--line)' }}><img src={src} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} /></button>)}</div>}</div>
    <div><span className="eyebrow">{categoryOf(product)}</span><h1 style={{ fontFamily:'var(--serif)',fontSize:'clamp(2rem,4vw,3rem)' }}>{product.name}</h1><p style={{margin:'8px 0 14px'}}>{product.shortDescription || product.description || product.line?.en || ''}</p><div style={{ display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',margin:'10px 0' }}>{product.brand&&<a className="eyebrow" href={`/brand/${brandSlug(product.brand)}`} style={{ border:'1px solid var(--line)',borderRadius:999,padding:'4px 10px' }}>{product.brand}</a>}{discount > 0 && settings.badgesEnabled && <span className="card__disc" style={{ position:'static' }}>-{discount}% OFF</span>}</div>
      <div className="price"><b>{fmt(sale)}</b>{retail > sale && <s>{fmt(retail)}</s>}</div>
      {colors.length>0&&<><h3 style={{ marginTop:12 }}>Color / strap</h3><div className="swatches">{colors.map((variation,index) => <button key={`${variation.hex}-${index}`} className={colorIndex === index ? 'on' : ''} style={{ background:variation.hex }} onClick={() => { setColorIndex(index); setPhoto(0) }} aria-label={`Select ${variation.name}`} title={variation.name} />)}</div><p>{color.name}</p></>}
      <div className="qty" style={{ margin:'16px 0' }}><button onClick={() => setQty(Math.max(1,qty-1))} aria-label="Decrease quantity">-</button><span>{qty}</span><button onClick={() => setQty(qty+1)} aria-label="Increase quantity">+</button></div><button className="btn btn--primary" style={{ width:'100%' }} onClick={() => onAdd(product,color.name||'',qty)}>Add to Cart</button><a className="btn btn--outline" style={{ width:'100%',marginTop:10 }} target="_blank" rel="noreferrer" href={whatsappUrl(settings.whatsapp,message)}>Need Help? Chat on WhatsApp</a>
    </div>
    <section style={{gridColumn:'1/-1',marginTop:24}}><h2 style={{fontFamily:'var(--serif)',marginBottom:12}}>Product details</h2>{product.fullDescription&&<div className="product-description" dangerouslySetInnerHTML={{__html:product.fullDescription}}/>}<h3 style={{marginTop:20}}>Technical specifications & delivery</h3><dl style={{display:'grid',gridTemplateColumns:'minmax(120px,.7fr) 1.3fr',gap:'8px 14px',margin:'10px 0 18px'}}>{details.map(([label,value])=><div key={label} style={{display:'contents'}}><dt style={{fontWeight:600}}>{label}</dt><dd>{value}</dd></div>)}</dl>{specifications.length>0&&<ul style={{paddingInlineStart:22,marginBottom:18}}>{specifications.map((s,i)=><li key={i}>{s}</li>)}</ul>}{product.faqs?.length>0&&<><h3>Frequently asked questions</h3>{product.faqs.map((faq,i)=><div key={i} style={{margin:'12px 0'}}><b>{faq.question}</b><p>{faq.answer}</p></div>)}</>}</section>
  </div></main>
}

const orderDigits = value => String(value || '').replace(/\D/g, '')
const phoneDigits = value => String(value || '').replace(/\D/g, '')
const trackingSteps = ['Pending / Processing', 'Shipped / In Transit', 'Completed / Delivered']

export function TrackOrderPage() {
  const params = new URLSearchParams(window.location.search)
  const [orderId, setOrderId] = useState(params.get('orderId') || '')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const lookup = () => {
    setSearched(true)
    setError('')
    const id = orderDigits(orderId)
    const customerPhone = phoneDigits(phone)
    if (!id || !customerPhone) { setOrder(null); setError('Enter both your Order ID and phone number.'); return }
    const orders = read(KEYS.orders, [])
    const match = (Array.isArray(orders) ? orders : []).find(item => orderDigits(item.id) === id && phoneDigits(item.customer?.phone) === customerPhone)
    setOrder(match || null)
    if (!match) setError('We could not find an order matching those details. Check the Order ID and phone number and try again.')
  }
  useEffect(() => {
    document.title = 'Track Your Order | A&H Luxe'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = 'Track your A&H Luxe order using your order reference and checkout phone number.'
  }, [])
  useEffect(() => {
    if (!searched) return
    const sync = () => {
      const id = orderDigits(orderId), customerPhone = phoneDigits(phone)
      const orders = read(KEYS.orders, [])
      const match = (Array.isArray(orders) ? orders : []).find(item => orderDigits(item.id) === id && phoneDigits(item.customer?.phone) === customerPhone)
      setOrder(match || null)
    }
    window.addEventListener('storage', sync)
    window.addEventListener('ahluxe:storage', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('ahluxe:storage', sync) }
  }, [searched, orderId, phone])
  const normalizedStatus = String(order?.status || 'Pending').toLowerCase()
  const stepIndex = normalizedStatus === 'completed' ? 2 : normalizedStatus === 'shipped' ? 1 : 0
  const statuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']
  return <main className="section"><div className="container" style={{maxWidth:820}}>
    <div className="section-head"><span className="eyebrow">A&amp;H Luxe Customer Support</span><h1>Track Your Order</h1><p>Enter the Order ID from your confirmation and the phone number used at checkout.</p></div>
    <form onSubmit={e=>{e.preventDefault();lookup()}} style={{background:'#fff',padding:22,border:'1px solid var(--line)',borderRadius:'var(--radius-lg)',marginBottom:22}}>
      <label style={{display:'grid',gap:6,marginBottom:12}}>Order ID<input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="#AH-78429" autoComplete="off" required style={{padding:'11px 12px',border:'1px solid var(--line)',borderRadius:'var(--radius-sm)',font:'inherit'}}/></label>
      <label style={{display:'grid',gap:6,marginBottom:14}}>Phone Number<input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" autoComplete="tel" placeholder="Phone used when placing the order" required style={{padding:'11px 12px',border:'1px solid var(--line)',borderRadius:'var(--radius-sm)',font:'inherit'}}/></label>
      <button className="btn btn--primary" type="submit">Track Order</button>{error&&<p role="alert" style={{color:'#842c2c',marginTop:12}}>{error}</p>}
    </form>
    {order&&<article style={{background:'#fff',padding:22,border:'1px solid var(--line)',borderRadius:'var(--radius-lg)'}}>
      <header style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',borderBottom:'1px solid var(--line)',paddingBottom:12}}><div><h2>Order {order.id}</h2><p>Placed {new Date(order.createdAt).toLocaleString()}</p></div><b aria-live="polite">Status: {statuses.includes(order.status)?order.status:'Pending'}</b></header>
      {normalizedStatus==='cancelled' ? <p role="status" style={{margin:'20px 0',color:'#842c2c',fontWeight:700}}>This order has been cancelled. Please contact support if you need help.</p> : <div aria-label="Order delivery progress" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,margin:'22px 0'}}>{trackingSteps.map((label,index)=><div key={label} style={{textAlign:'center',padding:'12px 6px',borderBottom:`4px solid ${index<=stepIndex?'var(--gold-deep)':'var(--line)'}`,color:index<=stepIndex?'var(--onyx)':'var(--muted)',fontWeight:index===stepIndex?700:500}}><span style={{display:'block',fontSize:'.82rem'}}>Step {index+1}</span>{label}</div>)}</div>}
      <h3>Items</h3>{order.items?.map((item,index)=><p key={`${item.productId}-${index}`}>{item.name}{item.color?` · ${item.color}`:''} × {item.quantity} — PKR {Number(item.lineTotal||0).toLocaleString('en-PK')}</p>)}
      <p><b>Delivery to:</b> {order.customer?.address}, {order.customer?.city}{order.customer?.postalCode?` ${order.customer.postalCode}`:''}</p><p><b>Delivery notes:</b> {order.deliveryNotes||'Contact store support for delivery updates.'}</p><p><b>Total:</b> PKR {Number(order.total||0).toLocaleString('en-PK')}</p>
    </article>}
  </div></main>
}
