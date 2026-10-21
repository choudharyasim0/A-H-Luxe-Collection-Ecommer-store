import { useState, useEffect, useCallback } from 'react'
import { dict } from './i18n.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Sections from './components/Sections.jsx'
import Footer from './components/Footer.jsx'
import QuickBuy from './components/QuickBuy.jsx'
import Admin from './components/Admin.jsx'
import Cart from './components/Cart.jsx'
import { BrandPage, CategoryPage, ProductPage, TrackOrderPage } from './components/StorePages.jsx'
import { KEYS, getProducts, getSettings, read, whatsappUrl, write } from './data/store.js'

export default function App() {
  const path = window.location.pathname
  if (path === '/admin' || path === '/admin/') return <Admin />
  const [lang, setLang] = useState('en'); const [products, setProducts] = useState(getProducts()); const [settings, setSettings] = useState(getSettings())
  const [cart, setCart] = useState(() => { const value = read(KEYS.cart, []); return Array.isArray(value) ? value : [] }); const [toast, setToast] = useState(''); const [quick, setQuick] = useState(null); const [cartOpen, setCartOpen] = useState(false); const [search, setSearch] = useState('')
  const t = dict[lang]
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'; document.documentElement.lang = lang
  }, [lang])
  useEffect(() => {
    if (path.startsWith('/product/') || path.startsWith('/category/') || path.startsWith('/brand/') || path.startsWith('/track-order')) return
    document.title = settings.seo?.homeTitle || "Buy Men's & Couple Watches in Pakistan | A&H Luxe"
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = settings.seo?.homeDescription || 'Shop watches and accessories at A&H Luxe. Nationwide Cash on Delivery and 3–5 day delivery across Pakistan.'
  }, [path, settings.seo])
  useEffect(() => {
    const sync = () => { setProducts(getProducts()); setSettings(getSettings()); const saved = read(KEYS.cart, []); setCart(Array.isArray(saved) ? saved : []) }
    window.addEventListener('storage',sync); window.addEventListener('ahluxe:storage',sync)
    return () => { window.removeEventListener('storage',sync); window.removeEventListener('ahluxe:storage',sync) }
  }, [])
  const addToCart = useCallback((product, color, qty = 1) => {
    if (!product) return
    const key = `${product.id}:${color || ''}`
    setCart(old => { const found = old.find(x => x.key === key); const next = found ? old.map(x => x.key === key ? { ...x, qty: x.qty + qty } : x) : [...old, { key, id: product.id, color: color || '', qty }]; write(KEYS.cart,next); return next })
    setToast(t.added); window.setTimeout(() => setToast(''),1800)
  }, [t.added])
  const setCartItems = next => { setCart(next); write(KEYS.cart,next) }
  const totalCount = cart.reduce((sum,row) => sum + Number(row.qty || 0),0)
  const productId = path.match(/^\/product\/([^/]+)/)?.[1]
  const currentProduct = productId ? products.find(p => String(p.id) === decodeURIComponent(productId)) : null
  const brandMatch = path.match(/^\/brand\/([^/]+)/)
  const categoryMatch = path.match(/^\/category\/([^/]+)/)
  const filteredSearch = search.trim() ? products.filter(p => `${p.name} ${p.category || ''} ${p.description || ''}`.toLowerCase().includes(search.trim().toLowerCase())) : null
  const content = path === '/track-order' || path === '/track-order/' ? <TrackOrderPage /> : brandMatch ? <BrandPage slug={decodeURIComponent(brandMatch[1])} products={products} settings={settings} onAdd={addToCart} /> : productId ? <ProductPage product={currentProduct} settings={settings} onAdd={addToCart} /> : categoryMatch ? <CategoryPage slug={decodeURIComponent(categoryMatch[1])} products={products} settings={settings} onAdd={addToCart} /> : filteredSearch ? <CategoryPage slug="search" products={filteredSearch.map(p => ({...p,category:'search'}))} settings={settings} onAdd={addToCart} /> : <main><Hero t={t} settings={settings} /><Sections t={t} lang={lang} addToCart={addToCart} onQuick={setQuick} products={products} settings={settings} /></main>
  return <><Header t={t} lang={lang} setLang={setLang} cart={totalCount} settings={settings} openCart={() => setCartOpen(true)} onSearch={setSearch} />{content}<Footer t={t} settings={settings} />
    <a className="wa-float" href={whatsappUrl(settings.whatsapp,t.waMsg)} target="_blank" rel="noreferrer" aria-label={t.wa}><span>{t.wa}</span></a>
    <QuickBuy p={quick} t={t} lang={lang} onClose={() => setQuick(null)} addToCart={addToCart} settings={settings} />
    <Cart open={cartOpen} onClose={() => setCartOpen(false)} items={cart} products={products} setItems={setCartItems} settings={settings} />
    {toast && <div className="toast" role="status">{toast}</div>}
  </>
}
