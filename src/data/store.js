import { products as starterProducts } from './products.js'

export const KEYS = { products: 'ahluxe.products', cart: 'ahluxe.cart', orders: 'ahluxe.orders', settings: 'ahluxe.settings', admin: 'ahluxe.admin' }
export const defaultSettings = {
  whatsapp: '923000000000', email: 'hello@ahluxe.pk', social: { Instagram: '#', Facebook: '#', TikTok: '#' },
  shippingCost: 0, paymentCheckoutUrl: '',
  announcementEnabled: true, announcement: 'Free delivery across Pakistan', badgesEnabled: true,
  hero: { videos: ['/hero-video-1.mp4', '/hero-video-2.mp4', '/hero-video-3-wide.mp4'], posters: ['/hero-poster-1.jpg', '/hero-poster-2.jpg', '/hero-poster-3.jpg'], eyebrow: 'A&H Luxe Pakistan', headline: "Buy Original Men's & Couple Watches in Pakistan", subheading: 'Premium watches & accessories · Nationwide COD · 7-day returns · Delivery in 3–5 days · 1-year movement warranty on watches · Faisalabad, Lahore & Karachi' },
  seo: { homeTitle: "Buy Men's & Couple Watches in Pakistan | A&H Luxe", homeDescription: 'Shop original men’s and couple watches at A&H Luxe. Nationwide COD, 7-day returns, 3–5 day delivery and 1-year movement warranty on watches. Serving Faisalabad, Lahore and Karachi.', categories: {
    mens: { title: "Men’s Luxury Quartz & Chronograph Watches in Pakistan", description: 'Shop men’s quartz and chronograph watches with nationwide Cash on Delivery. Delivery in 3–5 days to Faisalabad, Lahore, Karachi and across Pakistan. Check each product for warranty details.' },
    womens: { title: "Women’s Watches & Gifts in Pakistan", description: 'Explore women’s watches and gift styles at A&H Luxe. Nationwide Cash on Delivery and delivery in 3–5 days to Faisalabad, Lahore, Karachi and across Pakistan.' },
    accessories: { title: 'Gents Bracelets, Chains & Accessories Collection', description: 'Shop gents bracelets, chains, wallets and accessories at A&H Luxe. Nationwide Cash on Delivery with delivery in 3–5 days across Pakistan.' },
    couples: { title: 'Premium Matching Couple Watches for Wedding & Anniversary Gifts', description: 'Discover matching couple watches for wedding and anniversary gifts. Nationwide Cash on Delivery and delivery in 3–5 days across Pakistan.' },
    watches: { title: 'Quartz & Chronograph Watches in Pakistan', description: 'Browse watches from A&H Luxe with nationwide Cash on Delivery and 3–5 day delivery across Pakistan. Warranty details are listed on each product.' },
  } },
  banners: { mens: '', womens: '' }, collectionCards: { mens: '', womens: '' }, promotionalBanners: { home: '', categoryHeader: '' }, categoryImages: {}
}
export function read(key, fallback) {
  try { const value = localStorage.getItem(key); return value == null ? fallback : JSON.parse(value) } catch { return fallback }
}
export function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new CustomEvent('ahluxe:storage', { detail: key })) }
export function getProducts() {
  const saved=read(KEYS.products, null)
  if(!Array.isArray(saved))return starterProducts
  const legacyNames={2:'Heritage Leather Classic',4:'Regent Steel Automatic'}
  return saved.map(product=>{
    const starter=starterProducts.find(item=>String(item.id)===String(product.id)&&(item.name===product.name||legacyNames[item.id]===product.name))
    if(!starter)return product
    return {...product,name:starter.name,brand:!product.brand||product.brand==='A&H Luxe'?starter.brand:product.brand}
  })
}
export function getSettings() { const saved=read(KEYS.settings, {}); return { ...defaultSettings, ...saved, hero: { ...defaultSettings.hero, ...(saved.hero || {}), headline:!saved.hero?.headline||saved.hero.headline==='Wear Your Legacy'?defaultSettings.hero.headline:saved.hero.headline, subheading:!saved.hero?.subheading||saved.hero.subheading==='Every great story is told one moment at a time. Let your wrist tell yours.'?defaultSettings.hero.subheading:saved.hero.subheading }, seo: { ...defaultSettings.seo, ...(saved.seo||{}), categories:{...defaultSettings.seo.categories,...(saved.seo?.categories||{})} }, banners: { ...defaultSettings.banners, ...(saved.banners || {}) }, collectionCards: { ...defaultSettings.collectionCards, ...(saved.collectionCards || {}) }, promotionalBanners: { ...defaultSettings.promotionalBanners, ...(saved.promotionalBanners || {}) }, categoryImages: { ...defaultSettings.categoryImages, ...(saved.categoryImages || {}) } } }
export function categoryOf(p) {
  const category = (p.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  if (category) return category
  const type = (p.type || '').toLowerCase()
  if (type.includes('watch')) return type === 'watch-w' ? 'womens' : 'watches'
  if (type === 'pair') return 'couples'
  if (type === 'wallet') return 'wallets'
  if (type === 'chain') return 'chains'
  if (type === 'cap') return 'caps'
  return type || 'accessories'
}
export function whatsappUrl(phone, message) { return `https://wa.me/${String(phone || defaultSettings.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(message)}` }
export function productMessage(p, qty = 1, color = '') { return `Hello A&H Luxe! I'd like to order:\n${p.name} × ${qty}${color ? `\nColour: ${color}` : ''}\nUnit price: Rs. ${Number(p.price).toLocaleString('en-PK')}\nTotal: Rs. ${(Number(p.price) * qty).toLocaleString('en-PK')}` }
