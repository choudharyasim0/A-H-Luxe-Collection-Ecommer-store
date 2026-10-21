// Replace `type` art with real photos by adding an `image` URL to any product.
export const products = [
  { id: 1, name: 'Midnight Chronograph', brand: 'Curren', line: { en: 'For the deal you closed.', ur: 'اس سودے کے نام جو آپ نے جیتا۔' }, price: 12999, was: 17999, type: 'watch', colors: ['#0047ab', '#111111', '#8a8d93'] },
  { id: 2, name: 'Classic Leather Dress Watch', brand: 'Tissot', line: { en: 'Handed down, never outdated.', ur: 'نسل در نسل، کبھی پرانی نہیں۔' }, price: 9499, was: 13999, type: 'watch', colors: ['#5a3b24', '#111111', '#0d3b66'] },
  { id: 3, name: 'Aurora Rose Petite', brand: 'Rado', line: { en: 'Grace, worn lightly.', ur: 'ہلکی سی نزاکت۔' }, price: 8799, was: 11999, type: 'watch-w', colors: ['#d9a9a0', '#0047ab', '#e9e4da'] },
  { id: 4, name: 'Steel Automatic Chronograph', brand: 'Naviforce', line: { en: 'Power that stays calm.', ur: 'پُرسکون طاقت۔' }, price: 15499, was: 21999, type: 'watch', colors: ['#8a8d93', '#0d3b66', '#111111'] },
  { id: 5, name: 'Couple’s Eternity Pair', brand: 'Rolex', line: { en: 'Two wrists. One promise.', ur: 'دو کلائیاں، ایک وعدہ۔' }, price: 18999, was: 25999, type: 'pair', colors: ['#0047ab', '#111111'] },
  { id: 6, name: 'Executive Slim Wallet', line: { en: 'Carry what matters.', ur: 'جو اہم ہے، ساتھ رکھیں۔' }, price: 2499, was: 3499, type: 'wallet', colors: ['#111111', '#5a3b24', '#0d3b66'] },
  { id: 7, name: 'Cuban Link Chain', line: { en: 'Quiet confidence.', ur: 'خاموش اعتماد۔' }, price: 3299, was: 4799, type: 'chain', colors: ['#c8ccd2', '#0047ab'] },
  { id: 8, name: 'Signature Black Cap', line: { en: 'Effortless edge.', ur: 'بے ساختہ انداز۔' }, price: 1799, was: 2499, type: 'cap', colors: ['#111111', '#0d3b66', '#8a8d93'] },
]
export const brands = [
  { n: 'Rolex', s: { en: 'Iconic watch styles', ur: 'Mashhoor watch styles' } },
  { n: 'Hublot', s: { en: 'Bold statement watches', ur: 'Numayan watch styles' } },
  { n: 'Patek Philippe', s: { en: 'Classic dress watch styles', ur: 'Classic watch styles' } },
  { n: 'Audemars Piguet', s: { en: 'Contemporary statement styles', ur: 'Jadeed numayan styles' } },
  { n: 'TAG Heuer', s: { en: 'Sport inspired watches', ur: 'Sports watch styles' } },
  { n: 'Tissot', s: { en: 'Everyday watch styles', ur: 'Rozmarra watch styles' } },
  { n: 'Rado', s: { en: 'Modern dress watch styles', ur: 'Modern classic styles' } },
  { n: 'Curren', s: { en: 'Chronograph and everyday styles', ur: 'Chronograph aur rozmarra styles' } },
  { n: 'Naviforce', s: { en: 'Sport and utility styles', ur: 'Sports aur utility styles' } },
]
export const brandSlug = name => String(name||'').normalize('NFKD').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export const reviews = [
  { name: 'Hamza R.', city: 'Lahore', text: { en: 'I bought it for my father’s 60th. He hasn’t taken it off since — he tells everyone it came from his son.', ur: 'میں نے اپنے والد کی 60ویں سالگرہ کے لیے لی۔ تب سے انہوں نے اتاری نہیں — سب کو بتاتے ہیں کہ بیٹے نے دی ہے۔' }, chat: { en: ['Assalam o Alaikum, parcel mil gaya!', 'Alhamdulillah, packing bohat classy thi 🤍'], ur: ['السلام علیکم، پارسل مل گیا!', 'الحمدللہ، پیکنگ بہت شاندار تھی 🤍'] } },
  { name: 'Ayesha K.', city: 'Faisalabad', text: { en: 'My husband cried a little when he opened it. Thank you for helping me say what words couldn’t.', ur: 'میرے شوہر نے کھولتے ہی آنکھیں نم کر لیں۔ شکریہ کہ آپ نے وہ کہنے میں مدد کی جو الفاظ نہ کہہ سکے۔' }, chat: { en: ['Delivery on time, COD was so easy.', 'Will order the couple set next! ✨'], ur: ['ڈیلیوری وقت پر ہوئی، COD بہت آسان تھا۔', 'اگلی بار کپل سیٹ منگواؤں گی! ✨'] } },
  { name: 'Usman T.', city: 'Karachi', text: { en: 'Wore it to my first big interview. I felt taller walking in — and I got the job.', ur: 'پہلے بڑے انٹرویو میں پہنی۔ اندر جاتے ہوئے قد اونچا لگا — اور نوکری مل گئی۔' }, chat: { en: ['Bhai genuine quality hai 🔥', 'Dial bilkul waise jaisa picture mein tha.'], ur: ['بھائی اصلی کوالٹی ہے 🔥', 'ڈائل بالکل تصویر جیسا تھا۔'] } },
]
export const fmt = (n) => 'Rs. ' + n.toLocaleString('en-PK')
